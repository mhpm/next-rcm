"use server";

import { revalidatePath } from "next/cache";
import { getChurchPrisma, getChurchId } from "@/actions/churchContext";
import { Prisma } from "@/generated/prisma/client";
import type { ReportFieldType, ReportScope } from "@/generated/prisma/client";

export type ReportFieldInput = {
  id?: string;
  key: string;
  label?: string | null;
  type: ReportFieldType;
  value?: unknown;
  options?: string[]; // Add options
  required?: boolean;
};

export type CreateReportInput = {
  title: string;
  description?: string | null;
  scope: ReportScope;
  color?: string | null;
  cellId?: string | null;
  groupId?: string | null;
  sectorId?: string | null;
  fields?: ReportFieldInput[];
};

export async function createReport(input: CreateReportInput) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  if (!input.title || input.title.trim().length === 0) {
    throw new Error("El título es requerido");
  }

  // Solo tipo (scope) en plantillas; no se vincula a una entidad aquí
  const { scope } = input;

  const fieldsCreate: Prisma.ReportFieldsCreateWithoutReportInput[] = (
    input.fields || []
  ).map((f) => {
    // Validate key or generate one
    let key = f.key;
    if (!key || key.trim().length === 0) {
      // Simple slugify fallback or random
      const labelSlug = f.label
        ? slugify(f.label)
        : `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      key = labelSlug;
    }

    const base: Prisma.ReportFieldsCreateWithoutReportInput = {
      key,
      label: f.label ?? null,
      type: f.type,
      required: !!f.required,
    };

    if (typeof f.value !== "undefined") {
      (base as any).value = f.value as Prisma.InputJsonValue;
    }
    if (f.options && Array.isArray(f.options)) {
      (base as any).options = f.options as Prisma.InputJsonValue;
    }

    return base;
  });

  await prisma.reports.create({
    data: {
      church_id: churchId,
      title: input.title,
      description: input.description,
      scope,
      color: input.color || "#4F46E5",
      fields: {
        create: fieldsCreate,
      },
    },
  });

  revalidatePath("/reports");
}

export async function deleteReport(id: string) {
  const prisma = await getChurchPrisma();
  await prisma.reports.delete({ where: { id } });
  revalidatePath("/reports");
}

export async function deleteReportAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("id requerido");
  await deleteReport(id);
}

export type UpdateReportInput = {
  id: string;
  title: string;
  description?: string | null;
  scope: ReportScope;
  color?: string | null;
  fields?: ReportFieldInput[];
};

export async function updateReportWithFields(input: UpdateReportInput) {
  const prisma = await getChurchPrisma();

  // 1. Update basic fields
  await prisma.reports.update({
    where: { id: input.id },
    data: {
      title: input.title,
      description: input.description,
      scope: input.scope,
      color: input.color,
    },
  });

  // 2. Handle fields logic
  // A naive approach: delete all fields not present in input, upsert others.
  // BUT to keep data (values) associated with fields, we must be careful.
  // Ideally, if field has ID, update it. If not, create it.
  // Fields not in the list but in DB? -> Delete them?
  // For simplicity:
  // - If input.fields has ID -> update
  // - If input.fields no ID -> create
  // - Fields in DB not in input.fields -> delete

  // Get current fields
  const currentFields = await prisma.reportFields.findMany({
    where: { report_id: input.id },
    select: { id: true },
  });
  const currentIds = currentFields.map((c) => c.id);
  const inputIds = (input.fields || [])
    .map((f) => f.id)
    .filter(Boolean) as string[];

  const toDelete = currentIds.filter((id) => !inputIds.includes(id));

  // Transaction for atomicity if possible, or sequential
  await prisma.$transaction(async (tx) => {
    if (toDelete.length > 0) {
      await tx.reportFields.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    // Upsert/update/create remaining fields
    for (const [index, f] of (input.fields || []).entries()) {
      // Validate key
      if (!f.key) {
        f.key = slugify(
          f.label ||
            `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        );
      }

      const base: Prisma.ReportFieldsUncheckedUpdateInput = {
        label: f.label ?? null,
        type: f.type,
        required: !!f.required,
        order: index,
      } as Prisma.ReportFieldsUncheckedUpdateInput;
      if (typeof f.value !== "undefined") {
        (base as any).value = f.value as Prisma.InputJsonValue;
      }
      if (f.options && Array.isArray(f.options)) {
        (base as any).options = f.options as Prisma.InputJsonValue;
      }

      if (f.id) {
        await tx.reportFields.update({
          where: { id: f.id },
          data: base,
        });
      } else {
        const createData: Prisma.ReportFieldsCreateInput = {
          key: f.key,
          label: f.label ?? null,
          type: f.type,
          required: !!f.required,
          order: index,
          report: { connect: { id: input.id } },
        };
        if (typeof f.value !== "undefined") {
          (createData as any).value = f.value as Prisma.InputJsonValue;
        }
        if (f.options && Array.isArray(f.options)) {
          (createData as any).options = f.options as Prisma.InputJsonValue;
        }
        await tx.reportFields.create({ data: createData });
      }
    }
  });

  revalidatePath("/reports");
}

export async function deleteReportEntry(id: string) {
  const prisma = await getChurchPrisma();
  await prisma.reportEntries.delete({ where: { id } });
}

export async function deleteReportEntryAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("id requerido");

  const prisma = await getChurchPrisma();
  const existing = await prisma.reportEntries.findUnique({
    where: { id },
    select: { report_id: true },
  });

  await deleteReportEntry(id);

  if (existing?.report_id) {
    revalidatePath(`/reports/${existing.report_id}/entries`);
  }
}

export type UpdateReportEntryInput = {
  id: string;
  scope: ReportScope;
  cellId?: string | null;
  groupId?: string | null;
  sectorId?: string | null;
  values: { fieldId: string; value?: unknown }[];
};

export async function updateReportEntry(input: UpdateReportEntryInput) {
  const prisma = await getChurchPrisma();

  const { scope, cellId, groupId, sectorId } = input;
  if (scope === "CELL" && !cellId)
    throw new Error("Debes seleccionar una célula");
  if (scope === "GROUP" && !groupId)
    throw new Error("Debes seleccionar un grupo");
  if (scope === "SECTOR" && !sectorId)
    throw new Error("Debes seleccionar un sector");

  const connectByScope =
    scope === "CELL"
      ? { cell: { connect: { id: cellId! } } }
      : scope === "GROUP"
      ? { group: { connect: { id: groupId! } } }
      : scope === "SECTOR"
      ? { sector: { connect: { id: sectorId! } } }
      : {};

  await prisma.reportEntries.update({
    where: { id: input.id },
    data: {
      ...connectByScope,
    },
  });

  // Update values
  // similar logic: delete values for fields not present? or just upsert?
  // usually report entry values are simpler.
  // We can delete all values for this entry and recreate? Or update individually.
  // Recreating is easiest but loses history if we tracked that.
  // Better: loop and upsert.

  for (const v of input.values) {
    // Find existing value for this field and entry
    const existing = await prisma.reportEntryValues.findFirst({
      where: {
        entry_id: input.id,
        field: { id: v.fieldId },
      },
    });

    const val =
      typeof v.value === "undefined"
        ? Prisma.JsonNull
        : (v.value as Prisma.InputJsonValue);

    if (existing) {
      await prisma.reportEntryValues.update({
        where: { id: existing.id },
        data: { value: val },
      });
    } else {
      await prisma.reportEntryValues.create({
        data: {
          entry: { connect: { id: input.id } },
          field: { connect: { id: v.fieldId } },
          value: val,
        },
      });
    }
  }

  const existing = await prisma.reportEntries.findUnique({
    where: { id: input.id },
    select: { report_id: true },
  });
  if (existing?.report_id) {
    revalidatePath(`/reports/${existing.report_id}/entries`);
  }
}

export type CreateReportEntryInput = {
  reportId: string;
  scope: ReportScope;
  cellId?: string | null;
  groupId?: string | null;
  sectorId?: string | null;
  values: { fieldId: string; value?: unknown }[];
};

export async function createReportEntry(input: CreateReportEntryInput) {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  const { scope, cellId, groupId, sectorId } = input;
  if (scope === "CELL" && !cellId)
    throw new Error("Debes seleccionar una célula");
  if (scope === "GROUP" && !groupId)
    throw new Error("Debes seleccionar un grupo");
  if (scope === "SECTOR" && !sectorId)
    throw new Error("Debes seleccionar un sector");

  const connectByScope =
    scope === "CELL"
      ? { cell: { connect: { id: cellId! } } }
      : scope === "GROUP"
      ? { group: { connect: { id: groupId! } } }
      : scope === "SECTOR"
      ? { sector: { connect: { id: sectorId! } } }
      : {};

  const valuesCreate: Prisma.ReportEntryValuesCreateWithoutEntryInput[] = (
    input.values || []
  )
    .filter((v) => v.fieldId)
    .map((v) => {
      const base: Prisma.ReportEntryValuesCreateWithoutEntryInput = {
        field: { connect: { id: v.fieldId } },
      } as Prisma.ReportEntryValuesCreateWithoutEntryInput;

      if (typeof v.value !== "undefined") {
        (base as any).value = v.value as Prisma.InputJsonValue;
      } else {
        (base as any).value = Prisma.JsonNull;
      }
      return base;
    });

  await prisma.reportEntries.create({
    data: {
      church: { connect: { id: churchId } },
      report: { connect: { id: input.reportId } },
      ...connectByScope,
      values: {
        create: valuesCreate,
      },
    },
  });

  revalidatePath(`/reports/${input.reportId}/entries`);
}

export async function getReportEntityMembers(
  scope: ReportScope,
  entityId: string
) {
  const prisma = await getChurchPrisma();

  if (scope === "CELL") {
    return prisma.members.findMany({
      where: { cell_id: entityId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: "asc" },
    });
  }
  // Expand for other scopes if needed (requires recursive relation checks)
  return [];
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "_")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
