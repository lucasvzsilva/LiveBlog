export interface Community {
  id: string
  name: string
  slug: string
  description: string
  createdByUserId: string
  createdAt: string
  postCount: number
}

export interface CreateCommunityInput {
  name: string
  description: string
}
