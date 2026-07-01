import type { AuthUser } from '@/features/auth/types'

// "Banco" em memória que o MSW usa para simular o backend.
export interface DbUser extends AuthUser {
  password: string
}

export interface DbCommunity {
  id: string
  name: string
  slug: string
  description: string
  createdByUserId: string
  createdAt: string
}

export interface DbPost {
  id: string
  communityId: string
  authorId: string
  title: string
  content: string
  createdAt: string
  // voteScore é DESNORMALIZADO (guardado no post), não calculado a cada leitura.
  // Justificativa: feed é lido muitas vezes e votado poucas; recalcular a soma
  // de todos os votos em toda leitura seria caro. Na Fase 4 o voto atualiza este campo.
  voteScore: number
  commentCount: number
}

const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString()

export const db = {
  users: [
    { id: 'u1', username: 'demo', email: 'demo@liveblog.dev', password: '123456', karma: 42 },
  ] as DbUser[],

  communities: [
    { id: 'c1', name: 'React Brasil', slug: 'react-brasil', description: 'Tudo sobre React e o ecossistema front-end.', createdByUserId: 'u1', createdAt: hoursAgo(200) },
    { id: 'c2', name: 'DotNet', slug: 'dotnet', description: 'C#, .NET, arquitetura e boas práticas.', createdByUserId: 'u1', createdAt: hoursAgo(180) },
    { id: 'c3', name: 'Games', slug: 'games', description: 'Novidades, reviews e discussões sobre jogos.', createdByUserId: 'u1', createdAt: hoursAgo(150) },
  ] as DbCommunity[],

  posts: [
    // react-brasil (7 posts -> 2 páginas com limit 5)
    { id: 'p1', communityId: 'c1', authorId: 'u1', title: 'Hooks essenciais que todo dev deveria saber', content: 'useState, useEffect, useMemo, useCallback...', createdAt: hoursAgo(5), voteScore: 120, commentCount: 8 },
    { id: 'p2', communityId: 'c1', authorId: 'u1', title: 'Pegadinhas do useEffect', content: 'Cuidado com o array de dependências.', createdAt: hoursAgo(1), voteScore: 45, commentCount: 3 },
    { id: 'p3', communityId: 'c1', authorId: 'u1', title: 'Context API vs Zustand: quando usar cada um', content: 'Estado global sem dor de cabeça.', createdAt: hoursAgo(30), voteScore: 210, commentCount: 15 },
    { id: 'p4', communityId: 'c1', authorId: 'u1', title: 'Vite é rápido demais', content: 'HMR instantâneo, build enxuto.', createdAt: hoursAgo(0.5), voteScore: 8, commentCount: 1 },
    { id: 'p5', communityId: 'c1', authorId: 'u1', title: 'TanStack Query mudou minha vida', content: 'Cache, refetch, mutations de graça.', createdAt: hoursAgo(12), voteScore: 88, commentCount: 5 },
    { id: 'p6', communityId: 'c1', authorId: 'u1', title: 'Tailwind vale a pena?', content: 'Utility-first: prós e contras.', createdAt: hoursAgo(60), voteScore: 33, commentCount: 4 },
    { id: 'p7', communityId: 'c1', authorId: 'u1', title: 'TypeScript: o básico que muda tudo', content: 'Tipos, generics, inferência.', createdAt: hoursAgo(3), voteScore: 15, commentCount: 2 },

    // dotnet (4 posts)
    { id: 'p8', communityId: 'c2', authorId: 'u1', title: 'Clean Architecture na prática', content: 'Camadas, dependências, DTOs.', createdAt: hoursAgo(10), voteScore: 95, commentCount: 6 },
    { id: 'p9', communityId: 'c2', authorId: 'u1', title: 'MediatR vale a pena?', content: 'CQRS e desacoplamento.', createdAt: hoursAgo(48), voteScore: 150, commentCount: 20 },
    { id: 'p10', communityId: 'c2', authorId: 'u1', title: 'EF Core: dicas de performance', content: 'AsNoTracking, projeções...', createdAt: hoursAgo(2), voteScore: 12, commentCount: 2 },
    { id: 'p11', communityId: 'c2', authorId: 'u1', title: 'FluentValidation como pipeline', content: 'Validação antes do handler.', createdAt: hoursAgo(24), voteScore: 40, commentCount: 3 },

    // games (3 posts)
    { id: 'p12', communityId: 'c3', authorId: 'u1', title: 'Melhor RPG de 2026', content: 'Vale cada hora.', createdAt: hoursAgo(20), voteScore: 300, commentCount: 40 },
    { id: 'p13', communityId: 'c3', authorId: 'u1', title: 'Dicas de speedrun', content: 'Frame perfect.', createdAt: hoursAgo(0.2), voteScore: 5, commentCount: 0 },
    { id: 'p14', communityId: 'c3', authorId: 'u1', title: 'Indies que você precisa jogar', content: 'Pequenos grandes jogos.', createdAt: hoursAgo(72), voteScore: 60, commentCount: 9 },
  ] as DbPost[],
}

// Token fake só para simular o fluxo de auth (NÃO é um JWT real): "mock-token.<userId>.<ts>".
export function makeToken(userId: string): string {
  return `mock-token.${userId}.${Date.now()}`
}

export function toAuthUser(user: DbUser): AuthUser {
  const { password: _password, ...rest } = user
  return rest
}

// Extrai o userId do header Authorization (o "quem está logado" no back mockado).
export function getUserId(request: Request): string | null {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice(7).split('.')[1] ?? null
}
