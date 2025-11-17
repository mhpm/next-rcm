"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { InputField } from "@/components/FormControls";
import { useMember } from "@/app/members/hooks/useMembers";
import { getAllMembers } from "@/app/members/actions/members.actions";
import { useDebounce } from "@/hooks/useDebounce";

// Tipos del formulario
export interface MinistryFormInput {
  name: string;
  description?: string;
  leaderId?: string | null;
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

  // Estado para búsqueda de líder
  const [leaderSearch, setLeaderSearch] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [hasUserTyped, setHasUserTyped] = useState<boolean>(false);
  const debouncedSearch = useDebounce(leaderSearch, 300);
  const dropdownOpen =
    isSearchFocused && hasUserTyped && debouncedSearch.length >= 2;

  const searchInputRef = useRef<HTMLInputElement>(null);

  const leaderIdValue = watch("leaderId");
  const { data: currentLeader } = useMember(leaderIdValue || "");

  // Efecto: sincroniza el nombre en el input cuando hay leaderId válido.
  // No limpiar el input si no hay leaderId para no borrar lo que escribe el usuario.
  useEffect(() => {
    if (leaderIdValue && currentLeader) {
      setLeaderSearch(`${currentLeader.firstName} ${currentLeader.lastName}`);
      setHasUserTyped(false);
    }
  }, [leaderIdValue, currentLeader]);

  // Buscar miembros por término (lazy: sólo cuando hay 2+ caracteres)
  const { data: searchResult, isLoading: isSearching } = useQuery({
    queryKey: ["member-search", debouncedSearch],
    queryFn: async () => {
      const res = await getAllMembers({ search: debouncedSearch, limit: 10 });
      return res.members;
    },
    enabled: dropdownOpen, // Solo ejecutar si el dropdown está abierto
    staleTime: 60_000,
  });

  // Observar el leaderId actual del formulario

  const handleSubmitInternal = async (data: MinistryFormInput) => {
    try {
      await onSubmit(data);
      // Mantener sincronizados los valores del formulario con lo enviado
      // para evitar que visualmente se "regenere" con los valores antiguos.
      reset(data);
      // Actualizar referencia para que el efecto de initialData no sobrescriba lo enviado
      prevInitialDataRef.current = JSON.stringify(data ?? {});
      setHasUserTyped(false);
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
                {/* Buscador y selección de líder */}
                <fieldset>
                  <label className="label">
                    <span className="label-text">Líder del Ministerio</span>
                  </label>

                  {/* Valor oculto para react-hook-form */}
                  <input type="hidden" {...register("leaderId")} />

                  {/* Mostrar solo el campo de búsqueda sin chip */}

                  {/* Buscador */}
                  <div
                    className={`dropdown w-full ${
                      dropdownOpen ? "dropdown-open" : ""
                    }`}
                  >
                    <div className="relative">
                      <input
                        type="text"
                        className="input input-bordered w-full pr-10"
                        placeholder="Buscar miembros por nombre..."
                        value={leaderSearch}
                        onChange={(e) => {
                          setLeaderSearch(e.target.value);
                          setHasUserTyped(true);
                          if (e.target.value === "") {
                            setValue("leaderId", null);
                          }
                        }}
                        onFocus={() => {
                          setIsSearchFocused(true);
                          // No abrir resultados si no hay tecleo aún
                          setHasUserTyped(false);
                        }}
                        onBlur={() =>
                          setTimeout(() => {
                            setIsSearchFocused(false);
                            setHasUserTyped(false);
                          }, 150)
                        }
                        ref={searchInputRef}
                      />

                      {leaderIdValue && leaderSearch && (
                        <button
                          type="button"
                          aria-label="Quitar líder"
                          className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setValue("leaderId", null);
                            setLeaderSearch("");
                            setHasUserTyped(false);
                            searchInputRef.current?.focus();
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Resultados */}
                    {dropdownOpen && (
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full mt-2"
                      >
                        {isSearching ? (
                          <li>
                            <span>Buscando...</span>
                          </li>
                        ) : searchResult && searchResult.length > 0 ? (
                          searchResult.map((m) => (
                            <li key={m.id}>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  // Evita que el input pierda el foco antes de que se ejecute el click
                                  // así no se cierra el dropdown y no se "deshace" la selección
                                  e.preventDefault();
                                }}
                                onClick={() => {
                                  setValue("leaderId", m.id);
                                  setLeaderSearch(
                                    `${m.firstName} ${m.lastName}`
                                  );
                                  setIsSearchFocused(false);
                                  setHasUserTyped(false);
                                }}
                              >
                                {m.firstName} {m.lastName}{" "}
                                <span className="text-gray-500">
                                  - {m.email}
                                </span>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li>
                            <span>Sin resultados</span>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  {errors.leaderId?.message && (
                    <p className="text-error text-sm mt-1">
                      {errors.leaderId.message}
                    </p>
                  )}
                </fieldset>
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
            "Guardar Cambios"
          )}
        </button>
      </div>
    </form>
  );
};

export default MinistryForm;
