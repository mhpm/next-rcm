import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

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
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2">
            <span>
              ¿Estás seguro de que deseas eliminar{" "}
              {entityName ? "" : "este elemento"}
              {entityName ? (
                <>
                  {" "}
                  <span className="font-semibold text-foreground">
                    {entityName}
                  </span>{" "}
                  ?
                </>
              ) : (
                "?"
              )}
            </span>
            <span className="text-destructive">{description}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
