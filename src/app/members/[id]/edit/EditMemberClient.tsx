"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { MemberForm, Alert, MinimalLoader } from "@/components";
import { useMember, useUpdateMember } from "@/app/members/hooks/useMembers";
import { MemberFormData } from "@/types";
import { MemberRole, Gender, MemberMinistry, Ministries } from "@prisma/client";
import { useNotificationStore } from "@/store/NotificationStore";
import { MemberFormInput } from "@/app/members/schema/members.schema";
import { useQueryClient } from "@tanstack/react-query";

// FormValues type to match MemberForm component exactly
type FormValues = MemberFormInput;

interface EditMemberClientProps {
  memberId: string;
}

const EditMemberClient = ({ memberId }: EditMemberClientProps) => {
  const { showSuccess, showError } = useNotificationStore();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Function to invalidate and refetch member data
  const invalidateMemberQuery = () => {
    queryClient.invalidateQueries({ queryKey: ["member", memberId] });
  };

  // Fetch member data
  const { data: member, isLoading, error, isError } = useMember(memberId);

  // Update member mutation
  const updateMemberMutation = useUpdateMember();

  // Handle form submission
  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setErrorMessage(null);

      // Convert form data to match Member type
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
        skills: data.skills || [],
        ministries: data.ministries || [],
      };

      console.log("🚀 ~ handleSubmit ~ memberData:", memberData);

      await updateMemberMutation.mutateAsync({
        id: memberId,
        data: memberData,
      });

      showSuccess("Miembro actualizado exitosamente");
      router.push("/members");
    } catch (error) {
      console.error("Error updating member:", error);
      const message =
        error instanceof Error ? error.message : "Error desconocido";
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
        <button
          onClick={invalidateMemberQuery}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar carga
        </button>
      </div>
    );
  }

  // Convert member data for form
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
    skills: member.skills || [],
    ministries:
      member.ministries?.map(
        (memberMinistry: MemberMinistry & { ministry: Ministries }) =>
          memberMinistry.ministry.id
      ) || [],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {errorMessage && (
        <Alert
          type="error"
          title="Error"
          message={errorMessage}
          className="mb-6"
        />
      )}

      <MemberForm
        onSubmit={handleSubmit}
        initialData={defaultValues}
        isEditMode={true}
        isSubmitting={updateMemberMutation.isPending}
      />
    </div>
  );
};

export default EditMemberClient;
