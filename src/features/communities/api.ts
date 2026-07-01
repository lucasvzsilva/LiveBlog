import { api } from '@/lib/api/axios'
import type { Community, CreateCommunityInput } from './types'

export async function getCommunities(): Promise<Community[]> {
  const { data } = await api.get<Community[]>('/communities')
  return data
}

export async function getCommunity(slug: string): Promise<Community> {
  const { data } = await api.get<Community>(`/communities/${slug}`)
  return data
}

export async function createCommunity(input: CreateCommunityInput): Promise<Community> {
  const { data } = await api.post<Community>('/communities', input)
  return data
}
