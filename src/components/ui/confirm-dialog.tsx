import { useLayoutEffect, useId, useRef } from "react";
import type { SyntheticEvent } from "react";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    const previousFocus = document.activeElement;

    dialog.showModal();
    cancelButtonRef.current?.focus();

    return () => {
      dialog.close();

      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [open]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();

    if (!isLoading) {
      onCancel();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={handleCancel}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-[10px] border border-gray-300 bg-gray-100 p-0 backdrop:bg-gray-600/50"
    >
      <div className="border-b border-gray-300 px-6 py-4">
        <h2 id={titleId} className="text-lg font-bold text-blue-dark">
          {title}
        </h2>
      </div>

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
            className="cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            className="cursor-pointer"
            type="button"
            disabled={isLoading}
            aria-busy={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? "Carregando..." : confirmText}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
