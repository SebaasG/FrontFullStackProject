import api from './axios';
import { TipoServicioRequest, TipoServicioResponse, PaginatedResponse, PaginationParams } from '../types';

export const tiposServicioAPI = {
  getAll: async (params?: PaginationParams): Promise<TipoServicioResponse[]> => {
    try {
      console.log('🔄 Llamando API tipos de servicio...');
      const response = await api.get('/api/TipoServicio', { params });
      console.log('📦 Respuesta API tipos de servicio:', response.data);
      
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
      console.error('❌ Error en tiposServicioAPI.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<TipoServicioResponse> => {
    const response = await api.get(`/api/TipoServicio/${id}`);
    return response.data;
  },

  create: async (tipoServicio: TipoServicioRequest): Promise<TipoServicioResponse> => {
    console.log('💾 Creando tipo de servicio:', tipoServicio);
    const response = await api.post('/api/TipoServicio', tipoServicio);
    console.log('✅ Tipo de servicio creado:', response.data);
    return response.data;
  },

  update: async (id: number, tipoServicio: TipoServicioRequest): Promise<TipoServicioResponse> => {
    console.log('📝 Actualizando tipo de servicio:', id, tipoServicio);
    const response = await api.put(`/api/TipoServicio/${id}`, tipoServicio);
    console.log('✅ Tipo de servicio actualizado:', response.data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    console.log('🗑️ Eliminando tipo de servicio:', id);
    await api.delete(`/api/TipoServicio/${id}`);
    console.log('✅ Tipo de servicio eliminado');
  },
};