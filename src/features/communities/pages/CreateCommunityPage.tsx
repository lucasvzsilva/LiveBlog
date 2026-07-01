import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Field } from '@/shared/ui/Field'
import { useCreateCommunity } from '../hooks'
import { slugify } from '@/shared/utils/slug'

const schema = z.object({
  name: z.string().min(3, 'mínimo 3 caracteres'),
  description: z.string().min(10, 'descreva em pelo menos 10 caracteres'),
})
type FormData = z.infer<typeof schema>

export function CreateCommunityPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const create = useCreateCommunity()
  const name = watch('name') // mostra o preview do slug em tempo real

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-zinc-200 bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">Criar comunidade</h1>
      <form onSubmit={handleSubmit((data) => create.mutate(data))} className="space-y-4">
        <Field label="Nome" {...register('name')} error={errors.name?.message} />
        {name && <p className="-mt-2 text-xs text-zinc-400">URL: r/{slugify(name)}</p>}
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Descrição</span>
          <textarea
            rows={3}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            {...register('description')}
          />
          {errors.description && (
            <span className="mt-1 block text-sm text-red-600">{errors.description.message}</span>
          )}
        </label>
        {create.isError && (
          <p className="text-sm text-red-600">Não foi possível criar (nome já existe?)</p>
        )}
        <button
          type="submit"
          disabled={create.isPending}
          className="w-full rounded-full bg-orange-600 py-2 font-medium text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {create.isPending ? 'Criando…' : 'Criar'}
        </button>
      </form>
    </div>
  )
}
