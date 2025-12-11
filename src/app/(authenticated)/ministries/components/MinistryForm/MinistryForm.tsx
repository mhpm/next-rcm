"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, MemberSearchField } from "@/components/FormControls";
import {
  ministryFormSchema,
  type MinistryFormInput,
} from "@/app/(authenticated)/ministries/schema/ministries.schema";
export type { MinistryFormInput } from "@/app/(authenticated)/ministries/schema/ministries.schema";

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
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MinistryFormInput>({
    defaultValues: initialData,
    mode: "onChange",
    resolver: zodResolver(ministryFormSchema),
  });

  // Reset cuando cambian los datos iniciales (útil en modo edición)
  const prevInitialDataRef = useRef<string | null>(null);
  useEffect(() => {
    const json = JSON.stringify(initialData ?? {});
    // Evitar reestablecer el formulario si el contenido de initialData no cambió
    if (prevInitialDataRef.current === json) return;
    prevInitialDataRef.current = json;
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Observar el leaderId actual del formulario

  const handleSubmitInternal = async (data: MinistryFormInput) => {
    try {
      await onSubmit(data);
      // Mantener sincronizados los valores del formulario con lo enviado
      // para evitar que visualmente se "regenere" con los valores antiguos.
      reset(data);
      // Actualizar referencia para que el efecto de initialData no sobrescriba lo enviado
      prevInitialDataRef.current = JSON.stringify(data ?? {});
    } catch (error) {
      console.error("Error al enviar el formulario", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitInternal)} className="space-y-4">
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
                {/* Buscador y selección de líder (reusable) */}
                <MemberSearchField<MinistryFormInput>
                  name="leaderId"
                  label="Líder del Ministerio"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  error={errors.leaderId?.message}
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
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push("/ministries")}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
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
            "Crear Ministerio"
          )}
        </button>
      </div>
    </form>
  );
};

export default MinistryForm;
