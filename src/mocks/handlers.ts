import { http, HttpResponse } from 'msw'
import {
  db,
  makeToken,
  toAuthUser,
  getUserId,
  type DbUser,
  type DbPost,
  type DbCommunity,
} from './db'
import type { LoginInput, RegisterInput } from '@/features/auth/types'
import { slugify } from '@/shared/utils/slug'

const API = '/api'

// ---- helpers de mapeamento (entidade do "banco" -> DTO enviado ao front) ----
function toCommunityDto(c: DbCommunity) {
  return {
    ...c,
    postCount: db.posts.filter((p) => p.communityId === c.id).length,
  }
}

function toPostDto(p: DbPost) {
  const community = db.communities.find((c) => c.id === p.communityId)
  const author = db.users.find((u) => u.id === p.authorId)
  return {
    ...p,
    communitySlug: community?.slug ?? '',
    communityName: community?.name ?? '',
    authorUsername: author?.username ?? 'desconhecido',
  }
}

// ---- ordenação ----
// "Hot" mistura votos e recência (algoritmo simplificado do Reddit):
// log10 dos votos (impacto decrescente) + bônus de tempo. Assim um post muito
// votado sobe, mas posts novos também têm chance — senão o feed nunca mudaria.
const HOT_EPOCH = new Date('2026-01-01').getTime()
function hotScore(p: DbPost): number {
  const order = Math.log10(Math.max(Math.abs(p.voteScore), 1))
  const sign = Math.sign(p.voteScore)
  const seconds = (new Date(p.createdAt).getTime() - HOT_EPOCH) / 1000
  return sign * order + seconds / 45000
}

function sortPosts(posts: DbPost[], sort: string): DbPost[] {
  const copy = [...posts]
  if (sort === 'new') {
    return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }
  if (sort === 'top') {
    return copy.sort((a, b) => b.voteScore - a.voteScore)
  }
  return copy.sort((a, b) => hotScore(b) - hotScore(a)) // hot (default)
}

// ---- paginação ----
function paginate<T>(items: T[], page: number, limit: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / limit))
  const start = (page - 1) * limit
  return {
    items: items.slice(start, start + limit),
    page,
    totalPages,
    hasMore: page < totalPages,
  }
}

export const handlers = [
  // ---------------- auth ----------------
  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as RegisterInput
    if (db.users.some((u) => u.email === body.email)) {
      return HttpResponse.json({ message: 'Email já cadastrado' }, { status: 409 })
    }
    const user: DbUser = {
      id: crypto.randomUUID(),
      username: body.username,
      email: body.email,
      password: body.password,
      karma: 0,
    }
    db.users.push(user)
    return HttpResponse.json({ token: makeToken(user.id), user: toAuthUser(user) }, { status: 201 })
  }),

  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as LoginInput
    const user = db.users.find((u) => u.email === body.email && u.password === body.password)
    if (!user) {
      return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }
    return HttpResponse.json({ token: makeToken(user.id), user: toAuthUser(user) })
  }),

  // ---------------- communities ----------------
  http.get(`${API}/communities`, () => {
    return HttpResponse.json(db.communities.map(toCommunityDto))
  }),

  http.get(`${API}/communities/:slug`, ({ params }) => {
    const community = db.communities.find((c) => c.slug === params.slug)
    if (!community) return HttpResponse.json({ message: 'Comunidade não encontrada' }, { status: 404 })
    return HttpResponse.json(toCommunityDto(community))
  }),

  http.post(`${API}/communities`, async ({ request }) => {
    const userId = getUserId(request)
    if (!userId) return HttpResponse.json({ message: 'Não autenticado' }, { status: 401 })

    const body = (await request.json()) as { name: string; description: string }
    const slug = slugify(body.name)
    if (db.communities.some((c) => c.slug === slug)) {
      return HttpResponse.json({ message: 'Já existe uma comunidade com esse nome' }, { status: 409 })
    }
    const community: DbCommunity = {
      id: crypto.randomUUID(),
      name: body.name,
      slug,
      description: body.description,
      createdByUserId: userId,
      createdAt: new Date().toISOString(),
    }
    db.communities.push(community)
    return HttpResponse.json(toCommunityDto(community), { status: 201 })
  }),

  // ---------------- posts ----------------
  http.get(`${API}/communities/:slug/posts`, ({ params, request }) => {
    const community = db.communities.find((c) => c.slug === params.slug)
    if (!community) return HttpResponse.json({ message: 'Comunidade não encontrada' }, { status: 404 })

    const url = new URL(request.url)
    const sort = url.searchParams.get('sort') ?? 'hot'
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '5')

    const communityPosts = db.posts.filter((p) => p.communityId === community.id)
    const sorted = sortPosts(communityPosts, sort)
    const paged = paginate(sorted, page, limit)
    return HttpResponse.json({ ...paged, items: paged.items.map(toPostDto) })
  }),

  http.post(`${API}/communities/:slug/posts`, async ({ params, request }) => {
    const userId = getUserId(request)
    if (!userId) return HttpResponse.json({ message: 'Não autenticado' }, { status: 401 })

    const community = db.communities.find((c) => c.slug === params.slug)
    if (!community) return HttpResponse.json({ message: 'Comunidade não encontrada' }, { status: 404 })

    const body = (await request.json()) as { title: string; content: string }
    const post: DbPost = {
      id: crypto.randomUUID(),
      communityId: community.id,
      authorId: userId,
      title: body.title,
      content: body.content,
      createdAt: new Date().toISOString(),
      voteScore: 1, // autor já "vota" no próprio post
      commentCount: 0,
    }
    db.posts.push(post)
    return HttpResponse.json(toPostDto(post), { status: 201 })
  }),
]
