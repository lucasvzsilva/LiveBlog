import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login, register } from './api'
import { useAuthStore } from './store'

// useMutation = operação que muda estado no servidor (POST/PUT/DELETE).
// No sucesso, gravamos token+user no Zustand e navegamos pra home.
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.token, data.user)
      navigate('/')
    },
  })
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data.token, data.user)
      navigate('/')
    },
  })
}
