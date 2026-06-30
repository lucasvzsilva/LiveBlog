import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Field } from '@/shared/ui/Field'
import { useLogin } from '../hooks'

// Zod define o schema; o mesmo schema valida em runtime E gera o tipo TS (z.infer).
const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const login = useLogin()

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-zinc-200 bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">Entrar</h1>
      <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-4">
        <Field label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Field
          label="Senha"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        {login.isError && <p className="text-sm text-red-600">Credenciais inválidas</p>}
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-full bg-orange-600 py-2 font-medium text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {login.isPending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-600">
        Não tem conta?{' '}
        <Link to="/register" className="text-orange-600 hover:underline">
          Criar conta
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-zinc-400">demo@liveblog.dev / 123456</p>
    </div>
  )
}
