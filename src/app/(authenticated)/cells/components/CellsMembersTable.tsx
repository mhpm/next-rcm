"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components";
import { TableColumn, TableAction } from "@/types";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { Modal } from "@/components/Modal/Modal";
import { MultiSelectField } from "@/components/FormControls/MultiSelectField";
import { useMembers } from "@/app/(authenticated)/members/hooks/useMembers";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  useAddMembersToCell,
  useRemoveMemberFromCell,
} from "../hooks/useCells";

type CellsMembersTableProps = {
  cellId: string;
  members: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    role: string;
    createdAt: string | Date;
  }>;
};

export default function CellsMembersTable({
  cellId,
  members,
}: CellsMembersTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{
    memberId: string;
    nombre: string;
  } | null>(null);
  const addMembersMutation = useAddMembersToCell();
  const removeMemberMutation = useRemoveMemberFromCell();

  const { data: allMembersData, isLoading: isLoadingMembers } = useMembers();

  const currentMemberIds = useMemo(
    () => new Set(members.map((m) => m.id)),
    [members]
  );

  const availableMembers = useMemo(
    () =>
      (allMembersData ?? []).filter(
        (m) =>
          !currentMemberIds.has(m.id) &&
          (m as { cell_id?: string | null }).cell_id == null
      ),
    [allMembersData, currentMemberIds]
  );

  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const rows = useMemo(
    () =>
      members.map((m) => ({
        id: m.id,
        nombre: `${m.firstName} ${m.lastName}`,
        email: m.email ?? "",
        rol: m.role,
        agregadoEl:
          typeof m.createdAt === "string"
            ? new Date(m.createdAt).toLocaleDateString()
            : m.createdAt.toLocaleDateString(),
      })),
    [members]
  );

  const columns: TableColumn<(typeof rows)[number]>[] = [
    { key: "nombre", label: "Nombre", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "rol", label: "Rol", sortable: true },
    { key: "agregadoEl", label: "Agregado", sortable: true },
  ];

  const actions: TableAction<(typeof rows)[number]>[] = [
    {
      label: "Eliminar",
      variant: "ghost",
      onClick: (row) => {
        if (addMembersMutation.isPending || removeMemberMutation.isPending)
          return;
        setMemberToDelete({ memberId: row.id, nombre: row.nombre });
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const addButton = {
    text: "Agregar miembro",
    variant: "primary" as const,
    onClick: () => {
      if (addMembersMutation.isPending || removeMemberMutation.isPending)
        return;
      setIsModalOpen(true);
    },
  };

  const isProcessing =
    addMembersMutation.isPending || removeMemberMutation.isPending;

  const handleAddMembers = async () => {
    if (!selectedMemberIds.length) return;
    try {
      await addMembersMutation.mutateAsync({
        cellId,
        memberIds: selectedMemberIds,
      });
      setSelectedMemberIds([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error al agregar miembros:", err);
    }
  };

  return (
    <div className="mt-6">
      <DataTable
        data={rows}
        title="Miembros de la célula"
        subTitle={`Total de miembros en la célula: ${members.length}`}
        columns={columns}
        actions={actions}
        addButton={addButton}
        itemsPerPage={5}
        loading={isProcessing}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        entityName={memberToDelete?.nombre}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={async () => {
          if (!memberToDelete) return;
          try {
            await removeMemberMutation.mutateAsync({
              cellId,
              memberId: memberToDelete.memberId,
            });
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
          } catch (err) {
            console.error("Error al eliminar miembro de la célula:", err);
          }
        }}
        isPending={removeMemberMutation.isPending}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar miembros a la célula"
      >
        <div className="flex flex-col gap-3">
          <MultiSelectField
            label="Miembros"
            options={availableMembers.map((m) => ({
              value: m.id,
              label:
                `${m.firstName} ${m.lastName}` +
                (m.email ? ` - ${m.email}` : ""),
            }))}
            value={selectedMemberIds}
            onChange={setSelectedMemberIds}
            placeholder="Buscar y seleccionar miembros..."
            isLoading={isLoadingMembers}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddMembers}
              disabled={
                !selectedMemberIds.length || addMembersMutation.isPending
              }
            >
              {addMembersMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                "Agregar"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
