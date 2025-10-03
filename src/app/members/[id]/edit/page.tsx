'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, MemberForm, LoadingSkeleton } from '@/components';
import { useMember, useUpdateMember } from '@/app/members/hooks/useMembers';
import { Member, MemberFormData } from '@/types';
import { MemberRole, Gender } from '@prisma/client';
import { useServerNotifications } from '@/hooks/useServerNotifications';
import type { MemberFormValues } from '@/components';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Helper para formatear fechas a YYYY-MM-DD
const formatDateForInput = (date?: Date | null): string => {
  if (!date) return '';
  try {
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
const memberToFormData = (member: Member): MemberFormValues => ({
  firstName: member.firstName,
  lastName: member.lastName,
  email: member.email,
  phone: member.phone || undefined,
  age: member.age || undefined,
  street: member.street || undefined,
  city: member.city || undefined,
  state: member.state || undefined,
  zip: member.zip || undefined,
  country: member.country || undefined,
  birthDate: formatDateForInput(member.birthDate),
  baptismDate: formatDateForInput(member.baptismDate),
  role: member.role,
  gender: member.gender,
  ministerio: member.ministerio || undefined,
  notes: member.notes || undefined,
  skills: member.skills || undefined,
});

// Convert form data to member data for API
const formDataToMember = (
  formData: MemberFormValues
): Partial<MemberFormData> => {
  const memberData: Partial<MemberFormData> = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    role: formData.role as MemberRole,
    gender: formData.gender as Gender,
  };

  // Handle optional string fields
  if (formData.phone && formData.phone.trim())
    memberData.phone = formData.phone.trim();
  if (formData.street && formData.street.trim())
    memberData.street = formData.street.trim();
  if (formData.city && formData.city.trim())
    memberData.city = formData.city.trim();
  if (formData.state && formData.state.trim())
    memberData.state = formData.state.trim();
  if (formData.zip && formData.zip.trim()) memberData.zip = formData.zip.trim();
  if (formData.country && formData.country.trim())
    memberData.country = formData.country.trim();
  if (formData.ministerio && formData.ministerio.trim())
    memberData.ministerio = formData.ministerio.trim();
  if (formData.notes && formData.notes.trim())
    memberData.notes = formData.notes.trim();

  // Handle numeric fields
  if (formData.age && formData.age > 0) memberData.age = formData.age;

  // Handle date fields with proper validation
  if (formData.birthDate && formData.birthDate.trim()) {
    try {
      const birthDate = new Date(formData.birthDate);
      if (!isNaN(birthDate.getTime())) {
        memberData.birthDate = birthDate;
      }
    } catch {
      console.warn('Invalid birth date:', formData.birthDate);
    }
  }

  if (formData.baptismDate && formData.baptismDate.trim()) {
    try {
      const baptismDate = new Date(formData.baptismDate);
      if (!isNaN(baptismDate.getTime())) {
        memberData.baptismDate = baptismDate;
      }
    } catch {
      console.warn('Invalid baptism date:', formData.baptismDate);
    }
  }

  // Handle skills array
  if (formData.skills && Array.isArray(formData.skills)) {
    memberData.skills = formData.skills.filter(
      (skill) => skill && skill.trim()
    );
  }

  return memberData;
};

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
  const { data: member, isLoading, error, isError } = useMember(memberId);

  // Update member mutation
  const updateMemberMutation = useUpdateMember();
  const { handleServerAction } = useServerNotifications();

  // Handle form submission
  const handleSubmit = async (formData: MemberFormValues) => {
    if (!memberId) {
      return;
    }

    const result = await handleServerAction(
      async () => {
        const memberData = formDataToMember(formData);

        return await updateMemberMutation.mutateAsync({
          id: memberId,
          data: memberData,
        });
      },
      {
        successMessage: `¡Miembro ${formData.firstName} ${formData.lastName} actualizado exitosamente!`,
        errorMessage: 'Error al actualizar el miembro',
        showSuccessNotification: true,
        showErrorNotification: true,
      }
    );

    if (result.success) {
      // Redirect after successful update
      setTimeout(() => {
        router.push('/members');
      }, 1500);
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
