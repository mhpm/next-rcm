"use client";

import { Modal } from "@/components/Modal/Modal";
import { InputField } from "@/components/FormControls";
import { MemberSearchField } from "@/components/FormControls/MemberSearchField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateMinistry } from "../hooks/useMinistries";
import { ministryCreateSchema } from "../schema/ministries.schema";
import { z } from "zod";
import { useNotificationStore } from "@/store/NotificationStore";

type FormValues = z.infer<typeof ministryCreateSchema>;

type CreateMinistryModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateMinistryModal({
  open,
  onClose,
  onCreated,
}: CreateMinistryModalProps) {
  const createMinistryMutation = useCreateMinistry();
  const { showSuccess, showError } = useNotificationStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ministryCreateSchema),
    defaultValues: { name: "", description: "", leaderId: undefined },
    mode: "onChange",
  });

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset({ name: "", description: "", leaderId: undefined });
      }}
      title="Nuevo Ministerio"
    >
      <form
        suppressHydrationWarning
        onSubmit={handleSubmit(async (form) => {
          try {
            await createMinistryMutation.mutateAsync({
              name: form.name,
              description: form.description || undefined,
              leaderId: form.leaderId || undefined,
            });
            showSuccess("Ministerio creado exitosamente");
            onClose();
            reset({ name: "", description: "", leaderId: undefined });
            onCreated?.();
          } catch (e) {
            const message =
              e instanceof Error ? e.message : "Error al crear el ministerio";
            showError(message);
          }
        })}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4">
          <InputField<FormValues>
            name="name"
            label="Nombre del Ministerio"
            register={register}
            rules={{ required: "El nombre es requerido" }}
            error={errors.name?.message}
          />
          <InputField<FormValues>
            name="description"
            label="Descripción"
            register={register}
            placeholder="Breve descripción"
            error={errors.description?.message}
          />
          <MemberSearchField<FormValues>
            name="leaderId"
            label="Líder (opcional)"
            register={register}
            setValue={setValue}
            watch={watch}
            error={errors.leaderId?.message}
          />
        </div>
        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              onClose();
              reset({ name: "", description: "", leaderId: undefined });
            }}
            disabled={createMinistryMutation.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createMinistryMutation.isPending}
          >
            {createMinistryMutation.isPending ? (
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
