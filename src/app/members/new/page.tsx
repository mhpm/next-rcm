'use client';

import { Breadcrumbs, MemberForm, Alert } from '@/components';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { MemberFormData } from '@/types/member';
import { MemberRole, Gender } from '@/generated/prisma';
import { useCreateMember } from '@/app/members/hooks/useMembers';

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
    baptismDate: formData.baptismDate ? new Date(formData.baptismDate) : undefined,
    role: formData.role as MemberRole, // Los valores ya están en mayúsculas desde el formulario
    gender: formData.gender as Gender, // Los valores ya están en mayúsculas desde el formulario
    ministerio: formData.ministerio || undefined,
    notes: formData.notes || undefined,
    skills: formData.skills || [],
  });

  const handleSubmit: SubmitHandler<FormValues> = useCallback(async (data) => {
    // Limpiar mensajes anteriores
    setError(null);
    setSuccess(null);

    try {
      const memberData = formDataToMember(data);
      await createMemberMutation.mutateAsync(memberData);
      
      // Show success message and redirect
      setSuccess('Miembro creado exitosamente');
      setTimeout(() => {
        router.push('/members');
      }, 2000);
    } catch (error) {
      console.error('Error creating member:', error);
      
      // Proporcionar mensajes de error más específicos
      let errorMessage = 'Error al crear el miembro. Por favor, intenta de nuevo.';
      
      if (error instanceof Error) {
        if (error.message.includes('email already exists') || 
            error.message.includes('Unique constraint') ||
            error.message.includes('ya existe')) {
          errorMessage = 'Ya existe un miembro registrado con este email. Por favor, usa un email diferente.';
        } else if (error.message.includes('validation')) {
          errorMessage = 'Los datos proporcionados no son válidos. Verifica la información e intenta de nuevo.';
        } else if (error.message.includes('church')) {
          errorMessage = 'No se encontró una iglesia válida. Contacta al administrador del sistema.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    }
  }, [createMemberMutation, router]);

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
