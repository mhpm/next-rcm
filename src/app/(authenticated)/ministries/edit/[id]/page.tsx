"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MinistryForm, {
  MinistryFormInput,
} from "@/app/(authenticated)/ministries/components/MinistryForm/MinistryForm";
import {
  useMinistry,
  useUpdateMinistry,
} from "@/app/(authenticated)/ministries/hooks/useMinistries";
import { useNotificationStore } from "@/store/NotificationStore";
import { BackLink, Breadcrumbs, MinimalLoader } from "@/components";
import MinistryMembersTable from "@/app/(authenticated)/ministries/components/MinistryMembersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EditMinistryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const { data: ministryData, isLoading, error } = useMinistry(id);
  const updateMinistry = useUpdateMinistry();
  const { showSuccess, showError } = useNotificationStore();
  // const [activeTab, setActiveTab] = React.useState<"info" | "members">("info");

  const handleSubmit = async (data: MinistryFormInput) => {
    try {
      await updateMinistry.mutateAsync({ id, data });
      showSuccess("Ministerio actualizado exitosamente");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Error al actualizar el ministerio";
      showError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <MinimalLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-error">Error al cargar el ministerio</p>
        <BackLink text="Volver a la lista" fallbackHref="/ministries" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/ministries" />
        <Breadcrumbs />
      </div>
      {/* Tabs para información y miembros */}
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="members">Miembros</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="info">
              <MinistryForm
                initialData={{
                  name: ministryData?.name || "",
                  description: ministryData?.description || "",
                  id: ministryData?.id,
                  leaderId:
                    ministryData?.leader?.id || ministryData?.leader_id || "",
                }}
                onSubmit={handleSubmit}
                isEditMode={true}
                isSubmitting={updateMinistry.isPending}
              />
            </TabsContent>
            <TabsContent value="members">
              {ministryData && (
                <MinistryMembersTable
                  ministryId={id}
                  memberships={ministryData.members}
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
