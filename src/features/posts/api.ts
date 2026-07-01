import { api } from '@/lib/api/axios'
import type { CreatePostInput, PagedResult, Post, SortOption } from './types'

interface GetPostsParams {
  sort: SortOption
  page: number
  limit?: number
}

export async function getCommunityPosts(
  slug: string,
  { sort, page, limit = 5 }: GetPostsParams,
): Promise<PagedResult<Post>> {
  const { data } = await api.get<PagedResult<Post>>(`/communities/${slug}/posts`, {
    params: { sort, page, limit },
  })
  return data
}

export async function createPost(slug: string, input: CreatePostInput): Promise<Post> {
  const { data } = await api.post<Post>(`/communities/${slug}/posts`, input)
  return data
}
