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
        const filterDate = new Date(activeFilters.createdAt_from);
        // Normalize time for comparison
        rowDate.setHours(0, 0, 0, 0);
        filterDate.setHours(0, 0, 0, 0);
        if (rowDate < filterDate) return false;
      }
      if (activeFilters.createdAt_to) {
        const rowDate = new Date(row.raw_createdAt as string);
        const filterDate = new Date(activeFilters.createdAt_to);
        // Normalize time
        rowDate.setHours(0, 0, 0, 0);
        filterDate.setHours(0, 0, 0, 0);
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
              const fromDate = new Date(from);
              fromDate.setHours(0, 0, 0, 0);
              if (dateVal < fromDate) return false;
            }
            if (to) {
              const toDate = new Date(to);
              toDate.setHours(0, 0, 0, 0);
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
        columns={columns}
        actions={actions}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
        emptyMessage="Sin entradas que coincidan con los filtros"
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
