export interface AuthUser {
  id: string
  username: string
  email: string
  karma: number
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
}
