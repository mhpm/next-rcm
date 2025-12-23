"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
    control,
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

  // Reset form when modal opens with new initialParentId
  useEffect(() => {
    if (open) {
      reset({
        name: "",
        supervisorId: undefined,
        parentId: initialParentId || undefined,
      });
    }
  }, [initialParentId, open, reset]);

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

  const handleClose = () => {
    onClose();
    reset({ name: "", supervisorId: undefined, parentId: undefined });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {watch("parentId") ? "Nuevo Subsector" : "Nuevo Sector"}
          </DialogTitle>
        </DialogHeader>

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
                });
                showSuccess("Sector creado exitosamente");
              }
              onCreated?.();
              handleClose();
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Error al crear el sector";
              showError(message);
            }
          })}
          className="space-y-4"
        >
          <div className="space-y-4 py-2">
            <SelectField<FormValues>
              label="Sector Padre (Opcional)"
              name="parentId"
              control={control}
              error={errors.parentId?.message}
              options={parentSelectOptions}
              disabled={!!initialParentId}
            />

            <InputField<FormValues>
              label={
                watch("parentId") ? "Nombre del Subsector" : "Nombre del Sector"
              }
              name="name"
              control={control}
              error={errors.name?.message}
              placeholder="Ej. Sector Norte"
            />

            <MemberSearchField<FormValues>
              label="Supervisor (Opcional)"
              name="supervisorId"
              register={register}
              setValue={setValue}
              watch={watch}
              error={errors.supervisorId?.message}
              search={async (term) => {
                const res = await getAllMembers({
                  search: term,
                  limit: 10,
                });
                return res.members;
              }}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
