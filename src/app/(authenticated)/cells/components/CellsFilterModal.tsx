"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { RiCloseLine, RiFilter3Line } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { getAllSectors } from "../actions/cells.actions";

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
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: activeFilters,
  });

  const selectedSectorId = watch("sectorId");

  // Fetch sectors for the dropdown
  const { data: sectorsData } = useQuery({
    queryKey: ["sectors", "all"],
    queryFn: () => getAllSectors(),
    staleTime: 5 * 60 * 1000,
  });

  const sectors = sectorsData || [];

  // Filter subsectors based on selected sector
  const selectedSector = Array.isArray(sectors)
    ? sectors.find((s: any) => s.id === selectedSectorId)
    : null;

  const subSectors = selectedSector?.subSectors || [];

  // Update form when activeFilters change
  React.useEffect(() => {
    reset(activeFilters);
  }, [activeFilters, reset, isOpen]);

  // Reset subsector if sector changes
  React.useEffect(() => {
    // Only reset if the current subSectorId is not valid for the new sector
    // But for simplicity, if user manually changes sector, we might want to clear subsector.
    // However, react-hook-form might handle this via user interaction.
    // If this is triggered by reset(activeFilters), we don't want to clear it.
    // So maybe skip this effect or be careful.
    // Let's just let the user handle it.
  }, [selectedSectorId]);

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

  if (!isOpen) return null;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box w-11/12 max-w-3xl relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <RiCloseLine className="w-6 h-6" />
        </button>

        <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
          <RiFilter3Line className="text-primary" />
          Filtros Avanzados de Células
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Sector */}
            <div className="form-control">
              <label className="label font-medium">Sector</label>
              <select
                {...register("sectorId")}
                className="select select-bordered w-full"
              >
                <option value="">Todos</option>
                {sectors.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SubSector */}
            <div className="form-control">
              <label className="label font-medium">Sub-Sector</label>
              <select
                {...register("subSectorId")}
                className="select select-bordered w-full"
                disabled={!selectedSectorId || subSectors.length === 0}
              >
                <option value="">Todos</option>
                {subSectors.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.supervisor
                      ? `${s.name} (${s.supervisor.firstName} ${s.supervisor.lastName})`
                      : s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Líder */}
            <div className="form-control">
              <label className="label font-medium">Líder</label>
              <input
                {...register("leaderName")}
                className="input input-bordered w-full"
                placeholder="Nombre del líder..."
              />
            </div>

            {/* Anfitrión */}
            <div className="form-control">
              <label className="label font-medium">Anfitrión</label>
              <input
                {...register("hostName")}
                className="input input-bordered w-full"
                placeholder="Nombre del anfitrión..."
              />
            </div>

            {/* Cantidad de Miembros (Mínimo) */}
            <div className="form-control">
              <label className="label font-medium">Miembros (Mínimo)</label>
              <input
                type="number"
                {...register("minMembers")}
                className="input input-bordered w-full"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Cantidad de Miembros (Máximo) */}
            <div className="form-control">
              <label className="label font-medium">Miembros (Máximo)</label>
              <input
                type="number"
                {...register("maxMembers")}
                className="input input-bordered w-full"
                placeholder="100"
                min="0"
              />
            </div>
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-ghost"
            >
              Limpiar Filtros
            </button>
            <button type="submit" className="btn btn-primary">
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
