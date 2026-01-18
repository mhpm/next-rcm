import prisma from '@/lib/prisma';
import type { TableColumn } from '@/types';
import ReportEntriesTable from '@/app/[lang]/(authenticated)/reports/components/ReportEntriesTable';
import ConsolidatedReportView from '@/app/[lang]/(authenticated)/reports/components/ConsolidatedReportView';
import ComparisonReportView from '@/app/[lang]/(authenticated)/reports/components/ComparisonReportView';
import ReportDashboardBuilder from '@/app/[lang]/(authenticated)/reports/components/ReportDashboardBuilder';
import { BackLink, Breadcrumbs } from '@/components';
import { TabsContent } from '@/components/ui/tabs';
import ReportTabsClient from '@/app/[lang]/(authenticated)/reports/components/ReportTabsClient';
import { connection } from 'next/server';

export default async function ReportEntriesPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  await connection();
  const { id } = await params;

  // Use global prisma client to avoid context issues with findUnique
  const report = await prisma.reports.findUnique({
    where: { id },
    include: { fields: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] } },
  });

  if (!report) {
    console.error(`Report not found for ID: ${id}`);
    // Fallback debugging UI
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Report Not Found</h1>
        <p className="mt-4">
          Could not find report with ID:{' '}
          <code className="bg-muted p-1 rounded">{id}</code>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please verify the URL or go back to the list.
        </p>
        <div className="mt-4">
          <BackLink text="Volver al listado" fallbackHref="/reports" />
        </div>
      </div>
    );
  }

  const entries = await prisma.reportEntries.findMany({
    where: { report_id: id },
    orderBy: { createdAt: 'desc' },
    include: {
      values: { include: { field: true } },
      cell: {
        select: {
          id: true,
          name: true,
          leader_id: true,
          leader: { select: { firstName: true, lastName: true } },
          host: { select: { firstName: true, lastName: true } },
          assistant: { select: { firstName: true, lastName: true } },
          members: { select: { id: true, firstName: true, lastName: true } },
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
          members: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      sector: {
        select: {
          name: true,
          supervisor: { select: { firstName: true, lastName: true } },
          members: { select: { id: true, firstName: true, lastName: true } },
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

  // Extract member IDs from FRIEND_REGISTRATION and MEMBER_SELECT fields to pre-fetch names
  const memberIds = new Set<string>();
  entries.forEach((entry) => {
    entry.values.forEach((val) => {
      if (
        val.field.type === 'FRIEND_REGISTRATION' &&
        Array.isArray(val.value)
      ) {
        (val.value as any[]).forEach((friend) => {
          if (friend.spiritualFatherId) {
            memberIds.add(friend.spiritualFatherId);
          }
        });
      } else if (
        (val.field.type === 'MEMBER_SELECT' ||
          val.field.type === 'MEMBER_ATTENDANCE') &&
        Array.isArray(val.value)
      ) {
        (val.value as string[]).forEach((id) => {
          if (id) memberIds.add(id);
        });
      }
    });
  });

  // Fetch member names
  const members = await prisma.members.findMany({
    where: { id: { in: Array.from(memberIds) } },
    select: { id: true, firstName: true, lastName: true },
  });

  const memberMap = new Map(
    members.map((m) => [m.id, `${m.firstName} ${m.lastName}`])
  );

  // Fetch available entities based on scope for import validation
  let availableEntities: string[] = [];
  if (report.scope === 'CELL') {
    const cells = await prisma.cells.findMany({
      where: { church_id: report.church_id },
      select: { name: true },
      orderBy: { name: 'asc' },
    });
    availableEntities = cells.map((c) => c.name);
  } else if (report.scope === 'GROUP') {
    const groups = await prisma.groups.findMany({
      where: { church_id: report.church_id },
      select: { name: true },
      orderBy: { name: 'asc' },
    });
    availableEntities = groups.map((g) => g.name);
  } else if (report.scope === 'SECTOR') {
    const sectors = await prisma.sectors.findMany({
      where: { church_id: report.church_id },
      select: { name: true },
      orderBy: { name: 'asc' },
    });
    availableEntities = sectors.map((s) => s.name);
  } else if (report.scope === 'ZONE') {
    const zones = await prisma.zones.findMany({
      where: { church_id: report.church_id },
      select: { name: true },
      orderBy: { name: 'asc' },
    });
    availableEntities = zones.map((z) => z.name);
  }

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
    let asistente = '';
    let anfitrion = '';

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
      if (e.cell.assistant) {
        asistente = `${e.cell.assistant.firstName} ${e.cell.assistant.lastName}`;
      }
      if (e.cell.host) {
        anfitrion = `${e.cell.host.firstName} ${e.cell.host.lastName}`;
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

    const entityMemberIds =
      e.cell?.members.map((m) => m.id) ||
      e.group?.members.map((m) => m.id) ||
      e.sector?.members.map((m) => m.id) ||
      [];

    const entityMembers =
      e.cell?.members.map((m) => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
      })) ||
      e.group?.members.map((m) => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
      })) ||
      e.sector?.members.map((m) => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
      })) ||
      [];

    const base: Row = {
      id: e.id,
      createdAt: e.createdAt.toISOString(), // Send ISO string to client
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
      __allMemberIds: entityMemberIds,
      __allMembers: entityMembers,
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
      else if (
        f.type === 'CYCLE_WEEK_INDICATOR' &&
        val &&
        typeof val === 'object'
      ) {
        const cycleVal = val as { week?: number; verb?: string };
        if (cycleVal.week) {
          display = `Semana ${cycleVal.week}: ${cycleVal.verb}`;
        } else {
          display = cycleVal.verb || '';
        }
      } else if (f.type === 'FRIEND_REGISTRATION' && Array.isArray(val)) {
        display = (val as any[]).map((friend) => ({
          ...friend,
          spiritualFatherName: friend.spiritualFatherId
            ? memberMap.get(friend.spiritualFatherId)
            : undefined,
        }));
      } else if (
        (f.type === 'MEMBER_SELECT' || f.type === 'MEMBER_ATTENDANCE') &&
        Array.isArray(val)
      ) {
        let selectedNames = (val as string[])
          .map((id) => memberMap.get(id))
          .filter(Boolean) as string[];

        // If it's a cell report, ensure leader, assistant and host are included with labels
        if (e.cell) {
          // Add/Update Leader
          if (lider) {
            const index = selectedNames.findIndex((n) => n.startsWith(lider));
            if (index !== -1) {
              selectedNames[index] = `${lider} (Líder)`;
            }
          }

          // Add/Update Assistant
          if (asistente) {
            const index = selectedNames.findIndex((n) =>
              n.startsWith(asistente)
            );
            if (index !== -1) {
              selectedNames[index] = `${asistente} (Asistente)`;
            }
          }

          // Add/Update Host
          if (anfitrion) {
            const index = selectedNames.findIndex((n) =>
              n.startsWith(anfitrion)
            );
            if (index !== -1) {
              selectedNames[index] = `${anfitrion} (Anfitrión)`;
            }
          }

          // Sort: Leader > Assistant > Host > Others
          selectedNames.sort((a, b) => {
            const getOrder = (name: string) => {
              if (name.includes('(Líder)')) return 1;
              if (name.includes('(Asistente)')) return 2;
              if (name.includes('(Anfitrión)')) return 3;
              return 4;
            };
            const orderA = getOrder(a);
            const orderB = getOrder(b);
            if (orderA !== orderB) return orderA - orderB;
            return a.localeCompare(b);
          });
        }
        display = selectedNames;
      }
      base[f.id] = display;
      base[`raw_${f.id}`] = val; // Store raw value for filtering
    }
    return base;
  });

  const getEntityLabel = (scope: string) => {
    switch (scope) {
      case 'CELL':
        return 'Célula';
      case 'GROUP':
        return 'Grupo';
      case 'SECTOR':
        return 'Sector';
      case 'SUBSECTOR':
        return 'Sub-Sector';
      case 'ZONE':
        return 'Zona';
      case 'CHURCH':
        return 'Iglesia';
      default:
        return 'Entidad';
    }
  };

  const columns: TableColumn<Row>[] = [
    { key: 'entidad', label: getEntityLabel(report.scope), sortable: true },
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
            availableEntities={availableEntities}
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

        <TabsContent value="dashboard">
          <ReportDashboardBuilder
            reportId={id}
            fields={report.fields.map((f) => ({
              id: f.id,
              key: f.key,
              label: f.label,
              type: f.type,
            }))}
            rows={rows}
          />
        </TabsContent>
      </ReportTabsClient>
    </div>
  );
}
