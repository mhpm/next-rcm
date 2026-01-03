import { getChurchPrisma } from "@/actions/churchContext";
import SubmitReportForm from "../../components/SubmitReportForm";
import { notFound } from "next/navigation";
import { BackLink } from "@/components";
import { Breadcrumbs } from "@/components";
import { Card, CardContent } from "@/components/ui/card";
import { connection } from "next/server";

export default async function SubmitReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const prisma = await getChurchPrisma();

  const report = await prisma.reports.findUnique({
    where: { id },
    include: { fields: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] } },
  });

  if (!report) {
    notFound();
  }

  const [cells, groups, sectors] = await Promise.all([
    prisma.cells.findMany({
      select: {
        id: true,
        name: true,
        leader: { select: { firstName: true, lastName: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.groups.findMany({
      select: {
        id: true,
        name: true,
        leader: { select: { firstName: true, lastName: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.sectors.findMany({
      select: {
        id: true,
        name: true,
        supervisor: { select: { firstName: true, lastName: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const cellOptions = cells.map((c) => ({
    value: c.id,
    label: `${c.name}${
      c.leader ? ` - ${c.leader.firstName} ${c.leader.lastName}` : ""
    }`,
  }));
  const groupOptions = groups.map((g) => ({
    value: g.id,
    label: `${g.name}${
      g.leader ? ` - ${g.leader.firstName} ${g.leader.lastName}` : ""
    }`,
  }));
  const sectorOptions = sectors.map((s) => ({
    value: s.id,
    label: `${s.name}${
      s.supervisor
        ? ` - ${s.supervisor.firstName} ${s.supervisor.lastName}`
        : ""
    }`,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>

      <Card
        className="max-w-4xl mx-auto border-t-8"
        style={{ borderTopColor: report.color || "#3b82f6" }}
      >
        <CardContent className="p-6">
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
            value: f.value,
            options: Array.isArray(f.options)
              ? (f.options as string[])
              : undefined,
            visibilityRules: f.visibilityRules as any,
          }))}
          cells={cellOptions}
          groups={groupOptions}
          sectors={sectorOptions}
        />
        </CardContent>
      </Card>
    </div>
  );
}
