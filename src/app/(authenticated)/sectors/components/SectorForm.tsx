"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputField,
  MemberSearchField,
  SelectField,
} from "@/components/FormControls";
import {
  sectorFormSchema,
  type SectorFormInput,
} from "../schema/sectors.schema";
import { useQuery } from "@tanstack/react-query";
import { getAllSectors } from "../actions/sectors.actions";
import { getAllMembers } from "../../members/actions/members.actions";
import { MemberRole } from "@/generated/prisma/enums";

interface SectorFormProps {
  initialData?: Partial<SectorFormInput> & { id?: string };
  onSubmit: SubmitHandler<SectorFormInput>;
  isEditMode?: boolean;
  isSubmitting?: boolean;
}

const SectorForm: React.FC<SectorFormProps> = ({
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
  } = useForm<SectorFormInput>({
    defaultValues: initialData,
    mode: "onChange",
    resolver: zodResolver(sectorFormSchema),
  });

  // Fetch all sectors for the parent selector
  const { data: sectorsData } = useQuery({
    queryKey: ["sectors", "all"],
    queryFn: () => getAllSectors({ limit: 1000 }),
  });

  const parentOptions = (sectorsData?.sectors || [])
    .filter((s) => s.id !== initialData?.id) // Prevent selecting itself as parent
    .map((s) => ({
      value: s.id,
      label: s.name,
    }));

  const parentSelectOptions = [
    { value: "", label: "Sin sector padre (Sector Principal)" },
    ...parentOptions,
  ];

  const prevInitialDataRef = useRef<string | null>(null);
  useEffect(() => {
    const json = JSON.stringify(initialData ?? {});
    if (prevInitialDataRef.current === json) return;
    prevInitialDataRef.current = json;
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleSubmitInternal = async (data: SectorFormInput) => {
    try {
      await onSubmit(data);
      reset(data);
      prevInitialDataRef.current = JSON.stringify(data ?? {});
    } catch (error) {
      console.error("Error al enviar el formulario", error);
    }
  };

  const isSubSector = !!initialData?.parentId;

  // Watch parentId to update the value when options are loaded
  useEffect(() => {
    if (initialData?.parentId && sectorsData?.sectors) {
      setValue("parentId", initialData.parentId);
    }
  }, [initialData?.parentId, sectorsData?.sectors, setValue]);

  return (
    <form onSubmit={handleSubmit(handleSubmitInternal)} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">
                {isEditMode
                  ? isSubSector
                    ? "Editar Subsector"
                    : "Editar Sector"
                  : "Nuevo Sector"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField<SectorFormInput>
                  name="name"
                  label={
                    isSubSector ? "Nombre del Subsector" : "Nombre del Sector"
                  }
                  register={register}
                  rules={{ required: "El nombre es requerido" }}
                  defaultValue={initialData?.name}
                  error={errors.name?.message}
                />
                <MemberSearchField<SectorFormInput>
                  name="supervisorId"
                  label="Supervisor (opcional)"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  error={errors.supervisorId?.message}
                  search={async (term) => {
                    const res = await getAllMembers({
                      search: term,
                      limit: 10,
                      // Removed role filter to allow searching all members
                    });
                    return res.members;
                  }}
                />
                {isSubSector ? (
                  <SelectField<SectorFormInput>
                    name="parentId"
                    label="Sector Padre"
                    register={register}
                    options={parentSelectOptions}
                    error={errors.parentId?.message}
                  />
                ) : (
                  <SelectField<SectorFormInput>
                    name="zoneId"
                    label="Zona (Opcional)"
                    register={register}
                    // TODO: Fetch zones options
                    options={[{ value: "", label: "Sin zona" }]}
                    error={errors.zoneId?.message}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.back()}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          {isEditMode ? "Guardar Cambios" : "Crear Sector"}
        </button>
      </div>
    </form>
  );
};

export default SectorForm;
