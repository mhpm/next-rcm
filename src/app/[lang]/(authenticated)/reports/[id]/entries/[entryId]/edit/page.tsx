import { getChurchPrisma } from "@/actions/churchContext";
import SubmitReportForm from "@/app/[lang]/(authenticated)/reports/components/SubmitReportForm";
import { notFound } from "next/navigation";
import { BackLink, Breadcrumbs } from "@/components";
import { Card, CardContent } from "@/components/ui/card";
import { connection } from "next/server";

export default async function EditReportEntryPage({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  await connection();
  const { id, entryId } = await params;
  const prisma = await getChurchPrisma();

  const report = await prisma.reports.findUnique({
    where: { id },
    include: { fields: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] } },
  });

  if (!report) notFound();

  const entry = await prisma.reportEntries.findUnique({
    where: { id: entryId },
    include: {
      values: true,
    },
  });

  if (!entry) notFound();

  const [cells, groups, sectors] = await Promise.all([
    prisma.cells.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.groups.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.sectors.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const cellOptions = cells.map((c) => ({ value: c.id, label: c.name }));
  const groupOptions = groups.map((g) => ({ value: g.id, label: g.name }));
  const sectorOptions = sectors.map((s) => ({ value: s.id, label: s.name }));

  // Prepare initial values
  const valuesMap: Record<string, unknown> = {};
  entry.values.forEach((v) => {
    valuesMap[v.report_field_id] = v.value;
  });

  const initialValues = {
    scope: entry.scope,
    cellId: entry.cell_id ?? undefined,
    groupId: entry.group_id ?? undefined,
    sectorId: entry.sector_id ?? undefined,
    values: valuesMap,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackLink
          text="Volver a entradas"
          fallbackHref={`/reports/${id}/entries`}
        />
        <Breadcrumbs />
      </div>

      <Card
        className="max-w-4xl mx-auto border-t-8"
        style={{ borderTopColor: report.color || "#3b82f6" }}
      >
        <CardContent className="p-6">
        <SubmitReportForm
          reportId={report.id}
          title={`Editar entrada: ${report.title}`}
          description={report.description ?? undefined}
          scope={report.scope}
          fields={report.fields.map((f) => ({
            id: f.id,
            key: f.key,
            label: f.label,
            type: f.type,
            required: f.required,
            options: Array.isArray(f.options)
              ? (f.options as string[])
              : undefined,
          }))}
          cells={cellOptions}
          groups={groupOptions}
          sectors={sectorOptions}
          initialValues={initialValues}
          entryId={entryId}
        />
        </CardContent>
      </Card>
    </div>
  );
}
