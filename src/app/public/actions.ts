"use server";

import prisma from "@/lib/prisma";
import { ReportScope, Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function getPublicReport(token: string) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: token },
    include: {
      fields: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
      church: { select: { name: true } },
    },
  });
  return report;
}

export async function getPublicEntities(token: string) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: token },
    select: { church_id: true },
  });

  if (!report) return null;

  const [groups, sectors, members] = await Promise.all([
    prisma.groups.findMany({
      where: { church_id: report.church_id },
      select: {
        id: true,
        name: true,
        leader: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.sectors.findMany({
      where: { church_id: report.church_id },
      select: {
        id: true,
        name: true,
        supervisor: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.members.findMany({
      where: { church_id: report.church_id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: { firstName: "asc" },
    }),
  ]);

  return { groups, sectors, members };
}

export async function verifyCellAccess(code: string) {
  const cell = await prisma.cells.findFirst({
    where: { accessCode: code },
    select: {
      id: true,
      name: true,
      leader: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      subSector: {
        select: {
          name: true,
          sector: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return cell;
}

export async function getDraftReportEntry(
  token: string,
  scope: ReportScope,
  entityId: string
) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: token },
    select: { id: true },
  });

  if (!report) return null;

  const whereClause: Prisma.ReportEntriesWhereInput = {
    report_id: report.id,
    status: "DRAFT",
  };

  if (scope === "CELL") whereClause.cell_id = entityId;
  else if (scope === "GROUP") whereClause.group_id = entityId;
  else if (scope === "SECTOR") whereClause.sector_id = entityId;

  const entry = await prisma.reportEntries.findFirst({
    where: whereClause,
    include: {
      values: {
        include: {
          field: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return entry;
}

export type SubmitPublicReportEntryInput = {
  token: string;
  scope: ReportScope;
  cellId?: string | null;
  groupId?: string | null;
  sectorId?: string | null;
  values: { fieldId: string; value?: unknown }[];
  isDraft?: boolean;
};

export async function saveDraftReportEntry(
  input: SubmitPublicReportEntryInput & { entryId?: string }
) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: input.token },
  });

  if (!report) throw new Error("Reporte no encontrado");

  const { scope, cellId, groupId, sectorId } = input;
  const connectByScope =
    scope === "CELL"
      ? { cell: { connect: { id: cellId! } } }
      : scope === "GROUP"
      ? { group: { connect: { id: groupId! } } }
      : scope === "SECTOR"
      ? { sector: { connect: { id: sectorId! } } }
      : {};

  if (input.entryId) {
    // Update existing draft
    await prisma.reportEntries.update({
      where: { id: input.entryId },
      data: {
        updatedAt: new Date(),
      },
    });

    for (const v of input.values) {
      if (!v.fieldId) continue;

      const val =
        typeof v.value === "undefined"
          ? Prisma.JsonNull
          : (v.value as Prisma.InputJsonValue);

      // Check if value exists
      const existingValue = await prisma.reportEntryValues.findFirst({
        where: {
          entry_id: input.entryId,
          report_field_id: v.fieldId,
        },
      });

      if (existingValue) {
        await prisma.reportEntryValues.update({
          where: { id: existingValue.id },
          data: { value: val },
        });
      } else {
        await prisma.reportEntryValues.create({
          data: {
            entry: { connect: { id: input.entryId } },
            field: { connect: { id: v.fieldId } },
            value: val,
          },
        });
      }
    }
    return { id: input.entryId };
  } else {
    // Create new draft
    const valuesCreate = (input.values || [])
      .filter((v) => v.fieldId)
      .map((v) => ({
        field: { connect: { id: v.fieldId } },
        value:
          typeof v.value !== "undefined"
            ? (v.value as Prisma.InputJsonValue)
            : Prisma.JsonNull,
      }));

    const newEntry = await prisma.reportEntries.create({
      data: {
        scope,
        status: "DRAFT",
        church: { connect: { id: report.church_id } },
        report: { connect: { id: report.id } },
        ...connectByScope,
        values: {
          create: valuesCreate,
        },
      },
    });
    return { id: newEntry.id };
  }
}

export async function submitPublicReportEntry(
  input: SubmitPublicReportEntryInput & { entryId?: string }
) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: input.token },
  });

  if (!report) {
    throw new Error("Reporte no encontrado");
  }

  // If entryId provided, update existing
  if (input.entryId) {
    await saveDraftReportEntry(input);

    // Only update status to SUBMITTED if it's not a draft save
    if (!input.isDraft) {
      await prisma.reportEntries.update({
        where: { id: input.entryId },
        data: {
          status: "SUBMITTED",
        },
      });
      revalidatePath(`/reports/${report.id}/entries`);
    }
    return { id: input.entryId };
  }

  // Create new (DRAFT or SUBMITTED)
  // Reuse saveDraftReportEntry which creates a DRAFT by default
  const result = await saveDraftReportEntry(input);

  // If not draft, update to SUBMITTED immediately
  if (!input.isDraft) {
    await prisma.reportEntries.update({
      where: { id: result.id },
      data: {
        status: "SUBMITTED",
      },
    });
    revalidatePath(`/reports/${report.id}/entries`);
  }

  return result;
}

export async function getPublicReportEntityMembers(
  token: string,
  scope: ReportScope,
  entityId: string
) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: token },
    select: { church_id: true },
  });

  if (!report) throw new Error("Reporte no encontrado");

  // Verify entity belongs to church
  let valid = false;
  if (scope === "CELL") {
    const cell = await prisma.cells.findFirst({
      where: { id: entityId, church_id: report.church_id },
      select: { id: true },
    });
    valid = !!cell;
  } else if (scope === "GROUP") {
    const group = await prisma.groups.findFirst({
      where: { id: entityId, church_id: report.church_id },
      select: { id: true },
    });
    valid = !!group;
  } else if (scope === "SECTOR") {
    const sector = await prisma.sectors.findFirst({
      where: { id: entityId, church_id: report.church_id },
      select: { id: true },
    });
    valid = !!sector;
  }

  if (!valid) throw new Error("Entidad no válida");

  if (scope === "CELL") {
    return prisma.members.findMany({
      where: { cell_id: entityId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: "asc" },
    });
  } else if (scope === "GROUP") {
    return prisma.members.findMany({
      where: { groups: { some: { id: entityId } } },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: "asc" },
    });
  } else if (scope === "SECTOR") {
    return prisma.members.findMany({
      where: { sector_id: entityId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: "asc" },
    });
  }

  return [];
}
