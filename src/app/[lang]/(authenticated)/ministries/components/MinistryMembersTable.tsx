"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components";
import { TableColumn, TableAction } from "@/types";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { Modal } from "@/components/Modal/Modal";
import { MultiSelectField } from "@/components/FormControls/MultiSelectField";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMembers } from "@/app/[lang]/(authenticated)/members/hooks/useMembers";
import {
  useAddMembersToMinistry,
  useRemoveMemberFromMinistry,
} from "@/app/[lang]/(authenticated)/ministries/hooks/useMinistries";

type MinistryMembersTableProps = {
  ministryId: string;
  // Array of memberships from getMinistryById: { id, memberId, ministryId, createdAt, updatedAt, member: Members }
  memberships: Array<{
    id: string;
    memberId: string;
    ministryId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    member: {
      id: string;
      firstName: string;
      lastName: string;
      email: string | null;
      role: string;
    };
  }>;
};

export default function MinistryMembersTable({
  ministryId,
  memberships,
}: MinistryMembersTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{
    _memberId: string;
    nombre: string;
  } | null>(null);
  const addMembersMutation = useAddMembersToMinistry();
  const removeMemberMutation = useRemoveMemberFromMinistry();

  // Fetch all members (church-scoped) for selection
  const { data: allMembersData, isLoading: isLoadingMembers } = useMembers();

  // Current member IDs in ministry
  const currentMemberIds = useMemo(
    () => new Set(memberships.map((m) => m.memberId)),
    [memberships]
  );

  // Available members to add (exclude those already in ministry)
  const availableMembers = useMemo(
    () => (allMembersData ?? []).filter((m) => !currentMemberIds.has(m.id)),
    [allMembersData, currentMemberIds]
  );

  // Local state for selected members to add (multi-select)
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const rows = useMemo(
    () =>
      memberships.map((mm) => ({
        id: mm.member.id,
        nombre: `${mm.member.firstName} ${mm.member.lastName}`,
        email: mm.member.email || "",
        rol: mm.member.role,
        agregadoEl:
          typeof mm.createdAt === "string"
            ? new Date(mm.createdAt).toLocaleDateString()
            : mm.createdAt.toLocaleDateString(),
        _memberId: mm.memberId,
      })),
    [memberships]
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
        setMemberToDelete({ _memberId: row._memberId, nombre: row.nombre });
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const addButton = {
    text: "Agregar miembro",
    variant: "primary" as const,
    onClick: () => setIsModalOpen(true),
  };

  const handleAddMembers = async () => {
    if (!selectedMemberIds.length) return;
    try {
      await addMembersMutation.mutateAsync({
        ministryId,
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
        title="Miembros del ministerio"
        subTitle={`Total de miembros en el ministerio: ${memberships.length}`}
        columns={columns}
        actions={actions}
        addButton={addButton}
        itemsPerPage={5}
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
              ministryId,
              memberId: memberToDelete._memberId,
            });
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
          } catch (err) {
            console.error("Error al eliminar miembro del ministerio:", err);
          }
        }}
        isPending={removeMemberMutation.isPending}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar miembros al ministerio"
      >
        <div className="flex flex-col gap-3">
          <MultiSelectField
            label="Miembros"
            options={availableMembers.map((m) => ({
              value: m.id,
              label: `${m.firstName} ${m.lastName} - ${m.email}`,
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
