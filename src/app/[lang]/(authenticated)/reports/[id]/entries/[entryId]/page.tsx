import { getChurchPrisma } from '@/actions/churchContext';
import { notFound } from 'next/navigation';
import { BackLink, Breadcrumbs } from '@/components';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Calendar, User, Users } from 'lucide-react';
import { PrintReportButton } from '@/app/[lang]/(authenticated)/reports/components/PrintReportButton';

export default async function ViewReportEntryPage({
  params,
}: {
  params: Promise<{ lang: string; id: string; entryId: string }>;
}) {
  const { id, entryId } = await params;
  const prisma = await getChurchPrisma();

  const report = await prisma.reports.findUnique({
    where: { id },
    include: { fields: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] } },
  });

  if (!report) notFound();

  const entry = await prisma.reportEntries.findUnique({
    where: { id: entryId },
    include: {
      values: true,
      cell: {
        select: {
          name: true,
          leader: { select: { firstName: true, lastName: true } },
          assistant: { select: { firstName: true, lastName: true } },
          members: {
            select: { id: true, firstName: true, lastName: true },
            orderBy: { firstName: 'asc' },
          },
          subSector: {
            select: {
              name: true,
              supervisor: { select: { firstName: true, lastName: true } },
              sector: {
                select: {
                  name: true,
                  supervisor: { select: { firstName: true, lastName: true } },
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
          members: {
            select: { id: true, firstName: true, lastName: true },
            orderBy: { firstName: 'asc' },
          },
        },
      },
      sector: {
        select: {
          name: true,
          supervisor: { select: { firstName: true, lastName: true } },
          members: {
            select: { id: true, firstName: true, lastName: true },
            orderBy: { firstName: 'asc' },
          },
        },
      },
    },
  });

  if (!entry) notFound();

  // Collect member IDs to fetch names
  const memberIds = new Set<string>();
  const entityMembers =
    entry.cell?.members || entry.group?.members || entry.sector?.members || [];

  // Add all entity members to the set so we can resolve their names
  entityMembers.forEach((m) => memberIds.add(m.id));

  entry.values.forEach((v) => {
    const field = report.fields.find((f) => f.id === v.report_field_id);
    if (!field) return;

    if (field.type === 'MEMBER_SELECT' && Array.isArray(v.value)) {
      (v.value as string[]).forEach((id) => memberIds.add(id));
    }

    if (field.type === 'MEMBER_ATTENDANCE' && Array.isArray(v.value)) {
      (v.value as string[]).forEach((id) => memberIds.add(id));
    }

    if (field.type === 'FRIEND_REGISTRATION' && Array.isArray(v.value)) {
      (v.value as any[]).forEach((friend) => {
        if (friend.spiritualFatherId) memberIds.add(friend.spiritualFatherId);
      });
    }
  });

  const members = await prisma.members.findMany({
    where: { id: { in: Array.from(memberIds) } },
    select: { id: true, firstName: true, lastName: true },
  });

  const membersMap = new Map(
    members.map((m) => [m.id, `${m.firstName} ${m.lastName}`])
  );

  const entidad =
    entry.cell?.name || entry.group?.name || entry.sector?.name || 'Iglesia';

  let supervisorName: string | null = null;
  let supervisorLabel = 'Supervisor';
  let cellLeaderName: string | null = null;
  let cellAssistantName: string | null = null;

  if (entry.cell) {
    const subSectorSupervisor = entry.cell.subSector?.supervisor;
    const sectorSupervisor = entry.cell.subSector?.sector?.supervisor;

    if (subSectorSupervisor) {
      supervisorName = `${subSectorSupervisor.firstName} ${subSectorSupervisor.lastName}`;
    } else if (sectorSupervisor) {
      supervisorName = `${sectorSupervisor.firstName} ${sectorSupervisor.lastName}`;
    }

    if (entry.cell.leader) {
      cellLeaderName = `${entry.cell.leader.firstName} ${entry.cell.leader.lastName}`;
    }
    if (entry.cell.assistant) {
      cellAssistantName = `${entry.cell.assistant.firstName} ${entry.cell.assistant.lastName}`;
    }
  } else if (entry.sector) {
    if (entry.sector.supervisor) {
      supervisorName = `${entry.sector.supervisor.firstName} ${entry.sector.supervisor.lastName}`;
    }
  } else if (entry.group) {
    if (entry.group.leader) {
      supervisorName = `${entry.group.leader.firstName} ${entry.group.leader.lastName}`;
      supervisorLabel = 'Líder';
    }
  }

  // Group fields into sections
  const sections: { title: string; fields: typeof report.fields }[] = [];
  let currentSection: (typeof sections)[0] = {
    title: 'Datos del Reporte',
    fields: [],
  };
  sections.push(currentSection);

  report.fields.forEach((f) => {
    if (f.type === 'SECTION') {
      if (
        currentSection.fields.length === 0 &&
        currentSection.title === 'Datos del Reporte'
      ) {
        currentSection.title = f.label || 'Sección';
      } else {
        currentSection = { title: f.label || 'Sección', fields: [] };
        sections.push(currentSection);
      }
    } else {
      currentSection.fields.push(f);
    }
  });

  const nonEmptySections = sections.filter((s) => s.fields.length > 0);

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500 print:p-0 print:max-w-none">
      <style>{`
        @media print {
          @page {
            margin: 1.5cm;
            size: auto;
          }
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* Hide shadows, borders, and backgrounds for cleaner print */
          .shadow-md, .shadow-sm, .shadow {
            box-shadow: none !important;
          }
          .border, .border-t-8 {
            border: none !important;
            border-bottom: 1px solid #e5e7eb !important;
          }
          .bg-muted, .bg-muted\/30, .bg-muted\/50, .bg-secondary\/50, .bg-primary\/5, .bg-card {
            background-color: transparent !important;
          }
          /* Compact typography for print */
          h1 { font-size: 20pt !important; margin-bottom: 5px !important; color: black !important; }
          h2 { font-size: 16pt !important; margin-top: 15px !important; margin-bottom: 10px !important; font-weight: 800 !important; color: black !important; }
          h3 { font-size: 10pt !important; margin-bottom: 2px !important; font-weight: 700 !important; color: #000 !important; }
          p, span, div { font-size: 10pt; color: #000; }
          
          /* Add separators for sections */
          .section-separator {
            border-bottom: 2px solid #ddd !important;
            padding-bottom: 5px !important;
            margin-bottom: 10px !important;
          }

          .print-compact-grid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 15px !important;
          }
          .print-compact-card {
            padding: 0 !important;
            margin-bottom: 15px !important;
          }
          /* Force page breaks if needed, but try to avoid for compactness */
          .break-inside-avoid {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="flex items-center justify-between print:hidden">
        <BackLink
          text="Volver a entradas"
          fallbackHref={`/reports/${id}/entries`}
        />
        <Breadcrumbs />
      </div>

      <div className="flex justify-end print:hidden">
        <PrintReportButton />
      </div>

      <div id="printable-report" className="space-y-8 print:space-y-6">
        {/* Header Card */}
        <Card
          className="border-t-8 shadow-md overflow-hidden print:border-0 print:shadow-none print:mb-8"
          style={{ borderTopColor: report.color || '#3b82f6' }}
        >
          <CardHeader className="pb-6 bg-gradient-to-b from-muted/50 to-transparent print:p-0 print:pb-4 print:border-b-2 print:border-black">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 print:flex-row print:items-center print:gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground print:text-2xl">
                  {report.title}
                </h1>
                {report.description && (
                  <p className="text-muted-foreground mt-2 text-lg print:text-base print:mt-1">
                    {report.description}
                  </p>
                )}
              </div>
              <Badge
                variant="outline"
                className="text-sm px-4 py-1.5 h-auto rounded-full bg-background shadow-sm border-muted-foreground/20 print:border-0 print:px-0 print:py-0 print:text-base print:font-bold"
              >
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground print:hidden" />
                {new Date(entry.createdAt).toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="print:p-0 print:pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-5 bg-muted/30 rounded-2xl border border-muted/50 print:grid-cols-4 print:gap-4 print:p-0 print:border-0">
              <div className="space-y-1.5 print:space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 print:text-[10px] print:text-gray-500">
                  <Users className="w-3 h-3 print:hidden" />
                  Entidad
                </span>
                <p className="font-bold text-lg text-foreground print:text-base">
                  {entidad}
                </p>
              </div>
              {supervisorName && (
                <div className="space-y-1.5 print:space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 print:text-[10px] print:text-gray-500">
                    <User className="w-3 h-3 print:hidden" />
                    {supervisorLabel}
                  </span>
                  <p className="font-semibold text-foreground print:text-base">
                    {supervisorName}
                  </p>
                </div>
              )}
              {cellLeaderName && (
                <div className="space-y-1.5 print:space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 print:text-[10px] print:text-gray-500">
                    <User className="w-3 h-3 print:hidden" />
                    Líder de Célula
                  </span>
                  <p className="font-semibold text-foreground print:text-base">
                    {cellLeaderName}
                  </p>
                </div>
              )}
              {cellAssistantName && (
                <div className="space-y-1.5 print:space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 print:text-[10px] print:text-gray-500">
                    <User className="w-3 h-3 print:hidden" />
                    Asistente
                  </span>
                  <p className="font-semibold text-foreground print:text-base">
                    {cellAssistantName}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="grid gap-8 print:block print:gap-8">
          {nonEmptySections.map((section, idx) => (
            <div
              key={idx}
              className="space-y-4 print:space-y-4 break-inside-avoid print:mb-6"
            >
              {section.title && (
                <div className="flex items-center gap-4 print:gap-2 print:mb-2 section-separator">
                  <h2 className="text-xl font-bold text-foreground print:text-lg">
                    {section.title}
                  </h2>
                  <div className="h-px bg-border flex-1 print:hidden" />
                </div>
              )}
              <Card className="shadow-sm border-muted/60 print:shadow-none print:border-0">
                <CardContent className="p-6 md:p-8 print:p-0">
                  <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 print:grid-cols-4 print:gap-x-6 print:gap-y-4">
                    {section.fields.map((f) => {
                      const val = entry.values.find(
                        (v) => v.report_field_id === f.id
                      )?.value;
                      const isFullWidth =
                        f.type === 'MEMBER_SELECT' ||
                        f.type === 'MEMBER_ATTENDANCE' ||
                        f.type === 'FRIEND_REGISTRATION';

                      return (
                        <div
                          key={f.id}
                          className={`space-y-3 print:space-y-1 ${
                            isFullWidth ? 'col-span-full' : ''
                          }`}
                        >
                          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 print:text-[10px] print:mb-0.5 print:text-gray-600">
                            {f.label || f.key}
                          </h3>
                          <div className="text-base text-foreground font-medium print:text-sm">
                            <FieldValueDisplay
                              field={f}
                              value={val}
                              membersMap={membersMap}
                              allMembers={
                                f.type === 'MEMBER_ATTENDANCE'
                                  ? entityMembers.map((m) => m.id)
                                  : undefined
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FieldValueDisplay({
  field,
  value,
  membersMap,
  allMembers,
}: {
  field: any;
  value: any;
  membersMap: Map<string, string>;
  allMembers?: string[];
}) {
  if (value === undefined || value === null || value === '') {
    return (
      <span className="text-muted-foreground/50 italic text-sm print:text-xs">
        Sin respuesta
      </span>
    );
  }

  if (field.type === 'BOOLEAN') {
    return value ? (
      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20 pl-2 pr-3 py-1 print:bg-transparent print:text-black print:border print:border-black print:px-1 print:py-0 print:text-[10px] print:h-auto">
        <Check className="w-3.5 h-3.5 mr-1.5 print:w-3 print:h-3" /> Sí
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="text-muted-foreground bg-muted/50 pl-2 pr-3 py-1 print:bg-transparent print:text-black print:border print:border-black print:px-1 print:py-0 print:text-[10px] print:h-auto"
      >
        <X className="w-3.5 h-3.5 mr-1.5 print:w-3 print:h-3" /> No
      </Badge>
    );
  }

  if (field.type === 'CURRENCY') {
    return (
      <span className="font-mono font-bold text-2xl tracking-tight text-foreground print:text-sm">
        {new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(Number(value))}
      </span>
    );
  }

  if (field.type === 'DATE') {
    return (
      <div className="flex items-center gap-2 text-foreground/80 bg-muted/30 w-fit px-3 py-1.5 rounded-md border border-border/50 print:border-0 print:p-0 print:bg-transparent">
        <Calendar className="w-4 h-4 text-muted-foreground print:hidden" />
        <span className="print:text-sm">
          {new Date(String(value)).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
    );
  }

  if (field.type === 'MEMBER_SELECT' || field.type === 'MEMBER_ATTENDANCE') {
    const ids = (value as string[]) || [];

    if (field.type === 'MEMBER_ATTENDANCE' && allMembers) {
      const attendedIds = new Set(ids);
      const absentIds = allMembers.filter((id) => !attendedIds.has(id));
      const attendedCount = attendedIds.size;
      const absentCount = absentIds.length;
      const totalCount = allMembers.length;
      const attendancePercentage =
        totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0;

      return (
        <div className="space-y-3">
          <div className="flex gap-3 print:hidden flex-wrap">
            <Badge variant="default">Asistieron: {attendedCount}</Badge>
            <Badge variant="secondary">Faltaron: {absentCount}</Badge>
            <Badge variant="outline" className="ml-auto">
              {attendancePercentage}% Asistencia
            </Badge>
          </div>

          <div className="hidden print:block text-xs mb-2">
            Asistieron: {attendedCount} | Faltaron: {absentCount} (
            {attendancePercentage}%)
          </div>

          <div className="flex flex-wrap gap-2 print:gap-1">
            {ids.map((id) => (
              <Badge
                key={id}
                variant="secondary"
                className="pl-1 pr-3 py-1.5 bg-secondary/50 hover:bg-secondary/70 transition-colors print:bg-transparent print:border print:border-gray-300 print:text-black print:px-1 print:py-0 print:text-[10px] print:h-auto"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 text-[10px] font-black border border-primary/10 print:hidden">
                  {(membersMap.get(id) || '?').charAt(0)}
                </div>
                {membersMap.get(id) || 'Usuario desconocido'}
              </Badge>
            ))}

            {absentIds.map((id) => (
              <Badge
                key={id}
                variant="outline"
                className="pl-1 pr-3 py-1.5 text-muted-foreground border-dashed bg-muted/20 print:bg-transparent print:border print:border-gray-200 print:text-gray-400 print:px-1 print:py-0 print:text-[10px] print:h-auto"
              >
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center mr-2 text-[10px] font-black border border-muted-foreground/20 print:hidden">
                  {(membersMap.get(id) || '?').charAt(0)}
                </div>
                {membersMap.get(id) || 'Usuario desconocido'}
              </Badge>
            ))}
          </div>
        </div>
      );
    }

    if (!ids.length)
      return (
        <span className="text-muted-foreground/50 italic text-sm print:text-xs">
          Ningún miembro seleccionado
        </span>
      );

    return (
      <div className="flex flex-wrap gap-2 print:gap-1">
        {ids.map((id) => (
          <Badge
            key={id}
            variant="secondary"
            className="pl-1 pr-3 py-1.5 bg-secondary/50 hover:bg-secondary/70 transition-colors print:bg-transparent print:border print:border-gray-300 print:text-black print:px-1 print:py-0 print:text-[10px] print:h-auto"
          >
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 text-[10px] font-black border border-primary/10 print:hidden">
              {(membersMap.get(id) || '?').charAt(0)}
            </div>
            {membersMap.get(id) || 'Usuario desconocido'}
          </Badge>
        ))}
      </div>
    );
  }

  if (field.type === 'CYCLE_WEEK_INDICATOR') {
    let cycle = value as any;

    // Handle legacy string format: "Semana {week}: {verb}"
    if (typeof value === 'string') {
      const match = value.match(/Semana (\d+): (.+)/);
      if (match) {
        cycle = { week: parseInt(match[1]), verb: match[2] };
      } else {
        // Fallback if string format doesn't match
        return <span className="print:text-sm">{value}</span>;
      }
    }

    if (!cycle || !cycle.week) return <span>-</span>;

    return (
      <div className="inline-flex items-center gap-4 px-5 py-3 bg-primary/5 rounded-xl border border-primary/10 print:border-0 print:p-0 print:bg-transparent print:block">
        <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-lg font-bold leading-none shadow-md shadow-primary/20 print:hidden">
          <span className="text-[10px] uppercase opacity-70 mb-0.5">Sem</span>
          <span className="text-xl">{cycle.week}</span>
        </div>
        <div className="flex flex-col print:flex-row print:gap-2 print:items-baseline">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest print:hidden">
            Verbo
          </span>
          <span className="font-black text-primary text-xl tracking-tight print:text-sm print:text-black">
            Semana {cycle.week}: {cycle.verb}
          </span>
        </div>
      </div>
    );
  }

  if (field.type === 'FRIEND_REGISTRATION') {
    const friends = value as any[];
    if (!friends.length)
      return (
        <span className="text-muted-foreground/50 italic text-sm print:text-xs">
          Sin registros
        </span>
      );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-3 print:gap-2">
        {friends.map((friend, i) => (
          <div
            key={i}
            className="flex items-center p-3 bg-card rounded-xl border shadow-sm gap-3 group hover:border-primary/30 transition-colors print:p-1 print:border print:border-gray-300 print:shadow-none print:rounded-md print:block"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-lg border border-orange-200 dark:border-orange-800 print:hidden">
              {friend.firstName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate text-foreground print:text-[10px] print:whitespace-normal">
                {friend.firstName} {friend.lastName}
              </p>
              {friend.phone && (
                <p className="text-xs text-muted-foreground truncate print:text-[9px]">
                  {friend.phone}
                </p>
              )}
              {friend.spiritualFatherId && (
                <p className="text-[10px] text-primary font-bold mt-0.5 uppercase tracking-wide truncate print:text-[8px] print:text-black">
                  PE: {membersMap.get(friend.spiritualFatherId)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className="print:text-sm">{String(value)}</span>;
}
