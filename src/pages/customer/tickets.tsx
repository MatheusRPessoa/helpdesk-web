import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "@/services/api";
import type { Ticket } from "@/types";
import { Eye } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserBadge } from "@/components/ui/user-badge";

function formatDate(value: string) {
  return new Date(value)
    .toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");
}

function formatCurrency(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function CustomerTickets() {
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
    <div className="mx-auto w-full max-w-275">
      <h1 className="mb-6 text-xl font-bold text-blue-base">Meus chamados</h1>

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : tickets.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum chamado cadastrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-gray-300 bg-gray-200">
          <table className="w-full min-w-250">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="px-4 py-3 text-xs font-normal whitespace-nowrap text-gray-500">
                  Atualizado em
                </th>
                <th className="px-4 py-3 text-xs font-normal whitespace-nowrap text-gray-500">
                  Id
                </th>
                <th className="px-4 py-3 text-xs font-normal whitespace-nowrap text-gray-500">
                  Título
                </th>
                <th className="px-4 py-3 text-xs font-normal whitespace-nowrap text-gray-500">
                  Serviço
                </th>
                <th className="px-4 py-3 text-xs font-normal whitespace-nowrap text-gray-500">
                  Valor total
                </th>
                <th className="px-4 py-3 text-xs font-normal whitespace-nowrap text-gray-500">
                  Técnico
                </th>
                <th className="px-4 py-3 text-xs font-normal whitespace-nowrap text-gray-500">
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
                  <td className="px-4 py-4 text-xs whitespace-nowrap text-gray-600">
                    {formatDate(ticket.updatedAt)}
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-gray-600">
                    {ticket.id.slice(0, 5)}
                  </td>
                  <td className="px-4 py-4">
                    <p
                      className="max-w-48 truncate text-sm font-bold text-gray-600"
                      title={ticket.title}
                    >
                      {ticket.title}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-600">
                    {ticket.services[0]?.service.title}
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-600">
                    {formatCurrency(ticket.total)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <UserBadge name={ticket.technician.name} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/customers/tickets/${ticket.id}`)
                      }
                      aria-label={`Ver chamado ${ticket.title}`}
                      className="flex items-center justify-center rounded-md bg-gray-300 p-1.5 transition hover:bg-gray-400"
                    >
                      <Eye size={14} className="text-gray-600" />
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
