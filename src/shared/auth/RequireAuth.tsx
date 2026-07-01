import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'

// Guarda de rota: se não há usuário logado, redireciona pro login.
// Equivale a um [Authorize] no controller do .NET.
export function RequireAuth() {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
