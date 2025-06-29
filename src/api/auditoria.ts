import api from './axios';
import { AuditoriaRequest, AuditoriaResponse, PaginatedResponse, PaginationParams } from '../types';

export const auditoriaAPI = {
  getAll: async (params?: PaginationParams): Promise<AuditoriaResponse[]> => {
    try {
      console.log('🔄 Llamando API auditoría...');
      const response = await api.get('/api/Auditoria', { params });
      console.log('📦 Respuesta API auditoría:', response.data);
      
      // Manejar diferentes estructuras de respuesta del backend
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data.items && Array.isArray(response.data.items)) {
        return response.data.items;
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Error en auditoriaAPI.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<AuditoriaResponse> => {
    const response = await api.get(`/api/Auditoria/${id}`);
    return response.data;
  },

  create: async (auditoria: AuditoriaRequest): Promise<AuditoriaResponse> => {
    console.log('💾 Creando registro de auditoría:', auditoria);
    const response = await api.post('/api/Auditoria', auditoria);
    console.log('✅ Registro de auditoría creado:', response.data);
    return response.data;
  },
};