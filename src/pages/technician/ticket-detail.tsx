import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Play, CheckCircle2 } from "lucide-react";
import { isAxiosError } from "axios";

import { api } from "@/services/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserBadge } from "@/components/ui/user-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AddServiceDialog } from "@/components/add-service-dialog";
import { formatDate, formatCurrency } from "@/utils/format";
import type { Ticket, TicketService, TicketStatus } from "@/types";

export function TechnicianTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [removing, setRemoving] = useState<TicketService | null>(null);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    api
      .get<Ticket>(`/tickets/${id}`)
      .then((response) => setTicket(response.data))
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function changeStatus(status: TicketStatus) {
    setIsUpdating(true);
    setActionError(null);

    try {
      const { data } = await api.patch<Ticket>(`/tickets/${id}/status`, {
        status,
      });
      setTicket(data);
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setActionError(message ?? "Erro ao alterar status do chamado");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemove() {
    if (!removing) return;

    setIsLoading(true);
    setActionError(null);

    try {
      const { data } = await api.delete<Ticket>(
        `/tickets/${id}/services/${removing.id}`,
      );
      setTicket(data);
      setRemoving(null);
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setActionError(message ?? "Erro ao remover serviço");
      setRemoving(null);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleFinish() {
    await changeStatus("CLOSED");
    setFinishing(false);
  }

  if (isLoading) {
    return <p className="text-sm text-gray-500">Carregando...</p>;
  }

  if (hasError || !ticket) {
    return (
      <p role="alert" className="text-sm text-gray-500">
        Não foi possível carregar o chamado
      </p>
    );
  }

  const baseServices = ticket.services.filter((item) => !item.isAdditional);
  const additionalServices = ticket.services.filter(
    (item) => item.isAdditional,
  );
  const isClosed = ticket.status === "CLOSED";

  const additionalTotal = additionalServices.reduce(
    (sum, item) => sum + Number(item.price),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-200">
      <button
        onClick={() => navigate("/technician/tickets")}
        className="mb-2 flex items-center gap-1 text-xxs text-gray-500 transition hover:text-gray-600"
      >
        <ArrowLeft size={12} />
        Voltar
      </button>

      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-900">Chamado detalhado</h1>

        <div className="flex gap-2">
          {ticket.status === "IN_PROGRESS" && (
            <button
              onClick={() => setFinishing(true)}
              disabled={isUpdating}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-xs text-gray-600 transition hover:bg-gray-200 disabled:opacity-40"
            >
              <CheckCircle2 size={14} />
            </button>
          )}

          {ticket.status === "OPEN" && (
            <button
              onClick={() => changeStatus("IN_PROGRESS")}
              disabled={isUpdating}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-xs text-gray-600 transition hover:bg-gray-200 disabled:opacity-40"
            >
              <Play size={14} />
              Iniciar atendimento
            </button>
          )}
        </div>
      </div>

      {actionError && (
        <p role="alert" className="mb-3 text-xs text-red-600">
          {actionError}
        </p>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-4">
          <section className="rounded-[10px] border border-gray-300 bg-gray-100 p-6">
            <div className="mb-3 flex items-start justify-between">
              <span className="text-xxs text-gray-500">
                {ticket.id.slice(0, 5)}
              </span>
              <StatusBadge status={ticket.status} />
            </div>

            <h2 className="mb-4 text-mb font-bold text-gray-600">
              {ticket.title}
            </h2>

            <div className="mb-4">
              <p className="mb-1 text-xxs text-gray-500">Descrição</p>
              <p className="text-xs text-gray-600">{ticket.description}</p>
            </div>

            <div className="mb-4">
              <p className="mb-1 text-xxs text-gray-500">Caregoria</p>
              <p className="text-xs text-gray-600">
                {baseServices[0]?.service.title}
              </p>
            </div>

            <div className="mb-4 grid grid-cols-2">
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

          <section className="rounded-[10px] border border-gray-300 bg-gray-100 p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xxs text-gray-500">Serviços adicionais</p>

              <button
                onClick={() => setAddOpen(true)}
                disabled={isClosed || isUpdating}
                aria-label="Adicionar serviço"
                className="rounded-md bg-gray-600 p-1.5 text-gray-100 transition hover:opacity-90 disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>

            {additionalServices.length === 0 ? (
              <p className="text-xs text-gray-500">
                Nenhum serviço adicional incluído
              </p>
            ) : (
              <ul className="flex flex-col">
                {additionalServices.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between border-t border-gray-300 py-3 first:border-t-0 first:pt-0"
                  >
                    <span className="text-xs font-bold text-gray-600">
                      {item.service.title}
                    </span>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-600">
                        {formatCurrency(item.price)}
                      </span>

                      <button
                        onClick={() => setRemoving(item)}
                        disabled={isClosed || isUpdating}
                        aria-label={`Remover ${item.service.title}`}
                        className="rounded-md bg-gray-200 p-1.5 transition hover:bg-gray-300 disabled:opacity-40"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="w-full rounded-[10px] border border-gray-300 bg-gray-100 p-6 lg:w-70">
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

            {additionalTotal > 0 && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Adicionais</span>
                <span>{formatCurrency(String(additionalTotal))}</span>
              </div>
            )}

            <div className="mt-3 flex justify-between border-t border-gray-300 pt-3 text-sm font-bold text-gray-600">
              <span>Total</span>
              <span>{formatCurrency(ticket.total)}</span>
            </div>
          </div>
        </section>
      </div>

      {addOpen && (
        <AddServiceDialog
          ticketId={ticket.id}
          onClose={() => setAddOpen(false)}
          onAdded={setTicket}
        />
      )}

      {removing && (
        <ConfirmDialog
          open
          title="Remover serviço"
          description={`Remover "${removing.service.title}" do chamado? O valor sai do total.`}
          confirmText="Remover"
          isLoading={isUpdating}
          onConfirm={handleRemove}
          onCancel={() => setRemoving(null)}
        />
      )}

      {finishing && (
        <ConfirmDialog
          open
          title="Encerrar chamado"
          description={`Confirmar o encerramento de "${ticket.title}"? Não será possível adicionar novos serviços depois.`}
          confirmText="Encerrar"
          isLoading={isUpdating}
          onConfirm={handleFinish}
          onCancel={() => setFinishing(false)}
        />
      )}
    </div>
  );
}
