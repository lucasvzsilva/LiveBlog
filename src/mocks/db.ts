import type { AuthUser } from '@/features/auth/types'

// "Banco" em memória que o MSW usa para simular o backend.
// Será expandido nas próximas fases (communities, posts, comments, votes).
export interface DbUser extends AuthUser {
  password: string
}

export const db = {
  users: [
    {
      id: 'u1',
      username: 'demo',
      email: 'demo@liveblog.dev',
      password: '123456',
      karma: 42,
    },
  ] as DbUser[],
}

// Token fake só para simular o fluxo de auth (NÃO é um JWT real).
export function makeToken(userId: string): string {
  return `mock-token.${userId}.${Date.now()}`
}

// Remove o password antes de devolver o usuário ao cliente (nunca vaza hash/senha).
export function toAuthUser(user: DbUser): AuthUser {
  const { password: _password, ...rest } = user
  return rest
}
