import { useRef, useState } from "react";
import { isAxiosError } from "axios";

import { api } from "@/services/api";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

interface ServiceFormDialogProps {
  service?: Service | null;
  onClose: () => void;
  onSaved: (service: Service) => void
}

function parsePrice(value: string) {
  const normalized = value
    .replace(/\./g, "")
    .replace(",", ".")   
    .trim();

  return Number(normalized);
}

export function ServiceFormDialog({
  service,
  onClose,
  onSaved,
}: ServiceFormDialogProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(service?.title ?? "");
  const [price, setPrice] = useState(
    service ? Number(service.price).toFixed(2).replace(".", ",") : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(setter: (value: string) => void) {
    return (event: { target: { value: string } }) => {
      setter(event.target.value);
      if (error) setError(null);
    };
  }

  async function handleSubmit() {
    const parsedPrice = parsePrice(price);

    if (title.trim().length < 3) {
      setError("Título deve ter ao menos 3 caracteres");
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Informe um valor maior que zero");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = { title: title.trim(), price: parsedPrice };

      const { data } = service
        ? await api.put<Service>(`/services/${service.id}`, payload)
        : await api.post<Service>("/services", payload);

      onSaved(data);
      onClose();
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setError(message ?? "Erro ao salvar serviço");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog
      open
      title={service ? "Editar serviço" : "Cadastro de serviço"}
      onCancel={onClose}
      isLoading={isSaving}
      initialFocusRef={titleInputRef}
      onClose={onClose}
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
            id="service-title"
            ref={titleInputRef}
            label="Título"
            value={title}
            onChange={handleChange(setTitle)}
            placeholder="Nome do serviço"
          />

          <Input
            id="service-price"
            label="Valor"
            leading="R$"
            value={price}
            onChange={handleChange(setPrice)}
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
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
