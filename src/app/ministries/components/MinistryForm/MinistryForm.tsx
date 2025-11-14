"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

import { InputField } from "@/components/FormControls";

// Tipos del formulario
export interface MinistryFormInput {
  name: string;
  description?: string;
}

interface MinistryFormProps {
  initialData?: Partial<MinistryFormInput> & { id?: string };
  onSubmit: SubmitHandler<MinistryFormInput>;
  isEditMode?: boolean;
  isSubmitting?: boolean;
}

/**
 * MinistryForm
 * Formulario reusable para Crear y Editar Ministerios.
 * - Usa los FormControls del proyecto para mantener un estilo consistente con Members.
 */
const MinistryForm: React.FC<MinistryFormProps> = ({
  initialData,
  onSubmit,
  isEditMode = false,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MinistryFormInput>({
    defaultValues: initialData,
    mode: "onChange",
  });

  // Reset cuando cambian los datos iniciales (útil en modo edición)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-3 space-y-8">
          {/* Información del Ministerio */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">
                {isEditMode ? "Editar Ministerio" : "Nuevo Ministerio"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField<MinistryFormInput>
                  name="name"
                  label="Nombre del Ministerio"
                  register={register}
                  rules={{ required: "El nombre es requerido" }}
                  defaultValue={initialData?.name}
                  error={errors.name?.message}
                />
                <InputField<MinistryFormInput>
                  name="description"
                  label="Descripción"
                  register={register}
                  defaultValue={initialData?.description}
                  placeholder="Breve descripción"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna secundaria (opcional para futuras secciones) */}
        <div className="space-y-8"></div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 mt-8">
        <Link href="/ministries" className="btn btn-ghost">
          Cancelar
        </Link>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {isEditMode ? "Actualizando..." : "Guardando..."}
            </>
          ) : isEditMode ? (
            "Actualizar Ministerio"
          ) : (
            "Guardar Cambios"
          )}
        </button>
      </div>
    </form>
  );
};

export default MinistryForm;
