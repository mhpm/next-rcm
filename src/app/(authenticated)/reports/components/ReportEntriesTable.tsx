"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import type { TableColumn, TableAction } from "@/types";
import { useNotificationStore } from "@/store/NotificationStore";
import { deleteReportEntryAction } from "@/app/(authenticated)/reports/actions/reports.actions";
import { RiFilter3Line } from "react-icons/ri";
import AdvancedFilterModal, { FilterField } from "./AdvancedFilterModal";
import { usePersistentFilters } from "@/hooks/usePersistentFilters";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    if (typeof window !== "undefined") {
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
        console.error("Failed to parse column visibility", e);
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
    if (columnKeys.includes("entidad")) {
      next.add("entidad");
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
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function ReportEntriesTable({
  rows,
  columns,
  title = "Entradas del reporte",
  subTitle,
  reportId,
  fields = [],
}: ReportEntriesTableProps) {
  const router = useRouter();

  const { showSuccess, showError } = useNotificationStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<Row | null>(null);

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

  // Filter columns based on visibility
  const visibleColumnsArray = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(String(column.key)));
  }, [columns, visibleColumns]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Entidad
      if (
        activeFilters.entidad &&
        !String(row.entidad || "")
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

        if (field.type === "TEXT" && activeFilters[field.id]) {
          if (
            !String(rawVal || "")
              .toLowerCase()
              .includes(activeFilters[field.id].toLowerCase())
          )
            return false;
        }

        if (field.type === "NUMBER" || field.type === "CURRENCY") {
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

        if (field.type === "BOOLEAN" && activeFilters[field.id]) {
          const filterVal = activeFilters[field.id] === "true";
          if (rawVal !== filterVal) return false;
        }

        if (field.type === "DATE") {
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

        if (field.type === "SELECT" && activeFilters[field.id]) {
          if (rawVal !== activeFilters[field.id]) return false;
        }
      }

      return true;
    });
  }, [rows, activeFilters, fields]);

  const actions: TableAction<Row>[] = useMemo(
    () => [
      {
        label: "Ver",
        variant: "ghost",
        onClick: (row) => {
          router.push(`/reports/${reportId}/entries/${row.id}`);
        },
      },
      {
        label: "Editar",
        variant: "ghost",
        onClick: (row) => {
          router.push(`/reports/${reportId}/entries/${row.id}/edit`);
        },
      },
      {
        label: "Eliminar",
        variant: "error",
        onClick: (row) => {
          setEntryToDelete(row);
          setIsDeleteModalOpen(true);
        },
      },
    ],
    [reportId, router]
  );

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    try {
      setIsDeleting(true);
      const formData = new FormData();
      formData.set("id", String(entryToDelete.id));
      await deleteReportEntryAction(formData);
      showSuccess("Entrada eliminada exitosamente");
      setIsDeleteModalOpen(false);
      setEntryToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar entrada de reporte:", error);
      showError("Error al eliminar la entrada");
    } finally {
      setIsDeleting(false);
    }
  };

  // Period Filter Logic
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [filterType, setFilterType] = useState<
    "year" | "cuatrimestre" | "trimestre" | "month"
  >("cuatrimestre");
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
          setFilterType("year");
          setSelectedPeriod(null);
        } else if (toMonth - fromMonth + 1 === 4) {
          setFilterType("cuatrimestre");
          // 0-3 (1), 4-7 (2), 8-11 (3)
          if (fromMonth === 0) setSelectedPeriod(1);
          else if (fromMonth === 4) setSelectedPeriod(2);
          else if (fromMonth === 8) setSelectedPeriod(3);
        } else if (toMonth - fromMonth + 1 === 3) {
          setFilterType("trimestre");
          // 0-2 (1), 3-5 (2), 6-8 (3), 9-11 (4)
          if (fromMonth === 0) setSelectedPeriod(1);
          else if (fromMonth === 3) setSelectedPeriod(2);
          else if (fromMonth === 6) setSelectedPeriod(3);
          else if (fromMonth === 9) setSelectedPeriod(4);
        } else if (fromMonth === toMonth) {
          setFilterType("month");
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
    type: "year" | "cuatrimestre" | "trimestre" | "month"
  ) => {
    setFilterType(type);
    setSelectedPeriod(null); // Reset period selection
    if (type === "year") {
      applyFilter(selectedYear, "year", null);
    }
  };

  const applyFilter = (year: number, type: string, period: number | null) => {
    let fromMonth = 0,
      toMonth = 11,
      lastDay = 31;

    if (type === "year") {
      fromMonth = 0;
      toMonth = 11;
      lastDay = 31;
    } else if (type === "cuatrimestre" && period !== null) {
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
    } else if (type === "trimestre" && period !== null) {
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
    } else if (type === "month" && period !== null) {
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
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
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
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <div>
      <DataTable<Row>
        data={filteredRows}
        title={title}
        subTitle={subTitle ?? `Total: ${filteredRows.length}`}
        columns={visibleColumnsArray}
        actions={actions}
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
          <div className="flex items-start gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={
                      Object.keys(activeFilters).length > 0 ? "default" : "outline"
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
              <SelectTrigger className="w-64">
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
            <Select value={filterType} onValueChange={(v) => handleTypeChange(v as any)}>
              <SelectTrigger className="w-56">
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
            {filterType === "cuatrimestre" && (
              <div className="flex mr-8">
                {[1, 2, 3].map((q) => (
                  <Button
                    key={q}
                    type="button"
                    variant={selectedPeriod === q ? "default" : "outline"}
                    className={`h-10 rounded-none ${
                      q === 1 ? "rounded-l-md" : ""
                    } ${q === 3 ? "rounded-r-md" : ""}`}
                    onClick={() => handlePeriodClick(q)}
                  >
                    {q}º C
                  </Button>
                ))}
              </div>
            )}

            {filterType === "trimestre" && (
              <div className="flex mr-10">
                {[1, 2, 3, 4].map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={selectedPeriod === t ? "default" : "outline"}
                    className={`h-10 rounded-none ${
                      t === 1 ? "rounded-l-md" : ""
                    } ${t === 4 ? "rounded-r-md" : ""}`}
                    onClick={() => handlePeriodClick(t)}
                  >
                    {t}º T
                  </Button>
                ))}
              </div>
            )}

            {filterType === "month" && (
              <Select
                value={selectedPeriod !== null ? String(selectedPeriod) : ""}
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
    </div>
  );
}
