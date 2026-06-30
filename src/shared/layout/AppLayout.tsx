import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'

// Shell da aplicação: navbar + <Outlet/> (onde o React Router renderiza a rota atual).
export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="text-lg font-bold text-orange-600">
            LiveBlog
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <span className="text-zinc-600">olá, {user.username}</span>
                <button
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  className="text-zinc-700 hover:text-orange-600"
                >
                  sair
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="text-zinc-700 hover:text-orange-600">
                  entrar
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-orange-600 px-3 py-1 text-white hover:bg-orange-700"
                >
                  criar conta
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
