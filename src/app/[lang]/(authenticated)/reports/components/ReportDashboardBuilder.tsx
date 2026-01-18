'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GripVertical,
  Plus,
  Trash2,
  Printer,
  LayoutGrid,
  Eye,
  Pencil,
  BarChart3,
  Link as LinkIcon,
  Table as TableIcon,
  Grid3X3 as HeatmapIcon,
  BarChart4 as StackedBarIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
  LineChart,
  Line,
  AreaChart,
  Area,
  FunnelChart,
  Funnel,
  LabelList,
  Legend,
} from 'recharts';

type ReportField = {
  id: string;
  key: string;
  label: string | null;
  type: string;
};

type WidgetType =
  | 'STAT'
  | 'CHART_BAR'
  | 'CHART_PIE'
  | 'CHART_PERCENTAGE'
  | 'CHART_LINE'
  | 'CHART_AREA'
  | 'CHART_FUNNEL'
  | 'CHART_HEATMAP'
  | 'CHART_BAR_STACKED'
  | 'TABLE';

type Widget = {
  id: string;
  type: WidgetType;
  title: string;
  fieldId?: string;
  secondaryFieldId?: string;
  valueFieldId?: string;
  operation?: 'COUNT' | 'SUM' | 'AVG';
};

type DashboardRow = {
  id: string;
  columns: number;
  widgets: (Widget | null)[]; // Changed from Widget[] to fixed slots
};

type DashboardBuilderProps = {
  reportId: string;
  fields: ReportField[];
  rows: any[]; // Flat rows from ReportEntriesPage
};

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

export default function ReportDashboardBuilder({
  fields,
  rows,
}: DashboardBuilderProps) {
  const [dashboardRows, setDashboardRows] = useState<DashboardRow[]>([]);
  const [availableWidgets, setAvailableWidgets] = useState<Widget[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Initialize available widgets and default row
  useEffect(() => {
    setIsClient(true);
    // Initialize generic widgets
    const generics: Widget[] = [
      {
        id: 'template-stat',
        type: 'STAT',
        title: 'Tarjeta de Dato',
      },
      {
        id: 'template-pie',
        type: 'CHART_PIE',
        title: 'Gráfico de Pastel',
      },
      {
        id: 'template-bar',
        type: 'CHART_BAR',
        title: 'Gráfico de Barras',
      },
      {
        id: 'template-line',
        type: 'CHART_LINE',
        title: 'Gráfico de Líneas',
      },
      {
        id: 'template-area',
        type: 'CHART_AREA',
        title: 'Gráfico de Áreas',
      },
      {
        id: 'template-funnel',
        type: 'CHART_FUNNEL',
        title: 'Embudo de Procesos',
      },
      {
        id: 'template-heatmap',
        type: 'CHART_HEATMAP',
        title: 'Mapa de Calor',
      },
      {
        id: 'template-bar-stacked',
        type: 'CHART_BAR_STACKED',
        title: 'Barras Apiladas',
      },
      {
        id: 'template-percentage',
        type: 'CHART_PERCENTAGE',
        title: 'Indicador de Porcentaje',
      },
      {
        id: 'template-table',
        type: 'TABLE',
        title: 'Tabla de Datos',
      },
    ];
    setAvailableWidgets(generics);

    if (dashboardRows.length === 0) {
      // Start with one empty row with slots
      setDashboardRows([
        {
          id: `row-${Math.random().toString(36).substr(2, 9)}`,
          columns: 2,
          widgets: [null, null],
        },
      ]);
    }
  }, []);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    // Caso 1: Nuevo widget desde el Sidebar
    if (sourceId === 'sidebar') {
      if (!destId.includes('-slot-')) return;

      const template = availableWidgets[source.index];
      const newWidget: Widget = {
        ...template,
        id: `widget-${Math.random().toString(36).substr(2, 9)}`,
        title: template.title,
      };

      const [rowIdPrefix, slotIndexStr] = destId.split('-slot-');
      const slotIndex = parseInt(slotIndexStr);
      const rowId = rowIdPrefix;

      setDashboardRows((rows) =>
        rows.map((r) => {
          if (r.id === rowId) {
            const newWidgets = [...r.widgets];
            newWidgets[slotIndex] = newWidget;
            return { ...r, widgets: newWidgets };
          }
          return r;
        })
      );
      return;
    }

    // Caso 2: Eliminar widget (arrastrar al sidebar)
    if (destId === 'sidebar') {
      if (sourceId.includes('-slot-')) {
        const [rowIdPrefix, slotIndexStr] = sourceId.split('-slot-');
        const slotIndex = parseInt(slotIndexStr);
        const rowId = rowIdPrefix;

        setDashboardRows((rows) =>
          rows.map((r) => {
            if (r.id === rowId) {
              const newWidgets = [...r.widgets];
              newWidgets[slotIndex] = null;
              return { ...r, widgets: newWidgets };
            }
            return r;
          })
        );
      }
      return;
    }

    // Caso 3: Reordenamiento (Slot a Slot)
    if (sourceId.includes('-slot-') && destId.includes('-slot-')) {
      const [srcRowId, srcSlotStr] = sourceId.split('-slot-');
      const [dstRowId, dstSlotStr] = destId.split('-slot-');
      const srcSlot = parseInt(srcSlotStr);
      const dstSlot = parseInt(dstSlotStr);

      setDashboardRows((currentRows) => {
        const newRows = [...currentRows];
        const sRowIdx = newRows.findIndex((r) => r.id === srcRowId);
        const dRowIdx = newRows.findIndex((r) => r.id === dstRowId);

        if (sRowIdx === -1 || dRowIdx === -1) return currentRows;

        // Misma fila
        if (sRowIdx === dRowIdx) {
          const row = {
            ...newRows[sRowIdx],
            widgets: [...newRows[sRowIdx].widgets],
          };
          const movingWidget = row.widgets[srcSlot];
          const targetWidget = row.widgets[dstSlot];

          // Intercambiar
          row.widgets[dstSlot] = movingWidget;
          row.widgets[srcSlot] = targetWidget;

          newRows[sRowIdx] = row;
          return newRows;
        }

        // Diferentes filas
        const sRow = {
          ...newRows[sRowIdx],
          widgets: [...newRows[sRowIdx].widgets],
        };
        const dRow = {
          ...newRows[dRowIdx],
          widgets: [...newRows[dRowIdx].widgets],
        };

        const movingWidget = sRow.widgets[srcSlot];
        const targetWidget = dRow.widgets[dstSlot];

        // Intercambiar entre filas
        dRow.widgets[dstSlot] = movingWidget;
        sRow.widgets[srcSlot] = targetWidget;

        newRows[sRowIdx] = sRow;
        newRows[dRowIdx] = dRow;

        return newRows;
      });
    }
  };

  const addRow = () => {
    setDashboardRows([
      ...dashboardRows,
      {
        id: `row-${Math.random().toString(36).substr(2, 9)}`,
        columns: 2,
        widgets: [null, null],
      },
    ]);
  };

  const removeRow = (rowId: string) => {
    setDashboardRows(dashboardRows.filter((r) => r.id !== rowId));
  };

  const updateRowColumns = (rowId: string, columns: number) => {
    setDashboardRows(
      dashboardRows.map((row) => {
        if (row.id === rowId) {
          const newWidgets = [...row.widgets];
          if (columns > row.columns) {
            // Add nulls
            for (let i = 0; i < columns - row.columns; i++)
              newWidgets.push(null);
          } else {
            // Trim
            newWidgets.splice(columns);
          }
          return { ...row, columns, widgets: newWidgets };
        }
        return row;
      })
    );
  };

  const removeWidget = (rowId: string, widgetId: string) => {
    setDashboardRows(
      dashboardRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            widgets: row.widgets.map((w) => (w?.id === widgetId ? null : w)),
          };
        }
        return row;
      })
    );
  };

  const updateWidgetConfig = (
    rowId: string,
    widgetId: string,
    updates: Partial<Widget>
  ) => {
    setDashboardRows(
      dashboardRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            widgets: row.widgets.map((w) => {
              if (w && w.id === widgetId) {
                const newWidget = { ...w, ...updates };

                // Update title if primary field changed
                if (updates.fieldId) {
                  const field = fields.find((f) => f.id === updates.fieldId);
                  if (field) {
                    const prefix =
                      w.type === 'STAT'
                        ? 'Total'
                        : w.type === 'CHART_HEATMAP'
                        ? 'Mapa de Calor'
                        : w.type === 'CHART_BAR_STACKED'
                        ? 'Barras Apiladas'
                        : 'Distribución';
                    newWidget.title = `${prefix} ${field.label || field.key}`;
                  }
                }

                return newWidget;
              }
              return w;
            }),
          };
        }
        return row;
      })
    );
  };

  const calculateStat = (fieldId: string) => {
    let sum = 0;
    let count = 0;
    rows.forEach((row) => {
      const val = row[`raw_${fieldId}`];
      if (typeof val === 'number') {
        sum += val;
        count++;
      } else if (typeof val === 'string' && !isNaN(Number(val))) {
        sum += Number(val);
        count++;
      }
    });
    return { sum, avg: count > 0 ? sum / count : 0 };
  };

  const calculateDistribution = (fieldId: string, sortByKey = false) => {
    const counts: Record<string, number> = {};
    rows.forEach((row) => {
      const val = row[fieldId];
      const rawVal = row[`raw_${fieldId}`];

      if (val !== undefined && val !== null && val !== '') {
        let key = String(val);
        if (typeof rawVal === 'boolean') {
          key = rawVal ? 'Sí' : 'No';
        }
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    let result = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));

    if (sortByKey) {
      // Try to sort by date if it looks like a date, or alphabetically
      result.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );
    } else {
      // Sort by value descending by default for distribution
      result.sort((a, b) => b.value - a.value);
    }

    return result;
  };

  const processChartData = (widget: Widget) => {
    if (!widget.fieldId) return [];

    const field = fields.find((f) => f.id === widget.fieldId);
    if (!field) return [];

    // Helper to get value
    const getValue = (row: any, fId: string) => {
      const val = row[fId];
      const rawVal = row[`raw_${fId}`];
      if (val === undefined || val === null || val === '') return null;

      if (typeof rawVal === 'boolean') return rawVal ? 'Sí' : 'No';
      return String(val);
    };

    // 2D Analysis (Stacked Bar or Heatmap)
    if (widget.secondaryFieldId) {
      const dataMap: Record<string, Record<string, number>> = {};
      const allStackKeys = new Set<string>();

      rows.forEach((row) => {
        const xKey = getValue(row, widget.fieldId!);
        const stackKey = getValue(row, widget.secondaryFieldId!);

        if (!xKey || !stackKey) return;

        allStackKeys.add(stackKey);
        if (!dataMap[xKey]) dataMap[xKey] = {};

        let val = 1;
        if (widget.valueFieldId) {
          const num = Number(row[`raw_${widget.valueFieldId}`]);
          val = isNaN(num) ? 0 : num;
        }

        // Operation defaults to SUM (or COUNT if val is 1)
        // If user wants AVG, we need more logic, but for now SUM/COUNT
        dataMap[xKey][stackKey] = (dataMap[xKey][stackKey] || 0) + val;
      });

      if (widget.type === 'CHART_HEATMAP') {
        // Flat list for heatmap: { x, y, value }
        const result: any[] = [];
        Object.entries(dataMap).forEach(([x, yObj]) => {
          Object.entries(yObj).forEach(([y, value]) => {
            result.push({ x, y, value });
          });
        });
        return result;
      }

      // For Stacked Bar: [{ name: 'X', SeriesA: 10, SeriesB: 20 }]
      const result = Object.entries(dataMap).map(([name, series]) => ({
        name,
        ...series,
      }));

      // Sort X axis
      result.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );

      return { data: result, keys: Array.from(allStackKeys) };
    }

    // 1D Analysis (Enhanced Distribution)
    // If valueFieldId is present, we sum that field grouped by fieldId
    if (widget.valueFieldId) {
      const groups: Record<string, number> = {};
      rows.forEach((row) => {
        const key = getValue(row, widget.fieldId!);
        if (!key) return;

        const num = Number(row[`raw_${widget.valueFieldId}`]);
        const val = isNaN(num) ? 0 : num;

        groups[key] = (groups[key] || 0) + val;
      });

      const result = Object.entries(groups).map(([name, value]) => ({
        name,
        value,
      }));
      // Sort
      if (widget.type === 'CHART_LINE' || widget.type === 'CHART_AREA') {
        result.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base',
          })
        );
      } else {
        result.sort((a, b) => b.value - a.value);
      }
      return result;
    }

    // Fallback to simple distribution (Count occurrences)
    return calculateDistribution(
      widget.fieldId,
      widget.type === 'CHART_LINE' ||
        widget.type === 'CHART_AREA' ||
        widget.type === 'TABLE'
    );
  };

  const renderWidgetContent = (widget: Widget, mini = false) => {
    // If it's a template (mini=true) and has no fieldId, show placeholder visualization
    if (mini && !widget.fieldId) {
      if (widget.type === 'STAT') {
        return (
          <div className="flex flex-col items-center justify-center h-16 opacity-50">
            <span className="text-xl font-bold text-primary">123</span>
          </div>
        );
      }
      if (widget.type === 'CHART_PERCENTAGE') {
        return (
          <div className="h-24 w-full opacity-50 flex items-center justify-center">
            <div className="relative w-16 h-16 rounded-full border-4 border-primary/30 flex items-center justify-center">
              <span className="text-xs font-bold">75%</span>
            </div>
          </div>
        );
      }
      if (widget.type === 'TABLE') {
        return (
          <div className="h-24 w-full opacity-50 flex items-center justify-center">
            <TableIcon className="h-10 w-10 text-muted-foreground/50" />
          </div>
        );
      }
      if (widget.type === 'CHART_HEATMAP') {
        return (
          <div className="h-24 w-full opacity-50 flex items-center justify-center">
            <HeatmapIcon className="h-10 w-10 text-muted-foreground/50" />
          </div>
        );
      }
      if (widget.type === 'CHART_BAR_STACKED') {
        return (
          <div className="h-24 w-full opacity-50 flex items-center justify-center">
            <StackedBarIcon className="h-10 w-10 text-muted-foreground/50" />
          </div>
        );
      }

      const dummyData = [
        { name: 'A', value: 40 },
        { name: 'B', value: 30 },
        { name: 'C', value: 20 },
        { name: 'D', value: 10 },
      ];

      if (widget.type === 'CHART_PIE') {
        return (
          <div className="h-24 w-full opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dummyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dummyData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      }
      if (widget.type === 'CHART_BAR') {
        return (
          <div className="h-24 w-full opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dummyData}>
                <Bar dataKey="value" fill="#8884d8">
                  {dummyData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }
      if (widget.type === 'CHART_LINE') {
        return (
          <div className="h-24 w-full opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      }
      if (widget.type === 'CHART_AREA') {
        return (
          <div className="h-24 w-full opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      }
      if (widget.type === 'CHART_FUNNEL') {
        return (
          <div className="h-24 w-full opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Funnel
                  data={dummyData}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  <LabelList
                    position="right"
                    fill="#000"
                    stroke="none"
                    dataKey="name"
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        );
      }
    }

    if (!widget.fieldId) {
      return (
        <div className="flex flex-col items-center justify-center h-32 space-y-2">
          <div className="text-sm text-muted-foreground text-center px-4">
            Selecciona un campo para visualizar los datos
          </div>
          <div className="w-full max-w-[200px] bg-muted/30 p-2 rounded text-center text-xs border border-dashed">
            Usa el selector arriba para conectar
          </div>
        </div>
      );
    }

    const field = fields.find((f) => f.id === widget.fieldId);
    if (!field) return <div className="text-xs">Campo no encontrado</div>;

    if (widget.type === 'STAT') {
      const { sum } = calculateStat(field.id);
      return (
        <div
          className={`flex flex-col items-center justify-center ${
            mini ? 'h-16' : 'h-32'
          }`}
        >
          <span
            className={`${
              mini ? 'text-xl' : 'text-4xl'
            } font-bold text-primary`}
          >
            {sum.toLocaleString()}
          </span>
          {!mini && (
            <span className="text-sm text-muted-foreground">
              Total Acumulado
            </span>
          )}
        </div>
      );
    }

    if (widget.type === 'TABLE') {
      const processed = processChartData(widget);
      const data = Array.isArray(processed) ? processed : [];
      const total = rows.length; // This total might be wrong if we are summing values?
      // If we are summing values (e.g. Total Offerings by Month), "rows.length" is just count of months.
      // We should sum the 'value' column of data for percentage calculation if valueFieldId is present.

      const sumValue = data.reduce((acc, curr) => acc + curr.value, 0);
      const denominator = widget.valueFieldId ? sumValue : total;

      return (
        <div className={`w-full overflow-auto ${mini ? 'h-24' : 'h-64'}`}>
          <table className="w-full text-sm">
            {!mini && (
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="p-2 text-left font-medium">Opción</th>
                  <th className="p-2 text-right font-medium">
                    {widget.valueFieldId ? 'Valor' : 'Cant.'}
                  </th>
                  <th className="p-2 text-right font-medium">%</th>
                </tr>
              </thead>
            )}
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="p-2 truncate max-w-[120px]">{item.name}</td>
                  <td className="p-2 text-right">
                    {item.value.toLocaleString()}
                  </td>
                  <td className="p-2 text-right text-muted-foreground">
                    {denominator > 0
                      ? ((item.value / denominator) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (widget.type === 'CHART_PERCENTAGE') {
      const processed = processChartData(widget);
      const data = Array.isArray(processed) ? processed : [];
      const total = data.reduce((acc, curr) => acc + curr.value, 0);
      const sortedData = [...data].sort((a, b) => b.value - a.value);
      const mainSegment = sortedData[0] || { name: 'N/A', value: 0 };
      const percentage =
        total > 0 ? Math.round((mainSegment.value / total) * 100) : 0;

      const donutData = [
        { name: mainSegment.name, value: mainSegment.value },
        { name: 'Otros', value: total - mainSegment.value },
      ];

      return (
        <div className={`${mini ? 'h-24' : 'h-64'} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={mini ? 25 : 60}
                outerRadius={mini ? 35 : 80}
                fill="#8884d8"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill={COLORS[0]} />
                <Cell fill="#e2e8f0" />
                <Label
                  value={`${percentage}%`}
                  position="center"
                  className="fill-foreground font-bold"
                  style={{ fontSize: mini ? '12px' : '24px' }}
                />
              </Pie>
              {!mini && <Tooltip />}
            </PieChart>
          </ResponsiveContainer>
          {!mini && (
            <div className="text-center text-sm text-muted-foreground mt-[-10px]">
              {mainSegment.name}
            </div>
          )}
        </div>
      );
    }

    if (widget.type === 'CHART_HEATMAP') {
      const processed = processChartData(widget);
      const data = Array.isArray(processed) ? processed : [];

      const xKeys = Array.from(new Set(data.map((d) => d.x))).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
      );
      const yKeys = Array.from(new Set(data.map((d) => d.y))).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
      );

      const maxValue = Math.max(...data.map((d) => d.value), 1);

      return (
        <div className={`w-full overflow-auto ${mini ? 'h-24' : 'h-64'}`}>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `auto repeat(${xKeys.length}, minmax(40px, 1fr))`,
            }}
          >
            <div className="p-2"></div>
            {xKeys.map((x) => (
              <div
                key={x}
                className="p-1 text-xs font-bold text-center truncate bg-muted/20 rounded"
              >
                {x}
              </div>
            ))}

            {yKeys.map((y) => (
              <React.Fragment key={y}>
                <div className="p-1 text-xs font-bold truncate flex items-center bg-muted/20 rounded px-2">
                  {y}
                </div>
                {xKeys.map((x) => {
                  const item = data.find((d) => d.x === x && d.y === y);
                  const val = item?.value || 0;
                  const opacity = val / maxValue;
                  return (
                    <div
                      key={`${x}-${y}`}
                      className="aspect-square rounded flex items-center justify-center text-[10px] relative group transition-colors"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${Math.max(
                          opacity * 0.8 + 0.1,
                          0.1
                        )})`,
                      }}
                    >
                      <span
                        className={
                          opacity > 0.5
                            ? 'text-white font-bold'
                            : 'text-foreground/70'
                        }
                      >
                        {val > 0 ? val : ''}
                      </span>
                      {!mini && val > 0 && (
                        <div className="absolute hidden group-hover:block z-50 bg-popover text-popover-foreground text-xs p-2 rounded shadow-md -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none border">
                          <div className="font-bold">{val}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {x} - {y}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }

    if (widget.type === 'CHART_BAR_STACKED') {
      const processed = processChartData(widget);
      const { data, keys } =
        !Array.isArray(processed) && processed
          ? processed
          : { data: [], keys: [] };

      return (
        <div className={`${mini ? 'h-24' : 'h-64'} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide={mini} />
              <YAxis hide={mini} />
              {!mini && <Tooltip />}
              {!mini && <Legend />}
              {keys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Charts that benefit from sorting by Key (e.g. Dates)
    if (widget.type === 'CHART_LINE' || widget.type === 'CHART_AREA') {
      // Use processChartData instead of calculateDistribution
      const processed = processChartData(widget);
      const data = Array.isArray(processed) ? processed : [];

      return (
        <div className={`${mini ? 'h-24' : 'h-64'} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            {widget.type === 'CHART_LINE' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide={mini} />
                <YAxis hide={mini} />
                {!mini && <Tooltip />}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            ) : (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide={mini} />
                <YAxis hide={mini} />
                {!mini && <Tooltip />}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      );
    }

    if (widget.type === 'CHART_FUNNEL') {
      // Funnel usually sorted by value descending
      const processed = processChartData(widget);
      const data = Array.isArray(processed) ? processed : [];

      return (
        <div className={`${mini ? 'h-24' : 'h-64'} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              {!mini && <Tooltip />}
              <Funnel data={data} dataKey="value">
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                {!mini && (
                  <LabelList
                    position="right"
                    fill="#000"
                    stroke="none"
                    dataKey="name"
                  />
                )}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (widget.type === 'CHART_PIE' || widget.type === 'CHART_BAR') {
      const processed = processChartData(widget);
      const data = Array.isArray(processed) ? processed : [];
      return (
        <div className={`${mini ? 'h-24' : 'h-64'} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            {widget.type === 'CHART_PIE' ? (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={mini ? 30 : 80}
                  fill="#8884d8"
                  dataKey="value"
                  label={
                    mini
                      ? undefined
                      : ({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                {!mini && <Tooltip />}
              </PieChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide={mini} />
                <YAxis hide={mini} />
                {!mini && <Tooltip />}
                <Bar dataKey="value" fill="#8884d8">
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      );
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const dashboardContent = dashboardRows
      .map((row) => {
        if (row.widgets.length === 0) return '';

        const rowWidgetsHtml = row.widgets
          .map((widget) => {
            if (!widget) return '';
            if (!widget.fieldId) return ''; // Skip unconnected widgets
            const field = fields.find((f) => f.id === widget.fieldId);
            if (!field) return '';

            if (widget.type === 'STAT') {
              const { sum } = calculateStat(field.id);
              return `
            <div class="card">
              <h3>${widget.title}</h3>
              <div class="stat-value">${sum.toLocaleString()}</div>
              <div class="stat-label">Total Acumulado</div>
            </div>
          `;
            }

            // Handle all other types using processChartData
            const processed = processChartData(widget);

            // 2D Data (Heatmap / Stacked)
            if (widget.secondaryFieldId) {
              if (widget.type === 'CHART_HEATMAP') {
                const data = Array.isArray(processed) ? processed : [];
                const rowsHtml = data
                  .map(
                    (d) => `
                        <tr>
                            <td>${d.x}</td>
                            <td>${d.y}</td>
                            <td>${d.value}</td>
                        </tr>
                    `
                  )
                  .join('');
                return `
                        <div class="card">
                          <h3>${widget.title}</h3>
                          <table>
                            <thead><tr><th>${
                              field.label || field.key
                            }</th><th>Eje Y</th><th>Valor</th></tr></thead>
                            <tbody>${rowsHtml}</tbody>
                          </table>
                        </div>`;
              }

              if (widget.type === 'CHART_BAR_STACKED') {
                const { data, keys } =
                  !Array.isArray(processed) && processed
                    ? processed
                    : { data: [], keys: [] };
                const headers =
                  `<th>${field.label || field.key}</th>` +
                  keys.map((k: string) => `<th>${k}</th>`).join('');
                const rowsHtml = data
                  .map(
                    (d: any) => `
                        <tr>
                            <td>${d.name}</td>
                            ${keys
                              .map((k: string) => `<td>${d[k] || 0}</td>`)
                              .join('')}
                        </tr>
                    `
                  )
                  .join('');
                return `
                        <div class="card">
                          <h3>${widget.title}</h3>
                          <table>
                            <thead><tr>${headers}</tr></thead>
                            <tbody>${rowsHtml}</tbody>
                          </table>
                        </div>`;
              }
            }

            // 1D Data
            const data = Array.isArray(processed) ? processed : [];
            const total = data.reduce((acc, curr) => acc + curr.value, 0);

            if (widget.type === 'CHART_PERCENTAGE') {
              const sortedData = [...data].sort((a, b) => b.value - a.value);
              const mainSegment = sortedData[0] || { name: 'N/A', value: 0 };
              const percentage =
                total > 0 ? Math.round((mainSegment.value / total) * 100) : 0;

              return `
                    <div class="card">
                    <h3>${widget.title}</h3>
                    <div class="stat-value">${percentage}%</div>
                    <div class="stat-label">${mainSegment.name}</div>
                    </div>
                `;
            } else {
              // For all chart types (Line, Area, Bar, Pie, Funnel, Table), print a table
              const rowsHtml = data
                .map(
                  (d) => `
            <tr>
              <td>${d.name}</td>
              <td>${d.value.toLocaleString()}</td>
              <td>${total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%</td>
            </tr>
          `
                )
                .join('');

              return `
            <div class="card">
              <h3>${widget.title}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Opción</th>
                    <th>${widget.valueFieldId ? 'Valor' : 'Cantidad'}</th>
                    <th>Porcentaje</th>
                  </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
              </table>
            </div>
          `;
            }
          })
          .join('');

        return `
          <div class="row" style="grid-template-columns: repeat(${row.columns}, 1fr);">
            ${rowWidgetsHtml}
          </div>
        `;
      })
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte Dashboard - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 2rem; color: #1e293b; }
            h1 { text-align: center; margin-bottom: 2rem; }
            .row { display: grid; gap: 1rem; margin-bottom: 1rem; }
            .card { border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 0.5rem; break-inside: avoid; }
            h3 { margin-top: 0; font-size: 1.1rem; color: #64748b; }
            .stat-value { font-size: 2.5rem; font-weight: bold; color: #0f172a; text-align: center; }
            .stat-label { text-align: center; color: #64748b; font-size: 0.875rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { text-align: left; padding: 0.5rem; border-bottom: 1px solid #e2e8f0; }
            th { font-size: 0.875rem; color: #64748b; }
            @media print {
              .card { break-inside: avoid; }
              .row { display: grid !important; }
            }
          </style>
        </head>
        <body>
          <h1>Reporte Dashboard</h1>
          ${dashboardContent}
          <script>
            window.onload = () => {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isClient) return <div>Cargando dashboard...</div>;

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/20 p-4 rounded-lg border border-dashed gap-4">
          <div>
            <h3 className="font-semibold">Vista Previa del Reporte</h3>
            <p className="text-sm text-muted-foreground">
              Así es como se verá el reporte final.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Imprimir / PDF
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsPreview(false)}
            >
              <Pencil className="mr-2 h-4 w-4" /> Editar Dashboard
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {dashboardRows.map((row) => (
            <div
              key={row.id}
              className={`grid gap-4 ${
                row.columns === 1
                  ? 'grid-cols-1'
                  : row.columns === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : row.columns === 3
                  ? 'grid-cols-1 md:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-4'
              }`}
            >
              {row.widgets.map((widget) => {
                // Skip unconnected widgets in preview
                if (!widget || !widget.fieldId) return null;
                return (
                  <Card key={widget.id} className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">
                        {widget.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {renderWidgetContent(widget)}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))}
          {dashboardRows.length === 0 && (
            <div className="text-center py-12 border rounded-xl">
              <p className="text-muted-foreground">
                No hay contenido para mostrar.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/20 p-4 rounded-lg border border-dashed gap-4">
        <div>
          <h3 className="font-semibold">Constructor de Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Arrastra widgets desde el panel lateral hacia el área de diseño.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(true)}
          >
            <Eye className="mr-2 h-4 w-4" /> Vista Previa
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir / PDF
          </Button>
          <Button variant="secondary" size="sm" onClick={addRow}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Fila
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-6 lg:self-start">
            <Card className="h-full border-muted-foreground/20 bg-muted/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Widgets Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 max-h-[calc(100vh-100px)] overflow-y-auto">
                <Droppable droppableId="sidebar" type="WIDGET">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-2 min-h-[100px] p-2 rounded-md transition-colors ${
                        snapshot.isDraggingOver ? 'bg-primary/10' : ''
                      }`}
                    >
                      {availableWidgets.map((widget, index) => (
                        <Draggable
                          key={widget.id}
                          draggableId={widget.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <Card
                                className={`cursor-move transition-shadow hover:shadow-md ${
                                  snapshot.isDragging
                                    ? 'shadow-xl ring-2 ring-primary'
                                    : ''
                                }`}
                              >
                                <CardContent className="p-3">
                                  <div
                                    className="text-xs font-semibold mb-2 truncate"
                                    title={widget.title}
                                  >
                                    {widget.title}
                                  </div>
                                  <div className="pointer-events-none opacity-80 scale-90 origin-top-left w-[110%]">
                                    {renderWidgetContent(widget, true)}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {dashboardRows.map((row) => (
              <div
                key={row.id}
                className="border rounded-lg p-4 bg-background/50 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Fila de Contenido
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Columnas:
                    </span>
                    <Select
                      value={row.columns.toString()}
                      onValueChange={(val) =>
                        updateRowColumns(row.id, parseInt(val))
                      }
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeRow(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  {/* Background Grid (Empty Slots) */}
                  <div
                    className={`absolute inset-0 grid gap-4 p-2 pointer-events-none ${
                      row.columns === 1
                        ? 'grid-cols-1'
                        : row.columns === 2
                        ? 'grid-cols-1 md:grid-cols-2'
                        : row.columns === 3
                        ? 'grid-cols-1 md:grid-cols-3'
                        : 'grid-cols-1 md:grid-cols-4'
                    }`}
                  >
                    {Array.from({ length: row.columns }).map((_, i) => (
                      <div
                        key={`bg-empty-${row.id}-${i}`}
                        className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20 min-h-[120px]"
                      >
                        {i === 0 && row.widgets.length === 0 ? (
                          <>
                            <Plus className="h-8 w-8 mb-2 opacity-20" />
                            <span className="text-xs">
                              Arrastra un widget aquí
                            </span>
                          </>
                        ) : (
                          <span className="text-xs opacity-20">
                            Espacio Disponible
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Foreground Droppable */}
                  <div
                    className={`relative grid gap-4 p-2 pointer-events-none ${
                      row.columns === 1
                        ? 'grid-cols-1'
                        : row.columns === 2
                        ? 'grid-cols-1 md:grid-cols-2'
                        : row.columns === 3
                        ? 'grid-cols-1 md:grid-cols-3'
                        : 'grid-cols-1 md:grid-cols-4'
                    }`}
                  >
                    {row.widgets.map((widget, index) => (
                      <div
                        key={`slot-${row.id}-${index}`}
                        className="h-full relative pointer-events-auto"
                      >
                        <Droppable
                          droppableId={`${row.id}-slot-${index}`}
                          type="WIDGET"
                        >
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`min-h-[120px] h-full w-full rounded-lg transition-colors ${
                                snapshot.isDraggingOver
                                  ? 'bg-primary/20 ring-2 ring-primary'
                                  : ''
                              }`}
                            >
                              {widget ? (
                                <Draggable
                                  key={widget.id}
                                  draggableId={widget.id}
                                  index={0}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        height: '100%',
                                      }}
                                    >
                                      <Card
                                        className={`h-full transition-shadow ${
                                          snapshot.isDragging
                                            ? 'shadow-xl ring-2 ring-primary relative z-50'
                                            : ''
                                        } ${
                                          !widget.fieldId ? 'border-dashed' : ''
                                        }`}
                                      >
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <div className="flex items-center gap-2">
                                            <div
                                              {...provided.dragHandleProps}
                                              className="cursor-move p-1 hover:bg-muted rounded"
                                            >
                                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <CardTitle className="text-base font-medium">
                                              {widget.title}
                                            </CardTitle>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            {/* If unconnected, we prioritize showing the connection mechanism, but here we can select type too */}
                                            {widget.fieldId ? (
                                              <Select
                                                value={widget.type}
                                                onValueChange={(val) => {
                                                  const newRows = [
                                                    ...dashboardRows,
                                                  ];
                                                  const currentRow =
                                                    newRows.find(
                                                      (r) => r.id === row.id
                                                    );
                                                  if (currentRow) {
                                                    const widgetIndex = index;
                                                    if (
                                                      widgetIndex !== -1 &&
                                                      currentRow.widgets[
                                                        widgetIndex
                                                      ]
                                                    ) {
                                                      currentRow.widgets[
                                                        widgetIndex
                                                      ]!.type =
                                                        val as WidgetType;
                                                      setDashboardRows(newRows);
                                                    }
                                                  }
                                                }}
                                              >
                                                <SelectTrigger className="h-8 w-[110px] text-xs">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="STAT">
                                                    Tarjeta
                                                  </SelectItem>
                                                  <SelectItem value="CHART_PIE">
                                                    Pastel
                                                  </SelectItem>
                                                  <SelectItem value="CHART_BAR">
                                                    Barras
                                                  </SelectItem>
                                                  <SelectItem value="CHART_PERCENTAGE">
                                                    Porcentaje
                                                  </SelectItem>
                                                  <SelectItem value="CHART_LINE">
                                                    Líneas
                                                  </SelectItem>
                                                  <SelectItem value="CHART_AREA">
                                                    Áreas
                                                  </SelectItem>
                                                  <SelectItem value="CHART_FUNNEL">
                                                    Embudo
                                                  </SelectItem>
                                                  <SelectItem value="CHART_HEATMAP">
                                                    Mapa de Calor
                                                  </SelectItem>
                                                  <SelectItem value="CHART_BAR_STACKED">
                                                    Barras Apiladas
                                                  </SelectItem>
                                                  <SelectItem value="TABLE">
                                                    Tabla
                                                  </SelectItem>
                                                </SelectContent>
                                              </Select>
                                            ) : (
                                              <div className="flex items-center text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                                                <LinkIcon className="w-3 h-3 mr-1" />
                                                Sin conectar
                                              </div>
                                            )}

                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8 text-destructive hover:text-destructive"
                                              onClick={() =>
                                                removeWidget(row.id, widget.id)
                                              }
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </CardHeader>
                                        <CardContent className="pt-4 flex flex-col h-full gap-2">
                                          <div className="space-y-2 bg-muted/20 p-2 rounded text-xs shrink-0">
                                            {/* Primary Field */}
                                            <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                                              <label className="text-muted-foreground font-medium truncate">
                                                Principal
                                              </label>
                                              <Select
                                                value={widget.fieldId || ''}
                                                onValueChange={(val) =>
                                                  updateWidgetConfig(
                                                    row.id,
                                                    widget.id,
                                                    { fieldId: val }
                                                  )
                                                }
                                              >
                                                <SelectTrigger className="h-6 text-xs w-full">
                                                  <SelectValue placeholder="Seleccionar..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {fields.map((field) => (
                                                    <SelectItem
                                                      key={field.id}
                                                      value={field.id}
                                                    >
                                                      {field.label || field.key}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            </div>

                                            {/* Secondary Field */}
                                            {(widget.type === 'CHART_HEATMAP' ||
                                              widget.type ===
                                                'CHART_BAR_STACKED') && (
                                              <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                                                <label className="text-muted-foreground font-medium truncate">
                                                  {widget.type ===
                                                  'CHART_HEATMAP'
                                                    ? 'Eje Y'
                                                    : 'Agrupar'}
                                                </label>
                                                <Select
                                                  value={
                                                    widget.secondaryFieldId ||
                                                    ''
                                                  }
                                                  onValueChange={(val) =>
                                                    updateWidgetConfig(
                                                      row.id,
                                                      widget.id,
                                                      { secondaryFieldId: val }
                                                    )
                                                  }
                                                >
                                                  <SelectTrigger className="h-6 text-xs w-full">
                                                    <SelectValue placeholder="Seleccionar..." />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {fields.map((field) => (
                                                      <SelectItem
                                                        key={field.id}
                                                        value={field.id}
                                                      >
                                                        {field.label ||
                                                          field.key}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            )}

                                            {/* Value Field */}
                                            {widget.type !== 'STAT' && (
                                              <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                                                <label className="text-muted-foreground font-medium truncate">
                                                  Valor
                                                </label>
                                                <Select
                                                  value={
                                                    widget.valueFieldId ||
                                                    'count'
                                                  }
                                                  onValueChange={(val) =>
                                                    updateWidgetConfig(
                                                      row.id,
                                                      widget.id,
                                                      {
                                                        valueFieldId:
                                                          val === 'count'
                                                            ? undefined
                                                            : val,
                                                      }
                                                    )
                                                  }
                                                >
                                                  <SelectTrigger className="h-6 text-xs w-full">
                                                    <SelectValue placeholder="Contar" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="count">
                                                      Contar Registros
                                                    </SelectItem>
                                                    {fields
                                                      .filter(
                                                        (f) =>
                                                          f.type === 'NUMBER' ||
                                                          f.type === 'CURRENCY'
                                                      )
                                                      .map((f) => (
                                                        <SelectItem
                                                          key={f.id}
                                                          value={f.id}
                                                        >
                                                          Sumar{' '}
                                                          {f.label || f.key}
                                                        </SelectItem>
                                                      ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            )}
                                          </div>

                                          <div className="flex-1 min-h-0 overflow-hidden">
                                            {renderWidgetContent(widget)}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </Draggable>
                              ) : (
                                <div className="h-full w-full" />
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {dashboardRows.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <Button onClick={addRow}>
                  <Plus className="mr-2 h-4 w-4" /> Crear Primera Fila
                </Button>
              </div>
            )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
