"use server";

import prisma from "@/lib/prisma";
import { ReportScope, Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function getPublicReport(token: string) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: token },
    include: {
      fields: { orderBy: { createdAt: "asc" } },
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

  const [cells, groups, sectors] = await Promise.all([
    prisma.cells.findMany({
      where: { church_id: report.church_id },
      select: { id: true, name: true },
    }),
    prisma.groups.findMany({
      where: { church_id: report.church_id },
      select: { id: true, name: true },
    }),
    prisma.sectors.findMany({
      where: { church_id: report.church_id },
      select: { id: true, name: true },
    }),
  ]);

  return { cells, groups, sectors };
}

export type SubmitPublicReportEntryInput = {
  token: string;
  scope: ReportScope;
  cellId?: string | null;
  groupId?: string | null;
  sectorId?: string | null;
  values: { fieldId: string; value?: unknown }[];
};

export async function submitPublicReportEntry(
  input: SubmitPublicReportEntryInput
) {
  const report = await prisma.reports.findUnique({
    where: { publicToken: input.token },
  });

  if (!report) {
    throw new Error("Reporte no encontrado");
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
      }
      return base;
    });

  await prisma.reportEntries.create({
    data: {
      scope,
      church: { connect: { id: report.church_id } },
      report: { connect: { id: report.id } },
      ...connectByScope,
      ...(valuesCreate.length > 0 ? { values: { create: valuesCreate } } : {}),
    },
  });

  revalidatePath(`/reports/${report.id}/entries`);
}
