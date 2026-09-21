import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Ban, CircleCheck } from "lucide-react";
import { isAxiosError } from "axios";

import { api } from "@/services/api";
import { formatCurrency } from "@/utils/format";
import type { Service } from "@/types";

export function AdminServices() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Service[]>("/services")
      .then((response) => setServices(response.data))
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  async function toggleStatus(service: Service) {
    setTogglingId(service.id);
    setApiError(null);

    try {
      const { data } = await api.patch<Service>(
        `/services/${service.id}/status`,
        { isActive: !service.isActive },
      );

      setServices((current) =>
        current.map((item) => (item.id === data.id ? data : item)),
      );
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setApiError(message ?? "Erro ao excluir serviço");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-225">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-900">Serviços</h1>

        <button
          onClick={() => navigate("/admin/services/new")}
          className="flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 
                               text-xs font-bold text-gray-100 transition hover:opacity-90"
        >
          <Plus size={14} />
          Novo
        </button>
      </div>

      {apiError && (
        <p role="alert" className="mb-3 text-xs text-red-600">
          {apiError}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : hasError ? (
        <p role="alert" className="text-sm text-gray-500">
          Não foi possível carregar os serviços.
        </p>
      ) : services.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum serviço cadastrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-gray-300 bg-gray-100">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="px-4 py-3 text-xxs font-bold text-gray-500">
                  Título
                </th>
                <th className="px-4 py-3 text-xxs font-bold text-gray-500">
                  Valor
                </th>
                <th className="px-4 py-3 text-xxs font-bold text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-gray-300 last:border-0"
                >
                  <td className="px-4 py-2.5 text-xs font-bold text-gray-600">
                    {service.title}
                  </td>
                  <td className="px-4 py-5 text-xs text-gray-600">
                    {formatCurrency(service.price)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xxs font-bold ${
                        service.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {service.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => toggleStatus(service)}
                        disabled={togglingId === service.id}
                        className="flex items-center gap-1.5 text-xxs text-gray-600 transition
                                                         hover:text-gray-500 disabled:opacity-50"
                      >
                        {service.isActive ? (
                          <>
                            <Ban size={14} />
                            Desativar
                          </>
                        ) : (
                          <>
                            <CircleCheck size={14} />
                            Reativar
                          </>
                        )}
                      </button>

                      <button
                        aria-label={`Editar ${service.title}`}
                        onClick={() =>
                          navigate(`/admin/services/${service.id}`)
                        }
                        className="rounded-md bg-gray-200 p-1.5 transition hover:bg-gray-300"
                      >
                        <Pencil size={14} className="text-gray-600" />
                      </button>
                    </div>
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
