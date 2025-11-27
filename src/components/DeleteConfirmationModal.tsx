import { Modal } from "@/components/Modal/Modal";

type DeleteConfirmationModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  entityName?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  cancelText?: string;
  confirmText?: string;
};

export default function DeleteConfirmationModal({
  open,
  title = "Confirmar Eliminación",
  description = "Esta acción no se puede deshacer.",
  entityName,
  onCancel,
  onConfirm,
  isPending = false,
  cancelText = "Cancelar",
  confirmText = "Eliminar",
}: DeleteConfirmationModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="space-y-4">
        <p className="text-base-content">
          ¿Estás seguro de que deseas eliminar{" "}
          {entityName ? "" : "este elemento"}
          {entityName ? (
            <>
              {" "}
              <span className="font-semibold">{entityName}</span> ?
            </>
          ) : (
            "?"
          )}
        </p>
        <p className="text-sm text-warning">{description}</p>
        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className="btn btn-error"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
