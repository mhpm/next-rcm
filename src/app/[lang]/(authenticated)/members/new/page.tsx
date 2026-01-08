'use client';

import { Breadcrumbs, MemberForm, Alert, BackLink } from '@/components';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { MemberFormData } from '@/app/[lang]/(authenticated)/members/types/member';
import { MemberRole, Gender } from '@/generated/prisma/enums';
import { useCreateMember } from '@/app/[lang]/(authenticated)/members/hooks/useMembers';
import { useNotificationStore } from '@/store/NotificationStore';
import { MemberFormInput } from '@/app/[lang]/(authenticated)/members/schema/members.schema';

// FormValues type to match MemberForm component exactly
type FormValues = MemberFormInput;

export default function NewMemberPage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || 'es';
  const createMemberMutation = useCreateMember();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  // Convert form data to member data for API
  const formDataToMember = (formData: FormValues): MemberFormData => ({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email || undefined,
    phone: formData.phone || undefined,
    age:
      typeof formData.age === 'string'
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

  // Auto-dismiss success alert after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
          router.push(`/${lang}/members`);
        }, 2500);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error al crear el miembro';

        // Mostrar toast de error
        showError(errorMessage);

        // Set local error state for additional UI feedback
        setError(errorMessage);
      }
    },
    [createMemberMutation, router, showSuccess, showError]
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>
      <MemberForm
        title="Añadir Miembro"
        subtitle="Ingresa la información del nuevo miembro"
        onSubmit={handleSubmit}
        isSubmitting={createMemberMutation.isPending}
        resetAfterSubmit
      />
      {/* Alertas de error y éxito */}
      {error && (
        <div className="my-6">
          <Alert
            type="error"
            title="Error al crear miembro"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}

      {success && (
        <div className="my-6">
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
