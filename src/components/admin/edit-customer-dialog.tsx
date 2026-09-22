import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserBadge } from "@/components/ui/user-badge";
import type { Customer } from "@/types";

const schema = z.object({
  name: z.string().trim().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.email("E-mail inválido"),
});

export type CustomerForm = z.infer<typeof schema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: customer.name, email: customer.email },
  });

  return (
    <Dialog
      open
      title="Editar cliente"
      onCancel={onCancel}
      isLoading={isSubmitting}
    >
      <form onSubmit={handleSubmit(onSave)} className="space-y-4 p-6">
        <UserBadge
          name={customer.name}
          avatarUrl={customer.avatarUrl}
          size="md"
        />
        <Input
          label="Nome"
          autoComplete="name"
          disabled={isSubmitting}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="E-mail"
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
            className="cursor-pointer"
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            className="cursor-pointer"
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
