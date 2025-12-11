import { getChurchPrisma } from "@/actions/churchContext";
import { notFound } from "next/navigation";
import { BackLink, Breadcrumbs } from "@/components";

export default async function ViewReportEntryPage({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { id, entryId } = await params;
  const prisma = await getChurchPrisma();

  const report = await prisma.reports.findUnique({
    where: { id },
    include: { fields: { orderBy: { createdAt: "asc" } } },
  });

  if (!report) notFound();

  const entry = await prisma.reportEntries.findUnique({
    where: { id: entryId },
    include: {
      values: true,
      cell: { select: { name: true } },
      group: { select: { name: true } },
      sector: { select: { name: true } },
    },
  });

  if (!entry) notFound();

  const entidad =
    entry.cell?.name || entry.group?.name || entry.sector?.name || "Iglesia";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackLink
          text="Volver a entradas"
          fallbackHref={`/reports/${id}/entries`}
        />
        <Breadcrumbs />
      </div>

      <div
        className="card bg-base-100 shadow-md max-w-3xl mx-auto border-t-8"
        style={{ borderTopColor: report.color || "#3b82f6" }}
      >
        <div className="card-body">
          <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
          <div className="text-sm text-base-content/70 mb-6 flex flex-col gap-1">
            <p>
              Entidad: <span className="font-semibold">{entidad}</span>
            </p>
            <p>
              Fecha:{" "}
              <span className="font-semibold">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
            </p>
          </div>

          <div className="divider"></div>

          <div className="space-y-6">
            {report.fields.map((f) => {
              const val = entry.values.find((v) => v.report_field_id === f.id)
                ?.value as unknown;
              let display: React.ReactNode = String(val ?? "-");

              if (val == null || val === "")
                display = (
                  <span className="text-base-content/40 italic">
                    Sin respuesta
                  </span>
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
                  className="border-b border-base-200 pb-3 last:border-0"
                >
                  <h3 className="font-semibold text-sm text-base-content/60 mb-1">
                    {f.label || f.key}
                  </h3>
                  <div className="text-lg">{display}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
