"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { InputField, SelectField } from "@/components/FormControls";
import { getAllSectors, getMembersByCell } from "../../actions/cells.actions";

export interface CellFormInput {
  name: string;
  sectorId?: string | null;
  leaderId?: string | null;
  hostId?: string | null;
}

interface CellFormProps {
  initialData?: Partial<CellFormInput> & { id?: string };
  onSubmit: SubmitHandler<CellFormInput>;
  isEditMode?: boolean;
  isSubmitting?: boolean;
}

const CellForm: React.FC<CellFormProps> = ({
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
    formState: { errors },
  } = useForm<CellFormInput>({
    defaultValues: initialData,
    mode: "onChange",
  });

  const prevInitialDataRef = useRef<string | null>(null);
  useEffect(() => {
    const json = JSON.stringify(initialData ?? {});
    if (prevInitialDataRef.current === json) return;
    prevInitialDataRef.current = json;
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleSubmitInternal = async (data: CellFormInput) => {
    try {
      await onSubmit(data);
      reset(data);
      prevInitialDataRef.current = JSON.stringify(data ?? {});
    } catch (error) {
      console.error("Error al enviar el formulario", error);
    }
  };

  // Datos para selects
  const { data: sectors, isLoading: loadingSectors } = useQuery({
    queryKey: ["sectors", "all"],
    queryFn: () => getAllSectors(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const cellId = initialData?.id || "";
  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ["cell", "members", cellId],
    queryFn: () => getMembersByCell(cellId),
    enabled: !!cellId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const sectorOptions = (sectors || []).map((s) => ({
    value: s.id,
    label: s.name,
  }));
  const sectorPlaceholder = [{ value: "", label: "Selecciona un sector" }];
  const sectorSelectOptions = sectorPlaceholder.concat(sectorOptions);

  const memberOptions = (members || []).map((m) => ({
    value: m.id,
    label: `${m.firstName} ${m.lastName}` + (m.email ? ` - ${m.email}` : ""),
  }));
  const memberPlaceholder = [
    { value: "", label: "Selecciona un miembro de la célula" },
  ];
  const memberSelectOptions = memberPlaceholder.concat(memberOptions);

  useEffect(() => {
    if (sectors && initialData?.sectorId) {
      setValue("sectorId", initialData.sectorId);
    }
  }, [sectors, initialData?.sectorId, setValue]);

  useEffect(() => {
    if (cellId && members) {
      if (initialData?.leaderId) setValue("leaderId", initialData.leaderId);
      if (initialData?.hostId) setValue("hostId", initialData.hostId);
    }
  }, [cellId, members, initialData?.leaderId, initialData?.hostId, setValue]);

  return (
    <form onSubmit={handleSubmit(handleSubmitInternal)} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">
                {isEditMode ? "Editar Célula" : "Nueva Célula"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField<CellFormInput>
                  name="name"
                  label="Nombre de la Célula"
                  register={register}
                  rules={{ required: "El nombre es requerido" }}
                  defaultValue={initialData?.name}
                  error={errors.name?.message}
                />

                <SelectField<CellFormInput>
                  name="sectorId"
                  label="Sector"
                  register={register}
                  rules={{}}
                  error={errors.sectorId?.message}
                  options={sectorSelectOptions}
                  className="select select-bordered w-full"
                  defaultValue={initialData?.sectorId || ""}
                />
                {loadingSectors && (
                  <p className="text-sm text-base-content/60 md:col-span-2">
                    Cargando sectores...
                  </p>
                )}

                <SelectField<CellFormInput>
                  name="leaderId"
                  label="Líder de la Célula"
                  register={register}
                  rules={{}}
                  error={errors.leaderId?.message}
                  options={memberSelectOptions}
                  className="select select-bordered w-full"
                  defaultValue={initialData?.leaderId || ""}
                />
                <SelectField<CellFormInput>
                  name="hostId"
                  label="Anfitrión de la Célula"
                  register={register}
                  rules={{}}
                  error={errors.hostId?.message}
                  options={memberSelectOptions}
                  className="select select-bordered w-full"
                  defaultValue={initialData?.hostId || ""}
                />
                {!cellId && (
                  <p className="text-sm text-base-content/60 md:col-span-2">
                    Primero agrega miembros a la célula (pestaña Miembros) para
                    poder seleccionar líder y anfitrión.
                  </p>
                )}
                {cellId && loadingMembers && (
                  <p className="text-sm text-base-content/60 md:col-span-2">
                    Cargando miembros de la célula...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8"></div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push("/cells")}
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
            "Actualizar Célula"
          ) : (
            "Crear Célula"
          )}
        </button>
      </div>
    </form>
  );
};

export default CellForm;
