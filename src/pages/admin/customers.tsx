import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Pencil, Trash2 } from "lucide-react";

import { api } from "@/services/api";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EditCustomerDialog } from "@/components/admin/edit-customer-dialog";
import type { CustomerForm } from "@/components/admin/edit-customer-dialog";
import { UserBadge } from "@/components/ui/user-badge";
import type { Customer } from "@/types";

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Customer[]>("/customers")
      .then((response) => setCustomers(response.data))
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete() {
    if (!deleting) return;

    setIsDeleting(true);

    try {
      await api.delete(`/customers/${deleting.id}`);
      setCustomers((current) =>
        current.filter((item) => item.id !== deleting.id),
      );
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setApiError(message ?? "Erro ao excluir cliente");
    } finally {
      setIsDeleting(false);
      setDeleting(null);
    }
  }

  async function handleUpdate(values: CustomerForm) {
    if (!editing) return;

    setEditError(null);

    try {
      const { data } = await api.put<Customer>(`/customers/${editing.id}`, values);
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === editing.id ? { ...customer, ...data } : customer,
        ),
      );
      setEditing(null);
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setEditError(message ?? "Erro ao salvar cliente");
    }
  }

  return (
    <div className="mx-auto w-full max-w-225">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-900">Clientes</h1>
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
          Não foi possível carregar os clientes.
        </p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum cliente cadastrado</p>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-gray-300 bg-gray-100">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="px-4 py-2 text-xs font-bold text-gray-500">
                  Nome
                </th>
                <th className="px-4 py-2 text-xs font-bold text-gray-500">
                  E-mail
                </th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-300 last:border-0"
                >
                  <td className="px-4 py-2.5">
                    <UserBadge
                      name={customer.name}
                      avatarUrl={customer.avatarUrl}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">
                    {customer.email}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <button
                        aria-label={`Excluir ${customer.name}`}
                        onClick={() => {
                          setApiError(null);
                          setDeleting(customer);
                        }}
                        className="rounded-md border border-gray-300 p-1.5 transition hover:bg-gray-200 cursor-pointer"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>

                      <button
                        aria-label={`Editar ${customer.name}`}
                        onClick={() => {
                          setEditError(null);
                          setEditing(customer);
                        }}
                        className="cursor-pointer rounded-md border border-gray-300 p-1.5 transition hover:bg-gray-200"
                      >
                        <Pencil size={14} className="text-gray-600 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Excluir cliente"
        description={
          deleting && deleting.ticketsCount > 0
            ? `${deleting.name} possui ${deleting.ticketsCount} chamado(s). Excluir a conta também remove todos eles. Esta ação não pode ser desfeita.`
            : `Tem certeza que deseja excluir a conta de ${deleting?.name}? Esta ação não pode ser desfeita.`
        }
        confirmText="Excluir"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />

      {editing && (
        <EditCustomerDialog
          customer={editing}
          error={editError}
          onCancel={() => {
            setEditing(null);
            setEditError(null);
          }}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
