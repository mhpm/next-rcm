"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { InputField, SelectField } from "@/components/FormControls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof cellFormSchema>>({
    resolver: zodResolver(cellFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      sectorId: initialData?.sectorId ?? "",
      subSectorId: initialData?.subSectorId ?? "",
      leaderId: initialData?.leaderId ?? "",
      hostId: initialData?.hostId ?? "",
      assistantId: initialData?.assistantId ?? "",
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
        assistantId: initialData.assistantId ?? "",
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
      if (
        error instanceof Error &&
        error.message === "La clave de acceso ya existe. Por favor, elige otra."
      ) {
        setError("accessCode", {
          type: "manual",
          message: error.message,
        });
      }
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
    queryKey: ["cells", "sectors"],
    queryFn: () => getAllSectors(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const sectors = Array.isArray(sectorsData) ? sectorsData : [];
  const selectedSectorId = watch("sectorId");

  // Reset sub-sector when parent sector changes
  // useEffect(() => {
  //   if (initialData?.sectorId && selectedSectorId !== initialData.sectorId) {
  //     setValue("subSectorId", "");
  //   } else if (!initialData?.sectorId) {
  //     setValue("subSectorId", "");
  //   }
  // }, [selectedSectorId, initialData?.sectorId, setValue]);

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
      label: s.supervisor
        ? `${s.name} (${s.supervisor.firstName} ${s.supervisor.lastName})`
        : s.name,
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
      if (initialData?.assistantId)
        setValue("assistantId", initialData.assistantId);
    }
  }, [
    cellId,
    members,
    initialData?.leaderId,
    initialData?.hostId,
    initialData?.assistantId,
    setValue,
  ]);

  // Removed useEffect for subsector reset as it's now handled by the component

  return (
    <form
      suppressHydrationWarning
      onSubmit={handleSubmit(handleSubmitInternal)}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField<z.infer<typeof cellFormSchema>>
              name="name"
              label="Nombre de la Célula"
              control={control}
              rules={{ required: "El nombre es requerido" }}
              defaultValue={initialData?.name}
              error={errors.name?.message}
            />

            <InputField<z.infer<typeof cellFormSchema>>
              name="accessCode"
              label="Clave de Acceso"
              control={control}
              rules={{}}
              defaultValue={initialData?.accessCode}
              error={errors.accessCode?.message}
              placeholder="Código único para reportes"
            />

            <SelectField<z.infer<typeof cellFormSchema>>
              name="leaderId"
              label="Líder de la Célula"
              control={control}
              rules={{}}
              error={errors.leaderId?.message}
              options={memberSelectOptions}
              className="w-full"
              defaultValue={initialData?.leaderId || ""}
            />
            <SelectField<CellFormInput>
              name="hostId"
              label="Anfitrión de la Célula"
              control={control}
              rules={{}}
              error={errors.hostId?.message}
              options={memberSelectOptions}
              className="w-full"
              defaultValue={initialData?.hostId || ""}
            />
            <SelectField<CellFormInput>
              name="assistantId"
              label="Asistente de la Célula"
              control={control}
              rules={{}}
              error={errors.assistantId?.message}
              options={memberSelectOptions}
              className="w-full"
              defaultValue={initialData?.assistantId || ""}
            />
            {!cellId && (
              <p className="text-sm text-muted-foreground md:col-span-2">
                Primero agrega miembros a la célula (pestaña Miembros) para
                poder seleccionar líder y anfitrión.
              </p>
            )}
            {cellId && loadingMembers && (
              <p className="text-sm text-muted-foreground md:col-span-2">
                Cargando miembros de la célula...
              </p>
            )}
          </div>

          <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField<z.infer<typeof cellFormSchema>>
              name="sectorId"
              label="Sector"
              control={control}
              rules={{}}
              error={errors.sectorId?.message}
              options={sectorSelectOptions}
              className="w-full"
              defaultValue={initialData?.sectorId || ""}
            />
            <SelectField<z.infer<typeof cellFormSchema>>
              name="subSectorId"
              label="Subsector"
              control={control}
              rules={{}}
              error={errors.subSectorId?.message}
              options={subSectorOptions}
              className="w-full"
              defaultValue={initialData?.subSectorId || ""}
              disabled={!selectedSectorId || subSectorsList.length === 0}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/cells")}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Actualizando..." : "Guardando..."}
            </>
          ) : isEditMode ? (
            "Actualizar Célula"
          ) : (
            "Crear Célula"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CellForm;
