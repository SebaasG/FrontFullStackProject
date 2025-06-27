import { api } from './Api'
import type { User } from '../types'

export interface LoginRequest {
  correo: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    api.setToken(response.token)
    return response
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me')
  },

  logout() {
    api.removeToken()
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  }
}