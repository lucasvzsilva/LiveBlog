import { useQuery } from '@tanstack/react-query'
import { getHealth } from './api'

export function HomePage() {
  // useQuery = leitura de dados do servidor, com cache/loading/erro automáticos.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">LiveBlog</h1>
      <p className="text-zinc-600">Fase 1 concluída — stack do front configurada.</p>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="mb-2 font-semibold">Status da API (mock MSW)</h2>
        {isLoading && <p className="text-zinc-500">checando…</p>}
        {isError && <p className="text-red-600">falhou ao conectar</p>}
        {data && (
          <p className="font-medium text-green-600">
            {data.status} — {new Date(data.time).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  )
}
