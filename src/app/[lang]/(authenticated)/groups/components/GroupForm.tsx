"use client";

import React from "react";
import { InputField } from "@/components/FormControls";
import MemberSearchField from "@/components/FormControls/MemberSearchField";
import { SelectField } from "@/components/FormControls/SelectField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGroupsList } from "../hooks/useGroups";
import { BackLink } from "@/components";
import { groupCreateSchema, GroupCreateSchema } from "../schema/groups.schema";
import GroupFieldsBuilder from "./GroupFieldsBuilder";

type GroupFormProps = {
  initialData?: {
    id: string;
    name: string;
    leaderId?: string | null;
    parentId?: string | null;
    fields?: GroupCreateSchema["fields"];
  };
  onSubmit: (data: GroupCreateSchema) => Promise<void>;
  isSubmitting?: boolean;
  title?: string;
};

export default function GroupForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  title,
}: GroupFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<GroupCreateSchema>({
    resolver: zodResolver(groupCreateSchema),
    defaultValues: {
      name: initialData?.name || "",
      leaderId: initialData?.leaderId || "",
      parentId: initialData?.parentId || "",
      fields: initialData?.fields || [],
    },
  });

  const { data: groupsList } = useGroupsList(initialData?.id);

  React.useEffect(() => {
    if (initialData?.leaderId) {
      setValue("leaderId", initialData.leaderId);
    }
  }, [initialData?.leaderId, setValue]);

  React.useEffect(() => {
    if (initialData?.parentId) {
      setValue("parentId", initialData.parentId);
    }
  }, [initialData?.parentId, groupsList, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          {title && <h2 className="card-title mb-4">{title}</h2>}
          <div className="grid grid-cols-1 gap-4">
            <InputField<GroupCreateSchema>
              name="name"
              label="Nombre del Grupo"
              register={register}
              rules={{ required: "El nombre es requerido" }}
              error={errors.name?.message}
            />

            <MemberSearchField<GroupCreateSchema>
              name="leaderId"
              label="Líder"
              register={register}
              setValue={setValue}
              watch={watch}
              error={errors.leaderId?.message as string}
            />

            <SelectField<GroupCreateSchema>
              name="parentId"
              label="Grupo padre"
              control={control}
              defaultValue={initialData?.parentId || ""}
              error={errors.parentId?.message}
              options={[
                { value: "", label: "Sin grupo padre" },
                ...(groupsList || []).map((g) => ({
                  value: g.id,
                  label: g.name,
                })),
              ]}
            />
          </div>
        </div>
      </div>

      <GroupFieldsBuilder
        control={control}
        register={register}
        errors={errors}
      />

      <div className="flex justify-end gap-4">
        <BackLink
          text="Cancelar"
          fallbackHref="/groups"
          className="btn btn-ghost"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Guardar"
          )}
        </button>
      </div>
    </form>
  );
}
