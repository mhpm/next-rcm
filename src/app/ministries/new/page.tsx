"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MinistryForm, {
  MinistryFormInput,
} from "@/app/ministries/components/MinistryForm/MinistryForm";
import { useCreateMinistry } from "@/app/ministries/hooks/useMinistries";
import { useNotificationStore } from "@/store/NotificationStore";
import { BackLink, Breadcrumbs } from "@/components";

export default function NewMinistryPage() {
  const router = useRouter();
  const createMinistry = useCreateMinistry();
  const { showSuccess, showError } = useNotificationStore();

  const handleSubmit = async (data: MinistryFormInput) => {
    try {
      await createMinistry.mutateAsync(data);
      showSuccess("Ministerio creado exitosamente");
      router.push("/ministries");
    } catch (error) {
      console.error(error);
      showError("Error al crear el ministerio");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/ministries" />
        <Breadcrumbs />
      </div>
      <MinistryForm
        initialData={{ leaderId: "" }}
        onSubmit={handleSubmit}
        isEditMode={false}
        isSubmitting={createMinistry.isPending}
      />
    </div>
  );
}
