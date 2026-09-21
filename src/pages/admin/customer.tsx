import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Customer } from "@/types"
import { UserBadge } from "@/components/ui/user-badge"
import { api } from "@/services/api"
import { Pencil, Plus } from "lucide-react"

export function AdminCustomer() {
    const navigate = useNavigate()

    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        api
           .get<Customer[]>("/customers")
           .then((response) => setCustomers(response.data))
           .finally(() => setIsLoading(false))
    }, [])

    return (
        <div className="mx-auto w-full max-w-225">
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-xl font-bold text-blue-900">Clientes</h1>

                <button
                    onClick={() => navigate("/admin/customers/new")}
                    className="flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2
                               text-xs font-bold text-gray-100 transition hover:opacity-90"
                >
                    <Plus size={14} />
                    Novo
                </button>
            </div>

            {isLoading ? (
                <p className="text-sm text-gray-500">carregando</p>
            ): customers.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum cliente cadastrado</p>
            ): (
                <div className="overflow-x-auto rounded-[10px] border border-gray-300 bg-gray-100">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-300 text-left">
                                <th className="px-4 py-3 text-xs font-bold text-gray-500">
                                    Nome
                                </th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500">
                                    E-mail
                                </th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500">
                                    Chamados
                                </th>
                                <th className="px-4 py-3" />
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
                                    <td className="px-4 pt-2.5 text-xs text-gray-600">
                                        {customer.email}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        {customer.ticketsCount}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <button
                                            onClick={() =>
                                                navigate(`/admin/customers/${customer.id}`)
                                            }
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
            )
        }

            
        </div>
    )
} 