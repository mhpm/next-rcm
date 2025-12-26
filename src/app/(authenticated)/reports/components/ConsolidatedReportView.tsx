'use client';

import React, { useMemo, useState } from 'react';
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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
import AdvancedFilterModal, { FilterField } from './AdvancedFilterModal';
import { Button } from '@/components/ui/button';
import { RiFilter3Line } from 'react-icons/ri';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

  // Filter rows first
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Reuse filtering logic from ReportEntriesTable
      // Entidad
      if (
        activeFilters.entidad &&
        !String(row.entidad || '')
          .toLowerCase()
          .includes(activeFilters.entidad.toLowerCase())
      )
        return false;

      // CreatedAt
      if (activeFilters.createdAt_from) {
        const rowDate = new Date(row.raw_createdAt as string);
        const filterDate = parseLocalFilterDate(activeFilters.createdAt_from);
        rowDate.setHours(0, 0, 0, 0);
        if (rowDate < filterDate) return false;
      }
      if (activeFilters.createdAt_to) {
        const rowDate = new Date(row.raw_createdAt as string);
        const filterDate = parseLocalFilterDate(activeFilters.createdAt_to);
        rowDate.setHours(0, 0, 0, 0);
        if (rowDate > filterDate) return false;
      }

      // Dynamic fields
      for (const field of fields) {
        const rawVal = row[`raw_${field.id}`];

        if (field.type === 'TEXT' && activeFilters[field.id]) {
          if (
            !String(rawVal || '')
              .toLowerCase()
              .includes(activeFilters[field.id].toLowerCase())
          )
            return false;
        }

        if (field.type === 'NUMBER' || field.type === 'CURRENCY') {
          const min = activeFilters[`${field.id}_min`];
          const max = activeFilters[`${field.id}_max`];
          const val = Number(rawVal);

          if (
            min &&
            rawVal !== null &&
            rawVal !== undefined &&
            val < Number(min)
          )
            return false;
          if (
            max &&
            rawVal !== null &&
            rawVal !== undefined &&
            val > Number(max)
          )
            return false;
        }

        if (field.type === 'BOOLEAN' && activeFilters[field.id]) {
          const filterVal = activeFilters[field.id] === 'true';
          if (rawVal !== filterVal) return false;
        }

        if (field.type === 'DATE') {
          const from = activeFilters[`${field.id}_from`];
          const to = activeFilters[`${field.id}_to`];
          if (from || to) {
            if (!rawVal) return false;
            const dateVal = new Date(String(rawVal));
            dateVal.setHours(0, 0, 0, 0);

            if (from) {
              const fromDate = parseLocalFilterDate(from);
              if (dateVal < fromDate) return false;
            }
            if (to) {
              const toDate = parseLocalFilterDate(to);
              if (dateVal > toDate) return false;
            }
          }
        }

        if (field.type === 'SELECT' && activeFilters[field.id]) {
          if (rawVal !== activeFilters[field.id]) return false;
        }
      }

      return true;
    });
  }, [rows, activeFilters, fields]);

  // Identify numeric fields that can be aggregated
  const numericFields = useMemo(() => {
    return fields.filter((f) => f.type === 'NUMBER' || f.type === 'CURRENCY');
  }, [fields]);

  // Identify boolean fields
  const booleanFields = useMemo(() => {
    return fields.filter((f) => f.type === 'BOOLEAN');
  }, [fields]);

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
    { value: 'month', label: 'Mes' },
    { value: 'week', label: 'Semana' },
  ];

  // Process data
  const consolidatedData = useMemo(() => {
    const groups: Record<string, any> = {};

    filteredRows.forEach((row) => {
      let key = '';
      let label = '';

      if (groupBy === 'entidad') {
        key = row.entidad || 'Sin Entidad';
        label = key;
      } else if (groupBy === 'celula') {
        key = row.celula || 'Sin Célula';
        label = key;
      } else if (groupBy === 'subsector') {
        key = row.subsector || 'Sin Subsector';
        label = key;
      } else if (groupBy === 'sector') {
        key = row.sector || 'Sin Sector';
        label = key;
      } else if (groupBy === 'zona') {
        key = row.zona || 'Sin Zona';
        label = key;
      } else if (groupBy === 'supervisor_sector') {
        key = row.supervisor_sector || 'Sin Supervisor Sector';
        label = key;
      } else if (groupBy === 'supervisor_subsector') {
        key = row.supervisor_subsector || 'Sin Supervisor Subsector';
        label = key;
      } else if (groupBy === 'lider') {
        key = row.lider || 'Sin Líder';
        label = key;
      } else if (groupBy === 'month') {
        const date = new Date((row.raw_createdAt as string) || row.createdAt);
        key = format(date, 'yyyy-MM');
        label = format(date, 'MMMM yyyy', { locale: es });
      } else if (groupBy === 'week') {
        const date = new Date((row.raw_createdAt as string) || row.createdAt);
        key = format(date, "yyyy-'W'ww");
        label = `Semana ${format(date, 'ww, yyyy')}`;
      }

      if (!groups[key]) {
        groups[key] = {
          key,
          label,
          count: 0,
          values: {},
        };
        // Initialize sums
        numericFields.forEach((f) => {
          groups[key].values[f.id] = 0;
        });
        // Initialize boolean counts
        booleanFields.forEach((f) => {
          groups[key].values[f.id] = 0;
        });
      }

      groups[key].count++;

      // Sum numeric values
      numericFields.forEach((f) => {
        // Try to get raw value first, then fallback to field id
        const rawKey = `raw_${f.id}`;
        const val = row[rawKey] ?? row[f.id];

        const num = parseFloat(String(val || '0'));
        if (!isNaN(num)) {
          groups[key].values[f.id] += num;
        }
      });

      // Count boolean true values
      booleanFields.forEach((f) => {
        const rawKey = `raw_${f.id}`;
        const val = row[rawKey] ?? row[f.id];
        // Check for boolean true or string "true" or "Sí" (display value)
        if (val === true || val === 'true' || val === 'Sí') {
          groups[key].values[f.id]++;
        }
      });
    });

    return Object.values(groups).sort((a: any, b: any) =>
      a.label.localeCompare(b.label)
    );
  }, [filteredRows, groupBy, numericFields, booleanFields]);

  // Calculate totals
  const totals = useMemo(() => {
    const total: Record<string, number> = { count: 0 };
    numericFields.forEach((f) => (total[f.id] = 0));
    booleanFields.forEach((f) => (total[f.id] = 0));

    consolidatedData.forEach((group: any) => {
      total.count += group.count;
      numericFields.forEach((f) => {
        total[f.id] += group.values[f.id];
      });
      booleanFields.forEach((f) => {
        total[f.id] += group.values[f.id];
      });
    });

    return total;
  }, [consolidatedData, numericFields, booleanFields]);

  return (
    <Card className="w-full max-w-[85vw] mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Vista Consolidada</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Agrupar por:</span>
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="w-[180px]">
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
                    className="h-10 w-12"
                    onClick={() => setIsFilterModalOpen(true)}
                  >
                    <RiFilter3Line className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filtros avanzados</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Year Selector */}
            <Select
              value={String(selectedYear)}
              onValueChange={(v) => handleYearChange(Number(v))}
            >
              <SelectTrigger className="w-24">
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

            {/* Type Selector */}
            <Select
              value={filterType}
              onValueChange={(v) => handleTypeChange(v as any)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Todo el año</SelectItem>
                <SelectItem value="cuatrimestre">Por Cuatrimestre</SelectItem>
                <SelectItem value="trimestre">Por Trimestre</SelectItem>
                <SelectItem value="month">Por Mes</SelectItem>
              </SelectContent>
            </Select>

            {/* Dynamic Controls */}
            {filterType === 'cuatrimestre' && (
              <div className="flex">
                {[1, 2, 3].map((q) => (
                  <Button
                    key={q}
                    type="button"
                    variant={selectedPeriod === q ? 'default' : 'outline'}
                    className={`h-10 rounded-none ${
                      q === 1 ? 'rounded-l-md' : ''
                    } ${q === 3 ? 'rounded-r-md' : ''}`}
                    onClick={() => handlePeriodClick(q)}
                  >
                    {q}º C
                  </Button>
                ))}
              </div>
            )}

            {filterType === 'trimestre' && (
              <div className="flex">
                {[1, 2, 3, 4].map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={selectedPeriod === t ? 'default' : 'outline'}
                    className={`h-10 rounded-none ${
                      t === 1 ? 'rounded-l-md' : ''
                    } ${t === 4 ? 'rounded-r-md' : ''}`}
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
                <SelectTrigger className="w-40">
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
      <CardContent>
        <div className="rounded-md border overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] whitespace-nowrap">
                  Grupo
                </TableHead>
                <TableHead className="whitespace-nowrap">Registros</TableHead>
                {numericFields.map((f) => (
                  <TableHead key={f.id} className="whitespace-nowrap">
                    {f.label || 'Campo'}
                  </TableHead>
                ))}
                {booleanFields.map((f) => (
                  <TableHead key={f.id} className="whitespace-nowrap">
                    {f.label || 'Campo'} (Sí)
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {consolidatedData.map((group: any) => (
                <TableRow key={group.key}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {group.label}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {group.count}
                  </TableCell>
                  {numericFields.map((f) => (
                    <TableCell key={f.id} className="whitespace-nowrap">
                      {group.values[f.id].toLocaleString()}
                    </TableCell>
                  ))}
                  {booleanFields.map((f) => (
                    <TableCell key={f.id} className="whitespace-nowrap">
                      {group.values[f.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {/* Totals Row */}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell className="whitespace-nowrap">TOTAL</TableCell>
                <TableCell className="whitespace-nowrap">
                  {totals.count}
                </TableCell>
                {numericFields.map((f) => (
                  <TableCell key={f.id} className="whitespace-nowrap">
                    {totals[f.id].toLocaleString()}
                  </TableCell>
                ))}
                {booleanFields.map((f) => (
                  <TableCell key={f.id} className="whitespace-nowrap">
                    {totals[f.id]}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
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
