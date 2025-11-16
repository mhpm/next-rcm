"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Estado para búsqueda de líder
  const [leaderSearch, setLeaderSearch] = useState<string>("");
  const debouncedSearch = useDebounce(leaderSearch, 300);
  const dropdownOpen = debouncedSearch.length >= 2;

  // Buscar miembros por término (lazy: sólo cuando hay 2+ caracteres)
  const { data: searchResult, isLoading: isSearching } = useQuery({
    queryKey: ["member-search", debouncedSearch],
    queryFn: async () => {
      const res = await getAllMembers({ search: debouncedSearch, limit: 10 });
      return res.members;
    },
    enabled: debouncedSearch.length >= 2,
    staleTime: 60_000,
  });

  // Observar el leaderId actual del formulario y mostrar chip dinámico
  const leaderIdValue = watch("leaderId");
  // Estado local para mantener estable el chip del líder (evita parpadeos durante refetch)
  const [localSelectedLeader, setLocalSelectedLeader] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
  } | null>(null);
  const { data: selectedLeader } = useMember(leaderIdValue || "");
  const selectedLeaderName = useMemo(() => {
    if (localSelectedLeader) {
      return `${localSelectedLeader.firstName} ${localSelectedLeader.lastName}`;
    }
    if (selectedLeader) {
      return `${selectedLeader.firstName} ${selectedLeader.lastName}`;
    }
    return undefined;
  }, [localSelectedLeader, selectedLeader]);

  // Sincroniza el estado local con el dato remoto cuando exista leaderId (evita desaparezca el chip durante el refetch)
  useEffect(() => {
    if (!localSelectedLeader && selectedLeader) {
      setLocalSelectedLeader({
        id: selectedLeader.id,
        firstName: selectedLeader.firstName,
        lastName: selectedLeader.lastName,
        email: selectedLeader.email ?? null,
      });
    }
  }, [selectedLeader, localSelectedLeader]);

  const handleSubmitInternal: SubmitHandler<MinistryFormInput> = (data) => {
    const normalizedLeaderId =
      data.leaderId && data.leaderId.trim() !== "" ? data.leaderId : null;
    onSubmit({ ...data, leaderId: normalizedLeaderId });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitInternal)}>
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

                  {/* Chip del líder seleccionado (si aplica) */}
                  {selectedLeaderName ? (
                    <div className="badge badge-soft badge-neutral ml-2 gap-2 mb-2 p-3">
                      {selectedLeaderName}
                      <button
                        type="button"
                        className="ml-2 btn btn-ghost btn-xs"
                        onClick={() => {
                          setValue("leaderId", "");
                          setLeaderSearch("");
                          setLocalSelectedLeader(null);
                        }}
                      >
                        Quitar
                      </button>
                    </div>
                  ) : null}

                  {/* Buscador */}
                  <div
                    className={`dropdown w-full ${
                      dropdownOpen ? "dropdown-open" : ""
                    }`}
                  >
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Buscar miembros por nombre..."
                      value={leaderSearch}
                      onChange={(e) => setLeaderSearch(e.target.value)}
                    />

                    {/* Resultados */}
                    {dropdownOpen && (
                      <ul className="dropdown-content menu bg-base-100 w-full z-10 shadow">
                        {isSearching && (
                          <li className="p-2 text-sm opacity-70">
                            Buscando...
                          </li>
                        )}
                        {!isSearching &&
                          (!searchResult || searchResult.length === 0) && (
                            <li className="p-2 text-sm opacity-70">
                              Sin resultados
                            </li>
                          )}
                        {!isSearching &&
                          searchResult?.map((m) => (
                            <li key={m.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  setValue("leaderId", m.id);
                                  // Mostrar chip con el nombre seleccionado
                                  setLeaderSearch("");
                                  // Guardar localmente para mostrar el chip sin esperar al fetch
                                  setLocalSelectedLeader({
                                    id: m.id,
                                    firstName: m.firstName,
                                    lastName: m.lastName,
                                    email: m.email,
                                  });
                                }}
                              >
                                {m.firstName} {m.lastName}{" "}
                                {m.email ? `— ${m.email}` : ""}
                              </button>
                            </li>
                          ))}
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
