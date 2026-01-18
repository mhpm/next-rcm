import prisma from '@/lib/prisma';
import EditReportForm from '../../components/EditReportForm';
import { connection } from 'next/server';

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  await connection();
  const { id } = await params;

  // Use global prisma client to ensure we can find the report by ID regardless of context
  const report = await prisma.reports.findUnique({
    where: { id },
    include: { fields: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] } },
  });

  if (!report) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Report Not Found</h1>
        <p className="mt-4">
          Could not find report to edit with ID:{' '}
          <code className="bg-muted p-1 rounded">{id}</code>
        </p>
        <div className="mt-4">
          {/* Simple back link */}
          <a href="/reports" className="text-blue-500 underline">
            Volver al listado
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <EditReportForm
        initial={{
          id: report.id,
          title: report.title,
          slug: report.slug,
          description: report.description ?? undefined,
          scope: report.scope,
          color: report.color,
          fields: report.fields.map((f) => ({
            id: undefined, // Dejar id undefined para que useFieldArray genere uno nuevo
            fieldId: f.id, // Guardar el ID real de la BD
            key: f.key,
            label: f.label ?? undefined,
            description: f.description ?? undefined,
            type: f.type,
            value: (f as any).value,
            options: Array.isArray((f as any).options)
              ? (f as any).options.map((opt: any) => {
                  if (typeof opt === 'string') {
                    return { value: opt };
                  }
                  return opt;
                })
              : undefined,
            visibilityRules: (f as any).visibilityRules,
            validation: (f as any).validation ?? {},
            required: f.required,
          })),
        }}
      />
    </div>
  );
}
