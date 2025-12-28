'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFields } from '@/generated/prisma/client';

type Row = Record<string, unknown> & {
  id: string;
  createdAt: string;
  entidad: string;
  supervisor?: string;
  lider?: string;
  raw_createdAt?: string;
  supervisor_sector?: string;
  supervisor_subsector?: string;
  celula?: string;
  subsector?: string;
  sector?: string;
  zona?: string;
};

import { usePersistentFilters } from '@/hooks/usePersistentFilters';
import AdvancedFilterModal from './AdvancedFilterModal';
import { Button } from '@/components/ui/button';
import { RiFilter3Line } from 'react-icons/ri';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useReportData } from '@/app/(authenticated)/reports/hooks/useReportData';

interface ConsolidatedReportViewProps {
  rows: Row[];
  fields: ReportFields[];
  reportId: string; // Needed for persistent filters key
}

export default function ConsolidatedReportView({
  rows,
  fields,
  reportId,
}: ConsolidatedReportViewProps) {
  const [groupBy, setGroupBy] = useState<string>('entidad');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const {
    filters: activeFilters,
    setFilters: setActiveFilters,
    clearFilters,
  } = usePersistentFilters<Record<string, any>>(
    `report-filters-${reportId}`,
    {}
  );

  const parseLocalFilterDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Period Filter Logic
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [filterType, setFilterType] = useState<
    'year' | 'cuatrimestre' | 'trimestre' | 'month'
  >('cuatrimestre');
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

  // Sync state with activeFilters on mount
  React.useEffect(() => {
    if (activeFilters.createdAt_from && activeFilters.createdAt_to) {
      const fromDate = parseLocalFilterDate(activeFilters.createdAt_from);
      const toDate = parseLocalFilterDate(activeFilters.createdAt_to);
      const fromYear = fromDate.getFullYear();

      if (fromYear === toDate.getFullYear()) {
        setSelectedYear(fromYear);

        const fromMonth = fromDate.getMonth();
        const toMonth = toDate.getMonth();

        // Try to detect type
        if (fromMonth === 0 && toMonth === 11) {
          setFilterType('year');
          setSelectedPeriod(null);
        } else if (toMonth - fromMonth + 1 === 4) {
          setFilterType('cuatrimestre');
          // 0-3 (1), 4-7 (2), 8-11 (3)
          if (fromMonth === 0) setSelectedPeriod(1);
          else if (fromMonth === 4) setSelectedPeriod(2);
          else if (fromMonth === 8) setSelectedPeriod(3);
        } else if (toMonth - fromMonth + 1 === 3) {
          setFilterType('trimestre');
          // 0-2 (1), 3-5 (2), 6-8 (3), 9-11 (4)
          if (fromMonth === 0) setSelectedPeriod(1);
          else if (fromMonth === 3) setSelectedPeriod(2);
          else if (fromMonth === 6) setSelectedPeriod(3);
          else if (fromMonth === 9) setSelectedPeriod(4);
        } else if (fromMonth === toMonth) {
          setFilterType('month');
          setSelectedPeriod(fromMonth);
        }
      }
    }
  }, []);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    // Re-apply current filter with new year
    applyFilter(year, filterType, selectedPeriod);
  };

  const handleTypeChange = (
    type: 'year' | 'cuatrimestre' | 'trimestre' | 'month'
  ) => {
    setFilterType(type);
    setSelectedPeriod(null); // Reset period selection
    if (type === 'year') {
      applyFilter(selectedYear, 'year', null);
    }
  };

  const applyFilter = (year: number, type: string, period: number | null) => {
    let fromMonth = 0,
      toMonth = 11,
      lastDay = 31;

    if (type === 'year') {
      fromMonth = 0;
      toMonth = 11;
      lastDay = 31;
    } else if (type === 'cuatrimestre' && period !== null) {
      if (period === 1) {
        fromMonth = 0;
        toMonth = 3;
        lastDay = 30;
      } // Apr
      else if (period === 2) {
        fromMonth = 4;
        toMonth = 7;
        lastDay = 31;
      } // Aug
      else if (period === 3) {
        fromMonth = 8;
        toMonth = 11;
        lastDay = 31;
      } // Dec
    } else if (type === 'trimestre' && period !== null) {
      if (period === 1) {
        fromMonth = 0;
        toMonth = 2;
        lastDay = 31;
      } // Mar
      else if (period === 2) {
        fromMonth = 3;
        toMonth = 5;
        lastDay = 30;
      } // Jun
      else if (period === 3) {
        fromMonth = 6;
        toMonth = 8;
        lastDay = 30;
      } // Sep
      else if (period === 4) {
        fromMonth = 9;
        toMonth = 11;
        lastDay = 31;
      } // Dec
    } else if (type === 'month' && period !== null) {
      fromMonth = period;
      toMonth = period;
      // Get last day of month
      lastDay = new Date(year, fromMonth + 1, 0).getDate();
    } else {
      // No period selected for non-year type? Do nothing or clear?
      // For now, assume we wait for selection.
      return;
    }

    const fromDate = new Date(year, fromMonth, 1);
    const toDate = new Date(year, toMonth, lastDay);

    const formatDate = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    setActiveFilters({
      ...activeFilters,
      createdAt_from: formatDate(fromDate),
      createdAt_to: formatDate(toDate),
    });
    setSelectedPeriod(period);
  };

  const handlePeriodClick = (period: number) => {
    applyFilter(selectedYear, filterType, period);
  };

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  // Options for grouping
  const groupOptions = [
    { value: 'entidad', label: 'Entidad (Célula/Grupo/Sector)' },
    { value: 'celula', label: 'Célula' },
    { value: 'subsector', label: 'Subsector' },
    { value: 'sector', label: 'Sector' },
    { value: 'zona', label: 'Zona' },
    { value: 'supervisor_sector', label: 'Supervisor de Sector' },
    { value: 'supervisor_subsector', label: 'Supervisor de Subsector' },
    { value: 'lider', label: 'Líder' },
  ];

  // Use shared hook for data processing
  const { consolidatedData, totals, numericFields, booleanFields } =
    useReportData(rows, fields, activeFilters, groupBy);

  return (
    <Card className="w-full border-0 sm:border shadow-none sm:shadow-sm">
      <CardHeader className="px-2 sm:px-6 py-3 sm:py-4 space-y-3">
        <CardTitle className="text-base sm:text-xl font-bold">
          Totales
        </CardTitle>

        {/* Controls - Stacked on mobile */}
        <div className="space-y-2">
          {/* Row 1: Group By */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium shrink-0 text-muted-foreground min-w-[60px]">
              Agrupar:
            </span>
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="h-9 text-xs sm:text-sm">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {groupOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 2: Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={
                      Object.keys(activeFilters).length > 0
                        ? 'default'
                        : 'outline'
                    }
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => setIsFilterModalOpen(true)}
                  >
                    <RiFilter3Line className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filtros avanzados</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Select
              value={String(selectedYear)}
              onValueChange={(v) => handleYearChange(Number(v))}
            >
              <SelectTrigger className="h-9 w-20 text-xs sm:text-sm">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
                  (year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select
              value={filterType}
              onValueChange={(v) => handleTypeChange(v as any)}
            >
              <SelectTrigger className="h-9 flex-1 min-w-[120px] text-xs sm:text-sm">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Todo el año</SelectItem>
                <SelectItem value="cuatrimestre">Por Cuatrimestre</SelectItem>
                <SelectItem value="trimestre">Por Trimestre</SelectItem>
                <SelectItem value="month">Por Mes</SelectItem>
              </SelectContent>
            </Select>

            {filterType === 'cuatrimestre' && (
              <div className="flex w-full sm:w-auto gap-1">
                {[1, 2, 3].map((q) => (
                  <Button
                    key={q}
                    type="button"
                    variant={selectedPeriod === q ? 'default' : 'outline'}
                    className="h-9 flex-1 sm:flex-none text-xs sm:text-sm"
                    onClick={() => handlePeriodClick(q)}
                  >
                    {q}º C
                  </Button>
                ))}
              </div>
            )}

            {filterType === 'trimestre' && (
              <div className="flex w-full sm:w-auto gap-1">
                {[1, 2, 3, 4].map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={selectedPeriod === t ? 'default' : 'outline'}
                    className="h-9 flex-1 sm:flex-none text-xs sm:text-sm"
                    onClick={() => handlePeriodClick(t)}
                  >
                    {t}º T
                  </Button>
                ))}
              </div>
            )}

            {filterType === 'month' && (
              <Select
                value={selectedPeriod !== null ? String(selectedPeriod) : ''}
                onValueChange={(v) => handlePeriodClick(Number(v))}
              >
                <SelectTrigger className="h-9 w-full sm:w-40 text-xs sm:text-sm">
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-6 pb-4">
        {/* Mobile Cards View */}
        <div className="block md:hidden space-y-3">
          {consolidatedData.map((group: any) => (
            <div
              key={group.key}
              className="border rounded-lg p-3 bg-card space-y-2"
            >
              <div className="font-bold text-sm border-b pb-2 mb-2">
                {group.label}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Registros:</span>
                  <span className="ml-2 font-semibold">{group.count}</span>
                </div>
                {numericFields.map((f) => (
                  <div key={f.id}>
                    <span className="text-muted-foreground">{f.label}:</span>
                    <span className="ml-2 font-semibold">
                      {group.values[f.id].toLocaleString()}
                    </span>
                  </div>
                ))}
                {booleanFields.map((f) => (
                  <div key={f.id}>
                    <span className="text-muted-foreground">
                      {f.label} (Sí):
                    </span>
                    <span className="ml-2 font-semibold">
                      {group.values[f.id]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Totals Card */}
          <div className="border-2 border-primary rounded-lg p-3 bg-primary/5 space-y-2">
            <div className="font-bold text-sm border-b border-primary/20 pb-2 mb-2">
              TOTAL
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Registros:</span>
                <span className="ml-2 font-bold">{totals.count}</span>
              </div>
              {numericFields.map((f) => (
                <div key={f.id}>
                  <span className="text-muted-foreground">{f.label}:</span>
                  <span className="ml-2 font-bold">
                    {totals[f.id].toLocaleString()}
                  </span>
                </div>
              ))}
              {booleanFields.map((f) => (
                <div key={f.id}>
                  <span className="text-muted-foreground">{f.label} (Sí):</span>
                  <span className="ml-2 font-bold">{totals[f.id]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block w-full overflow-hidden">
          <div className="overflow-x-auto rounded-md border max-w-full relative">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] whitespace-nowrap py-2 sticky left-0 bg-background z-20 border-r">
                    Grupo
                  </TableHead>
                  <TableHead className="whitespace-nowrap py-2">
                    Registros
                  </TableHead>
                  {numericFields.map((f) => (
                    <TableHead key={f.id} className="whitespace-nowrap py-2">
                      {f.label || 'Campo'}
                    </TableHead>
                  ))}
                  {booleanFields.map((f) => (
                    <TableHead key={f.id} className="whitespace-nowrap py-2">
                      {f.label || 'Campo'} (Sí)
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {consolidatedData.map((group: any) => (
                  <TableRow key={group.key}>
                    <TableCell className="font-medium whitespace-nowrap py-2 sticky left-0 bg-background z-10 border-r">
                      {group.label}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-2">
                      {group.count}
                    </TableCell>
                    {numericFields.map((f) => (
                      <TableCell key={f.id} className="whitespace-nowrap py-2">
                        {group.values[f.id].toLocaleString()}
                      </TableCell>
                    ))}
                    {booleanFields.map((f) => (
                      <TableCell key={f.id} className="whitespace-nowrap py-2">
                        {group.values[f.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell className="whitespace-nowrap py-2 sticky left-0 bg-muted/50 z-10 border-r">
                    TOTAL
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-2">
                    {totals.count}
                  </TableCell>
                  {numericFields.map((f) => (
                    <TableCell key={f.id} className="whitespace-nowrap py-2">
                      {totals[f.id].toLocaleString()}
                    </TableCell>
                  ))}
                  {booleanFields.map((f) => (
                    <TableCell key={f.id} className="whitespace-nowrap py-2">
                      {totals[f.id]}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setActiveFilters}
        onClear={clearFilters}
        fields={fields.map((f) => ({
          id: f.id,
          key: f.key,
          label: f.label || f.key,
          type: f.type,
          options: Array.isArray(f.options)
            ? (f.options as string[])
            : undefined,
        }))}
        activeFilters={activeFilters}
      />
    </Card>
  );
}
