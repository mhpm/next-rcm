"use client";

import React from "react";
import CellForm from "../../components/CellForm/CellForm";
import type { CellFormInput } from "../../schema/cells.schema";
import CellsMembersTable from "../../components/CellsMembersTable";
import { useCell, useUpdateCell } from "../../hooks/useCells";
import { useNotificationStore } from "@/store/NotificationStore";
import { BackLink, Breadcrumbs, MinimalLoader } from "@/components";

export default function EditCellPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { data: cellData, isLoading, error } = useCell(id);
  const updateCell = useUpdateCell();
  const { showSuccess, showError } = useNotificationStore();
  const [activeTab, setActiveTab] = React.useState<"info" | "members">("info");

  const handleSubmit = async (data: CellFormInput) => {
    try {
      await updateCell.mutateAsync({ id, data });
      showSuccess("Célula actualizada exitosamente");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Error al actualizar la célula";
      showError(message);
      throw err;
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
        <p className="text-error">Error al cargar la célula</p>
        <BackLink text="Volver a la lista" fallbackHref="/cells" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/cells" />
        <Breadcrumbs />
      </div>
      <div className="flex flex-col gap-4">
        <div role="tablist" className="tabs tabs-border">
          <button
            role="tab"
            className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Información
          </button>
          <button
            role="tab"
            className={`tab ${activeTab === "members" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            Miembros
          </button>
        </div>

        <div className="mt-2">
          {activeTab === "info" && (
            <CellForm
              initialData={{
                name: cellData?.name || "",
                sectorId:
                  cellData?.subSector?.sector?.id ||
                  cellData?.subSector?.sector_id ||
                  "",
                subSectorId: cellData?.subSector?.id || "",
                leaderId: cellData?.leader?.id || cellData?.leader_id || "",
                hostId: cellData?.host?.id || cellData?.host_id || "",
                assistantId: cellData?.assistant?.id || cellData?.assistant_id || "",
                id: cellData?.id,
              }}
              onSubmit={handleSubmit}
              isEditMode={true}
              isSubmitting={updateCell.isPending}
            />
          )}

          {activeTab === "members" && cellData && (
            <CellsMembersTable cellId={id} members={cellData.members ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}
