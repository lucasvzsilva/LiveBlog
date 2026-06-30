import axios from 'axios'
import { useAuthStore } from '@/features/auth/store'

// Instância única do axios (equivalente a um HttpClient configurado no .NET).
// baseURL "/api": todas as chamadas batem em /api/* — o MSW intercepta no dev.
export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: injeta o JWT em toda requisição.
// É o equivalente a um DelegatingHandler que adiciona o header Authorization.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor: em 401, desloga e manda pro login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
