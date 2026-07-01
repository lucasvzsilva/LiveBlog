import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/shared/layout/AppLayout'
import { RequireAuth } from '@/shared/auth/RequireAuth'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { CommunitiesPage } from '@/features/communities/pages/CommunitiesPage'
import { CommunityPage } from '@/features/communities/pages/CommunityPage'
import { CreateCommunityPage } from '@/features/communities/pages/CreateCommunityPage'
import { CreatePostPage } from '@/features/posts/pages/CreatePostPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <CommunitiesPage /> },
      { path: 'r/:slug', element: <CommunityPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      // rotas protegidas: só logado
      {
        element: <RequireAuth />,
        children: [
          { path: 'communities/new', element: <CreateCommunityPage /> },
          { path: 'r/:slug/submit', element: <CreatePostPage /> },
        ],
      },
    ],
  },
])
