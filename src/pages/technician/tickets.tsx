import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { api } from "@/services/api";
import { TicketCard } from "@/components/ticket-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Ticket, TicketStatus } from "@/types";

const GROUPS: TicketStatus[] = ["IN_PROGRESS", "OPEN", "CLOSED"];

export function TechnicianTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Ticket[]>("/tickets")
      .then((response) => setTickets(response.data))
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  async function changeStatus(ticket: Ticket, status: TicketStatus) {
    setUpdatingId(ticket.id);
    setApiError(null);

    try {
      const { data } = await api.patch<Ticket>(`/tickets/${ticket.id}/status`, {
        status,
      });

      setTickets((current) =>
        current.map((item) => (item.id === data.id ? data : item)),
      );
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setApiError(message ?? "Erro ao alterar status do chamado");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="w-full max-w-225">
      <h1 className="mb-5 text-xl font-bold text-blue-dark">Meus chamados</h1>

      {apiError && (
        <p role="alert" className="mb-3 text-xs text-red-600">
          {apiError}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : hasError ? (
        <p role="alert" className="text-sm text-gray-500">
          Não foi possível carregar os chamados.
        </p>
      ) : tickets.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nenhum chamado atribuído a você.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {GROUPS.map((status) => {
            const group = tickets.filter((ticket) => ticket.status === status);

            if (group.length === 0) return null;

            return (
              <section key={status}>
                <div className="mb-3">
                  <StatusBadge status={status} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      isUpdating={updatingId === ticket.id}
                      onOpen={() =>
                        navigate(`/technicians/tickets/${ticket.id}`)
                      }
                      onStart={() => changeStatus(ticket, "IN_PROGRESS")}
                      onClose={() => changeStatus(ticket, "CLOSED")}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
