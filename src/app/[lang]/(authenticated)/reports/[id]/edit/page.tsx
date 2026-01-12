import { getChurchPrisma } from '@/actions/churchContext';
import { notFound } from 'next/navigation';
import EditReportForm from '../../components/EditReportForm';
import { connection } from 'next/server';

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const prisma = await getChurchPrisma();
  const report = await prisma.reports.findUnique({
    where: { id },
    include: { fields: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] } },
  });
  if (!report) notFound();

  return (
    <div className="p-4">
      <EditReportForm
        initial={{
          id: report.id,
          title: report.title,
          description: report.description ?? undefined,
          scope: report.scope,
          color: report.color,
          fields: report.fields.map((f) => ({
            id: undefined, // Dejar id undefined para que useFieldArray genere uno nuevo
            fieldId: f.id, // Guardar el ID real de la BD
            key: f.key,
            label: f.label ?? undefined,
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
