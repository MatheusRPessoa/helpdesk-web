import { useId, useRef } from "react";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const descriptionId = useId();

  return (
    <Dialog
      open={open}
      title={title}
      role="alertdialog"
      aria-describedby={descriptionId}
      onCancel={onCancel}
      isLoading={isLoading}
      initialFocusRef={cancelButtonRef}
    >
      <div className="p-6">
        <p id={descriptionId} className="text-sm text-gray-500">
          {description}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            ref={cancelButtonRef}
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            aria-busy={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? "Carregando..." : confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
