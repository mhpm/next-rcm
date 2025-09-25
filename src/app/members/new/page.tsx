'use client';

import { Breadcrumbs, MemberForm, Alert } from '@/components';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { MemberFormData } from '@/app/members/types/member';
import { MemberRole, Gender } from '@prisma/client';
import { useCreateMember } from '@/app/members/hooks/useMembers';
import { useServerNotifications } from '@/hooks/useServerNotifications';

// FormValues type to match MemberForm component exactly
type FormValues = Omit<MemberFormData, 'birthDate' | 'baptismDate'> & {
  birthDate?: string;
  baptismDate?: string;
};

export default function NewMemberPage() {
  const router = useRouter();
  const createMemberMutation = useCreateMember();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { handleServerAction } = useServerNotifications();

  // Convert form data to member data for API
  const formDataToMember = (formData: FormValues): MemberFormData => ({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone || undefined,
    age: formData.age || undefined,
    street: formData.street || undefined,
    city: formData.city || undefined,
    state: formData.state || undefined,
    zip: formData.zip || undefined,
    country: formData.country || undefined,
    birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
    baptismDate: formData.baptismDate
      ? new Date(formData.baptismDate)
      : undefined,
    role: formData.role as MemberRole, // Los valores ya están en mayúsculas desde el formulario
    gender: formData.gender as Gender, // Los valores ya están en mayúsculas desde el formulario
    ministerio: formData.ministerio || undefined,
    notes: formData.notes || undefined,
    skills: formData.skills || [],
  });

  const handleSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      // Limpiar mensajes anteriores
      setError(null);
      setSuccess(null);

      const result = await handleServerAction(
        async () => {
          const memberData = formDataToMember(data);
          return await createMemberMutation.mutateAsync(memberData);
        },
        {
          successMessage: `¡Miembro ${data.firstName} ${data.lastName} creado exitosamente!`,
          errorMessage: 'Error al crear el miembro',
          showSuccessNotification: true,
          showErrorNotification: true,
        }
      );

      if (result.success) {
        // Redirect after successful creation
        setTimeout(() => {
          router.push('/members');
        }, 1500);
      } else {
        // Set local error state for additional UI feedback if needed
        setError(result.error?.message || 'Error desconocido');
      }
    },
    [createMemberMutation, router, handleServerAction]
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Añadir Miembro</h1>
        <Breadcrumbs />
      </div>

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
            title="¡Éxito!"
            message={success}
            onClose={() => setSuccess(null)}
          />
        </div>
      )}

      <MemberForm
        onSubmit={handleSubmit}
        isSubmitting={createMemberMutation.isPending}
      />
    </div>
  );
}
