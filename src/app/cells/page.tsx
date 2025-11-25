"use client";

import { useRouter } from "next/navigation";
import { RiAddLine } from "react-icons/ri";
import { BackLink, Breadcrumbs, DataTable } from "@/components";
import { TableColumn, AddButtonConfig, TableAction } from "@/types";
import { useCells, useDeleteCell, useCreateCell } from "./hooks/useCells";
import { transformCellsToTableData } from "./utils/cellsUtils";
import { CellTableData } from "./types/cells";
import { useState } from "react";
import { Modal } from "@/components/Modal/Modal";
import { useNotificationStore } from "@/store/NotificationStore";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { InputField, SelectField } from "@/components/FormControls";
import { useQuery } from "@tanstack/react-query";
import { getAllSectors } from "./actions/cells.actions";

export default function CellsPage() {
  const router = useRouter();
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
    { key: "sectorName", label: "Sector", sortable: true },
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
  const deleteCellMutation = useDeleteCell();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const createCellMutation = useCreateCell();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; sectorId: string }>({
    defaultValues: { name: "", sectorId: "" },
    mode: "onChange",
  });
  const { data: sectors, isLoading: loadingSectors } = useQuery({
    queryKey: ["sectors", "all"],
    queryFn: () => getAllSectors(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const sectorOptions = (sectors || []).map((s) => ({
    value: s.id,
    label: s.name,
  }));
  const sectorSelectOptions = [
    { value: "", label: "Selecciona un sector" },
  ].concat(sectorOptions);

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
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          reset({ name: "", sectorId: "" });
        }}
        title="Nueva Célula"
      >
        <form
          onSubmit={handleSubmit(async (form) => {
            try {
              await createCellMutation.mutateAsync({
                name: form.name,
                sectorId: form.sectorId,
              });
              showSuccess("Célula creada exitosamente");
              setCreateModalOpen(false);
              reset({ name: "", sectorId: "" });
              refetch();
            } catch (e) {
              showError("Error al crear la célula");
            }
          })}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4">
            <InputField<{ name: string; sectorId: string }>
              name="name"
              label="Nombre de la Célula"
              register={register}
              rules={{ required: "El nombre es requerido" }}
              error={errors.name?.message}
            />
            <SelectField<{ name: string; sectorId: string }>
              name="sectorId"
              label="Sector"
              register={register}
              rules={{ required: "El sector es requerido" }}
              error={errors.sectorId?.message}
              options={sectorSelectOptions}
              className="select select-bordered w-full"
            />
            {loadingSectors && (
              <p className="text-sm text-base-content/60">
                Cargando sectores...
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setCreateModalOpen(false);
                reset({ name: "", sectorId: "" });
              }}
              disabled={createCellMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createCellMutation.isPending}
            >
              {createCellMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </form>
      </Modal>

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
            ¿Estás seguro de que deseas eliminar la célula{" "}
            <span className="font-semibold">{cellToDelete?.name}</span>?
          </p>
          <p className="text-sm text-warning">
            Esta acción no se puede deshacer.
          </p>
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
