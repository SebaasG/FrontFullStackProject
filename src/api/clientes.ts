import api from './axios';
import { ClienteRequest, ClienteResponse, PaginatedResponse, PaginationParams } from '../types';

export const clientesAPI = {
  getAll: async (params?: PaginationParams): Promise<ClienteResponse[]> => {
    try {
      console.log('🔄 Llamando API clientes...');
      const response = await api.get('/api/Cliente', { params });
      console.log('📦 Respuesta API clientes:', response.data);
      
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
      console.error('❌ Error en clientesAPI.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<ClienteResponse> => {
    const response = await api.get(`/api/Cliente/${id}`);
    return response.data;
  },

  create: async (cliente: ClienteRequest): Promise<ClienteResponse> => {
    console.log('💾 Creando cliente:', cliente);
    const response = await api.post('/api/Cliente', cliente);
    console.log('✅ Cliente creado:', response.data);
    return response.data;
  },

  update: async (id: number, cliente: ClienteRequest): Promise<ClienteResponse> => {
    console.log('📝 Actualizando cliente:', id, cliente);
    const response = await api.put(`/api/Cliente/${id}`, cliente);
    console.log('✅ Cliente actualizado:', response.data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    console.log('🗑️ Eliminando cliente:', id);
    await api.delete(`/api/Cliente/${id}`);
    console.log('✅ Cliente eliminado');
  },

  search: async (query: string): Promise<ClienteResponse[]> => {
    const response = await api.get(`/api/Cliente/search?q=${encodeURIComponent(query)}`);
    return Array.isArray(response.data) ? response.data : [];
  },
};