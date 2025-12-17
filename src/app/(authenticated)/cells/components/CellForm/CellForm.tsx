"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  InputField,
  SelectField,
  FormSection,
} from "@/components/FormControls";
import { getMembersByCell, getAllSectors } from "../../actions/cells.actions";
import { cellFormSchema } from "../../schema/cells.schema";
import type { CellFormInput } from "../../schema/cells.schema";

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
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof cellFormSchema>>({
    resolver: zodResolver(cellFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      sectorId: initialData?.sectorId ?? "",
      subSectorId: initialData?.subSectorId ?? "",
      leaderId: initialData?.leaderId ?? "",
      hostId: initialData?.hostId ?? "",
      id: initialData?.id,
    },
    mode: "onChange",
  });

  const prevInitialDataRef = useRef<string | null>(null);
  useEffect(() => {
    const json = JSON.stringify(initialData ?? {});
    if (prevInitialDataRef.current === json) return;
    prevInitialDataRef.current = json;
    if (initialData) {
      reset({
        name: initialData.name ?? "",
        sectorId: initialData.sectorId ?? "",
        subSectorId: initialData.subSectorId ?? "",
        leaderId: initialData.leaderId ?? "",
        hostId: initialData.hostId ?? "",
        id: initialData.id,
      });
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

  const cellId = initialData?.id || "";
  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ["cell", "members", cellId],
    queryFn: () => getMembersByCell(cellId),
    enabled: !!cellId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: sectorsData, isLoading: loadingSectors } = useQuery({
    queryKey: ["sectors", "all"],
    queryFn: () => getAllSectors(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const sectors = sectorsData || [];
  const selectedSectorId = watch("sectorId");

  // Reset sub-sector when parent sector changes
  useEffect(() => {
    if (initialData?.sectorId && selectedSectorId !== initialData.sectorId) {
      setValue("subSectorId", "");
    } else if (!initialData?.sectorId) {
      setValue("subSectorId", "");
    }
  }, [selectedSectorId, initialData?.sectorId, setValue]);

  const parentSectors = Array.isArray(sectors) ? sectors : [];
  const parentSectorOptions = parentSectors.map((s: any) => ({
    value: s.id,
    label: s.name,
  }));
  const sectorSelectOptions = [
    { value: "", label: "Selecciona un sector" },
  ].concat(parentSectorOptions);

  const selectedSector = Array.isArray(sectors)
    ? sectors.find((s: any) => s.id === selectedSectorId)
    : null;
  const subSectorsList = selectedSector?.subSectors || [];
  const subSectorOptions = [
    { value: "", label: "Selecciona un sub-sector" },
  ].concat(
    subSectorsList.map((s: any) => ({
      value: s.id,
      label: s.name,
    }))
  );

  const memberOptions = (members || []).map((m) => ({
    value: m.id,
    label: `${m.firstName} ${m.lastName}` + (m.email ? ` - ${m.email}` : ""),
  }));
  const memberPlaceholder = [
    { value: "", label: "Selecciona un miembro de la célula" },
  ];
  const memberSelectOptions = memberPlaceholder.concat(memberOptions);

  useEffect(() => {
    if (cellId && members) {
      if (initialData?.leaderId) setValue("leaderId", initialData.leaderId);
      if (initialData?.hostId) setValue("hostId", initialData.hostId);
    }
  }, [cellId, members, initialData?.leaderId, initialData?.hostId, setValue]);

  // Removed useEffect for subsector reset as it's now handled by the component

  return (
    <form
      suppressHydrationWarning
      onSubmit={handleSubmit(handleSubmitInternal)}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <FormSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField<z.infer<typeof cellFormSchema>>
                name="name"
                label="Nombre de la Célula"
                register={register}
                rules={{ required: "El nombre es requerido" }}
                defaultValue={initialData?.name}
                error={errors.name?.message}
              />

              <SelectField<z.infer<typeof cellFormSchema>>
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
          </FormSection>
          <FormSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField<z.infer<typeof cellFormSchema>>
                name="sectorId"
                label="Sector"
                register={register}
                rules={{}}
                error={errors.sectorId?.message}
                options={sectorSelectOptions}
                className="select select-bordered w-full"
                defaultValue={initialData?.sectorId || ""}
              />
              <SelectField<z.infer<typeof cellFormSchema>>
                name="subSectorId"
                label="Subsector"
                register={register}
                rules={{}}
                error={errors.subSectorId?.message}
                options={subSectorOptions}
                className="select select-bordered w-full"
                defaultValue={initialData?.subSectorId || ""}
                disabled={!selectedSectorId || subSectorsList.length === 0}
              />
            </div>
          </FormSection>
        </div>
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
