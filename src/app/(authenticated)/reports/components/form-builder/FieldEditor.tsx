import React from "react";
import { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FaCopy, FaTrash } from "react-icons/fa6";
import { InputField } from "@/components/FormControls";
import { OptionsEditor } from "./OptionsEditor";
import { slugify } from "./utils";
import { ReportFormValues, FieldItem } from "./types";

interface FieldEditorProps {
  index: number;
  field: FieldItem;
  register: UseFormRegister<ReportFormValues>;
  control: Control<ReportFormValues>;
  setValue: UseFormSetValue<ReportFormValues>;
  onDuplicate: (index: number) => void;
  onRemove: (index: number) => void;
}

export function FieldEditor({
  index,
  field,
  register,
  control,
  setValue,
  onDuplicate,
  onRemove,
}: FieldEditorProps) {
  return (
    <div className="p-4 border border-base-300 bg-base-200 rounded-lg hover:shadow-sm transition-all group">
      {/* Field Header / Actions */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-base-200">
        <div className="badge badge-ghost gap-1 cursor-grab active:cursor-grabbing">
          <span className="opacity-50">☰</span>
          <span className="text-xs font-medium opacity-70">
            {field.type === "TEXT" && "Texto"}
            {field.type === "NUMBER" && "Número"}
            {field.type === "CURRENCY" && "Moneda"}
            {field.type === "BOOLEAN" && "Sí/No"}
            {field.type === "DATE" && "Fecha"}
            {field.type === "SELECT" && "Opción Múltiple"}
            {field.type === "SECTION" && "Sección"}
            {field.type === "MEMBER_SELECT" && "Selección de Miembro"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="btn btn-ghost btn-xs text-neutral"
            onClick={() => onDuplicate(index)}
            title="Duplicar"
          >
            <FaCopy className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-xs text-neutral"
            onClick={() => onRemove(index)}
            title="Eliminar"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Field Inputs */}
      <div className="space-y-3">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              {...register(`fields.${index}.label` as const, {
                required: field.type !== "SECTION",
                onChange: (e) => {
                  if (!field.fieldId) {
                    setValue(`fields.${index}.key`, slugify(e.target.value));
                  }
                },
              })}
              className="input input-bordered input-sm w-full font-medium"
              placeholder={
                field.type === "SECTION"
                  ? "Título de la sección..."
                  : "Escribe tu pregunta aquí..."
              }
            />
          </div>
          <div className="flex items-center">
            {field.type !== "SECTION" && (
              <label className="label cursor-pointer gap-2">
                <span className="label-text text-xs">Obligatorio</span>
                <input
                  type="checkbox"
                  className="toggle toggle-xs toggle-primary"
                  {...register(`fields.${index}.required` as const)}
                />
              </label>
            )}
          </div>
        </div>

        {field.type === "SELECT" && (
          <OptionsEditor
            nestIndex={index}
            control={control}
            register={register}
          />
        )}

        {field.type !== "SECTION" && (
          <div className="collapse collapse-arrow border border-base-200 bg-base-100 rounded-md">
            <input type="checkbox" />
            <div className="collapse-title text-xs font-medium text-base-content/60 py-2 min-h-0">
              Opciones avanzadas
            </div>
            <div className="collapse-content text-sm">
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  name={`fields.${index}.key`}
                  label="ID de base de datos (slug)"
                  register={register}
                  rules={{ required: "Requerido" }}
                  // defaultValue handled by react-hook-form's register or defaultValues in parent
                  placeholder={field.fieldId ? "Bloqueado" : "Autogenerado..."}
                  className={`input input-bordered input-sm w-full ${
                    field.fieldId
                      ? "bg-base-200 text-base-content/60 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={!!field.fieldId}
                  tabIndex={field.fieldId ? -1 : undefined}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
