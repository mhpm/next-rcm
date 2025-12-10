import Link from "next/link";
import { getChurchPrisma } from "@/actions/churchContext";
import ReportCard from "./components/ReportCard";
import { BackLink, Breadcrumbs } from "@/components";
import { connection } from "next/server";

export default async function ReportsPage() {
  await connection();
  const prisma = await getChurchPrisma();
  const reports = await prisma.reports.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      description: true,
      scope: true,
      createdAt: true,
      color: true,
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reportes</h1>
        <Link href="/reports/new" className="btn btn-primary">
          Crear reporte
        </Link>
      </div>
      {reports.length === 0 ? (
        <div className="text-center py-16 bg-base-200/50 rounded-lg border border-dashed border-base-300">
          <p className="text-base-content/70">Aún no tienes reportes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}
