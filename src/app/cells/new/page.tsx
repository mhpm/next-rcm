"use client";

import { useRouter } from "next/navigation";
import CellForm, { CellFormInput } from "../components/CellForm/CellForm";
import { useCreateCell } from "../hooks/useCells";
import { useNotificationStore } from "@/store/NotificationStore";
import { BackLink, Breadcrumbs } from "@/components";

export default function NewCellPage() {
  const router = useRouter();
  const createCell = useCreateCell();
  const { showSuccess, showError } = useNotificationStore();

  const handleSubmit = async (data: CellFormInput) => {
    try {
      await createCell.mutateAsync(data);
      showSuccess("Célula creada exitosamente");
      router.push("/cells");
    } catch (error) {
      console.error(error);
      showError("Error al crear la célula");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/cells" />
        <Breadcrumbs />
      </div>
      <CellForm
        initialData={{ leaderId: "", hostId: "", sectorId: "" }}
        onSubmit={handleSubmit}
        isEditMode={false}
        isSubmitting={createCell.isPending}
      />
    </div>
  );
}
