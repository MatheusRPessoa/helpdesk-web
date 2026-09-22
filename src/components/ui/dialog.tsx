import { X } from "lucide-react";
import { useId, useLayoutEffect, useRef } from "react";
import type { ReactNode, RefObject, SyntheticEvent } from "react";

interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onCancel: () => void;
  isLoading?: boolean;
  role?: "dialog" | "alertdialog";
  "aria-describedby"?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  showCloseButton?: boolean;
}

export function Dialog({
  open,
  title,
  children,
  onCancel,
  isLoading = false,
  role = "dialog",
  "aria-describedby": descriptionId,
  initialFocusRef,
  showCloseButton = false,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    const previousFocus = document.activeElement;
    dialog.showModal();
    initialFocusRef?.current?.focus();

    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [open, initialFocusRef]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    if (!isLoading) onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      role={role}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={handleCancel}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-[10px] border border-gray-300 bg-gray-100 p-0 backdrop:bg-gray-600/50"
    >
      <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
        <h2 id={titleId} className="text-lg font-bold text-blue-dark">
          {title}
        </h2>

        {showCloseButton && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Fechar"
            className="text-gray-500 transition hover:text-gray-600 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {children}
    </dialog>
  );
}
