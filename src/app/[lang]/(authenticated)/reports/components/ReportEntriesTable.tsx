'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import type { TableColumn, TableAction } from '@/types';
import { useNotificationStore } from '@/store/NotificationStore';
import {
  deleteReportEntryAction,
  deleteReportEntriesAction,
} from '@/app/[lang]/(authenticated)/reports/actions/reports.actions';
import { RiFilter3Line, RiDeleteBinLine } from 'react-icons/ri';
import { RefreshCcw } from 'lucide-react';
import AdvancedFilterModal, { FilterField } from './AdvancedFilterModal';
import { usePersistentFilters } from '@/hooks/usePersistentFilters';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Custom hook for scoped column visibility
function useReportColumnVisibility(
  reportId: string,
  defaultColumns: TableColumn<Row>[]
) {
  const key = `report-column-visibility-${reportId}`;

  // Initialize state with all columns visible by default
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    // We can try to load from localStorage synchronously here for initial render
    // to avoid flash, but strict mode might complain.
    // However, in client components it's often acceptable or we use useEffect.
    // For simplicity and safety against SSR mismatch, we start with all valid.
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Filter out keys that are no longer in defaultColumns
            const validKeys = new Set(defaultColumns.map((c) => String(c.key)));
            const filtered = parsed.filter((k) => validKeys.has(k));
            // If stored is empty or invalid, fallback to all?
            // No, if user hid all, it should be empty.
            // But if new columns appeared, we might want to show them?
            // For now, let's just use what's stored if valid keys exist,
            // or if it was intentionally empty.
            // Actually, if we want to support "new columns show up by default",
            // we would need more complex logic.
            // Let's stick to: if stored exists, use it (filtered by validity).
            return new Set(filtered);
          }
        }
      } catch (e) {
        console.error('Failed to parse column visibility', e);
      }
    }
    return new Set(defaultColumns.map((col) => String(col.key)));
  });

  // Sync with localStorage when visibleColumns changes
  // We don't need to sync on mount because we read on init (if client).
  // But we need to ensure we save updates.

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

  const showAllColumns = (columnKeys: string[]) => {
    const next = new Set(columnKeys);
    setVisibleColumns(next);
    saveToStorage(next);
  };

  const hideAllColumns = (columnKeys: string[]) => {
    // Keep at least one or allow empty?
    // The store implementation kept 'firstName' if present.
    // Here we can just allow empty or keep 'entidad'.
    const next = new Set<string>();
    // Optional: keep 'entidad' visible always?
    if (columnKeys.includes('entidad')) {
      next.add('entidad');
    }
    setVisibleColumns(next);
    saveToStorage(next);
  };

  return {
    visibleColumns,
    toggleColumn,
    showAllColumns,
    hideAllColumns,
  };
}

type Row = Record<string, unknown> & {
  id: string;
  createdAt: string;
  entidad: string;
};

type ReportEntriesTableProps = {
  rows: Row[];
  columns: TableColumn<Row>[];
  title?: string;
  subTitle?: string;
  reportId: string;
  fields?: FilterField[];
};

const parseLocalFilterDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export default function ReportEntriesTable({
  rows,
  columns,
  title = 'Entradas del reporte',
  subTitle,
  reportId,
  fields = [],
}: ReportEntriesTableProps) {
  const router = useRouter();

  // Auto-refresh on window focus
  useRefreshOnFocus();

  const { showSuccess, showError } = useNotificationStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<Row | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(rows.map((r) => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const {
    filters: activeFilters,
    setFilters: setActiveFilters,
    clearFilters,
  } = usePersistentFilters<Record<string, any>>(
    `report-filters-${reportId}`,
    {}
  );

  // Column visibility state (scoped to report)
  const { visibleColumns, toggleColumn, showAllColumns, hideAllColumns } =
    useReportColumnVisibility(reportId, columns);

  // NOTE: Removed global store usage to prevent state conflicts between tables
  // and incorrect column counts (e.g. 13/8).

  // Enhance columns with custom renderers based on field types
  const enhancedColumns = useMemo(() => {
    return columns.map((col) => {
      const fieldDef = fields.find((f) => f.id === col.key);

      if (fieldDef?.type === 'FRIEND_REGISTRATION') {
        return {
          ...col,
          render: (value: any) => {
            if (!Array.isArray(value) || value.length === 0) {
              return <span className="text-muted-foreground">-</span>;
            }

            return (
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="cursor-help whitespace-nowrap"
                    >
                      {value.length} amigo{value.length !== 1 ? 's' : ''}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="p-0">
                    <div className="flex flex-col max-h-[300px] overflow-y-auto min-w-[200px]">
                      <div className="bg-muted/50 px-3 py-2 text-xs font-medium border-b">
                        Amigos Registrados
                      </div>
                      <div className="p-2 space-y-2">
                        {value.map((friend: any, i: number) => (
                          <div
                            key={i}
                            className="text-sm border-b last:border-0 pb-2 last:pb-0"
                          >
                            <div className="font-medium">
                              {friend.firstName} {friend.lastName}
                            </div>
                            {friend.phone && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <span>📱</span> {friend.phone}
                              </div>
                            )}
                            {friend.spiritualFatherId && (
                              <div className="text-xs text-primary font-bold mt-1">
                                PE:{' '}
                                {friend.spiritualFatherName || 'Cargando...'}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          },
        };
      }

      if (fieldDef?.type === 'MEMBER_SELECT') {
        return {
          ...col,
          render: (value: any) => {
            if (!Array.isArray(value) || value.length === 0) {
              return <span className="text-muted-foreground">-</span>;
            }

            return (
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="cursor-help whitespace-nowrap border-primary/30 text-primary"
                    >
                      {value.length} miembro{value.length !== 1 ? 's' : ''}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="p-0">
                    <div className="flex flex-col max-h-[300px] overflow-y-auto min-w-[180px]">
                      <div className="bg-primary/5 px-3 py-2 text-xs font-bold text-primary border-b">
                        Miembros Seleccionados
                      </div>
                      <div className="p-2 space-y-1">
                        {value.map((name: string, i: number) => {
                          const isSpecialRole =
                            name.includes('(Líder)') ||
                            name.includes('(Asistente)') ||
                            name.includes('(Anfitrión)');

                          return (
                            <div
                              key={i}
                              className={`text-sm px-2 py-1.5 rounded-md hover:bg-muted transition-colors ${
                                isSpecialRole
                                  ? 'text-primary font-semibold bg-primary/5'
                                  : ''
                              }`}
                            >
                              {name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          },
        };
      }
      return col;
    });
  }, [columns, fields]);

  // Filter columns based on visibility
  const visibleColumnsArray = useMemo(() => {
    return enhancedColumns.filter((column) =>
      visibleColumns.has(String(column.key))
    );
  }, [enhancedColumns, visibleColumns]);

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
        // Normalize time for comparison
        rowDate.setHours(0, 0, 0, 0);
        if (rowDate < filterDate) return false;
      }
      if (activeFilters.createdAt_to) {
        const rowDate = new Date(row.raw_createdAt as string);
        const filterDate = parseLocalFilterDate(activeFilters.createdAt_to);
        // Normalize time
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

  const actions: TableAction<Row>[] = useMemo(
    () => [
      {
        label: 'Ver',
        variant: 'ghost',
        onClick: (row) => {
          router.push(`/reports/${reportId}/entries/${row.id}`);
        },
      },
      {
        label: 'Editar',
        variant: 'ghost',
        onClick: (row) => {
          router.push(`/reports/${reportId}/entries/${row.id}/edit`);
        },
      },
      {
        label: 'Eliminar',
        variant: 'error',
        onClick: (row) => {
          setEntryToDelete(row);
          setIsDeleteModalOpen(true);
        },
      },
    ],
    [reportId, router]
  );

  const handleConfirmDelete = async () => {
    if (entryToDelete) {
      try {
        setIsDeleting(true);
        const formData = new FormData();
        formData.set('id', String(entryToDelete.id));
        await deleteReportEntryAction(formData);
        showSuccess('Entrada eliminada exitosamente');
        setIsDeleteModalOpen(false);
        setEntryToDelete(null);
        router.refresh();
      } catch (error) {
        console.error('Error al eliminar entrada de reporte:', error);
        showError('Error al eliminar la entrada');
      } finally {
        setIsDeleting(false);
      }
    } else if (selectedRows.size > 0) {
      try {
        setIsDeleting(true);
        await deleteReportEntriesAction(Array.from(selectedRows));
        showSuccess(`${selectedRows.size} entradas eliminadas exitosamente`);
        setIsBulkDeleteModalOpen(false);
        setSelectedRows(new Set());
        router.refresh();
      } catch (error) {
        console.error('Error al eliminar entradas de reporte:', error);
        showError('Error al eliminar las entradas');
      } finally {
        setIsDeleting(false);
      }
    }
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
    if (selectedPeriod === period) {
      // Optional: Toggle off logic could go here
      applyFilter(selectedYear, filterType, period);
    } else {
      applyFilter(selectedYear, filterType, period);
    }
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

  return (
    <div>
      <DataTable<Row>
        selectable={true}
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        data={filteredRows}
        title={title}
        subTitle={subTitle ?? `Total: ${filteredRows.length}`}
        columns={visibleColumnsArray}
        actions={actions}
        addButton={
          selectedRows.size > 0
            ? {
                text: `Eliminar (${selectedRows.size})`,
                onClick: () => setIsBulkDeleteModalOpen(true),
                variant: 'destructive',
                icon: <RiDeleteBinLine className="w-4 h-4 mr-2" />,
              }
            : undefined
        }
        searchable={true}
        pagination={true}
        itemsPerPage={10}
        emptyMessage="Sin entradas que coincidan con los filtros"
        // Props for column visibility
        allColumns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onShowAllColumns={showAllColumns}
        onHideAllColumns={hideAllColumns}
        showColumnVisibility={true}
        searchEndContent={
          <div className="space-y-2 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      onClick={() => router.refresh()}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Actualizar datos</TooltipContent>
                </Tooltip>
              </TooltipProvider>

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
        }
      />

      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setActiveFilters}
        onClear={clearFilters}
        fields={fields}
        activeFilters={activeFilters}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        entityName={entryToDelete ? `${entryToDelete.entidad}` : undefined}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEntryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />

      <DeleteConfirmationModal
        open={isBulkDeleteModalOpen}
        entityName={`${selectedRows.size} entradas seleccionadas`}
        onCancel={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
}
