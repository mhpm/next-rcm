"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";

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
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
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
    const isInitialSetup =
      initialData?.sectorId === selectedSectorId && initialData?.subSectorId;
    if (isInitialSetup) {
      setValue("subSectorId", initialData.subSectorId!);
    } else {
      setValue("subSectorId", "");
    }
  }, [selectedSectorId, setValue, initialData]);

  // Filter for parent sectors
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

  const handleClose = () => {
    onClose();
    reset({ name: "", sectorId: "", subSectorId: "" });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Célula</DialogTitle>
        </DialogHeader>
        <form
          suppressHydrationWarning
          onSubmit={handleSubmit(async (form) => {
            try {
              await createCellMutation.mutateAsync({
                name: form.name,
                subSectorId: form.subSectorId || "",
              });
              showSuccess("Célula creada exitosamente");
              handleClose();
              onCreated?.();
            } catch (e) {
              const message =
                e instanceof Error ? e.message : "Error al crear la célula";
              showError(message);
            }
          })}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 py-2">
            <InputField<FormValues>
              name="name"
              label="Nombre de la Célula"
              control={control}
              rules={{ required: "El nombre es requerido" }}
              error={errors.name?.message}
              placeholder="Ej. Célula de Vida"
            />
            <SelectField<FormValues>
              name="sectorId"
              label="Sector"
              control={control}
              rules={{}}
              error={errors.sectorId?.message}
              options={sectorSelectOptions}
              className="w-full"
            />

            {subSectors.length > 0 && (
              <SelectField<FormValues & { subSectorId?: string }>
                name="subSectorId"
                label="Subsectores"
                control={control}
                rules={{}}
                options={subSectorOptions}
                className="w-full"
              />
            )}

            {loadingSectors && (
              <p className="text-sm text-muted-foreground">
                Cargando sectores...
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createCellMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createCellMutation.isPending}>
              {createCellMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {createCellMutation.isPending ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
