'use client';

import { Breadcrumbs, MemberForm } from '@/components';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { MemberFormData } from '@/types/member';
import { useCreateMember } from '@/app/members/hooks/useMembers';

// FormValues type to match MemberForm component exactly
type FormValues = Omit<MemberFormData, 'birthDate' | 'baptismDate'> & {
  birthDate?: string;
  baptismDate?: string;
};

export default function NewMemberPage() {
  const router = useRouter();
  const createMemberMutation = useCreateMember();

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
    role: formData.role as any, // Los valores ya están en mayúsculas desde el formulario
    gender: formData.gender as any, // Los valores ya están en mayúsculas desde el formulario
    ministerio: formData.ministerio || undefined,
    notes: formData.notes || undefined,
    skills: formData.skills || [],
  });

  const handleSubmit: SubmitHandler<FormValues> = useCallback(async (data) => {
    try {
      const memberData = formDataToMember(data);
      await createMemberMutation.mutateAsync(memberData);
      
      // Show success message and redirect
      alert('Miembro creado exitosamente');
      router.push('/members');
    } catch (error) {
      console.error('Error creating member:', error);
      alert('Error al crear el miembro. Por favor, intenta de nuevo.');
    }
  }, [createMemberMutation, router]);

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
    </div>
  );
}
