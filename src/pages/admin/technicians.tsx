import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pencil, Plus } from "lucide-react"

import { api } from "@/services/api"
import { UserBadge } from "@/components/ui/user-badge"
import { AvailabilityChips } from "@/components/ui/availability-chips"
import type { Technician } from "@/types"

export function AdminTechnicians() {
    const navigate = useNavigate()

    const [technicians, setTechnicians] = useState<Technician[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        api
          .get<Technician[]>("/technicians")
          .then((response) => setTechnicians(response.data))
          .finally(() => setIsLoading(false))
    }, [])

    return (
        <div className="mx-auto w-full max-w-225">
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-xl font-bold text-blue-900">Técnicos</h1>

                <button
                    onClick={() => navigate("/admin/technicians/new")}
                    className="flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 
                               text-xs font-bold text-gray-100 transition hover:opacity-90"
                >
                    <Plus size={14} />
                    Novo
                </button>
            </div>

            {isLoading ? (
                <p className="text-sm text-gray-500">Carregando...</p>
            ): technicians.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum técnico cadastrado</p>
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
                                    Disponibilidade
                                </th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {technicians.map((technician) => (
                                <tr
                                  key={technician.id}
                                  className="border-b border-gray-300 last:border-0"
                                >
                                    <td className="px-4 py-2.5">
                                        <UserBadge
                                            name={technician.name}
                                            avatarUrl={technician.avatarUrl}
                                        />
                                    </td>
                                    <td className="px-4 pt-2.5 text-xs text-gray-600">
                                        {technician.email}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <AvailabilityChips
                                            hours={technician.availabilities.map((a) => a.hour)}
                                        />
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <button
                                            onClick={() => 
                                                navigate(`/admin/technicians/${technician.id}`)
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
            )}
        </div>
    )
}