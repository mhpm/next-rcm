"use client";

import { Modal } from "@/components/Modal/Modal";
import { InputField, SelectField } from "@/components/FormControls";
import MemberSearchField from "@/components/FormControls/MemberSearchField";
// AutocompleteField reemplazado por SelectField para seleccionar un solo grupo
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupCreateSchema } from "../schema/groups.schema";
import type { GroupCreateSchema } from "../schema/groups.schema";
import { useCreateGroup, useGroupsList } from "../hooks/useGroups";
import React from "react";
import { useNotificationStore } from "@/store/NotificationStore";


type CreateGroupModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initialParentId?: string;
  initialParentName?: string;
  showParentField?: boolean;
  parentReadonly?: boolean;
};

export default function CreateGroupModal({
  open,
  onClose,
  onCreated,
  initialParentId,
  initialParentName,
  showParentField = true,
  parentReadonly = false,
}: CreateGroupModalProps) {
  const createMutation = useCreateGroup();
  const { showSuccess, showError } = useNotificationStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<GroupCreateSchema>({
    resolver: zodResolver(groupCreateSchema),
    defaultValues: { name: "", leaderId: "", parentId: initialParentId || "" },
    mode: "onChange",
  });

  const { data: groupsList } = useGroupsList();
  const [fieldResetKey, setFieldResetKey] = React.useState(0);

  React.useEffect(() => {
    if (parentReadonly && initialParentId) {
      setValue("parentId", initialParentId);
    }
  }, [parentReadonly, initialParentId, setValue]);

  React.useEffect(() => {
    if (open) {
      reset({ name: "", leaderId: "", parentId: initialParentId || "" });
      setFieldResetKey((k) => k + 1);
    }
  }, [open, initialParentId, reset]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset({ name: "", leaderId: "", parentId: initialParentId || "" });
      }}
      title="Nuevo Grupo"
    >
      <form
        suppressHydrationWarning
        onSubmit={handleSubmit(async (form) => {
          try {
            await createMutation.mutateAsync({
              name: form.name,
              leaderId: form.leaderId || undefined,
              parentId: form.parentId || undefined,
            });
            showSuccess("Grupo creado exitosamente");
            onClose();
            reset({ name: "", leaderId: "", parentId: initialParentId || "" });
            onCreated?.();
          } catch (e) {
            const message =
              e instanceof Error ? e.message : "Error al crear el grupo";
            showError(message);
          }
        })}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4">
          <InputField<GroupCreateSchema>
            name="name"
            label="Nombre del Grupo"
            register={register}
            rules={{ required: "El nombre es requerido" }}
            error={errors.name?.message}
          />

          <MemberSearchField<GroupCreateSchema>
            key={`leader-${fieldResetKey}`}
            name="leaderId"
            label="Líder (opcional)"
            register={register}
            setValue={setValue}
            watch={watch}
            error={errors.leaderId?.message as string}
          />

          {showParentField && (
            <SelectField<GroupCreateSchema>
              name="parentId"
              label="Grupo padre"
              control={control}
              defaultValue={initialParentId || ""}
              error={errors.parentId?.message}
              disabled={parentReadonly}
              options={
                parentReadonly && initialParentId
                  ? [
                      {
                        value: initialParentId,
                        label: initialParentName || "Grupo padre seleccionado",
                      },
                    ]
                  : [
                      { value: "", label: "Sin grupo padre" },
                      ...(groupsList || []).map((g) => ({
                        value: g.id,
                        label: g.name,
                      })),
                    ]
              }
            />
          )}
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              onClose();
              reset({
                name: "",
                leaderId: "",
                parentId: initialParentId || "",
              });
            }}
            disabled={createMutation.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Crear"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
