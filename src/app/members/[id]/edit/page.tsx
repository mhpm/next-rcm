'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { Breadcrumbs, MemberForm, LoadingSkeleton } from '@/components';
import { useMember, useUpdateMember } from '@/hooks/useMember';
import { Member } from '@/types';

// FormValues type to match MemberForm component
type FormValues = Omit<Member, 'birthDate' | 'baptismDate'> & {
  birthDate?: string;
  baptismDate?: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Helper para formatear fechas a YYYY-MM-DD
const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

// Helper para convertir datos del miembro a formato de formulario
const memberToFormData = (member: Member): FormValues => ({
  firstName: member.firstName,
  lastName: member.lastName,
  email: member.email,
  phone: member.phone,
  age: member.age,
  address: member.address,
  birthDate: formatDateForInput(member.birthDate),
  baptismDate: formatDateForInput(member.baptismDate),
  role: member.role,
  gender: member.gender,
  ministerio: member.ministerio,
  notes: member.notes,
  skills: member.skills,
});

// Helper para convertir datos del formulario a formato de miembro
const formDataToMember = (formData: FormValues): Partial<Member> => ({
  firstName: formData.firstName as string,
  lastName: formData.lastName as string,
  email: formData.email as string,
  phone: formData.phone as string,
  age: formData.age as number,
  address: formData.address as Member['address'],
  birthDate: formData.birthDate || undefined,
  baptismDate: formData.baptismDate || undefined,
  role: formData.role as 'miembro' | 'supervisor' | 'lider' | 'anfitrion',
  gender: formData.gender as 'masculino' | 'femenino',
  ministerio: formData.ministerio as string,
  notes: formData.notes as string,
  skills: formData.skills as string[],
});

const EditMemberPage = ({ params }: PageProps) => {
  const router = useRouter();
  const [memberId, setMemberId] = useState<string>('');
  
  // Resolve params
  useEffect(() => {
    params.then((resolvedParams) => {
      setMemberId(resolvedParams.id);
    });
  }, [params]);

  // Fetch member data
  const {
    data: member,
    isLoading,
    error,
    isError,
  } = useMember(memberId);

  // Update member mutation
  const updateMemberMutation = useUpdateMember();

  // Handle form submission
  const handleSubmit: SubmitHandler<FormValues> = async (formData) => {
    if (!memberId) return;

    try {
      const memberData = formDataToMember(formData);
      await updateMemberMutation.mutateAsync({
        id: memberId,
        data: memberData,
      });
      
      // Show success message and redirect
      alert('Miembro actualizado exitosamente');
      router.push('/members');
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error al actualizar el miembro. Por favor, intenta de nuevo.');
    }
  };

  // Loading state
  if (!memberId || isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Miembro</h1>
          <Breadcrumbs />
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (isError || !member) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Miembro</h1>
          <Breadcrumbs />
        </div>
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-error mb-2">Error</h2>
          <p className="text-error">
            {error?.message || 'No se pudo cargar la información del miembro.'}
          </p>
          <button
            onClick={() => router.push('/members')}
            className="mt-4 btn btn-outline btn-error"
          >
            Volver a la lista de miembros
          </button>
        </div>
      </div>
    );
  }

  // Convert member data to form format
  const initialFormData = memberToFormData(member);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Editar Miembro: {member.firstName} {member.lastName}
        </h1>
        <Breadcrumbs />
      </div>
      
      <MemberForm
        initialData={initialFormData}
        onSubmit={handleSubmit}
        isEditMode={true}
        isSubmitting={updateMemberMutation.isPending}
      />
    </div>
  );
};

export default EditMemberPage;
