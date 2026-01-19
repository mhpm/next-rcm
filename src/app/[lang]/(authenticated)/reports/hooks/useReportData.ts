import { useMemo } from 'react';
import { ReportFields } from '@/generated/prisma/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { naturalSort } from '@/lib/utils';

// Type definition for Row (copied from ConsolidatedReportView for now, should be shared)
export type Row = Record<string, unknown> & {
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
  __allMemberIds?: string[];
  __allMembers?: { id: string; name: string }[];
};

const parseLocalFilterDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export function useReportData(
  rows: Row[],
  fields: ReportFields[],
  activeFilters: Record<string, any>,
  groupBy: string
) {
  // Identify numeric fields that can be aggregated
  const numericFields = useMemo(() => {
    return fields.filter(
      (f) =>
        f.type === 'NUMBER' ||
        f.type === 'CURRENCY' ||
        f.type === 'FRIEND_REGISTRATION' ||
        f.type === 'MEMBER_SELECT' ||
        f.type === 'MEMBER_ATTENDANCE'
    );
  }, [fields]);

  // Identify boolean fields
  const booleanFields = useMemo(() => {
    return fields.filter((f) => f.type === 'BOOLEAN');
  }, [fields]);

  // Filter rows
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
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

        if (
          (field.type === 'TEXT' || field.type === 'CYCLE_WEEK_INDICATOR') &&
          activeFilters[field.id]
        ) {
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

  // Process data (Grouping)
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
          if (f.type === 'MEMBER_ATTENDANCE') {
            groups[key].values[`${f.id}_absent`] = 0;
          }
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

        if (
          f.type === 'FRIEND_REGISTRATION' ||
          f.type === 'MEMBER_SELECT' ||
          f.type === 'MEMBER_ATTENDANCE'
        ) {
          const valArray = Array.isArray(val) ? val : [];
          groups[key].values[f.id] += valArray.length;

          if (f.type === 'MEMBER_ATTENDANCE') {
            const totalMembers = row.__allMemberIds?.length || 0;
            // Ensure we don't get negative values if data is inconsistent
            const absent = Math.max(0, totalMembers - valArray.length);
            groups[key].values[`${f.id}_absent`] += absent;
          }
        } else {
          const num = parseFloat(String(val || '0'));
          if (!isNaN(num)) {
            groups[key].values[f.id] += num;
          }
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
      naturalSort(a.label, b.label)
    );
  }, [filteredRows, groupBy, numericFields, booleanFields]);

  // Calculate totals
  const totals = useMemo(() => {
    const total: Record<string, number> = { count: 0 };
    numericFields.forEach((f) => {
      total[f.id] = 0;
      if (f.type === 'MEMBER_ATTENDANCE') {
        total[`${f.id}_absent`] = 0;
      }
    });
    booleanFields.forEach((f) => (total[f.id] = 0));

    consolidatedData.forEach((group: any) => {
      total.count += group.count;
      numericFields.forEach((f) => {
        total[f.id] += group.values[f.id];
        if (f.type === 'MEMBER_ATTENDANCE') {
          total[`${f.id}_absent`] += group.values[`${f.id}_absent`];
        }
      });
      booleanFields.forEach((f) => {
        total[f.id] += group.values[f.id];
      });
    });

    return total;
  }, [consolidatedData, numericFields, booleanFields]);

  return {
    consolidatedData,
    totals,
    filteredRows,
    numericFields,
    booleanFields,
  };
}

export type InsightConfig = {
  fieldId: string;
  type: 'max' | 'min';
  enabled: boolean;
};

export function useReportInsights(
  currentData: any[],
  numericFields: ReportFields[],
  config: InsightConfig[] = []
) {
  // Simple insights for now based on current data distribution
  // In a real scenario, we would compare with previousData

  const insights = useMemo(() => {
    if (currentData.length === 0) return [];

    const result = [];

    // 2. Configured Insights
    config
      .filter((c) => c.enabled)
      .forEach((conf) => {
        let fieldLabel = '';
        let iconType = 'info';
        let targetValue = 0;
        let targetLabel = '';

        if (conf.fieldId === 'count') {
          fieldLabel = 'Registros';
          iconType = 'activity';
          const sorted = [...currentData].sort((a, b) => {
            const valA = a.count || 0;
            const valB = b.count || 0;
            return conf.type === 'max' ? valB - valA : valA - valB;
          });
          const target = sorted[0];
          if (target) {
            targetLabel = target.label;
            targetValue = target.count;
          }
        } else {
          const field = numericFields.find((f) => f.id === conf.fieldId);
          if (!field) return;

          fieldLabel = field.label || 'Valor';
          // Sort data
          const sorted = [...currentData].sort((a, b) => {
            const valA = a.values[field.id] || 0;
            const valB = b.values[field.id] || 0;
            return conf.type === 'max' ? valB - valA : valA - valB;
          });

          const target = sorted[0];
          if (target) {
            targetLabel = target.label;
            targetValue = target.values[field.id] || 0;

            // Determine icon based on keywords (simple heuristic)
            const labelLower = (field.label || '').toLowerCase();
            const keyLower = field.key.toLowerCase();
            if (labelLower.includes('oracion') || keyLower.includes('oracion'))
              iconType = 'prayer';
            else if (labelLower.includes('ayuno') || keyLower.includes('ayuno'))
              iconType = 'fasting';
            else if (
              labelLower.includes('capitulo') ||
              keyLower.includes('bible')
            )
              iconType = 'bible';
            else if (
              labelLower.includes('ofrenda') ||
              keyLower.includes('money')
            )
              iconType = 'offering';
            else if (conf.type === 'min') iconType = 'warning';
          }
        }

        // Filter out if value is 0 for max (unless all are 0)
        if (conf.type === 'max' && targetValue === 0) return;

        if (targetLabel) {
          result.push({
            type: conf.type === 'max' ? 'info' : 'warning',
            title: `${conf.type === 'max' ? 'Mayor' : 'Menor'} ${fieldLabel}`,
            message: `${targetLabel} tiene ${
              conf.type === 'max' ? 'el mayor' : 'el menor'
            } registro con ${targetValue.toLocaleString()}.`,
            iconType,
          });
        }
      });

    // 3. Legacy/Default behavior if config is empty (for backward compatibility or initial state)
    // If no config is provided, we might want to default to the "smart" selection we implemented before
    // BUT, the user wants to control it. So let's provide a "default config" generator instead of hardcoding logic here.

    // 4. Underperformers (Risk) - e.g. bottom 10% or zero activity
    const inactive = currentData.filter((d) => d.count === 0);
    if (inactive.length > 0) {
      result.push({
        type: 'warning',
        title: 'Sin Actividad',
        message: `${inactive.length} grupos no han reportado actividad en este periodo.`,
        iconType: 'inactive',
      });
    }

    return result;
  }, [currentData, numericFields, config]);

  return insights;
}
