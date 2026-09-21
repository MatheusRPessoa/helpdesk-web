import { useEffect, useId, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserBadge } from "@/components/ui/user-badge";
import type { Customer } from "@/types";

const schema = z.object({
  name: z.string().trim().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.email("E-mail inválido"),
});

type CustomerForm = z.infer<typeof schema>;

interface EditCustomerDialogProps {
  customer: Customer;
  error: string | null;
  onCancel: () => void;
  onSave: (values: CustomerForm) => Promise<void>;
}

export function EditCustomerDialog({
  customer,
  error,
  onCancel,
  onSave,
}: EditCustomerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: customer.name, email: customer.email },
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement;
    dialog.showModal();

    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) onCancel();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-[10px] border border-gray-300 bg-gray-100 p-0 backdrop:bg-gray-600/50"
    >
      <div className="border-b border-gray-300 px-6 py-4">
        <h2 id={titleId} className="text-lg font-bold text-blue-dark">
          Editar cliente
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSave)} className="space-y-4 p-6">
        <UserBadge
          name={customer.name}
          avatarUrl={customer.avatarUrl}
          size="md"
        />
        <Input
          label="Nome"
          aria-label="Nome"
          autoComplete="name"
          disabled={isSubmitting}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="E-mail"
          aria-label="E-mail"
          type="email"
          autoComplete="email"
          disabled={isSubmitting}
          error={errors.email?.message}
          {...register("email")}
        />
        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
