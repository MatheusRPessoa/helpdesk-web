import { Pencil, Play, CheckCircle2, type LucideIcon } from "lucide-react";

import { UserBadge } from "./ui/user-badge";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Ticket } from "@/types";
import { TICKET_STATUS } from "@/config/ticket-status"

interface TicketCardProps {
  ticket: Ticket;
  onOpen: () => void;
  onStart?: () => void;
  onFinish?: () => void
  isUpdating?: boolean;
  error?: string
}

interface ActionButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  disabled?: boolean
}

function ActionButton({ icon: Icon, label, onClick, disabled }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 rounded-md bg-gray-600 px-2.5 py-1.5 text-xxs font-bold text-gray-100 transition hover:opacity-90 disabled:opacity-50"
    >
      <Icon size={12} />
      {label}
    </button>
  )
}

export function TicketCard({
  ticket,
  onOpen,
  onStart,
  onFinish,
  isUpdating,
  error,
}: TicketCardProps) {
  const { Icon, iconClassName } = TICKET_STATUS[ticket.status]

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
            <ActionButton
              icon={Play}
              label="Iniciar"
              onClick={onStart}
              disabled={isUpdating}
            />
          )}

          {ticket.status === "IN_PROGRESS" && onFinish && (
            <ActionButton
              icon={CheckCircle2}
              label="Encerrar"
              onClick={onFinish}
              disabled={isUpdating}
            />
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
      
      {error && (
        <p role="alert" className="text-xxs text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-gray-300 pt-3">
        <UserBadge
          name={ticket.customer.name}
          avatarUrl={ticket.customer.avatarUrl}
        />
        <Icon size={16} className={iconClassName} />
      </div>
    </article>
  );
}
