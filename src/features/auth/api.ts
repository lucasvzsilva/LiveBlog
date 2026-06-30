import { api } from '@/lib/api/axios'
import type { AuthResponse, LoginInput, RegisterInput } from './types'

// Camada de "service": só fala HTTP. Sem estado, sem React.
// Equivalente a um client tipado / repository do lado do consumidor.
export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', input)
  return data
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', input)
  return data
}
