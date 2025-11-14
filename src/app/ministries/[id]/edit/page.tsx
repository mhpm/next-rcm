"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MinistryForm, {
  MinistryFormInput,
} from "@/app/ministries/components/MinistryForm/MinistryForm";
import {
  useMinistry,
  useUpdateMinistry,
} from "@/app/ministries/hooks/useMinistries";
import { useNotificationStore } from "@/store/NotificationStore";
import { BackLink, Breadcrumbs } from "@/components";

export default function EditMinistryPage({
  params,
}: {
  // In Client Components, params is a Promise and must be unwrapped with React.use()
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const { data: ministryData, isLoading, error } = useMinistry(id);
  const updateMinistry = useUpdateMinistry();
  const { showSuccess, showError } = useNotificationStore();

  const handleSubmit = async (data: MinistryFormInput) => {
    try {
      await updateMinistry.mutateAsync({ id, data });
      showSuccess("Ministerio actualizado exitosamente");
      router.push("/ministries");
    } catch (err) {
      console.error(err);
      showError("Error al actualizar el ministerio");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="loading loading-spinner loading-lg" />
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
      <MinistryForm
        initialData={{
          name: ministryData?.name || "",
          description: ministryData?.description || "",
          id: ministryData?.id,
        }}
        onSubmit={handleSubmit}
        isEditMode={true}
        isSubmitting={updateMinistry.isPending}
      />
    </div>
  );
}
