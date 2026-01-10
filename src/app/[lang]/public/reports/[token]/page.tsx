import { notFound } from 'next/navigation';
import { getPublicReport, getPublicEntities } from '../../actions';
import PublicReportForm from '../components/PublicReportForm';
import { connection } from 'next/server';

export default async function PublicReportPage({
  params,
}: {
  params: Promise<{ lang: string; token: string }>;
}) {
  await connection();
  const { token } = await params;
  const report = await getPublicReport(token);

  if (!report) notFound();

  const entities = await getPublicEntities(token);

  if (!entities) notFound(); // Should not happen if report exists, but good for safety

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">
            Reporte Público
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            {report.church.name}
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-4" />
        </div>

        <PublicReportForm
          token={token}
          title={report.title}
          description={report.description}
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
          groups={entities.groups.map((g) => ({
            value: g.id,
            label: `${g.name}${
              g.leader ? ` - ${g.leader.firstName} ${g.leader.lastName}` : ''
            }`,
          }))}
          sectors={entities.sectors.map((s) => ({
            value: s.id,
            label: `${s.name}${
              s.supervisor
                ? ` - ${s.supervisor.firstName} ${s.supervisor.lastName}`
                : ''
            }`,
          }))}
          members={entities.members.map((m) => ({
            value: m.id,
            label: `${m.firstName} ${m.lastName}`,
          }))}
          unlinkedMembers={entities.unlinkedMembers.map((m) => ({
            value: m.id,
            label: `${m.firstName} ${m.lastName}`,
          }))}
          churchName={report.church.name}
        />
      </div>
    </div>
  );
}
