"use client";

import { useRouter } from "next/navigation";
import { RiAddLine } from "react-icons/ri";
import { BackLink, Breadcrumbs, DataTable } from "@/components";
import { TableColumn, AddButtonConfig, TableAction } from "@/types";
import { useCells } from "./hooks/useCells";
import { transformCellsToTableData } from "./utils/cellsUtils";
import { CellTableData } from "./types/cells";
import { useState } from "react";
import Link from "next/link";
import CreateCellModal from "./components/CreateCellModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useDeleteCell } from "./hooks/useCells";
import { useNotificationStore } from "@/store/NotificationStore";

export default function CellsPage() {
  const router = useRouter();
  const deleteCellMutation = useDeleteCell();
  const { showSuccess, showError } = useNotificationStore();

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useCells({
    limit: 50,
    orderBy: "name",
    orderDirection: "asc",
  });

  const cells = data?.cells ? transformCellsToTableData(data.cells) : [];

  const columns: TableColumn<CellTableData>[] = [
    {
      key: "name",
      label: "Nombre",
      sortable: true,
      className: "font-semibold",
    },
    {
      key: "sectorName",
      label: "Sector",
      sortable: true,
      className: "font-semibold",
      render: (value, row) => {
        const name = value as string;
        if (row.sectorId) {
          return (
            <Link
              href={`/sectors/edit/${row.sectorId}`}
              className="hover:underline text-primary"
            >
              {name}
            </Link>
          );
        }
        return <span className="text-base-content/40">{name}</span>;
      },
    },
    {
      key: "leaderName",
      label: "Líder",
      sortable: true,
      className: "font-semibold",
      render: (value, row) => {
        const name = value as string;
        if (row.leaderId) {
          return (
            <Link
              href={`/members/edit/${row.leaderId}`}
              className="hover:underline text-primary"
            >
              {name}
            </Link>
          );
        }
        return <span className="text-base-content/40">{name}</span>;
      },
    },
    {
      key: "hostName",
      label: "Anfitrión",
      sortable: true,
      className: "font-semibold",
      render: (value, row) => {
        const name = value as string;
        if (row.hostName && row.hostId) {
          return (
            <Link
              href={`/members/edit/${row.hostId}`}
              className="hover:underline text-primary"
            >
              {name}
            </Link>
          );
        }
        return <span className="text-base-content/40">{name}</span>;
      },
    },
    {
      key: "memberCount",
      label: "Miembros",
      sortable: true,
      className: "text-center font-semibold",
    },
  ];

  const addButton: AddButtonConfig = {
    text: "Nueva Célula",
    onClick: () => setCreateModalOpen(true),
    variant: "primary",
    icon: <RiAddLine className="w-4 h-4" />,
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cellToDelete, setCellToDelete] = useState<CellTableData | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

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

      <CreateCellModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => refetch()}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        entityName={cellToDelete?.name}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCellToDelete(null);
        }}
        onConfirm={async () => {
          const id = cellToDelete?.id;
          if (!id) return;
          try {
            await deleteCellMutation.mutateAsync(id);
            showSuccess("Célula eliminada exitosamente");
            setDeleteModalOpen(false);
            setCellToDelete(null);
            refetch();
          } catch (e) {
            showError("Error al eliminar la célula");
          }
        }}
        isPending={deleteCellMutation.isPending}
      />
    </div>
  );
}
