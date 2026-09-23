import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "@/services/api";
import type { Ticket } from "@/types";
import { tr } from "zod/locales";

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
    <div className="mx-auto 275">
      <h1 className="mb-6 text-xl font-bold text-blue-900">Chamados</h1>

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : tickets.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum chamado cadastrado.</p>
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
                    
                    >
                    

                    </tr>
                ))}
                </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
