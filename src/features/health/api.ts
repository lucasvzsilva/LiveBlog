import { api } from '@/lib/api/axios'

export interface HealthStatus {
  status: string
  time: string
}

export async function getHealth(): Promise<HealthStatus> {
  const { data } = await api.get<HealthStatus>('/health')
  return data
}
