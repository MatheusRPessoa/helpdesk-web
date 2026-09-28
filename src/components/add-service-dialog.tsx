import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { api } from "@/services/api";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPriceInput } from "@/utils/format";
import type { Service, Ticket } from "@/types";

interface AddServiceDialogProps {
  ticketId: string;
  onClose: () => void;
  onAdded: (ticket: Ticket) => void;
}

export function AddServiceDialog({
  ticketId,
  onClose,
  onAdded,
}: AddServiceDialogProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Service[]>("/services")
      .then((response) => setServices(response.data))
      .catch(() => setError("Não foi possível carregar os serviços"))
      .finally(() => setIsLoading(false));
  }, []);

  const selected = services.find((item) => item.id === selectedId);

  async function handleSubmit() {
    if (!selectedId) {
      setError("Selecione um serviço");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { data } = await api.post<Ticket>(`/tickets/${ticketId}/services`, {
        serviceIds: [selectedId],
      });

      onAdded(data);
      onClose();
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setError(message ?? "Erro ao adicionar serviço");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog
      open
      title="Serviço adicional"
      onCancel={onClose}
      isLoading={isSaving}
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
          <div className="flex flex-col gap-1">
            <label
              htmlFor="additional-service"
              className="text-xxs font-bold uppercase tracking-wider text-gray-500"
            >
              Descrição
            </label>
            <select
              id="additional-service"
              value={selectedId}
              onChange={(event) => {
                setSelectedId(event.target.value);
                if (error) setError(null);
              }}
              disabled={isLoading || isSaving}
              className="border-b border-gray-400 bg-transparent py-2 text-sm text-gray-600 outline-none transition focus:border-blue-base disabled:opacity-50"
            >
              <option value="">
                {isLoading ? "Carregando..." : "Selecione um serviço"}
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            id="additional-price"
            label="Valor"
            leading="R$"
            value={selected ? formatPriceInput(selected.price) : ""}
            placeholder="0,00"
            readOnly
            tabIndex={-1}
          />

          {error && (
            <p role="alert" className="text-xxs text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="px-6 pb-6">
          <Button type="submit" disabled={isSaving || isLoading}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
