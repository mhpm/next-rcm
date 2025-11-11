"use client";

import { Breadcrumbs, MemberForm, Alert } from "@/components";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { MemberFormData } from "@/app/members/types/member";
import { MemberRole, Gender } from "@prisma/client";
import { useCreateMember } from "@/app/members/hooks/useMembers";
import { useNotificationStore } from "@/store/NotificationStore";
import { MemberFormInput } from "@/app/members/schema/members.schema";

// FormValues type to match MemberForm component exactly
type FormValues = MemberFormInput;

export default function NewMemberPage() {
  const router = useRouter();
  const createMemberMutation = useCreateMember();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  // Convert form data to member data for API
  const formDataToMember = (formData: FormValues): MemberFormData => ({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone || undefined,
    age:
      typeof formData.age === "string"
        ? parseInt(formData.age, 10) || undefined
        : formData.age || undefined,
    street: formData.street || undefined,
    city: formData.city || undefined,
    state: formData.state || undefined,
    zip: formData.zip || undefined,
    country: formData.country || undefined,
    birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
    baptismDate: formData.baptismDate
      ? new Date(formData.baptismDate)
      : undefined,
    role: formData.role as MemberRole,
    gender: formData.gender as Gender,
    ministries: formData.ministries || [], // Include ministries array
    notes: formData.notes || undefined,
    picture: formData.picture || undefined,
  });

  const handleSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      // Limpiar mensajes anteriores
      setError(null);
      setSuccess(null);

      try {
        const memberData = formDataToMember(data);
        await createMemberMutation.mutateAsync(memberData);

        // Mostrar toast de éxito
        const successMessage = `¡Miembro ${data.firstName} ${data.lastName} creado exitosamente!`;
        showSuccess(successMessage);

        // Set local success state for additional UI feedback
        setSuccess(successMessage);

        // Redirect after successful creation with enough time for toast to show
        setTimeout(() => {
          router.push("/members");
        }, 2500);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al crear el miembro";

        // Mostrar toast de error
        showError(errorMessage);

        // Set local error state for additional UI feedback
        setError(errorMessage);
      }
    },
    [createMemberMutation, router, showSuccess, showError]
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Añadir Miembro</h1>
        <Breadcrumbs />
      </div>

      <MemberForm
        onSubmit={handleSubmit}
        isSubmitting={createMemberMutation.isPending}
      />
      {/* Alertas de error y éxito */}
      {error && (
        <div className="mb-6">
          <Alert
            type="error"
            title="Error al crear miembro"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}

      {success && (
        <div className="mb-6">
          <Alert
            type="success"
            title="Miembro creado exitosamente"
            message={success}
            onClose={() => setSuccess(null)}
          />
        </div>
      )}
    </div>
  );
}
