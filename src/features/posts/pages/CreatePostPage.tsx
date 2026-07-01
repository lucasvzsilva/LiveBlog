import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams } from 'react-router-dom'
import { Field } from '@/shared/ui/Field'
import { useCreatePost } from '../hooks'

const schema = z.object({
  title: z.string().min(5, 'mínimo 5 caracteres'),
  content: z.string().min(10, 'mínimo 10 caracteres'),
})
type FormData = z.infer<typeof schema>

export function CreatePostPage() {
  const { slug = '' } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const create = useCreatePost(slug)

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-zinc-200 bg-white p-6">
      <h1 className="mb-1 text-xl font-bold">Novo post</h1>
      <p className="mb-4 text-sm text-zinc-500">em r/{slug}</p>
      <form onSubmit={handleSubmit((data) => create.mutate(data))} className="space-y-4">
        <Field label="Título" {...register('title')} error={errors.title?.message} />
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Conteúdo</span>
          <textarea
            rows={5}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            {...register('content')}
          />
          {errors.content && (
            <span className="mt-1 block text-sm text-red-600">{errors.content.message}</span>
          )}
        </label>
        {create.isError && <p className="text-sm text-red-600">Não foi possível publicar</p>}
        <button
          type="submit"
          disabled={create.isPending}
          className="w-full rounded-full bg-orange-600 py-2 font-medium text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {create.isPending ? 'Publicando…' : 'Publicar'}
        </button>
      </form>
    </div>
  )
}
