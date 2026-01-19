'use client';

import React, { useState, useMemo } from 'react';
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
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown/ColumnVisibilityDropdown';
import { naturalSort } from '@/lib/utils';

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
import {
  RiFilter3Line,
  RiDownloadLine,
  RiFileExcel2Line,
  RiFileTextLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from 'react-icons/ri';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useReportData,
  useReportInsights,
  InsightConfig,
} from '@/app/[lang]/(authenticated)/reports/hooks/useReportData';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  DollarSign,
  Flame,
  HandHeart,
  MoreVertical,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const { filters: groupBy, setFilters: setGroupBy } =
    usePersistentFilters<string>(`report-groupby-${reportId}`, 'entidad');
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

  const { filters: insightConfig, setFilters: setInsightConfig } =
    usePersistentFilters<InsightConfig[]>(`report-insights-${reportId}`, []);

  // Initial load of defaults based on keywords (one-time)
  React.useEffect(() => {
    if (insightConfig.length > 0) return; // Already have saved config

    const defaults: InsightConfig[] = [
      { fieldId: 'count', type: 'max', enabled: true },
    ];
    const keywords = ['oracion', 'ayuno', 'capitulos', 'ofrenda'];

    fields.forEach((f) => {
      const keyLower = f.key.toLowerCase();
      const labelLower = (f.label || '').toLowerCase();
      if (
        keywords.some((k) => keyLower.includes(k) || labelLower.includes(k))
      ) {
        defaults.push({ fieldId: f.id, type: 'max', enabled: true });
      }
    });

    setInsightConfig(defaults);
  }, [fields, insightConfig.length, setInsightConfig]);

  const { consolidatedData, totals, numericFields, booleanFields } =
    useReportData(rows, fields, activeFilters, groupBy);

  // Sorting logic
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: 'label',
    direction: 'asc',
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedData = useMemo(() => {
    const data = [...consolidatedData];
    if (!sortConfig.key) return data;

    return data.sort((a: any, b: any) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === 'label') {
        aValue = a.label;
        bValue = b.label;
      } else if (sortConfig.key === 'count') {
        aValue = a.count;
        bValue = b.count;
      } else {
        aValue = a.values[sortConfig.key] ?? 0;
        bValue = b.values[sortConfig.key] ?? 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const cmp = naturalSort(aValue, bValue);
        return sortConfig.direction === 'asc' ? cmp : -cmp;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const cmp = aValue - bValue;
        return sortConfig.direction === 'asc' ? cmp : -cmp;
      }

      return 0;
    });
  }, [consolidatedData, sortConfig]);

  // Column visibility state (scoped to consolidated view)
  const allColumns = useMemo(() => {
    const cols = [{ key: 'count', label: 'Registros' }];
    numericFields.forEach((f) => {
      cols.push({ key: f.id, label: f.label || f.key });
      if (f.type === 'MEMBER_ATTENDANCE') {
        cols.push({
          key: `${f.id}_absent`,
          label: `${f.label || f.key} (Faltantes)`,
        });
      }
    });
    booleanFields.forEach((f) => {
      cols.push({ key: f.id, label: `${f.label || f.key} (Sí)` });
    });
    return cols;
  }, [numericFields, booleanFields]);

  const visibilityKey = `report-consolidated-visibility-${reportId}`;
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(visibilityKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const validKeys = new Set(allColumns.map((c) => c.key));
            const filtered = parsed.filter((k) => validKeys.has(k));
            return new Set(filtered);
          }
        }
      } catch (e) {
        console.error('Failed to parse column visibility', e);
      }
    }
    return new Set(allColumns.map((col) => col.key));
  });

  const saveVisibility = (newSet: Set<string>) => {
    localStorage.setItem(visibilityKey, JSON.stringify(Array.from(newSet)));
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnKey)) {
        next.delete(columnKey);
      } else {
        next.add(columnKey);
      }
      saveVisibility(next);
      return next;
    });
  };

  const showAllColumns = (columnKeys: string[]) => {
    const next = new Set(columnKeys);
    setVisibleColumns(next);
    saveVisibility(next);
  };

  const hideAllColumns = (columnKeys: string[]) => {
    const next = new Set<string>();
    // Optional: keep count visible?
    if (columnKeys.includes('count')) {
      next.add('count');
    }
    setVisibleColumns(next);
    saveVisibility(next);
  };

  const insights = useReportInsights(
    consolidatedData,
    numericFields,
    insightConfig
  );

  const toggleInsight = (fieldId: string, type: 'max' | 'min') => {
    setInsightConfig((prev) => {
      const existingIndex = prev.findIndex(
        (c) => c.fieldId === fieldId && c.type === type
      );
      if (existingIndex >= 0) {
        // Remove/Toggle off
        const next = [...prev];
        next.splice(existingIndex, 1);
        return next;
      } else {
        // Add
        return [...prev, { fieldId, type, enabled: true }];
      }
    });
  };

  const isInsightActive = (fieldId: string, type: 'max' | 'min') => {
    return insightConfig.some(
      (c) => c.fieldId === fieldId && c.type === type && c.enabled
    );
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return (
        <div className="flex flex-col opacity-0 group-hover:opacity-50 transition-opacity">
          <RiArrowUpSLine className="h-2.5 w-2.5 -mb-1" />
          <RiArrowDownSLine className="h-2.5 w-2.5" />
        </div>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <RiArrowUpSLine className="h-3.5 w-3.5 text-primary" />
    ) : (
      <RiArrowDownSLine className="h-3.5 w-3.5 text-primary" />
    );
  };

  // Export functions
  const getExportData = () => {
    const headers = ['Grupo'];
    if (visibleColumns.has('count')) headers.push('Registros');

    const fieldsToExport: { id: string; label: string; isBoolean?: boolean }[] =
      [];

    numericFields.forEach((f) => {
      if (visibleColumns.has(f.id)) {
        headers.push(f.label || f.key);
        fieldsToExport.push({ id: f.id, label: f.label || f.key });
      }
      if (
        f.type === 'MEMBER_ATTENDANCE' &&
        visibleColumns.has(`${f.id}_absent`)
      ) {
        const label = `${f.label || f.key} (Faltantes)`;
        headers.push(label);
        fieldsToExport.push({ id: `${f.id}_absent`, label });
      }
    });

    booleanFields.forEach((f) => {
      if (visibleColumns.has(f.id)) {
        const label = `${f.label || f.key} (Sí)`;
        headers.push(label);
        fieldsToExport.push({ id: f.id, label, isBoolean: true });
      }
    });

    const rows = consolidatedData.map((group: any) => {
      const row: any = { Grupo: group.label };
      if (visibleColumns.has('count')) row['Registros'] = group.count;

      fieldsToExport.forEach((f) => {
        row[f.label] = group.values[f.id];
      });
      return row;
    });

    // Add Total row
    const totalRow: any = { Grupo: 'TOTAL GENERAL' };
    if (visibleColumns.has('count')) totalRow['Registros'] = totals.count;

    fieldsToExport.forEach((f) => {
      totalRow[f.label] = totals[f.id];
    });

    rows.push(totalRow);

    return { headers, rows };
  };

  const handleExportCSV = () => {
    const { headers, rows } = getExportData();

    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            return `"${val !== undefined && val !== null ? val : ''}"`;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `reporte_consolidado_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const { rows } = getExportData();

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Totales');

      // Auto-width columns
      const colWidths = Object.keys(rows[0] || {}).map((key) => ({
        wch: Math.max(key.length, 15),
      }));
      worksheet['!cols'] = colWidths;

      XLSX.writeFile(
        workbook,
        `reporte_consolidado_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const visibleFields = allColumns.filter((c) => visibleColumns.has(c.key));
  const lastVisibleKey = visibleFields[visibleFields.length - 1]?.key;

  return (
    <Card className="w-full border-0 sm:border shadow-none sm:shadow-sm">
      <CardHeader className="px-2 sm:px-6 py-3 sm:py-4 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-xl font-bold">
            Totales
          </CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <RiDownloadLine className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
                <RiArrowDownSLine className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleExportCSV}
                className="cursor-pointer"
              >
                <RiFileTextLine className="mr-2 h-4 w-4" />
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportExcel}
                className="cursor-pointer"
              >
                <RiFileExcel2Line className="mr-2 h-4 w-4" />
                Exportar Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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

            <ColumnVisibilityDropdown
              columns={allColumns}
              visibleColumns={visibleColumns}
              onToggleColumn={toggleColumn}
              onShowAllColumns={showAllColumns}
              onHideAllColumns={hideAllColumns}
            />
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
                {visibleColumns.has('count') && (
                  <div>
                    <span className="text-muted-foreground">Registros:</span>
                    <span className="ml-2 font-semibold">{group.count}</span>
                  </div>
                )}
                {numericFields.map((f) => (
                  <React.Fragment key={f.id}>
                    {visibleColumns.has(f.id) && (
                      <div key={f.id}>
                        <span className="text-muted-foreground">
                          {f.label}:
                        </span>
                        <span className="ml-2 font-semibold">
                          {group.values[f.id].toLocaleString()}
                        </span>
                      </div>
                    )}
                    {f.type === 'MEMBER_ATTENDANCE' &&
                      visibleColumns.has(`${f.id}_absent`) && (
                        <div key={`${f.id}_absent`}>
                          <span className="text-muted-foreground">
                            {f.label} (Faltantes):
                          </span>
                          <span className="ml-2 font-semibold">
                            {group.values[`${f.id}_absent`].toLocaleString()}
                          </span>
                        </div>
                      )}
                  </React.Fragment>
                ))}
                {booleanFields
                  .filter((f) => visibleColumns.has(f.id))
                  .map((f) => (
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
          <div className="border-2 border-primary rounded-lg p-3 bg-primary/5 dark:bg-primary/20 space-y-2">
            <div className="font-bold text-sm border-b border-primary/20 pb-2 mb-2">
              TOTAL
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {visibleColumns.has('count') && (
                <div>
                  <span className="text-muted-foreground">Registros:</span>
                  <span className="ml-2 font-bold">{totals.count}</span>
                </div>
              )}
              {numericFields.map((f) => (
                <React.Fragment key={f.id}>
                  {visibleColumns.has(f.id) && (
                    <div key={f.id}>
                      <span className="text-muted-foreground">{f.label}:</span>
                      <span className="ml-2 font-bold">
                        {totals[f.id].toLocaleString()}
                      </span>
                    </div>
                  )}
                  {f.type === 'MEMBER_ATTENDANCE' &&
                    visibleColumns.has(`${f.id}_absent`) && (
                      <div key={`${f.id}_absent`}>
                        <span className="text-muted-foreground">
                          {f.label} (Faltantes):
                        </span>
                        <span className="ml-2 font-bold">
                          {totals[`${f.id}_absent`].toLocaleString()}
                        </span>
                      </div>
                    )}
                </React.Fragment>
              ))}
              {booleanFields
                .filter((f) => visibleColumns.has(f.id))
                .map((f) => (
                  <div key={f.id}>
                    <span className="text-muted-foreground">
                      {f.label} (Sí):
                    </span>
                    <span className="ml-2 font-bold">{totals[f.id]}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        {insights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border flex items-start gap-3 transition-all duration-200 hover:shadow-md ${
                  insight.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                    : insight.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'
                    : 'bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400'
                }`}
              >
                <div
                  className={`mt-0.5 shrink-0 ${
                    insight.type === 'success'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : insight.type === 'warning'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-sky-600 dark:text-sky-400'
                  }`}
                >
                  {insight.type === 'success' && <Award className="w-5 h-5" />}
                  {insight.type === 'warning' && (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  {insight.type === 'info' && !insight.iconType && (
                    <Lightbulb className="w-5 h-5" />
                  )}
                  {insight.iconType === 'prayer' && (
                    <HandHeart className="w-5 h-5" />
                  )}
                  {insight.iconType === 'fasting' && (
                    <Flame className="w-5 h-5" />
                  )}
                  {insight.iconType === 'bible' && (
                    <BookOpen className="w-5 h-5" />
                  )}
                  {insight.iconType === 'offering' && (
                    <DollarSign className="w-5 h-5" />
                  )}
                  {insight.iconType === 'activity' && (
                    <TrendingUp className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">
                    {insight.title}
                  </h4>
                  <p className="text-xs mt-1.5 font-medium leading-normal opacity-100">
                    {insight.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden md:block w-full overflow-hidden">
          <div className="overflow-auto rounded-xl border max-w-full relative max-h-[600px]">
            <Table className="w-full">
              <TableHeader className="sticky top-0 z-20 bg-card shadow-sm">
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead
                    className="w-50 whitespace-nowrap py-2 sticky left-0 bg-background z-20 border-r cursor-pointer group select-none"
                    onClick={() => handleSort('label')}
                  >
                    <div className="flex items-center gap-1">
                      Grupo
                      {getSortIcon('label')}
                    </div>
                  </TableHead>
                  {visibleColumns.has('count') && (
                    <TableHead
                      className="whitespace-nowrap py-2 group cursor-pointer select-none"
                      onClick={() => handleSort('count')}
                    >
                      <div className="flex items-center gap-1 justify-between">
                        <div className="flex items-center gap-1">
                          Registros
                          {getSortIcon('count')}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Insights</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => toggleInsight('count', 'max')}
                            >
                              <div className="flex items-center gap-2 w-full">
                                {isInsightActive('count', 'max') ? (
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                ) : (
                                  <ArrowUpCircle className="h-3 w-3 text-green-500" />
                                )}
                                <span
                                  className={
                                    isInsightActive('count', 'max')
                                      ? 'text-red-500'
                                      : ''
                                  }
                                >
                                  {isInsightActive('count', 'max')
                                    ? 'Quitar Mayor'
                                    : 'Destacar Mayor'}
                                </span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleInsight('count', 'min')}
                            >
                              <div className="flex items-center gap-2 w-full">
                                {isInsightActive('count', 'min') ? (
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                ) : (
                                  <ArrowDownCircle className="h-3 w-3 text-yellow-500" />
                                )}
                                <span
                                  className={
                                    isInsightActive('count', 'min')
                                      ? 'text-red-500'
                                      : ''
                                  }
                                >
                                  {isInsightActive('count', 'min')
                                    ? 'Quitar Menor'
                                    : 'Destacar Menor'}
                                </span>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                  )}
                  {numericFields.map((f) => (
                    <React.Fragment key={f.id}>
                      {visibleColumns.has(f.id) && (
                        <TableHead
                          key={f.id}
                          className="whitespace-nowrap py-2 group cursor-pointer select-none"
                          onClick={() => handleSort(f.id)}
                        >
                          <div className="flex items-center gap-1 justify-between">
                            <div className="flex items-center gap-1">
                              {f.label || 'Campo'}
                              {getSortIcon(f.id)}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Insights</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => toggleInsight(f.id, 'max')}
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    {isInsightActive(f.id, 'max') ? (
                                      <Trash2 className="h-3 w-3 text-red-500" />
                                    ) : (
                                      <ArrowUpCircle className="h-3 w-3 text-green-500" />
                                    )}
                                    <span
                                      className={
                                        isInsightActive(f.id, 'max')
                                          ? 'text-red-500'
                                          : ''
                                      }
                                    >
                                      {isInsightActive(f.id, 'max')
                                        ? 'Quitar Mayor'
                                        : 'Destacar Mayor'}
                                    </span>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleInsight(f.id, 'min')}
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    {isInsightActive(f.id, 'min') ? (
                                      <Trash2 className="h-3 w-3 text-red-500" />
                                    ) : (
                                      <ArrowDownCircle className="h-3 w-3 text-yellow-500" />
                                    )}
                                    <span
                                      className={
                                        isInsightActive(f.id, 'min')
                                          ? 'text-red-500'
                                          : ''
                                      }
                                    >
                                      {isInsightActive(f.id, 'min')
                                        ? 'Quitar Menor'
                                        : 'Destacar Menor'}
                                    </span>
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableHead>
                      )}
                      {f.type === 'MEMBER_ATTENDANCE' &&
                        visibleColumns.has(`${f.id}_absent`) && (
                          <TableHead
                            key={`${f.id}_absent`}
                            className="whitespace-nowrap py-2 group cursor-pointer select-none"
                            onClick={() => handleSort(`${f.id}_absent`)}
                          >
                            <div className="flex items-center gap-1 justify-between">
                              <div className="flex items-center gap-1">
                                {f.label || 'Campo'} (Faltantes)
                                {getSortIcon(`${f.id}_absent`)}
                              </div>
                            </div>
                          </TableHead>
                        )}
                    </React.Fragment>
                  ))}
                  {booleanFields
                    .filter((f) => visibleColumns.has(f.id))
                    .map((f) => (
                      <TableHead
                        key={f.id}
                        className="whitespace-nowrap py-2 cursor-pointer group select-none"
                        onClick={() => handleSort(f.id)}
                      >
                        <div className="flex items-center gap-1">
                          {f.label || 'Campo'} (Sí)
                          {getSortIcon(f.id)}
                        </div>
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((group: any) => (
                  <TableRow key={group.key}>
                    <TableCell className="font-medium whitespace-nowrap py-2 sticky left-0 bg-background z-10 border-r">
                      {group.label}
                    </TableCell>
                    {visibleColumns.has('count') && (
                      <TableCell className="whitespace-nowrap py-2">
                        {group.count}
                      </TableCell>
                    )}
                    {numericFields.map((f) => (
                      <React.Fragment key={f.id}>
                        {visibleColumns.has(f.id) && (
                          <TableCell
                            key={f.id}
                            className="whitespace-nowrap py-2"
                          >
                            {group.values[f.id].toLocaleString()}
                          </TableCell>
                        )}
                        {f.type === 'MEMBER_ATTENDANCE' &&
                          visibleColumns.has(`${f.id}_absent`) && (
                            <TableCell
                              key={`${f.id}_absent`}
                              className="whitespace-nowrap py-2 text-muted-foreground"
                            >
                              {group.values[`${f.id}_absent`].toLocaleString()}
                            </TableCell>
                          )}
                      </React.Fragment>
                    ))}
                    {booleanFields
                      .filter((f) => visibleColumns.has(f.id))
                      .map((f) => (
                        <TableCell
                          key={f.id}
                          className="whitespace-nowrap py-2"
                        >
                          {group.values[f.id]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
                <TableRow className="bg-slate-500 dark:bg-slate-800 text-white hover:bg-slate-900 dark:hover:bg-slate-700 font-black text-base shadow-lg">
                  <TableCell className="whitespace-nowrap py-4 px-6 sticky left-0 bg-slate-500 dark:bg-slate-800 text-white z-10 border-r border-slate-800 rounded-l-lg">
                    TOTAL GENERAL
                  </TableCell>
                  {visibleColumns.has('count') && (
                    <TableCell
                      className={`whitespace-nowrap py-4 px-6 text-lg ${
                        lastVisibleKey === 'count' ? 'rounded-r-lg' : ''
                      }`}
                    >
                      {totals.count}
                    </TableCell>
                  )}
                  {numericFields.map((f) => (
                    <React.Fragment key={f.id}>
                      {visibleColumns.has(f.id) && (
                        <TableCell
                          key={f.id}
                          className={`whitespace-nowrap py-4 px-6 text-lg ${
                            lastVisibleKey === f.id ? 'rounded-r-lg' : ''
                          }`}
                        >
                          {totals[f.id].toLocaleString()}
                        </TableCell>
                      )}
                      {f.type === 'MEMBER_ATTENDANCE' &&
                        visibleColumns.has(`${f.id}_absent`) && (
                          <TableCell
                            key={`${f.id}_absent`}
                            className={`whitespace-nowrap py-4 px-6 text-lg ${
                              lastVisibleKey === `${f.id}_absent`
                                ? 'rounded-r-lg'
                                : ''
                            }`}
                          >
                            {totals[`${f.id}_absent`].toLocaleString()}
                          </TableCell>
                        )}
                    </React.Fragment>
                  ))}
                  {booleanFields
                    .filter((f) => visibleColumns.has(f.id))
                    .map((f) => (
                      <TableCell
                        key={f.id}
                        className={`whitespace-nowrap py-4 px-6 text-lg ${
                          lastVisibleKey === f.id ? 'rounded-r-lg' : ''
                        }`}
                      >
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
