import { Pencil, Play, CheckCircle2, Circle, Clock } from "lucide-react";

import { UserBadge } from "./ui/user-badge";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Ticket } from "@/types";

interface TicketCardProps {
  ticket: Ticket;
  onOpen: () => void;
  onStart?: () => void;
  onClose?: () => void;
  isUpdating?: boolean;
}

const statusIcon = {
  OPEN: { Icon: Circle, className: "text-red-600" },
  IN_PROGRESS: { Icon: Clock, className: "text-blue-base" },
  CLOSED: { Icon: CheckCircle2, className: "text-green-700" },
};

export function TicketCard({
  ticket,
  onOpen,
  onStart,
  onClose,
  isUpdating,
}: TicketCardProps) {
  const { Icon, className } = statusIcon[ticket.status];

  return (
    <article className="flex flex-col gap-3 rounded-[10px] border border-gray-300 bg-gray-100 p-4">
      <div className="flex items-start justify-between">
        <span className="text-xxs text-gray-500">{ticket.id.slice(0, 5)}</span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpen}
            aria-label={`Abrir chamado ${ticket.title}`}
            className="rounded-md bg-gray-200 p-1.5 transition hover:bg-gray-300"
          >
            <Pencil size={12} className="text-gray-600" />
          </button>

          {ticket.status === "OPEN" && onStart && (
            <button
              onClick={onStart}
              disabled={isUpdating}
              className="flex items-center gap-1.5 rounded-md bg-gray-600 px-2.5 py-1.5 text-xxs font-bold text-gray-100 transition hover:opacity-90 disabled:opacity-50"
            >
              <Play size={12} />
              Iniciar
            </button>
          )}

          {ticket.status === "IN_PROGRESS" && onClose && (
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="flex items-center gap-1.5 rounded-md bg-gray-600 px-2.5 py-1.5 text-xxs font-bold text-gray-100 transition hover:opacity-90 disabled:opacity-50"
            >
              <CheckCircle2 size={12} />
              Encerrar
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-600">{ticket.title}</h3>
        <p className="text-xxs text-gray-500">
          {ticket.services[0]?.service.title}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xxs text-gray-500">
          {formatDate(ticket.updatedAt)}
        </span>
        <span className="text-xs text-gray-600">
          {formatCurrency(ticket.total)}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-gray-300 pt-3">
        <UserBadge
          name={ticket.customer.name}
          avatarUrl={ticket.customer.avatarUrl}
        />
        <Icon size={16} className={className} />
      </div>
    </article>
  );
}
