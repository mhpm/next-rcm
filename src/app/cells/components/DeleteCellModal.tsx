"use client";

import { Modal } from "@/components/Modal/Modal";
import { useDeleteCell } from "../hooks/useCells";
import { useNotificationStore } from "@/store/NotificationStore";
import { CellTableData } from "../types/cells";

type DeleteCellModalProps = {
  open: boolean;
  onClose: () => void;
  cell?: CellTableData;
  onDeleted?: () => void;
};

export default function DeleteCellModal({
  open,
  onClose,
  cell,
  onDeleted,
}: DeleteCellModalProps) {
  const deleteCellMutation = useDeleteCell();
  const { showSuccess, showError } = useNotificationStore();

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      title="Confirmar Eliminación"
    >
      <div className="space-y-4">
        <p className="text-base-content">
          ¿Estás seguro de que deseas eliminar la célula{" "}
          <span className="font-semibold">{cell?.name}</span>?
        </p>
        <p className="text-sm text-warning">
          Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              onClose();
            }}
            className="btn btn-ghost"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              const id = cell?.id;
              if (!id) return;
              try {
                await deleteCellMutation.mutateAsync(id);
                showSuccess("Célula eliminada exitosamente");
                onClose();
                onDeleted?.();
              } catch (e) {
                showError("Error al eliminar la célula");
              }
            }}
            className="btn btn-error"
            disabled={deleteCellMutation.isPending || !cell?.id}
          >
            {deleteCellMutation.isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Eliminar"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
