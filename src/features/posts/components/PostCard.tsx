import type { Post } from '../types'
import { timeAgo } from '@/shared/utils/timeAgo'

// Card de post no estilo Reddit: coluna de score à esquerda + conteúdo à direita.
// Os botões de voto entram na Fase 4 — por ora mostramos só o placar.
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex w-10 shrink-0 flex-col items-center text-zinc-500">
        <span className="text-lg leading-none">▲</span>
        <span className="my-1 text-sm font-semibold text-zinc-800">{post.voteScore}</span>
        <span className="text-lg leading-none">▼</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-zinc-900">{post.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{post.content}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-zinc-400">
          <span>por u/{post.authorUsername}</span>
          <span>{timeAgo(post.createdAt)}</span>
          <span>{post.commentCount} comentários</span>
        </div>
      </div>
    </article>
  )
}
