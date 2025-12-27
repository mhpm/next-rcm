'use client';

import { useMemo, useState } from 'react';
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
import {
  Row,
  useReportData,
} from '@/app/(authenticated)/reports/hooks/useReportData';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown/ColumnVisibilityDropdown';

// Custom hook for scoped column visibility
function useComparisonColumnVisibility(
  reportId: string,
  allColumnKeys: string[]
) {
  const key = `comparison-column-visibility-${reportId}`;

  // Initialize state with all columns visible by default if no storage
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Only keep keys that still exist
            const validKeys = new Set(allColumnKeys);
            const filtered = parsed.filter((k) => validKeys.has(k));
            // If filtered is empty but we have columns, maybe default to all?
            // Or assume user wanted everything hidden.
            // For safety, if stored was empty list, it means empty.
            return new Set(filtered);
          }
        }
      } catch (e) {
        console.error('Error parsing column visibility', e);
      }
    }
    return new Set(allColumnKeys);
  });

  const saveToStorage = (newSet: Set<string>) => {
    localStorage.setItem(key, JSON.stringify(Array.from(newSet)));
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnKey)) {
        next.delete(columnKey);
      } else {
        next.add(columnKey);
      }
      saveToStorage(next);
      return next;
    });
  };

  const showAllColumns = () => {
    const next = new Set(allColumnKeys);
    setVisibleColumns(next);
    saveToStorage(next);
  };

  const hideAllColumns = () => {
    const next = new Set<string>();
    setVisibleColumns(next);
    saveToStorage(next);
  };

  return { visibleColumns, toggleColumn, showAllColumns, hideAllColumns };
}

interface ComparisonReportViewProps {
  rows: Row[];
  fields: ReportFields[];
  reportId: string;
}

export default function ComparisonReportView({
  rows,
  fields,
  reportId,
}: ComparisonReportViewProps) {
  const { filters: groupBy, setFilters: setGroupBy } =
    usePersistentFilters<string>(`comparison-groupby-${reportId}`, 'entidad');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilterPeriod, setActiveFilterPeriod] = useState<
    'A' | 'B' | null
  >(null);

  // Filters for Period A
  const {
    filters: filtersA_extra,
    setFilters: setFiltersA_extra,
    clearFilters: clearFiltersA,
  } = usePersistentFilters<Record<string, any>>(
    `comparison-filters-A-${reportId}`,
    {}
  );

  // Filters for Period B
  const {
    filters: filtersB_extra,
    setFilters: setFiltersB_extra,
    clearFilters: clearFiltersB,
  } = usePersistentFilters<Record<string, any>>(
    `comparison-filters-B-${reportId}`,
    {}
  );

  const currentYear = new Date().getFullYear();

  // Period A Config
  const { filters: configA, setFilters: setConfigA } = usePersistentFilters(
    `comparison-config-A-${reportId}`,
    {
      year: currentYear,
      type: 'cuatrimestre' as 'year' | 'cuatrimestre' | 'trimestre' | 'month',
      period: 1 as number | null,
    }
  );

  // Period B Config
  const { filters: configB, setFilters: setConfigB } = usePersistentFilters(
    `comparison-config-B-${reportId}`,
    {
      year: currentYear - 1,
      type: 'cuatrimestre' as 'year' | 'cuatrimestre' | 'trimestre' | 'month',
      period: 1 as number | null,
    }
  );

  const { year: yearA, type: typeA, period: periodA } = configA;
  const { year: yearB, type: typeB, period: periodB } = configB;

  // Setters wrappers for Period A
  const setYearA = (y: number) => setConfigA((prev) => ({ ...prev, year: y }));
  const setTypeA = (t: any) => setConfigA((prev) => ({ ...prev, type: t }));
  const setPeriodA = (p: number | null) =>
    setConfigA((prev) => ({ ...prev, period: p }));

  // Setters wrappers for Period B
  const setYearB = (y: number) => setConfigB((prev) => ({ ...prev, year: y }));
  const setTypeB = (t: any) => setConfigB((prev) => ({ ...prev, type: t }));
  const setPeriodB = (p: number | null) =>
    setConfigB((prev) => ({ ...prev, period: p }));

  // Helper to generate date filters from period config
  const getPeriodFilters = (
    year: number,
    type: string,
    period: number | null
  ) => {
    let fromMonth = 0;
    let toMonth = 11;
    let lastDay = 31;

    if (type === 'year') {
      fromMonth = 0;
      toMonth = 11;
      lastDay = 31;
    } else if (type === 'cuatrimestre' && period !== null) {
      if (period === 1) {
        fromMonth = 0;
        toMonth = 3;
        lastDay = 30;
      } else if (period === 2) {
        fromMonth = 4;
        toMonth = 7;
        lastDay = 31;
      } else if (period === 3) {
        fromMonth = 8;
        toMonth = 11;
        lastDay = 31;
      }
    } else if (type === 'trimestre' && period !== null) {
      if (period === 1) {
        fromMonth = 0;
        toMonth = 2;
        lastDay = 31;
      } else if (period === 2) {
        fromMonth = 3;
        toMonth = 5;
        lastDay = 30;
      } else if (period === 3) {
        fromMonth = 6;
        toMonth = 8;
        lastDay = 30;
      } else if (period === 4) {
        fromMonth = 9;
        toMonth = 11;
        lastDay = 31;
      }
    } else if (type === 'month' && period !== null) {
      fromMonth = period;
      toMonth = period;
      lastDay = new Date(year, fromMonth + 1, 0).getDate();
    } else {
      return {}; // No valid period
    }

    const fromDate = new Date(year, fromMonth, 1);
    const toDate = new Date(year, toMonth, lastDay);

    const formatDate = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    return {
      createdAt_from: formatDate(fromDate),
      createdAt_to: formatDate(toDate),
    };
  };

  const filtersA = useMemo(
    () => ({
      ...filtersA_extra,
      ...getPeriodFilters(yearA, typeA, periodA),
    }),
    [filtersA_extra, yearA, typeA, periodA]
  );

  const filtersB = useMemo(
    () => ({
      ...filtersB_extra,
      ...getPeriodFilters(yearB, typeB, periodB),
    }),
    [filtersB_extra, yearB, typeB, periodB]
  );

  // Get Data
  const {
    consolidatedData: dataA,
    totals: totalsA,
    numericFields,
    booleanFields,
  } = useReportData(rows, fields, filtersA, groupBy);

  const { consolidatedData: dataB, totals: totalsB } = useReportData(
    rows,
    fields,
    filtersB,
    groupBy
  );

  // Column Visibility Logic
  const allColumns = useMemo(() => {
    const cols = [
      { key: 'count', label: 'Registros' },
      ...numericFields.map((f) => ({ key: f.id, label: f.label || f.key })),
      ...booleanFields.map((f) => ({
        key: f.id,
        label: `${f.label || f.key} (Sí)`,
      })),
    ];
    return cols;
  }, [numericFields, booleanFields]);

  const { visibleColumns, toggleColumn, showAllColumns, hideAllColumns } =
    useComparisonColumnVisibility(
      reportId,
      allColumns.map((c) => c.key)
    );

  // Merge Data
  const comparisonData = useMemo(() => {
    const keys = new Set([
      ...dataA.map((d) => d.key),
      ...dataB.map((d) => d.key),
    ]);
    const merged: any[] = [];

    keys.forEach((key) => {
      const itemA = dataA.find((d) => d.key === key);
      const itemB = dataB.find((d) => d.key === key);
      const label = itemA?.label || itemB?.label || key;

      merged.push({
        key,
        label,
        itemA,
        itemB,
      });
    });

    return merged.sort((a, b) => a.label.localeCompare(b.label));
  }, [dataA, dataB]);

  // Group Options
  const groupOptions = [
    { value: 'entidad', label: 'Entidad' },
    { value: 'celula', label: 'Célula' },
    { value: 'subsector', label: 'Subsector' },
    { value: 'sector', label: 'Sector' },
    { value: 'zona', label: 'Zona' },
    { value: 'supervisor_sector', label: 'Supervisor de Sector' },
    { value: 'supervisor_subsector', label: 'Supervisor de Subsector' },
    { value: 'lider', label: 'Líder' },
  ];

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

  const PeriodSelector = ({
    label,
    year,
    setYear,
    type,
    setType,
    period,
    setPeriod,
    onFilterClick,
    hasFilters,
  }: any) => (
    <div className="flex flex-col gap-2 p-3 border rounded-md bg-muted/20">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase">
          {label}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={hasFilters ? 'default' : 'ghost'}
                size="icon"
                className="h-6 w-6"
                onClick={onFilterClick}
              >
                <RiFilter3Line className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Filtros adicionales para este periodo
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="h-8 w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
              (y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select
          value={type}
          onValueChange={(v: any) => {
            setType(v);
            setPeriod(null);
          }}
        >
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Año</SelectItem>
            <SelectItem value="cuatrimestre">Cuatrimestre</SelectItem>
            <SelectItem value="trimestre">Trimestre</SelectItem>
            <SelectItem value="month">Mes</SelectItem>
          </SelectContent>
        </Select>

        {type === 'cuatrimestre' && (
          <div className="flex gap-1">
            {[1, 2, 3].map((q) => (
              <Button
                key={q}
                variant={period === q ? 'default' : 'outline'}
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setPeriod(q)}
              >
                {q}º
              </Button>
            ))}
          </div>
        )}

        {type === 'trimestre' && (
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((t) => (
              <Button
                key={t}
                variant={period === t ? 'default' : 'outline'}
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setPeriod(t)}
              >
                {t}º
              </Button>
            ))}
          </div>
        )}

        {type === 'month' && (
          <Select
            value={period !== null ? String(period) : ''}
            onValueChange={(v) => setPeriod(Number(v))}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Mes" />
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
  );

  const formatDelta = (valA: number, valB: number) => {
    const diff = valA - valB;
    if (diff === 0)
      return <span className="text-muted-foreground text-[10px]">-</span>;
    const isPositive = diff > 0;
    return (
      <span
        className={`flex items-center text-xs font-bold ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {isPositive ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3 h-3" />
        )}
        {Math.abs(diff)}
      </span>
    );
  };

  const filterFields: FilterField[] = useMemo(
    () =>
      fields.map((f) => ({
        id: f.id,
        key: f.key,
        label: f.label,
        type: f.type,
        options: Array.isArray(f.options) ? (f.options as string[]) : undefined,
      })),
    [fields]
  );

  return (
    <Card className="w-full border-0 sm:border shadow-none sm:shadow-sm">
      <CardHeader className="px-2 sm:px-6 py-3 sm:py-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-base sm:text-xl font-bold">
            Comparativa de Periodos
          </CardTitle>
          <ColumnVisibilityDropdown
            columns={allColumns}
            visibleColumns={visibleColumns}
            onToggleColumn={toggleColumn}
            onShowAllColumns={showAllColumns}
            onHideAllColumns={hideAllColumns}
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PeriodSelector
            label="Periodo A (Actual)"
            year={yearA}
            setYear={setYearA}
            type={typeA}
            setType={setTypeA}
            period={periodA}
            setPeriod={setPeriodA}
            onFilterClick={() => {
              setActiveFilterPeriod('A');
              setIsFilterModalOpen(true);
            }}
            hasFilters={Object.keys(filtersA_extra).length > 0}
          />
          <PeriodSelector
            label="Periodo B (Comparación)"
            year={yearB}
            setYear={setYearB}
            type={typeB}
            setType={setTypeB}
            period={periodB}
            setPeriod={setPeriodB}
            onFilterClick={() => {
              setActiveFilterPeriod('B');
              setIsFilterModalOpen(true);
            }}
            hasFilters={Object.keys(filtersB_extra).length > 0}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm font-medium">Agrupar por:</span>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="h-9 w-[200px] text-sm">
              <SelectValue />
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
      </CardHeader>

      <CardContent className="px-0 sm:px-6 pb-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Grupo</TableHead>
              {visibleColumns.has('count') && (
                <TableHead className="text-center bg-muted/30 border-l border-r">
                  Registros
                </TableHead>
              )}
              {numericFields
                .filter((f) => visibleColumns.has(f.id))
                .map((f) => (
                  <TableHead
                    key={f.id}
                    className="text-center min-w-[120px] bg-muted/10 border-r"
                  >
                    {f.label}
                  </TableHead>
                ))}
              {booleanFields
                .filter((f) => visibleColumns.has(f.id))
                .map((f) => (
                  <TableHead
                    key={f.id}
                    className="text-center min-w-[120px] bg-muted/10 border-r"
                  >
                    {f.label} (Sí)
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonData.map((row) => (
              <TableRow key={row.key}>
                <TableCell className="font-medium whitespace-nowrap sticky left-0 bg-background z-10 border-r py-2">
                  {row.label}
                </TableCell>
                {visibleColumns.has('count') && (
                  <TableCell className="text-center border-l border-r bg-muted/30 py-2">
                    <div className="flex flex-row items-center justify-center gap-1.5 whitespace-nowrap">
                      <span className="font-semibold">
                        {row.itemA?.count || 0}
                      </span>
                      <span className="text-xs text-muted-foreground opacity-70">
                        vs {row.itemB?.count || 0}
                      </span>
                      {formatDelta(
                        row.itemA?.count || 0,
                        row.itemB?.count || 0
                      )}
                    </div>
                  </TableCell>
                )}

                {/* Numeric Fields */}
                {numericFields
                  .filter((f) => visibleColumns.has(f.id))
                  .map((f) => (
                    <TableCell key={f.id} className="text-center border-r py-2">
                      <div className="flex flex-row items-center justify-center gap-1.5 whitespace-nowrap">
                        <span className="font-semibold">
                          {(row.itemA?.values[f.id] || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground opacity-70">
                          vs {(row.itemB?.values[f.id] || 0).toLocaleString()}
                        </span>
                        {formatDelta(
                          row.itemA?.values[f.id] || 0,
                          row.itemB?.values[f.id] || 0
                        )}
                      </div>
                    </TableCell>
                  ))}

                {/* Boolean Fields */}
                {booleanFields
                  .filter((f) => visibleColumns.has(f.id))
                  .map((f) => (
                    <TableCell key={f.id} className="text-center border-r py-2">
                      <div className="flex flex-row items-center justify-center gap-1.5 whitespace-nowrap">
                        <span className="font-semibold">
                          {row.itemA?.values[f.id] || 0}
                        </span>
                        <span className="text-xs text-muted-foreground opacity-70">
                          vs {row.itemB?.values[f.id] || 0}
                        </span>
                        {formatDelta(
                          row.itemA?.values[f.id] || 0,
                          row.itemB?.values[f.id] || 0
                        )}
                      </div>
                    </TableCell>
                  ))}
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-bold">
              <TableCell className="whitespace-nowrap sticky left-0 bg-muted/50 z-10 border-r py-2">
                TOTAL
              </TableCell>
              {visibleColumns.has('count') && (
                <TableCell className="text-center border-l border-r bg-muted/30 py-2">
                  <div className="flex flex-row items-center justify-center gap-1.5 whitespace-nowrap">
                    <span>{totalsA.count || 0}</span>
                    <span className="text-xs text-muted-foreground font-normal opacity-70">
                      vs {totalsB.count || 0}
                    </span>
                    {formatDelta(totalsA.count || 0, totalsB.count || 0)}
                  </div>
                </TableCell>
              )}
              {numericFields
                .filter((f) => visibleColumns.has(f.id))
                .map((f) => (
                  <TableCell key={f.id} className="text-center border-r py-2">
                    <div className="flex flex-row items-center justify-center gap-1.5 whitespace-nowrap">
                      <span>{(totalsA[f.id] || 0).toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground font-normal opacity-70">
                        vs {(totalsB[f.id] || 0).toLocaleString()}
                      </span>
                      {formatDelta(totalsA[f.id] || 0, totalsB[f.id] || 0)}
                    </div>
                  </TableCell>
                ))}
              {booleanFields
                .filter((f) => visibleColumns.has(f.id))
                .map((f) => (
                  <TableCell key={f.id} className="text-center border-r py-2">
                    <div className="flex flex-row items-center justify-center gap-1.5 whitespace-nowrap">
                      <span>{totalsA[f.id] || 0}</span>
                      <span className="text-xs text-muted-foreground font-normal opacity-70">
                        vs {totalsB[f.id] || 0}
                      </span>
                      {formatDelta(totalsA[f.id] || 0, totalsB[f.id] || 0)}
                    </div>
                  </TableCell>
                ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => {
          setIsFilterModalOpen(false);
          setActiveFilterPeriod(null);
        }}
        fields={filterFields}
        activeFilters={
          activeFilterPeriod === 'A'
            ? filtersA_extra
            : activeFilterPeriod === 'B'
            ? filtersB_extra
            : {}
        }
        onApply={(f) => {
          if (activeFilterPeriod === 'A') setFiltersA_extra(f);
          else if (activeFilterPeriod === 'B') setFiltersB_extra(f);
        }}
        onClear={() => {
          if (activeFilterPeriod === 'A') clearFiltersA();
          else if (activeFilterPeriod === 'B') clearFiltersB();
        }}
        title={
          activeFilterPeriod
            ? `Filtros Periodo ${activeFilterPeriod}`
            : 'Filtros'
        }
      />
    </Card>
  );
}
