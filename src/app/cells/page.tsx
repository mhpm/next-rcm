"use client";

import { useRouter } from "next/navigation";
import { RiAddLine } from "react-icons/ri";
import { BackLink, Breadcrumbs, DataTable } from "@/components";
import { TableColumn, AddButtonConfig, TableAction } from "@/types";
import { useCells, useDeleteCell } from "./hooks/useCells";
import { transformCellsToTableData } from "./utils/cellsUtils";
import { CellTableData } from "./types/cells";
import { useState } from "react";
import { Modal } from "@/components/Modal/Modal";
import { useNotificationStore } from "@/store/NotificationStore";

export default function CellsPage() {
  const router = useRouter();
  const { showSuccess, showError } = useNotificationStore();

  const { data, isLoading: loading, error, refetch } = useCells({
    limit: 50,
    orderBy: "name",
    orderDirection: "asc",
  });

  const cells = data?.cells ? transformCellsToTableData(data.cells) : [];

  const columns: TableColumn<CellTableData>[] = [
    { key: "name", label: "Nombre", sortable: true, className: "font-semibold" },
    { key: "sectorName", label: "Sector", sortable: true },
    { key: "leaderName", label: "Líder", sortable: true },
    { key: "hostName", label: "Anfitrión", sortable: true },
    { key: "memberCount", label: "Miembros", sortable: true, className: "text-center font-semibold" },
  ];

  const addButton: AddButtonConfig = {
    text: "Nueva Célula",
    onClick: () => router.push("/cells/new"),
    variant: "primary",
    icon: <RiAddLine className="w-4 h-4" />,
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cellToDelete, setCellToDelete] = useState<CellTableData | null>(null);
  const deleteCellMutation = useDeleteCell();

  const actions: TableAction<CellTableData>[] = [
    {
      label: "Editar",
      variant: "ghost",
      onClick: (cell) => router.push(`/cells/edit/${cell.id}`),
    },
    {
      label: "Eliminar",
      variant: "ghost",
      onClick: (cell) => {
        setCellToDelete(cell);
        setDeleteModalOpen(true);
      },
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-error">Error al cargar las células</p>
        <button onClick={() => refetch()} className="btn btn-primary btn-sm">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>
      <DataTable<CellTableData>
        data={cells}
        title="Células"
        subTitle={`Total de células en la iglesia: ${cells.length}`}
        columns={columns}
        actions={actions}
        searchable={true}
        searchPlaceholder="Buscar células..."
        selectable={false}
        pagination={true}
        itemsPerPage={10}
        loading={loading}
        emptyMessage="No se encontraron células"
        addButton={addButton}
      />

      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCellToDelete(null);
        }}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-base-content">
            ¿Estás seguro de que deseas eliminar la célula
            {" "}
            <span className="font-semibold">{cellToDelete?.name}</span>?
          </p>
          <p className="text-sm text-warning">Esta acción no se puede deshacer.</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setCellToDelete(null);
              }}
              className="btn btn-ghost"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                if (!cellToDelete) return;
                try {
                  await deleteCellMutation.mutateAsync(cellToDelete.id);
                  showSuccess("Célula eliminada exitosamente");
                  setDeleteModalOpen(false);
                  setCellToDelete(null);
                  refetch();
                } catch (e) {
                  showError("Error al eliminar la célula");
                }
              }}
              className="btn btn-error"
              disabled={deleteCellMutation.isPending}
            >
              {deleteCellMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}