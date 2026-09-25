import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import type { Service } from "@/types";
import { formatCurrency } from "@/utils/format";

interface AvailableTechnician {
  id: string;
}

export function CustomerCreateTicket() {
  const navigate = useNavigate();
  const submitting = useRef(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const selectedService = services.find((service) => service.id === serviceId);

  useEffect(() => {
    let active = true;

    api
      .get<Service[]>("/services")
      .then(({ data }) => {
        if (active) setServices(data.filter((service) => service.isActive));
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError(null);

    if (title.trim().length < 3 || description.trim().length < 10) {
      setError(
        "Preencha o título com pelo menos 3 caracteres e a descrição com pelo menos 10 caracteres.",
      );
      return;
    }
    if (!selectedService) {
      setError("Selecione uma categoria de serviço.");
      return;
    }

    submitting.current = true;
    setIsSubmitting(true);

    try {
      const { data: technicians } = await api.get<AvailableTechnician[]>(
        "/technicians/available",
      );
      const technician = technicians[0];

      if (!technician) {
        setError(
          "Nenhum técnico cadastrado para receber o chamado.",
        );
        return;
      }

      await api.post("/tickets", {
        title: title.trim(),
        description: description.trim(),
        serviceIds: [selectedService.id],
        technicianId: technician.id,
      });
      navigate("/customers/tickets");
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setError(
        typeof message === "string"
          ? message
          : "Não foi possível criar o chamado. Tente novamente.",
      );
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-200">
      <h1 className="mb-6 text-xl font-bold text-blue-base">Novo chamado</h1>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-6 md:grid-cols-[1.6fr_1fr]"
      >
        <fieldset
          disabled={isSubmitting}
          className="min-w-0 rounded-[10px] border border-gray-300 p-6 md:p-8"
        >
          <h2 className="text-md font-bold text-gray-600">Informações</h2>
          <p className="mt-1 text-xs text-gray-500">
            Descreva o problema e selecione a categoria de atendimento.
          </p>

          <div className="mt-6 flex flex-col gap-5">
            <Input
              label="Título"
              name="title"
              placeholder="Digite um título para o chamado"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              minLength={3}
            />

            <div className="flex flex-col gap-1">
              <label
                htmlFor="ticket-description"
                className="text-xxs font-bold uppercase tracking-wider text-gray-500"
              >
                Descrição
              </label>
              <textarea
                id="ticket-description"
                name="description"
                placeholder="Descreva o que está acontecendo"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                minLength={10}
                className="min-h-36 w-full resize-y border-b border-gray-400 py-2 text-sm text-gray-600 outline-none placeholder:text-gray-400 focus:border-blue-base"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="ticket-service"
                className="text-xxs font-bold uppercase tracking-wider text-gray-500"
              >
                Categoria de serviço
              </label>
              <div className="relative">
                <select
                  id="ticket-service"
                  name="serviceId"
                  value={serviceId}
                  onChange={(event) => setServiceId(event.target.value)}
                  required
                  disabled={isLoading || loadError || services.length === 0}
                  className={`w-full appearance-none border-b border-gray-400 bg-transparent py-2 pr-7 text-sm outline-none focus:border-blue-base ${serviceId ? "text-gray-600" : "text-gray-500"}`}
                >
                  <option value="" disabled>
                    {isLoading
                      ? "Carregando categorias..."
                      : "Selecione a categoria de atendimento"}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-2.5 text-gray-500"
                />
              </div>
              {loadError && (
                <p role="alert" className="text-xs text-red-600">
                  Não foi possível carregar as categorias. Recarregue a página
                  para tentar novamente.
                </p>
              )}
              {!isLoading && !loadError && services.length === 0 && (
                <p role="status" className="text-xs text-gray-500">
                  Nenhum serviço disponível para novos chamados.
                </p>
              )}
            </div>
          </div>
        </fieldset>

        <section
          aria-labelledby="ticket-summary"
          className="rounded-[10px] border border-gray-300 p-6"
        >
          <h2 id="ticket-summary" className="text-md font-bold text-gray-600">
            Resumo
          </h2>
          <p className="mt-1 text-xs text-gray-500">Valores e detalhes</p>

          <dl className="mt-6 space-y-4" aria-live="polite">
            <div>
              <dt className="text-xs text-gray-500">Categoria de serviço</dt>
              <dd className="mt-1 text-sm text-gray-600">
                {selectedService?.title ?? "Selecione uma categoria"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Custo inicial</dt>
              <dd className="mt-1 text-lg font-bold text-gray-600">
                {selectedService ? formatCurrency(selectedService.price) : "—"}
              </dd>
            </div>
          </dl>

          <p className="my-6 text-xs text-gray-500">
            O chamado será automaticamente atribuído a um técnico disponível.
          </p>
          {error && (
            <p role="alert" className="mb-4 text-xs text-red-600">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={isLoading || !selectedService || isSubmitting}
            className="bg-[#1e2022] font-normal"
          >
            {isSubmitting ? "Criando chamado..." : "Criar chamado"}
          </Button>
        </section>
      </form>
    </div>
  );
}
