import { getChurchPrisma } from "@/actions/churchContext";
import { notFound } from "next/navigation";
import { BackLink, Breadcrumbs } from "@/components";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { connection } from "next/server";

export default async function ViewReportEntryPage({
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
      cell: {
        select: {
          name: true,
          leader: { select: { firstName: true, lastName: true } },
          assistant: { select: { firstName: true, lastName: true } },
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
  });

  if (!entry) notFound();

  const entidad =
    entry.cell?.name || entry.group?.name || entry.sector?.name || "Iglesia";

  let supervisorName: string | null = null;
  let supervisorLabel = "Supervisor";
  let cellLeaderName: string | null = null;
  let cellAssistantName: string | null = null;

  if (entry.cell) {
    const subSectorSupervisor = entry.cell.subSector?.supervisor;
    const sectorSupervisor = entry.cell.subSector?.sector?.supervisor;

    if (subSectorSupervisor) {
      supervisorName = `${subSectorSupervisor.firstName} ${subSectorSupervisor.lastName}`;
    } else if (sectorSupervisor) {
      supervisorName = `${sectorSupervisor.firstName} ${sectorSupervisor.lastName}`;
    }

    if (entry.cell.leader) {
      cellLeaderName = `${entry.cell.leader.firstName} ${entry.cell.leader.lastName}`;
    }
    if (entry.cell.assistant) {
      cellAssistantName = `${entry.cell.assistant.firstName} ${entry.cell.assistant.lastName}`;
    }
  } else if (entry.sector) {
    if (entry.sector.supervisor) {
      supervisorName = `${entry.sector.supervisor.firstName} ${entry.sector.supervisor.lastName}`;
    }
  } else if (entry.group) {
    if (entry.group.leader) {
      supervisorName = `${entry.group.leader.firstName} ${entry.group.leader.lastName}`;
      supervisorLabel = "Líder";
    }
  }

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
        className="max-w-3xl mx-auto border-t-8"
        style={{ borderTopColor: report.color || "#3b82f6" }}
      >
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
          <div className="text-sm text-muted-foreground mb-6 flex flex-col gap-1">
            <p>
              Entidad: <span className="font-semibold">{entidad}</span>
            </p>
            {supervisorName && (
              <p>
                {supervisorLabel}:{" "}
                <span className="font-semibold">{supervisorName}</span>
              </p>
            )}
            {cellLeaderName && (
              <p>
                Líder de Célula:{" "}
                <span className="font-semibold">{cellLeaderName}</span>
              </p>
            )}
            {cellAssistantName && (
              <p>
                Asistente:{" "}
                <span className="font-semibold">{cellAssistantName}</span>
              </p>
            )}
            <p>
              Fecha:{" "}
              <span className="font-semibold">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
            </p>
          </div>

          <Separator />

          <div className="space-y-6">
            {report.fields.map((f) => {
              const val = entry.values.find((v) => v.report_field_id === f.id)
                ?.value as unknown;
              let display: React.ReactNode = String(val ?? "-");

              if (val == null || val === "")
                display = (
                  <span className="text-muted-foreground italic">Sin respuesta</span>
                );
              else if (f.type === "BOOLEAN") display = val ? "Sí" : "No";
              else if (f.type === "DATE")
                display = new Date(String(val)).toLocaleDateString();
              else if (f.type === "CURRENCY")
                display = new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(Number(val));

              return (
                <div
                  key={f.id}
                  className="border-b border-border pb-3 last:border-0"
                >
                  <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                    {f.label || f.key}
                  </h3>
                  <div className="text-lg">{display}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
