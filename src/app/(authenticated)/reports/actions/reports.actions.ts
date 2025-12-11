"use server";

import { revalidatePath } from "next/cache";
import { getChurchPrisma, getChurchId } from "@/actions/churchContext";
import type {
  ReportFieldType,
  ReportScope,
  Prisma,
} from "@/generated/prisma/client";

export type ReportFieldInput = {
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
  )
    .filter((f) => f.key && f.key.trim().length > 0)
    .map((f) => {
      const base: Prisma.ReportFieldsCreateWithoutReportInput = {
        key: f.key,
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

  const report = await prisma.reports.create({
    data: {
      title: input.title.trim(),
      description: input.description ?? null,
      scope,
      color: input.color,
      publicToken: crypto.randomUUID(),
      church: { connect: { id: churchId } },
      ...(fieldsCreate.length > 0 ? { fields: { create: fieldsCreate } } : {}),
    },
    select: { id: true },
  });

  revalidatePath("/reports");
  return report.id;
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

  if (!input.reportId) {
    throw new Error("El reporte es requerido");
  }

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
      : {}; // CHURCH

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
      }
      return base;
    });

  await prisma.reportEntries.create({
    data: {
      scope,
      church: { connect: { id: churchId } },
      report: { connect: { id: input.reportId } },
      ...connectByScope,
      ...(valuesCreate.length > 0 ? { values: { create: valuesCreate } } : {}),
    },
    select: { id: true },
  });

  revalidatePath("/reports");
}

export async function deleteReport(id: string) {
  const prisma = await getChurchPrisma();
  await prisma.reports.delete({ where: { id } });
  revalidatePath("/reports");
}

export type UpdateReportInput = {
  id: string;
  title: string;
  description?: string | null;
  scope: ReportScope;
};

export async function updateReport(input: UpdateReportInput) {
  const prisma = await getChurchPrisma();
  await prisma.reports.update({
    where: { id: input.id },
    data: {
      title: input.title,
      description: input.description ?? null,
      scope: input.scope,
    },
  });
  revalidatePath("/reports");
}

export async function deleteReportAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("id requerido");
  await deleteReport(id);
}

export async function updateReportAction(formData: FormData) {
  const id = formData.get("id") as string;
  const title = (formData.get("title") as string) || "";
  const description = (formData.get("description") as string) || null;
  const scope = formData.get("scope") as ReportScope;
  if (!id || !title || !scope) throw new Error("Campos requeridos");
  await updateReport({ id, title, description, scope });
}

export type ReportFieldUpdateInput = {
  id?: string;
  key: string;
  label?: string | null;
  type: ReportFieldType;
  required?: boolean;
  value?: unknown;
  options?: string[]; // Add options
};

export type UpdateReportWithFieldsInput = {
  id: string;
  title: string;
  description?: string | null;
  scope: ReportScope;
  color?: string | null;
  fields: ReportFieldUpdateInput[];
};

export async function updateReportWithFields(
  input: UpdateReportWithFieldsInput
) {
  const prisma = await getChurchPrisma();

  await prisma.$transaction(async (tx) => {
    await tx.reports.update({
      where: { id: input.id },
      data: {
        title: input.title,
        description: input.description ?? null,
        scope: input.scope,
        color: input.color,
      },
    });

    const existing = await tx.reportFields.findMany({
      where: { report_id: input.id },
      select: { id: true },
    });

    const existingIds = new Set(existing.map((f) => f.id));
    const incomingIds = new Set(
      (input.fields || [])
        .map((f) => f.id)
        .filter((id): id is string => typeof id === "string")
    );

    // Delete removed fields
    const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));
    if (idsToDelete.length > 0) {
      await tx.reportFields.deleteMany({
        where: { id: { in: idsToDelete } },
      });
    }

    // Upsert/update/create remaining fields
    for (const f of input.fields || []) {
      const base: Prisma.ReportFieldsUncheckedUpdateInput = {
        label: f.label ?? null,
        type: f.type,
        required: !!f.required,
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
