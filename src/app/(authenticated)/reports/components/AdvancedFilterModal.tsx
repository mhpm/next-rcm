"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RiCloseLine, RiFilter3Line, RiDeleteBinLine } from "react-icons/ri";
import { InputField, SelectField } from "@/components/FormControls";
import type { ReportFieldType } from "@/generated/prisma/client";

export type FilterField = {
  id: string;
  key: string;
  label?: string | null;
  type: ReportFieldType;
  options?: string[];
};

type AdvancedFilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
  fields: FilterField[];
  activeFilters: Record<string, any>;
};

export default function AdvancedFilterModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  fields,
  activeFilters,
}: AdvancedFilterModalProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  // Reset form when modal opens or activeFilters change
  useEffect(() => {
    if (isOpen) {
      reset(activeFilters);
    }
  }, [isOpen, activeFilters, reset]);

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
          Filtros Avanzados
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Campos fijos */}
            <div className="form-control">
              <label className="label font-medium">Entidad</label>
              <input
                {...register("entidad")}
                className="input input-bordered w-full"
                placeholder="Buscar por nombre de entidad..."
              />
            </div>

            <div className="form-control">
              <label className="label font-medium">Fecha (Desde)</label>
              <input
                type="date"
                {...register("createdAt_from")}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label font-medium">Fecha (Hasta)</label>
              <input
                type="date"
                {...register("createdAt_to")}
                className="input input-bordered w-full"
              />
            </div>

            {/* Campos dinámicos del reporte */}
            {fields.map((field) => (
              <div key={field.id} className="form-control">
                <label className="label font-medium">
                  {field.label || field.key}
                </label>

                {field.type === "TEXT" && (
                  <input
                    {...register(field.id)}
                    className="input input-bordered w-full"
                    placeholder={`Contiene...`}
                  />
                )}

                {(field.type === "NUMBER" || field.type === "CURRENCY") && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step={field.type === "CURRENCY" ? "0.01" : "1"}
                      {...register(`${field.id}_min`)}
                      className="input input-bordered w-full"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      step={field.type === "CURRENCY" ? "0.01" : "1"}
                      {...register(`${field.id}_max`)}
                      className="input input-bordered w-full"
                      placeholder="Max"
                    />
                  </div>
                )}

                {field.type === "BOOLEAN" && (
                  <select
                    {...register(field.id)}
                    className="select select-bordered w-full"
                    defaultValue=""
                  >
                    <option value="">Todos</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                )}

                {field.type === "DATE" && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      {...register(`${field.id}_from`)}
                      className="input input-bordered w-full"
                    />
                    <input
                      type="date"
                      {...register(`${field.id}_to`)}
                      className="input input-bordered w-full"
                    />
                  </div>
                )}

                {field.type === "SELECT" && (
                  <select
                    {...register(field.id)}
                    className="select select-bordered w-full"
                    defaultValue=""
                  >
                    <option value="">Todos</option>
                    {field.options?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          <div className="modal-action flex justify-center sm:justify-between flex-wrap gap-4 border-t border-base-200 pt-4">
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-ghost text-error gap-2"
            >
              <RiDeleteBinLine />
              Limpiar filtros
            </button>
            <div>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost mr-2"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary px-8">
                Aplicar Filtros
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
