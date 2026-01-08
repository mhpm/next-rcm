"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { RiFilter3Line } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { getAllSectors } from "../actions/cells.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/FormControls";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// ScrollArea no está disponible; usamos un contenedor con overflow

type CellsFilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
  activeFilters: Record<string, any>;
};

export default function CellsFilterModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  activeFilters,
}: CellsFilterModalProps) {
  const { handleSubmit, reset, watch, control, setValue } = useForm({
    defaultValues: activeFilters,
  });

  const selectedSectorId = watch("sectorId");

  // Fetch sectors for the dropdown
  const { data: sectorsData } = useQuery({
    queryKey: ["cells", "sectors"],
    queryFn: () => getAllSectors(),
    staleTime: 5 * 60 * 1000,
  });

  const sectors = Array.isArray(sectorsData) ? sectorsData : [];

  // Filter subsectors based on selected sector
  const selectedSector = Array.isArray(sectors)
    ? sectors.find((s: any) => s.id === selectedSectorId)
    : null;

  const subSectors = selectedSector?.subSectors || [];

  // Update form when activeFilters change
  React.useEffect(() => {
    reset(activeFilters);
  }, [activeFilters, reset, isOpen]);

  const onSubmit = (data: Record<string, any>) => {
    // Filter out empty values
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    onApply(cleanData);
    onClose();
  };

  const handleClear = () => {
    reset({});
    onClear();
    onClose();
  };

  const sectorOptions = [
    { value: "", label: "Todos" },
    ...sectors.map((s: any) => ({ value: s.id, label: s.name })),
  ];

  const subSectorOptions = [
    { value: "", label: "Todos" },
    ...subSectors.map((s: any) => ({
      value: s.id,
      label: s.supervisor
        ? `${s.name} (${s.supervisor.firstName} ${s.supervisor.lastName})`
        : s.name,
    })),
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RiFilter3Line className="text-primary" />
            Filtros Avanzados de Células
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-h-[60vh] pr-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              {/* Sector */}
              <SelectField
                name="sectorId"
                label="Sector"
                control={control}
                options={sectorOptions}
              />

              {/* SubSector */}
              <SelectField
                name="subSectorId"
                label="Sub-Sector"
                control={control}
                options={subSectorOptions}
                disabled={!selectedSectorId || subSectors.length === 0}
              />
            </div>

            <div className="flex items-center space-x-2 py-2 px-1">
              <Checkbox
                id="orphanOnly"
                checked={watch("orphanOnly")}
                onCheckedChange={(checked) => setValue("orphanOnly", checked)}
              />
              <Label htmlFor="orphanOnly">
                Mostrar solo células sin sector (huérfanas)
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              {/* Líder */}
              <InputField
                name="leaderName"
                label="Líder"
                control={control}
                placeholder="Nombre del líder..."
              />

              {/* Anfitrión */}
              <InputField
                name="hostName"
                label="Anfitrión"
                control={control}
                placeholder="Nombre del anfitrión..."
              />

              {/* Asistente */}
              <InputField
                name="assistantName"
                label="Asistente"
                control={control}
                placeholder="Nombre del asistente..."
              />

              {/* Cantidad de Miembros (Mínimo) */}
              <InputField
                name="minMembers"
                label="Miembros (Mínimo)"
                type="number"
                control={control}
                placeholder="0"
                min="0"
              />

              {/* Cantidad de Miembros (Máximo) */}
              <InputField
                name="maxMembers"
                label="Miembros (Máximo)"
                type="number"
                control={control}
                placeholder="100"
                min="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClear}>
              Limpiar Filtros
            </Button>
            <Button type="submit">Aplicar Filtros</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
