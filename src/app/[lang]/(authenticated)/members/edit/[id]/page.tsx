'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import {
  BackLink,
  Breadcrumbs,
  Alert,
  MinimalLoader,
  MemberForm,
} from '@/components';
import {
  useMember,
  useUpdateMember,
} from '@/app/[lang]/(authenticated)/members/hooks/useMembers';
import { MemberFormInput } from '@/app/[lang]/(authenticated)/members/schema/members.schema';
import { MemberFormData } from '@/app/[lang]/(authenticated)/members/types/member';
import { MemberRole, Gender } from '@/generated/prisma/enums';
import { MemberMinistry, Ministries } from '@/generated/prisma/browser';
import { useNotificationStore } from '@/store/NotificationStore';

type FormValues = MemberFormInput;

export default function EditMemberPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const resolved = use(params);
  const { lang, id: memberId } = resolved;
  const router = useRouter();
  const { showSuccess, showError } = useNotificationStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-dismiss error alert after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Fetch member data
  const { data: member, isLoading, error, isError } = useMember(memberId);

  // Update member mutation
  const updateMemberMutation = useUpdateMember();

  // Handle form submission
  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setErrorMessage(null);

      const memberData: MemberFormData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        age:
          typeof data.age === 'string'
            ? parseInt(data.age, 10) || undefined
            : data.age || undefined,
        street: data.street || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip || '',
        country: data.country || '',
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        baptismDate: data.baptismDate ? new Date(data.baptismDate) : undefined,
        role: (data.role as MemberRole) || MemberRole.MIEMBRO,
        gender: (data.gender as Gender) || Gender.MASCULINO,
        pictureUrl: data.pictureUrl || null,
        notes: data.notes || '',
        network_id: data.network_id || undefined,
        ministries: data.ministries || [],
      };

      await updateMemberMutation.mutateAsync({
        id: memberId,
        data: memberData,
      });

      showSuccess('Miembro actualizado exitosamente');
      router.push(`/${lang}/members`);
    } catch (err) {
      console.error('Error updating member:', err);
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setErrorMessage(message);
      showError(`Error al actualizar miembro: ${message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <MinimalLoader text="Cargando información del miembro..." />
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert
          type="error"
          title="Error"
          message={
            error?.message || 'No se pudo cargar la información del miembro'
          }
        />
      </div>
    );
  }

  // Helper para convertir Date a YYYY-MM-DD usando UTC para evitar desfases
  const toYMD = (date: Date | string | undefined | null) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const defaultValues: FormValues = {
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone || '',
    age: member.age || 0,
    street: member.street || '',
    city: member.city || '',
    state: member.state || '',
    zip: member.zip || '',
    country: member.country || '',
    birthDate: toYMD(member.birthDate),
    baptismDate: toYMD(member.baptismDate),
    role: member.role,
    gender: member.gender,
    pictureUrl: member.pictureUrl || '',
    notes: member.notes || '',
    network_id: member.network_id || undefined,
    ministries:
      member.ministries?.map(
        (mm: MemberMinistry & { ministry: Ministries }) => mm.ministry.id
      ) || [],
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>
      <MemberForm
        title="Editar Miembro"
        subtitle="Actualiza la información del miembro"
        onSubmit={handleSubmit}
        initialData={defaultValues}
        isEditMode={true}
        isSubmitting={updateMemberMutation.isPending}
      />
      <br />
      {errorMessage && (
        <Alert
          type="error"
          title="Error"
          message={errorMessage}
          className="mb-6"
        />
      )}
    </div>
  );
}
