import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createCommunity, getCommunities, getCommunity } from './api'

export function useCommunities() {
  return useQuery({ queryKey: ['communities'], queryFn: getCommunities })
}

export function useCommunity(slug: string) {
  return useQuery({
    queryKey: ['community', slug],
    queryFn: () => getCommunity(slug),
  })
}

export function useCreateCommunity() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: createCommunity,
    onSuccess: (community) => {
      // invalida o cache da lista -> o TanStack Query refaz o GET e a nova comunidade aparece.
      queryClient.invalidateQueries({ queryKey: ['communities'] })
      navigate(`/r/${community.slug}`)
    },
  })
}
