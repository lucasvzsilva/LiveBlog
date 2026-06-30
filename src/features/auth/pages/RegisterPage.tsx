import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Field } from '@/shared/ui/Field'
import { useRegister } from '../hooks'

const schema = z.object({
  username: z.string().min(3, 'mínimo 3 caracteres'),
  email: z.string().email('email inválido'),
  password: z.string().min(6, 'mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const registerMutation = useRegister()

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-zinc-200 bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">Criar conta</h1>
      <form
        onSubmit={handleSubmit((data) => registerMutation.mutate(data))}
        className="space-y-4"
      >
        <Field label="Usuário" {...register('username')} error={errors.username?.message} />
        <Field label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Field
          label="Senha"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        {registerMutation.isError && (
          <p className="text-sm text-red-600">Não foi possível criar a conta</p>
        )}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded-full bg-orange-600 py-2 font-medium text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {registerMutation.isPending ? 'Criando…' : 'Criar conta'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-600">
        Já tem conta?{' '}
        <Link to="/login" className="text-orange-600 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
