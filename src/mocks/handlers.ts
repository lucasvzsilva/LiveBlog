import { http, HttpResponse } from 'msw'
import { db, makeToken, toAuthUser, type DbUser } from './db'
import type { LoginInput, RegisterInput } from '@/features/auth/types'

const API = '/api'

// Cada handler intercepta uma rota e devolve uma resposta — o "controller" mockado.
export const handlers = [
  http.get(`${API}/health`, () => {
    return HttpResponse.json({ status: 'ok', time: new Date().toISOString() })
  }),

  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as RegisterInput
    if (db.users.some((u) => u.email === body.email)) {
      return HttpResponse.json({ message: 'Email já cadastrado' }, { status: 409 })
    }
    const user: DbUser = {
      id: `u${db.users.length + 1}`,
      username: body.username,
      email: body.email,
      password: body.password,
      karma: 0,
    }
    db.users.push(user)
    return HttpResponse.json(
      { token: makeToken(user.id), user: toAuthUser(user) },
      { status: 201 },
    )
  }),

  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as LoginInput
    const user = db.users.find(
      (u) => u.email === body.email && u.password === body.password,
    )
    if (!user) {
      return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }
    return HttpResponse.json({ token: makeToken(user.id), user: toAuthUser(user) })
  }),
]
