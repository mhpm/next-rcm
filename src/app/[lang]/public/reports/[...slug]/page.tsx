import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getPublicReport,
  getPublicEntities,
  getPublicReportBySlugs,
  getPublicEntitiesBySlugs,
} from '../../actions';
import PublicReportForm from '../components/PublicReportForm';
import { connection } from 'next/server';

type Props = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let report = null;

  if (slug.length === 1) {
    report = await getPublicReport(slug[0]);
  } else if (slug.length === 2) {
    report = await getPublicReportBySlugs(slug[0], slug[1]);
  }

  if (!report) {
    return {
      title: 'Reporte no encontrado',
    };
  }

  return {
    title: report.title,
    description:
      report.description || `Reporte público de ${report.church.name}`,
    openGraph: {
      title: report.title,
      description:
        report.description || `Reporte público de ${report.church.name}`,
      type: 'website',
      images: [
        {
          url: '/icon.svg',
          width: 512,
          height: 512,
          alt: 'MultiplyNet Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: report.title,
      description:
        report.description || `Reporte público de ${report.church.name}`,
      images: ['/icon.svg'],
    },
  };
}

export default async function PublicReportPage({ params }: Props) {
  await connection();
  const { slug } = await params;

  let report = null;
  let entities = null;
  let token = '';

  // Case 1: Legacy URL /public/reports/[token]
  if (slug.length === 1) {
    token = slug[0];
    report = await getPublicReport(token);
    if (report) {
      entities = await getPublicEntities(token);
    }
  }
  // Case 2: Friendly URL /public/reports/[churchSlug]/[reportSlug]
  else if (slug.length === 2) {
    const [churchSlug, reportSlug] = slug;
    report = await getPublicReportBySlugs(churchSlug, reportSlug);
    if (report) {
      token = report.publicToken || '';
      entities = await getPublicEntitiesBySlugs(churchSlug, reportSlug);
    }
  }

  if (!report || !entities || !token) notFound();

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
            description: f.description,
            type: f.type,
            required: f.required,
            value: f.value,
            options: Array.isArray(f.options)
              ? (f.options as string[])
              : undefined,
            visibilityRules: Array.isArray(f.visibilityRules)
              ? (f.visibilityRules as any[])
              : undefined,
            validation: f.validation as any,
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
