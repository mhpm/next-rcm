import { getChurchPrisma } from '@/actions/churchContext';
import { notFound } from 'next/navigation';
import type { TableColumn } from '@/types';
import ReportEntriesTable from '@/app/[lang]/(authenticated)/reports/components/ReportEntriesTable';
import ConsolidatedReportView from '@/app/[lang]/(authenticated)/reports/components/ConsolidatedReportView';
import ComparisonReportView from '@/app/[lang]/(authenticated)/reports/components/ComparisonReportView';
import { BackLink, Breadcrumbs } from '@/components';
import { TabsContent } from '@/components/ui/tabs';
import ReportTabsClient from '@/app/[lang]/(authenticated)/reports/components/ReportTabsClient';
import { connection } from 'next/server';

export default async function ReportEntriesPage({
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

  const entries = await prisma.reportEntries.findMany({
    where: { report_id: id },
    orderBy: { createdAt: 'desc' },
    include: {
      values: { include: { field: true } },
      cell: {
        select: {
          name: true,
          leader: { select: { firstName: true, lastName: true } },
          subSector: {
            select: {
              name: true,
              supervisor: { select: { firstName: true, lastName: true } },
              sector: {
                select: {
                  name: true,
                  supervisor: { select: { firstName: true, lastName: true } },
                  zone: {
                    select: {
                      name: true,
                      supervisor: {
                        select: { firstName: true, lastName: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      group: {
        select: {
          name: true,
          leader: { select: { firstName: true, lastName: true } },
        },
      },
      sector: {
        select: {
          name: true,
          supervisor: { select: { firstName: true, lastName: true } },
          zone: {
            select: {
              name: true,
              supervisor: { select: { firstName: true, lastName: true } },
            },
          },
        },
      },
    },
    take: 5000,
  });

  // Extract spiritualFatherIds from FRIEND_REGISTRATION fields to pre-fetch names
  const spiritualFatherIds = new Set<string>();
  entries.forEach((entry) => {
    entry.values.forEach((val) => {
      if (
        val.field.type === 'FRIEND_REGISTRATION' &&
        Array.isArray(val.value)
      ) {
        (val.value as any[]).forEach((friend) => {
          if (friend.spiritualFatherId) {
            spiritualFatherIds.add(friend.spiritualFatherId);
          }
        });
      }
    });
  });

  // Fetch member names
  const members = await prisma.members.findMany({
    where: { id: { in: Array.from(spiritualFatherIds) } },
    select: { id: true, firstName: true, lastName: true },
  });

  const memberMap = new Map(
    members.map((m) => [m.id, `${m.firstName} ${m.lastName}`])
  );

  type Row = Record<string, unknown> & {
    id: string;
    createdAt: string;
    entidad: string;
    supervisor?: string;
    lider?: string;
    supervisor_sector?: string;
    supervisor_subsector?: string;
    // New fields for hierarchical grouping
    celula?: string;
    subsector?: string;
    sector?: string;
    zona?: string;
  };

  const rows: Row[] = entries.map((e) => {
    const entidad =
      e.cell?.name || e.group?.name || e.sector?.name || 'Iglesia';

    let supervisor = '';
    let lider = '';

    // Names for grouping
    let celula = '';
    let subsector = '';
    let sector = '';
    let zona = '';

    if (e.cell) {
      celula = e.cell.name;
      if (e.cell.subSector) {
        subsector = e.cell.subSector.name || '';
        if (e.cell.subSector.supervisor) {
          supervisor = `${e.cell.subSector.supervisor.firstName} ${e.cell.subSector.supervisor.lastName}`;
        }

        if (e.cell.subSector.sector) {
          sector = e.cell.subSector.sector.name || '';
          if (!supervisor && e.cell.subSector.sector.supervisor) {
            supervisor = `${e.cell.subSector.sector.supervisor.firstName} ${e.cell.subSector.sector.supervisor.lastName}`;
          }

          if (e.cell.subSector.sector.zone) {
            zona = e.cell.subSector.sector.zone.name || '';
          }
        }
      }
      if (e.cell.leader) {
        lider = `${e.cell.leader.firstName} ${e.cell.leader.lastName}`;
      }
    } else if (e.sector) {
      sector = e.sector.name;
      if (e.sector.supervisor) {
        supervisor = `${e.sector.supervisor.firstName} ${e.sector.supervisor.lastName}`;
      }
      if (e.sector.zone) {
        zona = e.sector.zone.name || '';
      }
    } else if (e.group) {
      if (e.group.leader) {
        supervisor = `${e.group.leader.firstName} ${e.group.leader.lastName}`;
      }
    }

    // Determine scopes for grouping
    let supervisor_subsector = '';
    let supervisor_sector = '';

    if (e.cell) {
      if (e.cell.subSector?.supervisor) {
        supervisor_subsector = `${e.cell.subSector.supervisor.firstName} ${e.cell.subSector.supervisor.lastName}`;
      }
      if (e.cell.subSector?.sector?.supervisor) {
        supervisor_sector = `${e.cell.subSector.sector.supervisor.firstName} ${e.cell.subSector.sector.supervisor.lastName}`;
      }
    }

    const base: Row = {
      id: e.id,
      createdAt: new Date(e.createdAt).toLocaleString(),
      raw_createdAt: e.createdAt.toISOString(),
      entidad,
      supervisor,
      lider,
      supervisor_sector,
      supervisor_subsector,
      celula,
      subsector,
      sector,
      zona,
    };
    for (const f of report.fields) {
      const val = e.values.find((v) => v.report_field_id === f.id)
        ?.value as unknown;
      let display: unknown = val;
      if (val == null) display = '';
      else if (f.type === 'BOOLEAN') display = val ? 'Sí' : 'No';
      else if (f.type === 'DATE')
        display = new Date(String(val)).toLocaleDateString();
      else if (f.type === 'CURRENCY')
        display = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(Number(val));
      else if (f.type === 'FRIEND_REGISTRATION' && Array.isArray(val)) {
        display = (val as any[]).map((friend) => ({
          ...friend,
          spiritualFatherName: friend.spiritualFatherId
            ? memberMap.get(friend.spiritualFatherId)
            : undefined,
        }));
      }
      base[f.id] = display;
      base[`raw_${f.id}`] = val; // Store raw value for filtering
    }
    return base;
  });

  const columns: TableColumn<Row>[] = [
    { key: 'entidad', label: 'Entidad', sortable: true },
    { key: 'supervisor', label: 'Supervisor', sortable: true },
    { key: 'lider', label: 'Líder', sortable: true },
    { key: 'createdAt', label: 'Fecha', sortable: true },
    ...report.fields
      .filter((f) => f.type !== 'SECTION')
      .map((f) => ({
        key: f.id as keyof Row,
        label: f.label ?? f.key,
        sortable: false,
      })),
  ];

  return (
    <div className="space-y-6 p-4 w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>

      <ReportTabsClient reportId={id}>
        <TabsContent value="list">
          <ReportEntriesTable
            rows={rows}
            columns={columns}
            title={`Entradas del reporte: ${report.title}`}
            subTitle={`Total: ${entries.length}`}
            reportId={id}
            fields={report.fields
              .filter((f) => f.type !== 'SECTION')
              .map((f) => ({
                id: f.id,
                key: f.key,
                label: f.label,
                type: f.type,
                options: Array.isArray(f.options)
                  ? (f.options as string[])
                  : undefined,
              }))}
          />
        </TabsContent>

        <TabsContent value="consolidated">
          <ConsolidatedReportView
            rows={rows}
            fields={report.fields}
            reportId={id}
          />
        </TabsContent>

        <TabsContent value="comparison">
          <ComparisonReportView
            rows={rows}
            fields={report.fields}
            reportId={id}
          />
        </TabsContent>
      </ReportTabsClient>
    </div>
  );
}
