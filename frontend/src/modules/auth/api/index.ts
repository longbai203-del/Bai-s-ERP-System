import http from '@/api/http'

export interface AuthLoginPayload {
  username: string
  password: string
}

export interface AuthResponse {
  token?: string
  user?: Record<string, any>
  message?: string
  success?: boolean
}

export const login = (payload: AuthLoginPayload): Promise<AuthResponse> => {
  return http.post('/auth/login', payload)
}

export const logout = (): Promise<void> => {
  return http.post('/auth/logout')
}

export const getCurrentUser = (): Promise<Record<string, any>> => {
  return http.get('/auth/me')
}

export default {
  login,
  logout,
  getCurrentUser,
}
