import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { api } from "@/services/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserBadge } from "@/components/ui/user-badge";
import { formatDate, formatCurrency } from "@/utils/format";
import type { Ticket } from "@/types";

export function CustomerTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<Ticket>(`/tickets/${id}`)
      .then((response) => setTicket(response.data))
      .catch(() => setTicket(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Carregando...</p>;
  }

  if (!ticket) {
    return (
      <p role="alert" className="text-sm text-gray-500">
        Não foi possível carregar o chamado.
      </p>
    );
  }

  const baseServices = ticket.services.filter((item) => !item.isAdditional);
  const additionalServices = ticket.services.filter(
    (item) => item.isAdditional,
  );

  return (
    <div className="mx-auto w-full max-w-225">
      <button
        onClick={() => navigate(-1)}
        className="mb-2 flex items-center gap-1 text-xs text-gray-500 transition hover:text-gray-600"
      >
        <ArrowLeft size={12} />
        Voltar
      </button>

      <h1 className="mb-5 text-xl font-bold text-blue-900">Chamado detalhado</h1>

      <div className="flex flex-col gap-4 lg:flex-row">
        <section className="flex-1 rounded-[10px] border border-gray-300 bg-gray-100 p-6">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-xxs text-gray-500">
              {ticket.id.slice(0, 5)}
            </span>
            <StatusBadge status={ticket.status} />
          </div>

          <h2 className="mb-5 text-md font-bold text-gray-600">
            {ticket.title}
          </h2>

          <div className="mb-5">
            <p className="mb-1 text-xxs text-gray-500">Descrição</p>
            <p className="text-xs text-gray-600">{ticket.description}</p>
          </div>

          <div className="mb-5">
            <p className="mb-1 text-xxs text-gray-500">Categoria</p>
            <p className="text-xs text-gray-600">
              {baseServices[0]?.service.title}
            </p>
          </div>

          <div className="mb-5 flex gap-12">
            <div>
              <p className="mb-1 text-xxs text-gray-500">Criado em</p>
              <p className="text-xs text-gray-600">
                {formatDate(ticket.createdAt)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xxs text-gray-500">Atualizado em</p>
              <p className="text-xs text-gray-600">
                {formatDate(ticket.updatedAt)}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xxs text-gray-500">Cliente</p>
            <UserBadge
              name={ticket.customer.name}
              avatarUrl={ticket.customer.avatarUrl}
            />
          </div>
        </section>

        <section
          className="w-full rounded-[10px] border border-gray-300
                                      bg-gray-100 p-6 lg:w-[320px] lg:self-start"
        >
          <div className="mb-6">
            <p className="mb-2 text-xxs text-gray-500">Técnico responsável</p>
            <UserBadge
              name={ticket.technician.name}
              email={ticket.technician.email}
              avatarUrl={ticket.technician.avatarUrl}
              size="md"
            />
          </div>

          <div className="border-t border-gray-300 pt-4">
            <p className="mb-3 text-xxs text-gray-500">Valores</p>

            {baseServices.map((item) => (
              <div
                key={item.id}
                className="mb-2 flex justify-between text-xs text-gray-600"
              >
                <span>Preço base</span>
                <span>{formatCurrency(item.price)}</span>
              </div>
            ))}

            {additionalServices.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xxs text-gray-500">Adicionais</p>
                {additionalServices.map((item) => (
                  <div
                    key={item.id}
                    className="mb-1 flex justify-between text-xs text-gray-600"
                  >
                    <span>{item.service.title}</span>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            )}

            <div
              className="mt-4 flex justify-between border-t border-gray-300
                                                pt-4 text-sm font-bold text-gray-600"
            >
              <span>Total</span>
              <span>{formatCurrency(ticket.total)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
