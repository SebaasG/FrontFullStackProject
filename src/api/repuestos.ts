import api from './axios';
import { RepuestoRequest, RepuestoResponse, PaginatedResponse, PaginationParams } from '../types';

export const repuestosAPI = {
  getAll: async (params?: PaginationParams): Promise<RepuestoResponse[]> => {
    try {
      console.log('🔄 Llamando API repuestos...');
      const response = await api.get('/api/Repuesto', { params });
      console.log('📦 Respuesta API repuestos:', response.data);
      
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
      console.error('❌ Error en repuestosAPI.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<RepuestoResponse> => {
    const response = await api.get(`/api/Repuesto/${id}`);
    return response.data;
  },

  create: async (repuesto: RepuestoRequest): Promise<RepuestoResponse> => {
    console.log('💾 Creando repuesto:', repuesto);
    const response = await api.post('/api/Repuesto', repuesto);
    console.log('✅ Repuesto creado:', response.data);
    return response.data;
  },

  update: async (id: number, repuesto: RepuestoRequest): Promise<RepuestoResponse> => {
    console.log('📝 Actualizando repuesto:', id, repuesto);
    const response = await api.put(`/api/Repuesto/${id}`, repuesto);
    console.log('✅ Repuesto actualizado:', response.data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    console.log('🗑️ Eliminando repuesto:', id);
    await api.delete(`/api/Repuesto/${id}`);
    console.log('✅ Repuesto eliminado');
  },

  search: async (query: string): Promise<RepuestoResponse[]> => {
    try {
      const response = await api.get(`/api/Repuesto/search?q=${encodeURIComponent(query)}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('❌ Error buscando repuestos:', error);
      return [];
    }
  },

  getLowStock: async (): Promise<RepuestoResponse[]> => {
    try {
      console.log('🔄 Obteniendo repuestos con stock bajo...');
      const response = await api.get('/api/Repuesto/low-stock');
      console.log('📦 Repuestos con stock bajo:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error obteniendo repuestos con stock bajo:', error);
      return [];
    }
  },
};