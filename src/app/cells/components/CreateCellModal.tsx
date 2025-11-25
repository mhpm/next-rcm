"use client";

import { Modal } from "@/components/Modal/Modal";
import { InputField, SelectField } from "@/components/FormControls";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getAllSectors } from "../actions/cells.actions";
import { useCreateCell } from "../hooks/useCells";
import { useNotificationStore } from "@/store/NotificationStore";

type FormValues = { name: string; sectorId: string };

type CreateCellModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateCellModal({ open, onClose, onCreated }: CreateCellModalProps) {
  const createCellMutation = useCreateCell();
  const { showSuccess, showError } = useNotificationStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: "", sectorId: "" },
    mode: "onChange",
  });

  const { data: sectors, isLoading: loadingSectors } = useQuery({
    queryKey: ["sectors", "all"],
    queryFn: () => getAllSectors(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const sectorOptions = (sectors || []).map((s) => ({ value: s.id, label: s.name }));
  const sectorSelectOptions = [{ value: "", label: "Selecciona un sector" }].concat(
    sectorOptions
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset({ name: "", sectorId: "" });
      }}
      title="Nueva Célula"
    >
      <form
        onSubmit={handleSubmit(async (form) => {
          try {
            await createCellMutation.mutateAsync({ name: form.name, sectorId: form.sectorId });
            showSuccess("Célula creada exitosamente");
            onClose();
            reset({ name: "", sectorId: "" });
            onCreated?.();
          } catch (e) {
            showError("Error al crear la célula");
          }
        })}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4">
          <InputField<FormValues>
            name="name"
            label="Nombre de la Célula"
            register={register}
            rules={{ required: "El nombre es requerido" }}
            error={errors.name?.message}
          />
          <SelectField<FormValues>
            name="sectorId"
            label="Sector"
            register={register}
            rules={{ required: "El sector es requerido" }}
            error={errors.sectorId?.message}
            options={sectorSelectOptions}
            className="select select-bordered w-full"
          />
          {loadingSectors && (
            <p className="text-sm text-base-content/60">Cargando sectores...</p>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              onClose();
              reset({ name: "", sectorId: "" });
            }}
            disabled={createCellMutation.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createCellMutation.isPending}
          >
            {createCellMutation.isPending ? (
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

