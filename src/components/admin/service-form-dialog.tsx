import { useRef, useState, type ChangeEvent } from "react";

import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

export interface ServiceForm {
  title: string;
  price: number;
}

interface ServiceFormDialogProps {
  service?: Service | null;
  error: string | null;
  onCancel: () => void;
  onSave: (values: ServiceForm) => Promise<void>;
}

function parsePrice(value: string) {
  const trimmed = value.trim();
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;

  return Number(normalized);
}

export function ServiceFormDialog({
  service,
  error,
  onCancel,
  onSave,
}: ServiceFormDialogProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(service?.title ?? "");
  const [price, setPrice] = useState(
    service ? Number(service.price).toFixed(2).replace(".", ",") : "",
  );
  const [titleError, setTitleError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(
    setter: (value: string) => void,
    clearError: (value: null) => void,
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      clearError(null);
    };
  }

  async function handleSubmit() {
    const parsedPrice = parsePrice(price);

    const nextTitleError =
      title.trim().length < 3 ? "Título deve ter ao menos 3 caracteres" : null;
    const nextPriceError =
      Number.isNaN(parsedPrice) || parsedPrice <= 0
        ? "Informe um valor maior que zero"
        : null;

    setTitleError(nextTitleError);
    setPriceError(nextPriceError);

    if (nextTitleError || nextPriceError) return;

    setIsSaving(true);

    try {
      await onSave({ title: title.trim(), price: parsedPrice });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog
      open
      title={service ? "Editar serviço" : "Cadastro de serviço"}
      onCancel={onCancel}
      isLoading={isSaving}
      initialFocusRef={titleInputRef}
      showCloseButton
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
        <div className="flex flex-col gap-4 px-6 py-5">
          <Input
            ref={titleInputRef}
            label="Título"
            value={title}
            onChange={handleChange(setTitle, setTitleError)}
            disabled={isSaving}
            error={titleError ?? undefined}
            placeholder="Nome do serviço"
          />

          <Input
            label="Valor"
            leading="R$"
            value={price}
            onChange={handleChange(setPrice, setPriceError)}
            disabled={isSaving}
            error={priceError ?? undefined}
            inputMode="decimal"
            placeholder="0,00"
          />

          {error && (
            <p role="alert" className="text-xxs text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="px-6 pb-6">
          <Button type="submit" disabled={isSaving} aria-busy={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
