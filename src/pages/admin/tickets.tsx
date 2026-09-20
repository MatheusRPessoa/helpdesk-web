import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import { api } from "@/services/api";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Ticket } from "@/types";
import { useNavigate } from "react-router-dom";

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AdminTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<Ticket[]>("/tickets")
      .then((response) => setTickets(response.data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto 275">
      <h1 className="mb-6 text-xl font-bold text-blue-900">Chamados</h1>

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : tickets.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum chamado encontrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-gray-300 bg-gray-100">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="px-4 py-3 text-xxs font-bold text-gray-500">
                  Atualizado em
                </th>
                <th className="px-4 py-3 text-xxs font-bold text-gray-500">
                  Id
                </th>
                <th className="px-4 py-3 text-xxs font-bold text-gray-500">
                  Título e Serviço
                </th>
                <th className="px-4 py-3 text-xxs font-bold text-gray-500">
                  Valor total
                </th>
                <th className="px-4 py-3 text-xxs font-bold text-gray-500">
                  Cliente
                </th>
                <th className="px-4 py-3 text-xxs font-bold text-gray-500">
                  Técnico
                </th>
                <th className="px-4 py-3 text-xxs font-bold text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-300 last:border-0"
                >
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {formatDate(ticket.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {ticket.id.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-bold text-gray-600">
                      {ticket.title}
                    </p>
                    <p className="text-xxs text-gray-500">
                      {ticket.services[0]?.service.title}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {formatCurrency(ticket.total)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-base text-[9px] font-bold text-gray-100">
                        {initials(ticket.customer.name)}
                      </span>
                      <span className="text-xs text-gray-600">
                        {ticket.customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-base text-[9px] font-bold text-gray-100">
                        {initials(ticket.technician.name)}
                      </span>
                      <span className="text-xs text-gray-600">
                        {ticket.technician.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                      className="rounded-md border border-gray-300 p-1.5 transition hover:bg-gray-200"
                    >
                      <Pencil size={14} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
