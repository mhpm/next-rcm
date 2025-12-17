"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { RiCloseLine, RiFilter3Line } from "react-icons/ri";
import { MemberRole } from "@/generated/prisma/enums";

type MembersFilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
  activeFilters: Record<string, any>;
};

export default function MembersFilterModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  activeFilters,
}: MembersFilterModalProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: activeFilters,
  });

  // Update form when activeFilters change (e.g. when opening)
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
          Filtros Avanzados de Miembros
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            
            {/* Rol */}
            <div className="form-control">
              <label className="label font-medium">Rol</label>
              <select {...register("role")} className="select select-bordered w-full">
                <option value="">Todos</option>
                {Object.values(MemberRole).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Ministerios */}
             <div className="form-control">
              <label className="label font-medium">Ministerio</label>
              <input
                {...register("ministries")}
                className="input input-bordered w-full"
                placeholder="Buscar por ministerio..."
              />
            </div>

            {/* Dirección */}
            <div className="form-control">
              <label className="label font-medium">Dirección</label>
              <input
                {...register("address")}
                className="input input-bordered w-full"
                placeholder="Ciudad, calle, etc..."
              />
            </div>

             {/* Email */}
             <div className="form-control">
              <label className="label font-medium">Email</label>
              <input
                {...register("email")}
                className="input input-bordered w-full"
                placeholder="Contiene..."
              />
            </div>

            {/* Fecha Nacimiento */}
            <div className="form-control">
              <label className="label font-medium">Fecha Nacimiento (Desde)</label>
              <input
                type="date"
                {...register("birthDate_from")}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label font-medium">Fecha Nacimiento (Hasta)</label>
              <input
                type="date"
                {...register("birthDate_to")}
                className="input input-bordered w-full"
              />
            </div>

            {/* Fecha Bautismo */}
             <div className="form-control">
              <label className="label font-medium">Fecha Bautismo (Desde)</label>
              <input
                type="date"
                {...register("baptismDate_from")}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label font-medium">Fecha Bautismo (Hasta)</label>
              <input
                type="date"
                {...register("baptismDate_to")}
                className="input input-bordered w-full"
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
