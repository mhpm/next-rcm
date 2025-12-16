"use client";

import { useEffect } from "react";
import { Modal } from "@/components/Modal/Modal";
import { InputField, SelectField } from "@/components/FormControls";
import { MemberSearchField } from "@/components/FormControls/MemberSearchField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateSector, useCreateSubSector } from "../hooks/useSectors";
import { sectorCreateSchema } from "../schema/sectors.schema";
import { z } from "zod";
import { useNotificationStore } from "@/store/NotificationStore";
import { useQuery } from "@tanstack/react-query";
import { getAllSectors } from "../actions/sectors.actions";
import { getAllMembers } from "../../members/actions/members.actions";
import { MemberRole } from "@/generated/prisma/enums";

type FormValues = z.infer<typeof sectorCreateSchema>;

type CreateSectorModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initialParentId?: string;
};

export default function CreateSectorModal({
  open,
  onClose,
  onCreated,
  initialParentId,
}: CreateSectorModalProps) {
  const createSectorMutation = useCreateSector();
  const createSubSectorMutation = useCreateSubSector();
  const { showSuccess, showError } = useNotificationStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(sectorCreateSchema),
    defaultValues: {
      name: "",
      supervisorId: undefined,
      parentId: initialParentId || undefined,
    },
    mode: "onChange",
  });

  // Update parentId when initialParentId changes
  useEffect(() => {
    if (open) {
      setValue("parentId", initialParentId || undefined);
    }
  }, [initialParentId, open, setValue]);

  // Fetch all sectors for the parent selector
  const { data: sectorsData } = useQuery({
    queryKey: ["sectors", "all"],
    queryFn: () => getAllSectors(),
  });

  const parentOptions = (sectorsData?.sectors || []).map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const parentSelectOptions = [
    { value: "", label: "Sin sector padre (Sector Principal)" },
    ...parentOptions,
  ];

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset({ name: "", supervisorId: undefined, parentId: undefined });
      }}
      title="Nuevo Sector"
    >
      <form
        suppressHydrationWarning
        onSubmit={handleSubmit(async (form) => {
          try {
            if (form.parentId) {
              await createSubSectorMutation.mutateAsync({
                name: form.name,
                sectorId: form.parentId,
                supervisorId: form.supervisorId || undefined,
              });
              showSuccess("Subsector creado exitosamente");
            } else {
              await createSectorMutation.mutateAsync({
                name: form.name,
                supervisorId: form.supervisorId || undefined,
                // zoneId logic here if needed
              });
              showSuccess("Sector creado exitosamente");
            }
            onClose();
            reset({ name: "", supervisorId: undefined, parentId: undefined });
            onCreated?.();
          } catch (e) {
            const message =
              e instanceof Error ? e.message : "Error al crear el sector";
            showError(message);
          }
        })}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4">
          <InputField<FormValues>
            name="name"
            label="Nombre del Sector"
            register={register}
            rules={{ required: "El nombre es requerido" }}
            error={errors.name?.message}
          />
          <MemberSearchField<FormValues>
            name="supervisorId"
            label="Supervisor (opcional)"
            register={register}
            setValue={setValue}
            watch={watch}
            error={errors.supervisorId?.message}
            search={async (term) => {
              const res = await getAllMembers({
                search: term,
                limit: 10,
                role: MemberRole.SUPERVISOR,
              });
              return res.members;
            }}
          />
          <SelectField<FormValues>
            name="parentId"
            label="Sector Padre (Opcional)"
            register={register}
            options={parentSelectOptions}
            error={errors.parentId?.message}
          />
        </div>
        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              onClose();
              reset({ name: "", supervisorId: undefined, parentId: undefined });
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
            disabled={
              isSubmitting ||
              createSectorMutation.isPending ||
              createSubSectorMutation.isPending
            }
          >
            {watch("parentId") ? "Crear Subsector" : "Crear Sector"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
