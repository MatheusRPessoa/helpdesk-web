import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { isAxiosError } from "axios";

import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import { HourPicker } from "@/components/ui/hour-picker";
import type { Technician } from "@/types";

const baseSchema = {
  name: z.string().trim().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.email("E-mail inválido"),
};

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

const editSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .min(6, "Senha deve ter ao menos 6 caracteres")
    .optional()
    .or(z.literal("")),
});

type TechnicianForm = z.infer<typeof editSchema>;

export function AdminTechnicianForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [hours, setHours] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TechnicianForm>({
    resolver: zodResolver(isEditing ? editSchema : createSchema),
  });

  useEffect(() => {
    if (!id) return;

    api
      .get<Technician[]>("/technicians")
      .then((response) => {
        const technician = response.data.find((item) => item.id === id);

        if (technician) {
          reset({ name: technician.name, email: technician.email });
          setHours(technician.availabilities.map((a) => a.hour));
        }
      })
      .finally(() => setIsLoading(false));
  }, [id, reset]);

  async function onSubmit(data: TechnicianForm) {
    setApiError(null);

    if (hours.length === 0) {
      setApiError("Selecione ao menos um horário de atendimento");
      return;
    }

    try {
      if (isEditing) {
        const payload: Record<string, unknown> = {
          name: data.name,
          email: data.email,
          availabilities: hours,
        };

        if (data.password) {
          payload.password = data.password;
        }

        await api.put(`/technicians/${id}`, payload);
      } else {
        await api.post("/technicians", { ...data, availabilities: hours });
      }

      navigate("/admin/technicians");
    } catch (error) {
      if (isAxiosError(error)) {
        setApiError(error.response?.data?.message ?? "Erro ao salvar técnico");
      } else {
        setApiError("Não foi possível conectar ao servidor");
      }
    }
  }

  if (isLoading) {
    return <p className="text-sm text-gray-500">Carregando...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mx-auto w-full max-w-200"
    >
      <button
        type="button"
        onClick={() => navigate("/admin/technicians")}
        className="mb-2 flex items-center gap-1 text-xxs text-gray-500 transition hover:text-gray-600 cursor-pointer"
      >
        <ArrowLeft size={12} />
        Voltar
      </button>

      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-900">Perfil de técnico</h1>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/technicians")}
            className="rounded-md bg-gray-300 px-4 py-2 text-xs font-bold 
                                  text-gray-600 transition hover:opacity-90 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gray-600 px-5 py-2 text-xs font-bold 
                                  text-gray-100 transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      {apiError && <p className="mb-3 text-xs text-red-600">{apiError}</p>}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <section className="w-full rounded-[10px] border border-gray-300 bg-gray-100 p-6 lg:w-75">
          <h2 className="text-md font-bold text-gray-600">Dados Pessoais</h2>
          <p className="mb-5 text-xxs text-gray-500">
            Defina as informações do perfil do técnico
          </p>

          <div className="flex flex-col gap-4">
            <Input
              label="nome"
              placeholder="Nome completo"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="exemplo@mail.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Senha"
              type="password"
              placeholder={
                isEditing
                  ? "Deixe em branco para manter"
                  : "Defina a senha de acesso"
              }
              hint="Mínimo de 6 digitos"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>
        </section>

        <section className="flex-1 rounded-[10px] border border-gray-300 bg-gray-100 p-6">
          <h2 className="text-md font-bold text-gray-600">
            Horários de atendimento
          </h2>
          <p className="mb-5 text-xxs text-gray-500">
            Selecione os horários de disponibilidade do técnico para atendimento
          </p>

          <HourPicker selected={hours} onChange={setHours} />
        </section>
      </div>
    </form>
  );
}
