import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from './types'

// Estado GLOBAL de cliente (usuário logado + token).
// No .NET você guardaria isso num contexto de sessão/HttpContext;
// aqui o Zustand é a "fonte da verdade" do cliente, persistida no localStorage.
interface AuthState {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'liveblog-auth' }, // chave no localStorage
  ),
)
