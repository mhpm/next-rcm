"use client";

import { Modal } from "@/components/Modal/Modal";
import { InputField, SelectField } from "@/components/FormControls";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { getAllSectors } from "../actions/cells.actions";
import { useCreateCell } from "../hooks/useCells";
import { cellCreateSchema } from "../schema/cells.schema";
import { useNotificationStore } from "@/store/NotificationStore";
import { useEffect } from "react";

type FormValues = z.infer<typeof cellCreateSchema>;

type CreateCellModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initialData?: {
    sectorId?: string;
    subSectorId?: string;
  };
};

export default function CreateCellModal({
  open,
  onClose,
  onCreated,
  initialData,
}: CreateCellModalProps) {
  const createCellMutation = useCreateCell();
  const { showSuccess, showError } = useNotificationStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues & { subSectorId?: string }>({
    resolver: zodResolver(cellCreateSchema),
    defaultValues: {
      name: "",
      sectorId: initialData?.sectorId || "",
      subSectorId: initialData?.subSectorId || "",
    },
    mode: "onChange",
  });

  // Effect to update values if initialData changes or modal opens
  useEffect(() => {
    if (open && initialData) {
      if (initialData.sectorId) setValue("sectorId", initialData.sectorId);
      // We need to wait for sectors to load/update before setting subSectorId
      // But react-hook-form might handle it if we set it after a small delay or if options exist.
      // However, the `useEffect` below resets subSectorId when sectorId changes.
      // We need to handle that carefully.
    }
  }, [open, initialData, setValue]);

  const { data: sectorsData, isLoading: loadingSectors } = useQuery({
    queryKey: ["cells", "sectors"],
    queryFn: () => getAllSectors(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const sectors = Array.isArray(sectorsData) ? sectorsData : [];

  const selectedSectorId = watch("sectorId");

  // Reset sub-sector when parent sector changes
  useEffect(() => {
    // Only reset if it's a manual change, not initial setup
    // But detecting manual vs initial is hard.
    // Let's just reset if the current value doesn't match initialData (if provided)
    // OR simply: if sectorId changes, reset subSectorId UNLESS it matches initialData's target

    const isInitialSetup =
      initialData?.sectorId === selectedSectorId && initialData?.subSectorId;
    if (isInitialSetup) {
      setValue("subSectorId", initialData.subSectorId!);
    } else {
      setValue("subSectorId", "");
    }
  }, [selectedSectorId, setValue, initialData]);

  // Filter for parent sectors (those with no parent_id - actually all are sectors now)
  const parentSectors = Array.isArray(sectors) ? sectors : [];

  const parentSectorOptions = parentSectors.map((s: any) => ({
    value: s.id,
    label: s.name,
  }));

  const sectorSelectOptions = [
    { value: "", label: "Selecciona un sector" },
  ].concat(parentSectorOptions);

  // Filter for sub-sectors of the selected parent
  const selectedSector = Array.isArray(sectors)
    ? sectors.find((s: any) => s.id === selectedSectorId)
    : null;

  const subSectors = selectedSector?.subSectors || [];

  const subSectorOptions = [
    { value: "", label: "Selecciona un sub-sector" },
  ].concat(
    subSectors.map((s: any) => ({
      value: s.id,
      label: s.supervisor
        ? `${s.name} (${s.supervisor.firstName} ${s.supervisor.lastName})`
        : s.name,
    }))
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset({ name: "", sectorId: "", subSectorId: "" });
      }}
      title="Nueva Célula"
    >
      <form
        suppressHydrationWarning
        onSubmit={handleSubmit(async (form) => {
          try {
            // We must pass subSectorId. If user selected a subsector, use it.
            // If user only selected a sector, we can't really create the cell unless we force subsector.
            // But let's assume we pass the subSectorId if present.
            await createCellMutation.mutateAsync({
              name: form.name,
              subSectorId: form.subSectorId || "",
              // We don't pass sectorId anymore as createCell expects subSectorId
            });
            showSuccess("Célula creada exitosamente");
            onClose();
            reset({ name: "", sectorId: "", subSectorId: "" });
            onCreated?.();
          } catch (e) {
            const message =
              e instanceof Error ? e.message : "Error al crear la célula";
            showError(message);
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
            rules={{}}
            error={errors.sectorId?.message}
            options={sectorSelectOptions}
            className="select select-bordered w-full"
          />

          {subSectors.length > 0 && (
            <SelectField<FormValues & { subSectorId?: string }>
              name="subSectorId"
              label="Subsectores"
              register={register}
              rules={{}}
              // No error mapping needed as it's optional in schema but we use it for selection
              options={subSectorOptions}
              className="select select-bordered w-full"
            />
          )}

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
              reset({ name: "", sectorId: "", subSectorId: "" });
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
