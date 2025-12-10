import { getChurchPrisma } from "@/actions/churchContext";
import { notFound } from "next/navigation";
import EditReportForm from "../../components/EditReportForm";

export default async function EditReportPage({
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

  return (
    <div className="p-6">
      <EditReportForm
        initial={{
          id: report.id,
          title: report.title,
          description: report.description ?? undefined,
          scope: report.scope,
          fields: report.fields.map((f) => ({
            id: undefined, // Dejar id undefined para que useFieldArray genere uno nuevo
            fieldId: f.id, // Guardar el ID real de la BD
            key: f.key,
            label: f.label ?? undefined,
            type: f.type,
            value: (f as any).value,
            required: f.required,
          })),
        }}
      />
    </div>
  );
}
