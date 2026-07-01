import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCommunity } from '../hooks'
import { useCommunityPosts } from '@/features/posts/hooks'
import { PostCard } from '@/features/posts/components/PostCard'
import { SortTabs } from '@/features/posts/components/SortTabs'
import type { SortOption } from '@/features/posts/types'
import { useAuthStore } from '@/features/auth/store'

export function CommunityPage() {
  const { slug = '' } = useParams()
  const [sort, setSort] = useState<SortOption>('hot')
  const [page, setPage] = useState(1)
  const user = useAuthStore((s) => s.user)

  const community = useCommunity(slug)
  const posts = useCommunityPosts(slug, sort, page)

  // Trocar de ordenação reinicia a paginação para a página 1.
  function changeSort(next: SortOption) {
    setSort(next)
    setPage(1)
  }

  if (community.isLoading) return <p className="text-zinc-500">carregando…</p>
  if (community.isError || !community.data)
    return <p className="text-red-600">comunidade não encontrada</p>

  const feed = posts.data

  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-zinc-200 bg-white p-4">
        <h1 className="text-xl font-bold text-orange-600">r/{community.data.slug}</h1>
        <p className="mt-1 text-sm text-zinc-600">{community.data.description}</p>
      </header>

      <div className="flex items-center justify-between">
        <SortTabs value={sort} onChange={changeSort} />
        {user && (
          <Link
            to={`/r/${slug}/submit`}
            className="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-700"
          >
            Criar post
          </Link>
        )}
      </div>

      {posts.isLoading && <p className="text-zinc-500">carregando posts…</p>}
      {posts.isError && <p className="text-red-600">erro ao carregar posts</p>}

      <div className="space-y-3">
        {feed?.items.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {feed && feed.items.length === 0 && (
          <p className="text-sm text-zinc-500">nenhum post ainda — seja o primeiro!</p>
        )}
      </div>

      {feed && feed.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="rounded-md border border-zinc-300 px-3 py-1 text-sm disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-sm text-zinc-500">
            {feed.page} / {feed.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!feed.hasMore}
            className="rounded-md border border-zinc-300 px-3 py-1 text-sm disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}
