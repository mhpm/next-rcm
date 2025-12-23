"use client";

import { useRouter } from "next/navigation";
import { RiAddLine, RiFilter3Line } from "react-icons/ri";
import { BackLink, Breadcrumbs, DataTable } from "@/components";
import { TableColumn, AddButtonConfig, TableAction } from "@/types";
import { useCells } from "./hooks/useCells";
import { transformCellsToTableData } from "./utils/cellsUtils";
import { CellTableData } from "./types/cells";
import { useState, useMemo } from "react";
import Link from "next/link";
import CreateCellModal from "./components/CreateCellModal";
import CellsFilterModal from "./components/CellsFilterModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useDeleteCell } from "./hooks/useCells";
import { useNotificationStore } from "@/store/NotificationStore";
import { usePersistentFilters } from "@/hooks/usePersistentFilters";
import { Button } from "@/components/ui/button";

export default function CellsPage() {
  const router = useRouter();
  const deleteCellMutation = useDeleteCell();
  const { showSuccess, showError } = useNotificationStore();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const {
    filters: activeFilters,
    setFilters: setActiveFilters,
    clearFilters,
  } = usePersistentFilters<Record<string, any>>("cells-filters", {});

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useCells({
    limit: 1000,
    orderBy: "name",
    orderDirection: "asc",
  });

  const cells = useMemo(
    () => (data?.cells ? transformCellsToTableData(data.cells) : []),
    [data?.cells]
  );

  const filteredCells = useMemo(() => {
    let result = cells;

    if (Object.keys(activeFilters).length > 0) {
      result = result.filter((cell) => {
        // Sector
        if (
          activeFilters.sectorId &&
          cell.parentSectorId !== activeFilters.sectorId
        ) {
          return false;
        }

        // SubSector
        if (
          activeFilters.subSectorId &&
          cell.subSectorId !== activeFilters.subSectorId
        ) {
          return false;
        }

        // Leader Name
        if (
          activeFilters.leaderName &&
          !cell.leaderName
            .toLowerCase()
            .includes(activeFilters.leaderName.toLowerCase())
        ) {
          return false;
        }

        // Host Name
        if (
          activeFilters.hostName &&
          !cell.hostName
            .toLowerCase()
            .includes(activeFilters.hostName.toLowerCase())
        ) {
          return false;
        }

        // Assistant Name
        if (
          activeFilters.assistantName &&
          !cell.assistantName
            .toLowerCase()
            .includes(activeFilters.assistantName.toLowerCase())
        ) {
          return false;
        }

        // Min Members
        if (
          activeFilters.minMembers &&
          cell.memberCount < Number(activeFilters.minMembers)
        ) {
          return false;
        }

        // Max Members
        if (
          activeFilters.maxMembers &&
          cell.memberCount > Number(activeFilters.maxMembers)
        ) {
          return false;
        }

        // Orphan Only (Sin Sector)
        if (activeFilters.orphanOnly) {
          // Si tiene subSectorId, entonces tiene sector asignado, así que lo filtramos fuera
          if (cell.subSectorId) {
            return false;
          }
        }

        return true;
      });
    }

    return result;
  }, [cells, activeFilters]);

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
        return (
          <span className="text-destructive font-bold flex items-center gap-1">
            ⚠️ {name || "Sin ubicación"}
          </span>
        );
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
      key: "assistantName",
      label: "Asistente",
      sortable: true,
      className: "font-semibold",
      render: (value, row) => {
        const name = value as string;
        if (row.assistantName && row.assistantId) {
          return (
            <Link
              href={`/members/edit/${row.assistantId}`}
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
        <Button onClick={() => refetch()} size="sm">
          Reintentar
        </Button>
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
        data={filteredCells}
        title="Células"
        subTitle={
          Object.keys(activeFilters).length > 0
            ? `Mostrando ${filteredCells.length} de ${data?.total || 0} células`
            : `Total de células en la iglesia: ${data?.total || 0}`
        }
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

      <CreateCellModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => refetch()}
      />

      <CellsFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setActiveFilters}
        onClear={clearFilters}
        activeFilters={activeFilters}
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
