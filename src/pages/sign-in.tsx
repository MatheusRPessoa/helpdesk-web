import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"

import logo from "@/assets/logo.svg"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"

const signInSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
})

type SignInForm = z.infer<typeof signInSchema>

export function SignIn() {
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  })

  async function onSubmit(data: SignInForm) {
    setApiError(null)

    try {
      const response = await api.post("/sessions", data)
      console.log(response.data)
    } catch {
      setApiError("E-mail ou senha inválidos")
    }
  }

  return (
    <div className="flex w-full max-w-95 flex-col gap-3">
      <img src={logo} alt="HelpDesk" className="mx-auto mb-4 h-12" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5 rounded-[10px] border border-gray-300 bg-gray-100 p-6"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-gray-600">Acesse o portal</h1>
          <p className="text-xs text-gray-500">
            Entre usando seu e-mail e senha cadastrados
          </p>
        </div>

        <div className="flex flex-col gap-4">
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="flex flex-col gap-5 rounded-[10px] border border-gray-300 bg-gray-100 p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-md font-bold text-gray-600">
            Ainda não tem uma conta?
          </h2>
          <p className="text-xs text-gray-500">Cadastre agora mesmo</p>
        </div>

        <Link to="/sign-up">
          <Button variant="secondary" type="button">
            Criar conta
          </Button>
        </Link>
      </div>
    </div>
  )
}