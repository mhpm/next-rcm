"use client";

import GroupForm from "../../components/GroupForm";
import { useUpdateGroup } from "../../hooks/useGroups";
import { useNotificationStore } from "@/store/NotificationStore";
import { useRouter } from "next/navigation";
import { Breadcrumbs, BackLink } from "@/components";

export default function EditGroupClient({ group }: { group: any }) {
  const updateMutation = useUpdateGroup();
  const { showSuccess, showError } = useNotificationStore();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({
        id: group.id,
        data: {
          name: data.name,
          leaderId: data.leaderId || undefined,
          parentId: data.parentId || undefined,
          fields: data.fields,
        },
      });
      showSuccess("Grupo actualizado exitosamente");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Error al actualizar el grupo";
      showError(message);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <BackLink text="Volver a grupos" fallbackHref="/groups" />
        <Breadcrumbs />
      </div>
      <GroupForm
        title="Editar Grupo"
        initialData={{
          id: group.id,
          name: group.name,
          leaderId: group.leader?.id || group.leader_id || "",
          parentId: group.parent?.id || group.parent_id || "",
          fields: group.fields,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}
