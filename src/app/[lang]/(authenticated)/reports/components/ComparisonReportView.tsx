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
import { usePersistentFilters } from '@/hooks/usePersistentFilters';
import AdvancedFilterModal, { FilterField } from './AdvancedFilterModal';
import { Button } from '@/components/ui/button';
import {
  RiFilter3Line,
  RiArrowUpSLine,
  RiArrowDownSLine,
} from 'react-icons/ri';
import { naturalSort, cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Row,
  useReportData,
} from '@/app/[lang]/(authenticated)/reports/hooks/useReportData';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown/ColumnVisibilityDropdown';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

import {
  Users,
  TrendingUp,
  Activity,
  Award,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

// =============================
//  CUSTOM TOOLTIP
// =============================
export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm min-w-[150px]">
        <div className="mb-2 border-b pb-1">
          <p className="font-semibold text-sm">{label}</p>
        </div>
        <div className="grid gap-1">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-[2px]"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {entry.name}
                </span>
              </div>
              <span className="font-mono text-xs font-medium">
                {entry.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// =============================
//  NUEVO COMPONENTE UX
// =============================
function ComparisonCell({ a = 0, b = 0 }: { a?: number; b?: number }) {
  const diff = b - a;
  const positive = diff > 0;
  const neutral = diff === 0;

  return (
    <div className="flex flex-col items-center justify-center leading-tight">
      <span className="text-base font-bold">{a.toLocaleString()}</span>

      <div className="flex items-center gap-1 text-xs opacity-70">
        <span>Comp:</span>
        <span>{b.toLocaleString()}</span>
      </div>

      <span
        className={`mt-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
          neutral
            ? 'bg-muted text-muted-foreground'
            : positive
            ? 'bg-green-500/15 text-green-500'
            : 'bg-red-500/15 text-red-500'
        }`}
      >
        {neutral ? 'Sin cambio' : positive ? `+${diff}` : `${diff}`}
      </span>
    </div>
  );
}

// Custom hook for scoped column visibility
function useComparisonColumnVisibility(
  reportId: string,
  allColumnKeys: string[]
) {
  const key = `comparison-column-visibility-${reportId}`;

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const validKeys = new Set(allColumnKeys);
            const filtered = parsed.filter((k) => validKeys.has(k));
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
      if (next.has(columnKey)) next.delete(columnKey);
      else next.add(columnKey);
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

  // ===============================
  // TODA LA LÓGICA ORIGINAL IGUAL
  // ===============================

  const {
    filters: filtersA_extra,
    setFilters: setFiltersA_extra,
    clearFilters: clearFiltersA,
  } = usePersistentFilters<Record<string, any>>(
    `comparison-filters-A-${reportId}`,
    {}
  );

  const {
    filters: filtersB_extra,
    setFilters: setFiltersB_extra,
    clearFilters: clearFiltersB,
  } = usePersistentFilters<Record<string, any>>(
    `comparison-filters-B-${reportId}`,
    {}
  );

  const currentYear = new Date().getFullYear();

  const { filters: configA, setFilters: setConfigA } = usePersistentFilters(
    `comparison-config-A-${reportId}`,
    {
      year: currentYear,
      type: 'cuatrimestre',
      period: 1 as number | null,
    }
  );

  const { filters: configB, setFilters: setConfigB } = usePersistentFilters(
    `comparison-config-B-${reportId}`,
    {
      year: currentYear - 1,
      type: 'cuatrimestre',
      period: 1 as number | null,
    }
  );

  const { year: yearA, type: typeA, period: periodA } = configA;
  const { year: yearB, type: typeB, period: periodB } = configB;

  const setYearA = (y: number) => setConfigA((prev) => ({ ...prev, year: y }));
  const setTypeA = (t: any) => setConfigA((prev) => ({ ...prev, type: t }));
  const setPeriodA = (p: number | null) =>
    setConfigA((prev) => ({ ...prev, period: p }));

  const setYearB = (y: number) => setConfigB((prev) => ({ ...prev, year: y }));
  const setTypeB = (t: any) => setConfigB((prev) => ({ ...prev, type: t }));
  const setPeriodB = (p: number | null) =>
    setConfigB((prev) => ({ ...prev, period: p }));

  const getPeriodFilters = (
    year: number,
    type: string,
    period: number | null
  ) => {
    let fromMonth = 0;
    let toMonth = 11;
    let lastDay = 31;

    if (type === 'cuatrimestre' && period) {
      if (period === 1) {
        fromMonth = 0;
        toMonth = 3;
      } else if (period === 2) {
        fromMonth = 4;
        toMonth = 7;
      } else if (period === 3) {
        fromMonth = 8;
        toMonth = 11;
      }
    }

    const fromDate = new Date(year, fromMonth, 1);
    const toDate = new Date(year, toMonth, lastDay);

    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

    return {
      createdAt_from: formatDate(fromDate),
      createdAt_to: formatDate(toDate),
    };
  };

  const filtersA = useMemo(
    () => ({ ...filtersA_extra, ...getPeriodFilters(yearA, typeA, periodA) }),
    [filtersA_extra, yearA, typeA, periodA]
  );

  const filtersB = useMemo(
    () => ({ ...filtersB_extra, ...getPeriodFilters(yearB, typeB, periodB) }),
    [filtersB_extra, yearB, typeB, periodB]
  );

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

  const { visibleColumns, toggleColumn, showAllColumns, hideAllColumns } =
    useComparisonColumnVisibility(
      reportId,
      allColumns.map((c) => c.key)
    );

  // Calculate grouped headers
  const columnGroups = useMemo(() => {
    // 1. Build map of Field ID -> Section
    const fieldSectionMap = new Map<
      string,
      { title: string; color?: string }
    >();
    let currentSection = {
      title: 'Detalles',
      color: undefined as string | undefined,
    };

    fields.forEach((f) => {
      if (f.type === 'SECTION') {
        currentSection = {
          title: f.label || 'Sección',
          color: (f.options as any)?.[0] as string | undefined,
        };
      } else {
        fieldSectionMap.set(f.id, currentSection);
      }
    });

    // 2. Identify visible columns in order
    const groups: {
      title: string;
      colSpan: number;
      color?: string;
      className?: string;
    }[] = [];
    let currentGroup: {
      title: string;
      colSpan: number;
      color?: string;
      className?: string;
    } | null = null;

    const addColumnToGroup = (key: string, isSystem = false) => {
      let groupInfo;
      if (isSystem) {
        groupInfo = { title: 'Información General', color: undefined };
      } else {
        const cleanKey = key.replace('_absent', '');
        groupInfo = fieldSectionMap.get(cleanKey) || {
          title: 'Detalles',
          color: undefined,
        };
      }

      if (currentGroup && currentGroup.title === groupInfo.title) {
        currentGroup.colSpan++;
      } else {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = {
          title: groupInfo.title,
          colSpan: 1,
          color: groupInfo.color,
          className: 'text-center font-bold text-xs uppercase tracking-wider',
        };
        // If no color, add default styling
        if (!groupInfo.color) {
          if (currentGroup.className) {
            currentGroup.className += ' bg-muted/30';
          } else {
            currentGroup.className = 'bg-muted/30';
          }
        }
      }
    };

    // Grupo
    addColumnToGroup('label', true);

    // Count
    if (visibleColumns.has('count')) {
      addColumnToGroup('count', true);
    }

    // Numeric Fields
    numericFields.forEach((f) => {
      if (visibleColumns.has(f.id)) {
        addColumnToGroup(f.id);
      }
      if (
        f.type === 'MEMBER_ATTENDANCE' &&
        visibleColumns.has(`${f.id}_absent`)
      ) {
        addColumnToGroup(`${f.id}_absent`);
      }
    });

    // Boolean Fields
    booleanFields.forEach((f) => {
      if (visibleColumns.has(f.id)) {
        addColumnToGroup(f.id);
      }
    });

    if (currentGroup) groups.push(currentGroup);

    return groups;
  }, [fields, numericFields, booleanFields, visibleColumns]);

  const comparisonData = useMemo(() => {
    const keys = new Set([
      ...dataA.map((d) => d.key),
      ...dataB.map((d) => d.key),
    ]);

    return [...keys]
      .map((key) => ({
        key,
        label:
          dataA.find((d) => d.key === key)?.label ||
          dataB.find((d) => d.key === key)?.label ||
          key,
        itemA: dataA.find((d) => d.key === key),
        itemB: dataB.find((d) => d.key === key),
      }))
      .sort((a, b) => naturalSort(a.label, b.label));
  }, [dataA, dataB]);

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
    const data = [...comparisonData];
    if (!sortConfig.key) return data;

    return data.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === 'label') {
        aValue = a.label;
        bValue = b.label;
      } else if (sortConfig.key === 'count') {
        // Compare the difference or one of the periods?
        // Let's compare the Period A values for now, or maybe the sum?
        // Actually, it's better to compare the specific value being looked at.
        // For comparison view, let's compare by Period A (itemA)
        aValue = a.itemA?.count || 0;
        bValue = b.itemA?.count || 0;
      } else {
        aValue = a.itemA?.values[sortConfig.key] || 0;
        bValue = b.itemA?.values[sortConfig.key] || 0;
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
  }, [comparisonData, sortConfig]);

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

  // ============================================
  //  CÁLCULOS DE METRICAS (Dashboard Pastoral)
  // ============================================
  const metrics = useMemo(() => {
    // Helper to find value by loosely matching key
    const getValue = (totals: Record<string, number>, keywords: string[]) => {
      // 1. Try exact match in numericFields
      const field = numericFields.find((f) =>
        keywords.some((k) =>
          (f.label || f.key).toLowerCase().includes(k.toLowerCase())
        )
      );
      if (field) return totals[field.id] || 0;

      // 2. Try boolean fields (count of true)
      const boolField = booleanFields.find((f) =>
        keywords.some((k) =>
          (f.label || f.key).toLowerCase().includes(k.toLowerCase())
        )
      );
      if (boolField) return totals[boolField.id] || 0;

      return 0;
    };

    // 1. Asistencia Total (Miembros + Amigos)
    const getAttendance = (totals: Record<string, number>) => {
      const miembros = getValue(totals, ['miembros asistentes', 'asistencia']);
      const amigos = getValue(totals, ['amigos asistentes', 'invitados']);
      // Si no encuentra campos específicos, usa el count total como fallback
      return miembros + amigos || totals.count || 0;
    };

    const attendanceA = getAttendance(totalsA);
    const attendanceB = getAttendance(totalsB);
    const growthAbs = attendanceB - attendanceA;
    const growthPct =
      attendanceA > 0 ? ((attendanceB - attendanceA) / attendanceA) * 100 : 0;

    // 2. Retención (Miembros Asistentes vs Total Miembros [Asistentes + Faltantes])
    const getRetention = (totals: Record<string, number>) => {
      const asistentes = getValue(totals, ['miembros asistentes']);
      const faltantes = getValue(totals, ['miembros faltantes', 'ausentes']);
      const total = asistentes + faltantes;
      return total > 0 ? (asistentes / total) * 100 : 0;
    };

    const retentionB = getRetention(totalsB);

    // 3. Conversión (Amigos Asistentes - solo count por ahora)
    // Idealmente seria Nuevos Convertidos / Amigos Asistentes
    const conversionCount = getValue(totalsB, [
      'nuevos',
      'convertidos',
      'amigos',
    ]);

    // 4. Índice Espiritual (Promedio de oraciones/ayunos por asistente)
    const getSpiritualIndex = (totals: Record<string, number>) => {
      const oraciones = getValue(totals, ['oraciones']);
      const ayunos = getValue(totals, ['ayunos']);
      const leidos = getValue(totals, ['capitulos', 'lectura']);
      const asist = getAttendance(totals);
      return asist > 0 ? (oraciones + ayunos + leidos) / asist : 0;
    };

    const spiritualIndexB = getSpiritualIndex(totalsB);

    // 5. Ranking Células/Líderes
    // Usamos comparisonData que ya tiene la agrupación actual
    const rankedItems = comparisonData
      .map((item) => {
        const valA = getAttendance(item.itemA?.values || {});
        const valB = getAttendance(item.itemB?.values || {});
        const diff = valB - valA;
        const pct = valA > 0 ? (diff / valA) * 100 : valB > 0 ? 100 : 0;
        return { ...item, growthPct: pct, valB };
      })
      .sort((a, b) => b.growthPct - a.growthPct);

    const bestGrowth = rankedItems.filter((i) => i.growthPct > 0).slice(0, 3);
    const atRisk = [...rankedItems]
      .reverse()
      .filter((i) => i.growthPct < 0)
      .slice(0, 3);

    // 6. Insights Automáticos
    const insights = [];
    if (Math.abs(growthPct) > 5) {
      insights.push(
        `La iglesia ${growthPct > 0 ? 'creció' : 'decreció'} un ${Math.abs(
          growthPct
        ).toFixed(1)}% respecto al periodo anterior.`
      );
    }
    if (retentionB > 80) {
      insights.push(
        `La retención fue del ${retentionB.toFixed(
          1
        )}%, ¡excelente trabajo pastoral!`
      );
    } else if (retentionB < 50 && retentionB > 0) {
      insights.push(
        `Atención: La retención está baja (${retentionB.toFixed(
          1
        )}%), se recomienda contactar a los ausentes.`
      );
    }
    if (bestGrowth.length > 0) {
      insights.push(
        `El grupo con mayor crecimiento fue ${
          bestGrowth[0].label
        } con +${bestGrowth[0].growthPct.toFixed(1)}%.`
      );
    }

    // Buscar indicador con mayor caída
    const numericdiffs = numericFields.map((f) => {
      const valA = totalsA[f.id] || 0;
      const valB = totalsB[f.id] || 0;
      const pct = valA > 0 ? ((valB - valA) / valA) * 100 : 0;
      return { label: f.label || f.key, pct };
    });
    const worstIndicator = numericdiffs.sort((a, b) => a.pct - b.pct)[0];
    if (worstIndicator && worstIndicator.pct < -10) {
      insights.push(
        `El indicador con mayor caída fue ${
          worstIndicator.label
        } (${worstIndicator.pct.toFixed(1)}%).`
      );
    }

    return {
      attendanceA,
      attendanceB,
      growthAbs,
      growthPct,
      retentionB,
      conversionCount,
      spiritualIndexB,
      bestGrowth,
      atRisk,
      insights,
    };
  }, [totalsA, totalsB, comparisonData, numericFields, booleanFields]);

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

  const chartData = useMemo(() => {
    const data = [];

    if (visibleColumns.has('count')) {
      data.push({
        name: 'Registros',
        PeriodoA: totalsA.count || 0,
        PeriodoB: totalsB.count || 0,
      });
    }

    numericFields.forEach((f) => {
      if (visibleColumns.has(f.id)) {
        data.push({
          name: f.label || f.key,
          PeriodoA: totalsA[f.id] || 0,
          PeriodoB: totalsB[f.id] || 0,
        });
      }
      if (
        f.type === 'MEMBER_ATTENDANCE' &&
        visibleColumns.has(`${f.id}_absent`)
      ) {
        data.push({
          name: `${f.label || f.key} (Faltantes)`,
          PeriodoA: totalsA[`${f.id}_absent`] || 0,
          PeriodoB: totalsB[`${f.id}_absent`] || 0,
        });
      }
    });

    booleanFields.forEach((f) => {
      if (visibleColumns.has(f.id)) {
        data.push({
          name: `${f.label || f.key} (Sí)`,
          PeriodoA: totalsA[f.id] || 0,
          PeriodoB: totalsB[f.id] || 0,
        });
      }
    });

    return data.map((item) => ({
      ...item,
      delta: item.PeriodoB - item.PeriodoA,
    }));
  }, [totalsA, totalsB, numericFields, booleanFields, visibleColumns]);

  const {
    attendanceA,
    attendanceB,
    growthAbs,
    growthPct,
    retentionB,
    conversionCount,
    spiritualIndexB,
    bestGrowth,
    atRisk,
    insights,
  } = metrics;

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

        {/* ===================== DASHBOARD PASTORAL ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* 1. Resumen Asistencia */}
          <Card className="p-4 bg-muted/10 border-none shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">
                Asistencia Total
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold">
                  {attendanceB.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  vs {attendanceA.toLocaleString()} (Previo)
                </div>
              </div>
              <div
                className={`text-right ${
                  growthAbs >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <div className="text-lg font-bold">
                  {growthAbs > 0 ? '+' : ''}
                  {growthAbs}
                </div>
                <div className="text-xs font-semibold bg-white/50 px-1 rounded">
                  {growthPct.toFixed(1)}%
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Panel Pastoral */}
          <Card className="p-4 bg-muted/10 border-none shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">
                Indicadores Clave
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Retención:</span>
                <span className="font-bold">{retentionB.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Conversión:</span>
                <span className="font-bold">{conversionCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Índice Espiritual:</span>
                <span className="font-bold">{spiritualIndexB.toFixed(1)}</span>
              </div>
            </div>
          </Card>

          {/* 3. Mejores y Riesgo */}
          <Card className="p-4 bg-muted/10 border-none shadow-sm col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">
                Top & Flop
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="font-semibold text-green-600 mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3" /> Top Crecimiento
                </div>
                {bestGrowth.map((i) => (
                  <div
                    key={i.key}
                    className="truncate flex justify-between gap-1"
                  >
                    <span className="truncate max-w-[80px]">{i.label}</span>
                    <span className="font-bold">
                      +{i.growthPct.toFixed(0)}%
                    </span>
                  </div>
                ))}
                {bestGrowth.length === 0 && (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
              <div>
                <div className="font-semibold text-red-600 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> En Riesgo
                </div>
                {atRisk.map((i) => (
                  <div
                    key={i.key}
                    className="truncate flex justify-between gap-1"
                  >
                    <span className="truncate max-w-[80px]">{i.label}</span>
                    <span className="font-bold">{i.growthPct.toFixed(0)}%</span>
                  </div>
                ))}
                {atRisk.length === 0 && (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>
          </Card>

          {/* 4. Insights Automáticos */}
          <Card className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900 shadow-sm col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
              <Lightbulb className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">
                Insights Pastorales
              </span>
            </div>
            <div className="text-xs space-y-1.5 text-muted-foreground">
              {insights.slice(0, 3).map((insight, idx) => (
                <p key={idx} className="leading-tight">
                  • {insight}
                </p>
              ))}
              {insights.length === 0 && <p>No hay insights suficientes.</p>}
            </div>
          </Card>
        </div>

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

      <CardContent className="px-0 sm:px-6 pb-4">
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              {/* Grouped Headers */}
              <TableRow className="border-b border-muted/20 hover:bg-transparent">
                {columnGroups.map((group, i) => (
                  <TableHead
                    key={i}
                    colSpan={group.colSpan}
                    className={cn(
                      'py-2 h-auto border-r border-foreground/10',
                      group.className
                    )}
                    style={{
                      backgroundColor: group.color
                        ? `${group.color}20`
                        : undefined,
                      color: group.color,
                    }}
                  >
                    {group.title}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                <TableHead
                  className="w-[300px] whitespace-nowrap sticky left-0 bg-muted/10 border-r z-20 cursor-pointer group select-none"
                  onClick={() => handleSort('label')}
                >
                  <div className="flex items-center gap-1 justify-center">
                    Grupo
                    {getSortIcon('label')}
                  </div>
                </TableHead>

                {visibleColumns.has('count') && (
                  <TableHead
                    className="text-center min-w-[120px] bg-muted/10 border-r cursor-pointer group select-none"
                    onClick={() => handleSort('count')}
                  >
                    <div className="flex items-center gap-1 justify-center">
                      Registros
                      {getSortIcon('count')}
                    </div>
                  </TableHead>
                )}

                {numericFields.map((f) => (
                  <React.Fragment key={f.id}>
                    {visibleColumns.has(f.id) && (
                      <TableHead
                        key={f.id}
                        className="text-center min-w-[120px] bg-muted/10 border-r cursor-pointer group select-none"
                        onClick={() => handleSort(f.id)}
                      >
                        <div className="flex items-center gap-1 justify-center">
                          {f.label}
                          {getSortIcon(f.id)}
                        </div>
                      </TableHead>
                    )}
                    {f.type === 'MEMBER_ATTENDANCE' &&
                      visibleColumns.has(`${f.id}_absent`) && (
                        <TableHead
                          key={`${f.id}_absent`}
                          className="text-center min-w-[120px] bg-muted/10 border-r cursor-pointer group select-none"
                          onClick={() => handleSort(`${f.id}_absent`)}
                        >
                          <div className="flex items-center gap-1 justify-center text-muted-foreground">
                            {f.label} (Faltantes)
                            {getSortIcon(`${f.id}_absent`)}
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
                      className="text-center min-w-[120px] bg-muted/10 border-r cursor-pointer group select-none"
                      onClick={() => handleSort(f.id)}
                    >
                      <div className="flex items-center gap-1 justify-center">
                        {f.label} (Sí)
                        {getSortIcon(f.id)}
                      </div>
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium whitespace-nowrap sticky left-0 bg-background z-10 border-r py-2">
                    {row.label}
                  </TableCell>

                  {visibleColumns.has('count') && (
                    <TableCell className="text-center border-l border-r bg-muted/30 py-2">
                      <ComparisonCell
                        a={row.itemA?.count || 0}
                        b={row.itemB?.count || 0}
                      />
                    </TableCell>
                  )}

                  {numericFields.map((f) => (
                    <React.Fragment key={f.id}>
                      {visibleColumns.has(f.id) && (
                        <TableCell
                          key={f.id}
                          className="text-center border-r py-2"
                        >
                          <ComparisonCell
                            a={row.itemA?.values[f.id] || 0}
                            b={row.itemB?.values[f.id] || 0}
                          />
                        </TableCell>
                      )}
                      {f.type === 'MEMBER_ATTENDANCE' &&
                        visibleColumns.has(`${f.id}_absent`) && (
                          <TableCell
                            key={`${f.id}_absent`}
                            className="text-center border-r py-2 bg-muted/5"
                          >
                            <ComparisonCell
                              a={row.itemA?.values[`${f.id}_absent`] || 0}
                              b={row.itemB?.values[`${f.id}_absent`] || 0}
                            />
                          </TableCell>
                        )}
                    </React.Fragment>
                  ))}

                  {booleanFields
                    .filter((f) => visibleColumns.has(f.id))
                    .map((f) => (
                      <TableCell
                        key={f.id}
                        className="text-center border-r py-2"
                      >
                        <ComparisonCell
                          a={row.itemA?.values[f.id] || 0}
                          b={row.itemB?.values[f.id] || 0}
                        />
                      </TableCell>
                    ))}
                </TableRow>
              ))}

              {/* TOTAL */}
              <TableRow className="bg-slate-500 dark:bg-slate-800 text-white hover:bg-slate-900 dark:hover:bg-slate-700 font-black text-base shadow-lg">
                <TableCell className="whitespace-nowrap py-4 px-6 sticky left-0 bg-slate-500 dark:bg-slate-800 text-white z-10 border-r border-slate-800 rounded-l-lg">
                  TOTAL
                </TableCell>

                {visibleColumns.has('count') && (
                  <TableCell className="text-center border-l border-r py-4 px-6 text-lg">
                    <ComparisonCell
                      a={totalsA.count || 0}
                      b={totalsB.count || 0}
                    />
                  </TableCell>
                )}

                {numericFields.map((f) => (
                  <React.Fragment key={f.id}>
                    {visibleColumns.has(f.id) && (
                      <TableCell
                        key={f.id}
                        className="text-center border-r py-4 px-6 text-lg"
                      >
                        <ComparisonCell
                          a={totalsA[f.id] || 0}
                          b={totalsB[f.id] || 0}
                        />
                      </TableCell>
                    )}
                    {f.type === 'MEMBER_ATTENDANCE' &&
                      visibleColumns.has(`${f.id}_absent`) && (
                        <TableCell
                          key={`${f.id}_absent`}
                          className="text-center border-r py-4 px-6 text-lg bg-slate-600/50"
                        >
                          <ComparisonCell
                            a={totalsA[`${f.id}_absent`] || 0}
                            b={totalsB[`${f.id}_absent`] || 0}
                          />
                        </TableCell>
                      )}
                  </React.Fragment>
                ))}

                {booleanFields
                  .filter((f) => visibleColumns.has(f.id))
                  .map((f) => (
                    <TableCell
                      key={f.id}
                      className="text-center border-r py-4 px-6 text-lg"
                    >
                      <ComparisonCell
                        a={totalsA[f.id] || 0}
                        b={totalsB[f.id] || 0}
                      />
                    </TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* ===================== CHART ===================== */}
      {chartData.length > 0 && (
        <CardContent className="px-2 sm:px-6 pb-6">
          <div className="mt-8 p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-6">
              Gráfica Comparativa de Totales
            </h3>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip
                    cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  <Bar
                    dataKey="PeriodoA"
                    name="Periodo A"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="PeriodoB"
                    name="Periodo B"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      )}

      {/* ===================== MODAL ===================== */}
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
