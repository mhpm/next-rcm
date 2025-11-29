"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import {
  BackLink,
  Breadcrumbs,
  Alert,
  MinimalLoader,
  MemberForm,
} from "@/components";
import { useMember, useUpdateMember } from "@/app/members/hooks/useMembers";
import { MemberFormInput } from "@/app/members/schema/members.schema";
import { MemberFormData } from "@/app/members/types/member";
import { MemberRole, Gender, MemberMinistry, Ministries } from "@prisma/client";
import { useNotificationStore } from "@/store/NotificationStore";

type FormValues = MemberFormInput;

export default function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = use(params);
  const memberId = resolved.id;
  const router = useRouter();
  const { showSuccess, showError } = useNotificationStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        phone: data.phone || "",
        age:
          typeof data.age === "string"
            ? parseInt(data.age, 10) || undefined
            : data.age || undefined,
        street: data.street || "",
        city: data.city || "",
        state: data.state || "",
        zip: data.zip || "",
        country: data.country || "",
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        baptismDate: data.baptismDate ? new Date(data.baptismDate) : undefined,
        role: (data.role as MemberRole) || MemberRole.MIEMBRO,
        gender: (data.gender as Gender) || Gender.MASCULINO,
        pictureUrl: data.pictureUrl || null,
        notes: data.notes || "",
        ministries: data.ministries || [],
      };

      await updateMemberMutation.mutateAsync({
        id: memberId,
        data: memberData,
      });

      showSuccess("Miembro actualizado exitosamente");
      router.push("/members");
    } catch (err) {
      console.error("Error updating member:", err);
      const message = err instanceof Error ? err.message : "Error desconocido";
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
            error?.message || "No se pudo cargar la información del miembro"
          }
        />
      </div>
    );
  }

  const defaultValues: FormValues = {
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone || "",
    age: member.age || 0,
    street: member.street || "",
    city: member.city || "",
    state: member.state || "",
    zip: member.zip || "",
    country: member.country || "",
    birthDate: member.birthDate
      ? member.birthDate.toISOString().split("T")[0]
      : "",
    baptismDate: member.baptismDate
      ? member.baptismDate.toISOString().split("T")[0]
      : "",
    role: member.role,
    gender: member.gender,
    pictureUrl: member.pictureUrl || "",
    notes: member.notes || "",
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
