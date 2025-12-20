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
          <div className="tooltip" data-tip="Filtros avanzados">
            <button
              className={`btn btn-square ${
                Object.keys(activeFilters).length > 0
                  ? "btn-primary"
                  : "btn-ghost bg-base-200"
              }`}
              onClick={() => setIsFilterModalOpen(true)}
            >
              <RiFilter3Line className="w-5 h-5" />
            </button>
            {Object.keys(activeFilters).length > 0 && (
              <div className="absolute -top-1 -right-1 badge badge-xs badge-secondary w-4 h-4 p-0 flex items-center justify-center animate-pulse">
                !
              </div>
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
