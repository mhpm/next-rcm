import Link from 'next/link';
import { getChurchPrisma } from '@/actions/churchContext';
import ReportCard from './components/ReportCard';
import { BackLink, Breadcrumbs } from '@/components';
import { connection } from 'next/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default async function ReportsPage() {
  await connection();
  const prisma = await getChurchPrisma();
  const reports = await prisma.reports.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      description: true,
      scope: true,
      createdAt: true,
      color: true,
      publicToken: true,
    },
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reportes</h1>
        <Button asChild>
          <Link href="/reports/new">Crear reporte</Link>
        </Button>
      </div>
      {reports.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Aún no tienes reportes</p>
          </CardContent>
        </Card>
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
