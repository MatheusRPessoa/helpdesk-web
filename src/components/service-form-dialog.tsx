import { useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { isAxiosError } from "axios";

import { api } from "@/services/api";
import type { Service } from "@/types";

interface ServiceFormDialogProps {
  open: boolean;
  service?: Service | null;
  onClose: () => void;
  onSaved: (service: Service) => void;
}

export function ServiceFormDialog({
  open,
  service,
  onClose,
  onSaved,
}: ServiceFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [title, setTitle] = useState(service?.title ?? "");
  const [price, setPrice] = useState(
    service ? Number(service.price).toFixed(2) : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  async function handleSubmit() {
    const parsedPrice = Number(price.replace(",", "."));

    if (title.trim().length < 3) {
      setError("Título deve ter ao menos 3 caracteres");
      return;
    }

    if (!parsedPrice || parsedPrice <= 0) {
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
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      className="m-auto w-full max-w-95 rounded-[10px] bg-gray-100 p-0 backdrop:bg-black/40"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
        <header className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
          <h2 className="text-sm font-bold text-gray-600">
            {service ? "Editar serviço" : "Cadastro de serviço"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-gray-500 transition hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="service-title"
              className="text-xxs font-bold uppercase tracking-wider text-gray-500"
            >
              Título
            </label>
            <input
              id="service-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Nome do serviço"
              className="border-b border-gray-400 py-2 text-sm text-gray-600 outline-none transition placeholder:text-gray-400 focus:border-blue-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="service-price"
              className="text-xxs font-bold uppercase tracking-wider text-gray-500"
            >
              Valor
            </label>
            <div className="flex items-center gap-2 border-b border-gray-400 focus-within:border-blue-base">
              <span className="text-sm text-gray-600">R$</span>
              <input
                id="service-price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                className="w-full py-2 text-sm text-gray-600 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-xxs text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="px-6 pb-6">
          <button
            type="submit"
            disabled={isSaving}
            className="h-11 w-full rounded-lg bg-gray-600 text-sm font-bold text-gray-100 transition hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
