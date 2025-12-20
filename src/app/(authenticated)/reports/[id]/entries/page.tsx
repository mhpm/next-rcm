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
    include: { fields: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] } },
  });

  if (!report) notFound();

  const entries = await prisma.reportEntries.findMany({
    where: { report_id: id },
    orderBy: { createdAt: "desc" },
    include: {
      values: { include: { field: true } },
      cell: {
        select: {
          name: true,
          leader: { select: { firstName: true, lastName: true } },
          subSector: {
            select: {
              supervisor: { select: { firstName: true, lastName: true } },
              sector: {
                select: {
                  supervisor: { select: { firstName: true, lastName: true } },
                },
              },
            },
          },
        },
      },
      group: {
        select: {
          name: true,
          leader: { select: { firstName: true, lastName: true } },
        },
      },
      sector: {
        select: {
          name: true,
          supervisor: { select: { firstName: true, lastName: true } },
        },
      },
    },
    take: 100,
  });

  type Row = Record<string, unknown> & {
    id: string;
    createdAt: string;
    entidad: string;
    supervisor?: string;
    lider?: string;
  };

  const rows: Row[] = entries.map((e) => {
    const entidad =
      e.cell?.name || e.group?.name || e.sector?.name || "Iglesia";

    let supervisor = "";
    let lider = "";

    if (e.cell) {
      if (e.cell.subSector?.supervisor) {
        supervisor = `${e.cell.subSector.supervisor.firstName} ${e.cell.subSector.supervisor.lastName}`;
      } else if (e.cell.subSector?.sector?.supervisor) {
        supervisor = `${e.cell.subSector.sector.supervisor.firstName} ${e.cell.subSector.sector.supervisor.lastName}`;
      }
      if (e.cell.leader) {
        lider = `${e.cell.leader.firstName} ${e.cell.leader.lastName}`;
      }
    } else if (e.sector) {
      if (e.sector.supervisor) {
        supervisor = `${e.sector.supervisor.firstName} ${e.sector.supervisor.lastName}`;
      }
    } else if (e.group) {
      if (e.group.leader) {
        supervisor = `${e.group.leader.firstName} ${e.group.leader.lastName}`;
      }
    }

    const base: Row = {
      id: e.id,
      createdAt: new Date(e.createdAt).toLocaleString(),
      raw_createdAt: e.createdAt.toISOString(),
      entidad,
      supervisor,
      lider,
    };
    for (const f of report.fields) {
      const val = e.values.find((v) => v.report_field_id === f.id)
        ?.value as unknown;
      let display: unknown = val;
      if (val == null) display = "";
      else if (f.type === "BOOLEAN") display = val ? "Sí" : "No";
      else if (f.type === "DATE")
        display = new Date(String(val)).toLocaleDateString();
      else if (f.type === "CURRENCY")
        display = new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(Number(val));
      base[f.id] = display;
      base[`raw_${f.id}`] = val; // Store raw value for filtering
    }
    return base;
  });

  const columns: TableColumn<Row>[] = [
    { key: "entidad", label: "Entidad", sortable: true },
    { key: "supervisor", label: "Supervisor", sortable: true },
    { key: "lider", label: "Líder", sortable: true },
    { key: "createdAt", label: "Fecha", sortable: true },
    ...report.fields
      .filter((f) => f.type !== "SECTION")
      .map((f) => ({
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
        title={`Entradas del reporte: ${report.title}`}
        subTitle={`Total: ${entries.length}`}
        reportId={id}
        fields={report.fields
          .filter((f) => f.type !== "SECTION")
          .map((f) => ({
            id: f.id,
            key: f.key,
            label: f.label,
            type: f.type,
            options: Array.isArray(f.options)
              ? (f.options as string[])
              : undefined,
          }))}
      />
    </div>
  );
}
