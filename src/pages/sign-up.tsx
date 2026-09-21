import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import logo from "@/assets/logo.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";

const signUpSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUp() {
  const [apiError, setApiError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: SignUpForm) {
    setApiError(null);

    try {
      await api.post("/customers", data);
      await signIn(data.email, data.password);
      navigate("/tickets");
    } catch (error) {
      if (isAxiosError(error)) {
        setApiError(error.response?.data.message ?? "Erro ao criar conta");
      } else {
        setApiError("Não foi possível conectar ao servidor");
      }
    }
  }

  return (
    <div className="flex w-full max-w-100 flex-col gap-3">
      <img src={logo} alt="HelpDesk" className="mx-auto mb-4 h-12" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5 rounded-[10px] border border-gray-300 bg-gray-100 p-6"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-gray-600">Crie sua conta</h1>
          <p className="text-xs text-gray-500">
            Informe seu nome, e-mail e senha
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Nome"
            placeholder="Digite o nome completo"
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
            placeholder="Digite sua senha"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {apiError && <span className="text-xs text-red-600">{apiError}</span>}

        <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
      <div className="flex flex-col gap-5 rounded-[10px] border border-gray-300 bg-gray-100 p-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-md font-bold text-gray-600">Já tem uma conta?</h2>
          <p className="text-xs text-gray-500">Entre agora mesmo</p>
        </div>

        <Link to="/">
          <Button variant="secondary" type="button" className="cursor-pointer">
            Acessar conta
          </Button>
        </Link>
      </div>
    </div>
  );
}
