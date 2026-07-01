export type SortOption = 'hot' | 'new' | 'top'

export interface Post {
  id: string
  communityId: string
  communitySlug: string
  communityName: string
  authorId: string
  authorUsername: string
  title: string
  content: string
  createdAt: string
  voteScore: number
  commentCount: number
}

export interface CreatePostInput {
  title: string
  content: string
}

// Resposta paginada genérica (items + metadados da página).
export interface PagedResult<T> {
  items: T[]
  page: number
  totalPages: number
  hasMore: boolean
}
