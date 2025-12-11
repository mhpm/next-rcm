import { getChurchPrisma } from "@/actions/churchContext";
import SubmitReportForm from "../../components/SubmitReportForm";
import { notFound } from "next/navigation";
import { BackLink } from "@/components";
import { Breadcrumbs } from "@/components";

export default async function SubmitReportPage({
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

  if (!report) {
    notFound();
  }

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>

      <div
        className="bg-base-100 p-6 rounded-box shadow-md max-w-4xl mx-auto border-t-8"
        style={{ borderTopColor: report.color || "#3b82f6" }}
      >
        <SubmitReportForm
          reportId={report.id}
          title={report.title}
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
        />
      </div>
    </div>
  );
}
