"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import type { TableColumn, TableAction } from "@/types";
import { useNotificationStore } from "@/store/NotificationStore";
import { deleteReportEntryAction } from "@/app/(authenticated)/reports/actions/reports.actions";

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
};

export default function ReportEntriesTable({
  rows,
  columns,
  title = "Entradas del reporte",
  subTitle,
}: ReportEntriesTableProps) {
  const router = useRouter();
  const { showSuccess, showError } = useNotificationStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<Row | null>(null);

  const actions: TableAction<Row>[] = useMemo(
    () => [
      {
        label: "Eliminar",
        variant: "error",
        onClick: (row) => {
          setEntryToDelete(row);
          setIsDeleteModalOpen(true);
        },
      },
    ],
    []
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
        data={rows}
        title={title}
        subTitle={subTitle ?? `Total: ${rows.length}`}
        columns={columns}
        actions={actions}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
        emptyMessage="Sin entradas"
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
