import api from './axios';
import { LoginRequest, LoginResponse } from '../types';

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('🔐 Intentando login con:', { 
        correo: credentials.correo, 
        password: '***' 
      });
      
      const response = await api.post('/api/auth/login', credentials);
      
      console.log('✅ Login exitoso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en authAPI.login:', error);
      
      // Re-lanzar el error para que sea manejado por el componente
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    // Clear local storage and redirect
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  },

  validateToken: async (): Promise<boolean> => {
    try {
      const response = await api.get('/api/auth/validate');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
};