"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RiAddLine } from "react-icons/ri";
import { BackLink, Breadcrumbs, DataTable } from "@/components";
import { TableColumn, TableAction, AddButtonConfig } from "@/types";
import { useMinistries, useDeleteMinistry } from "./hooks/useMinistries";
import { Modal } from "@/components/Modal/Modal";
import { useNotificationStore } from "@/store/NotificationStore";
import { transformMinistriesToTableData } from "./utils/ministriesUtils";
import { MinistryTableData } from "./types/ministries";

export default function MinistriesPage() {
  const router = useRouter();
  const { showSuccess, showError } = useNotificationStore();

  // Data fetching
  const {
    data: ministriesData,
    isLoading: loading,
    error,
    refetch,
  } = useMinistries({
    limit: 50,
    orderBy: "name",
    orderDirection: "asc",
  });

  // Delete functionality
  const deleteMinistryMutation = useDeleteMinistry();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ministryToDelete, setMinistryToDelete] =
    useState<MinistryTableData | null>(null);

  // Transform data for table
  const ministries = ministriesData?.ministries
    ? transformMinistriesToTableData(ministriesData.ministries)
    : [];

  // Define table columns
  const columns: TableColumn<MinistryTableData>[] = [
    {
      key: "name",
      label: "Nombre",
      sortable: true,
      className: "font-semibold",
    },
    {
      key: "description",
      label: "Descripción",
      sortable: false,
      className: "max-w-xs truncate",
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
        return <span className="text-neutral/45">{name}</span>;
      },
    },
    {
      key: "memberCount",
      label: "Miembros",
      sortable: true,
      className: "text-center font-semibold",
    },
  ];

  // Define table actions
  const actions: TableAction<MinistryTableData>[] = [
    {
      label: "Editar",
      variant: "ghost",
      onClick: (ministry) => {
        router.push(`/ministries/edit/${ministry.id}`);
      },
    },
    {
      label: "Eliminar",
      variant: "ghost",
      onClick: (ministry) => {
        setMinistryToDelete(ministry);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Add button configuration
  const addButton: AddButtonConfig = {
    text: "Nuevo Ministerio",
    onClick: () => router.push("/ministries/new"),
    variant: "primary",
    icon: <RiAddLine className="w-4 h-4" />,
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!ministryToDelete) return;

    try {
      await deleteMinistryMutation.mutateAsync(ministryToDelete.id);
      showSuccess("Ministerio eliminado exitosamente");
      setDeleteModalOpen(false);
      setMinistryToDelete(null);
      refetch();
    } catch (error) {
      showError("Error al eliminar el ministerio");
      console.error("Error deleting ministry:", error);
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-error">Error al cargar los ministerios</p>
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
      <DataTable<MinistryTableData>
        data={ministries}
        title="Ministerios"
        subTitle={`Total de ministerios en la iglesia: ${ministries.length}`}
        columns={columns}
        actions={actions}
        searchable={true}
        searchPlaceholder="Buscar ministerios..."
        selectable={false}
        pagination={true}
        itemsPerPage={10}
        loading={loading}
        emptyMessage="No se encontraron ministerios"
        addButton={addButton}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setMinistryToDelete(null);
        }}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-base-content">
            ¿Estás seguro de que deseas eliminar el ministerio{" "}
            <span className="font-semibold">{ministryToDelete?.name}</span>?
          </p>
          <p className="text-sm text-warning">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setMinistryToDelete(null);
              }}
              className="btn btn-ghost"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="btn btn-error"
              disabled={deleteMinistryMutation.isPending}
            >
              {deleteMinistryMutation.isPending ? (
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
