"use client";

import React from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  Control,
} from "react-hook-form";
import { InputField, SelectField } from "@/components/FormControls";
import { ColorPicker } from "./ColorPicker";
import { ReportFormValues } from "./types";

interface GeneralSettingsFormProps {
  register: UseFormRegister<ReportFormValues>;
  watch: UseFormWatch<ReportFormValues>;
  setValue: UseFormSetValue<ReportFormValues>;
  control: Control<ReportFormValues>;
}

export function GeneralSettingsForm({
  register,
  watch,
  setValue,
  control,
}: GeneralSettingsFormProps) {
  const color = watch("color");
  const watchedValues = watch();

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-6">
        <h3 className="font-semibold text-lg mb-4">Configuración General</h3>
        <div className="space-y-4">
          <InputField
            name="title"
            label="Título del Reporte"
            register={register}
            rules={{ required: "Requerido" }}
            placeholder="ej. Reporte Semanal de Célula"
          />
          <InputField
            name="description"
            label="Descripción (Opcional)"
            register={register}
            placeholder="Instrucciones para llenar el reporte..."
          />
          <SelectField
            name="scope"
            label="Tipo de Entidad"
            control={control}
            options={[
              { value: "CELL", label: "Célula" },
              { value: "GROUP", label: "Grupo" },
              { value: "SECTOR", label: "Sector" },
              { value: "CHURCH", label: "Iglesia" },
            ]}
          />
          <ColorPicker
            selected={color || watchedValues.color || "#3b82f6"}
            onChange={(color) => setValue("color", color)}
          />
        </div>
      </div>
    </div>
  );
}
