import { Link } from 'react-router-dom'
import { useCommunities } from '../hooks'
import { useAuthStore } from '@/features/auth/store'

export function CommunitiesPage() {
  const { data: communities, isLoading, isError } = useCommunities()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comunidades</h1>
        {user && (
          <Link
            to="/communities/new"
            className="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-700"
          >
            Criar comunidade
          </Link>
        )}
      </div>

      {isLoading && <p className="text-zinc-500">carregando…</p>}
      {isError && <p className="text-red-600">erro ao carregar comunidades</p>}

      <ul className="space-y-3">
        {communities?.map((c) => (
          <li key={c.id}>
            <Link
              to={`/r/${c.slug}`}
              className="block rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-orange-300"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-semibold text-orange-600">r/{c.slug}</h2>
                <span className="text-xs text-zinc-400">{c.postCount} posts</span>
              </div>
              <p className="mt-1 text-sm text-zinc-600">{c.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
