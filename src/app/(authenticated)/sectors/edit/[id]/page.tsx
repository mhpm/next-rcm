"use client";

import React from "react";
import SectorForm from "../../components/SectorForm";
import { SectorFormInput } from "../../schema/sectors.schema";
import {
  useSector,
  useUpdateSector,
  useUpdateSubSector,
} from "../../hooks/useSectors";
import { useNotificationStore } from "@/store/NotificationStore";
import { BackLink, Breadcrumbs, MinimalLoader } from "@/components";

export default function EditSectorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { data: sectorData, isLoading, error } = useSector(id);
  const updateSector = useUpdateSector(id);
  const updateSubSector = useUpdateSubSector(id);
  const { showSuccess, showError } = useNotificationStore();

  const handleSubmit = async (data: SectorFormInput) => {
    try {
      if (sectorData?.type === "SUB_SECTOR") {
        await updateSubSector.mutateAsync({
          name: data.name,
          supervisorId: data.supervisorId,
          // sub-sectors don't update zone directly, but can update parent sector
          // data.parentId is the sectorId
          // updateSubSector expects Partial<SubSectorFormData>
          // SubSectorFormData has sectorId.
          // We need to check if data.parentId is defined.
          ...(data.parentId ? { sectorId: data.parentId } : {}),
        });
        showSuccess("Subsector actualizado exitosamente");
      } else {
        await updateSector.mutateAsync({
          name: data.name,
          supervisorId: data.supervisorId,
          zoneId: data.zoneId,
        });
        showSuccess("Sector actualizado exitosamente");
      }
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Error al actualizar el sector";
      showError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <MinimalLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-error">Error al cargar el sector</p>
        <BackLink text="Volver a la lista" fallbackHref="/sectors" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/sectors" />
        <Breadcrumbs />
      </div>

      <SectorForm
        initialData={{
          name: sectorData?.name || "",
          id: sectorData?.id,
          supervisorId:
            sectorData?.supervisor?.id || sectorData?.supervisor_id || "",
          zoneId:
            sectorData?.type === "SECTOR"
              ? sectorData?.zone?.id || sectorData?.zone_id || null
              : null,
          parentId:
            sectorData?.type === "SUB_SECTOR"
              ? sectorData?.sector?.id || sectorData?.sector_id
              : null,
        }}
        onSubmit={handleSubmit}
        isEditMode={true}
        isSubmitting={updateSector.isPending}
      />
    </div>
  );
}
