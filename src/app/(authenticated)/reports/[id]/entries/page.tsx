import { getChurchPrisma } from "@/actions/churchContext";
import { notFound } from "next/navigation";
import type { TableColumn } from "@/types";
import ReportEntriesTable from "@/app/(authenticated)/reports/components/ReportEntriesTable";
import { BackLink, Breadcrumbs } from "@/components";

export default async function ReportEntriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prisma = await getChurchPrisma();

  const report = await prisma.reports.findUnique({
    where: { id },
    include: { fields: { orderBy: { createdAt: "asc" } } },
  });

  if (!report) notFound();

  const entries = await prisma.reportEntries.findMany({
    where: { report_id: id },
    orderBy: { createdAt: "desc" },
    include: {
      values: { include: { field: true } },
      cell: { select: { name: true } },
      group: { select: { name: true } },
      sector: { select: { name: true } },
    },
    take: 100,
  });

  type Row = Record<string, unknown> & {
    id: string;
    createdAt: string;
    entidad: string;
  };

  const rows: Row[] = entries.map((e) => {
    const entidad =
      e.cell?.name || e.group?.name || e.sector?.name || "Iglesia";
    const base: Row = {
      id: e.id,
      createdAt: new Date(e.createdAt).toLocaleString(),
      entidad,
    };
    for (const f of report.fields) {
      const val = e.values.find((v) => v.report_field_id === f.id)
        ?.value as unknown;
      let display: unknown = val;
      if (val == null) display = "";
      else if (f.type === "BOOLEAN") display = val ? "Sí" : "No";
      else if (f.type === "DATE")
        display = new Date(String(val)).toLocaleDateString();
      base[f.id] = display;
    }
    return base;
  });

  const columns: TableColumn<Row>[] = [
    { key: "entidad", label: "Entidad", sortable: true },
    { key: "createdAt", label: "Fecha", sortable: true },
    ...report.fields.map((f) => ({
      key: f.id as keyof Row,
      label: f.label ?? f.key,
      sortable: false,
    })),
  ];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>
      <ReportEntriesTable
        rows={rows}
        columns={columns}
        title="Entradas del reporte"
        subTitle={`Total: ${entries.length}`}
      />
    </div>
  );
}
