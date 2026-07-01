import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createPost, getCommunityPosts } from './api'
import type { CreatePostInput, SortOption } from './types'

export function useCommunityPosts(slug: string, sort: SortOption, page: number) {
  return useQuery({
    // A queryKey inclui slug+sort+page: cada combinação vira uma entrada de cache.
    queryKey: ['posts', slug, sort, page],
    queryFn: () => getCommunityPosts(slug, { sort, page }),
    // Mantém os dados da página anterior visíveis enquanto a nova carrega (sem "piscar").
    placeholderData: keepPreviousData,
  })
}

export function useCreatePost(slug: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (input: CreatePostInput) => createPost(slug, input),
    onSuccess: () => {
      // invalida TODAS as páginas/ordenações desta comunidade.
      queryClient.invalidateQueries({ queryKey: ['posts', slug] })
      navigate(`/r/${slug}`)
    },
  })
}
