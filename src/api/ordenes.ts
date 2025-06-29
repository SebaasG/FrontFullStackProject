import api from './axios';
import { OrdenServicioRequest, OrdenServicioResponse, PaginatedResponse, PaginationParams } from '../types';

export const ordenesAPI = {
  getAll: async (params?: PaginationParams): Promise<OrdenServicioResponse[]> => {
    try {
      console.log('🔄 Llamando API órdenes...');
      const response = await api.get('/api/OrdenServicio', { params });
      console.log('📦 Respuesta API órdenes:', response.data);
      
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
      console.error('❌ Error en ordenesAPI.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<OrdenServicioResponse> => {
    const response = await api.get(`/api/OrdenServicio/${id}`);
    return response.data;
  },

  getByMecanico: async (mecanicoId: number): Promise<OrdenServicioResponse[]> => {
    try {
      console.log('🔄 Obteniendo órdenes del mecánico:', mecanicoId);
      const response = await api.get(`/api/OrdenServicio?usuarioId=${mecanicoId}`);
      console.log('📦 Órdenes del mecánico:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error obteniendo órdenes del mecánico:', error);
      throw error;
    }
  },

  create: async (orden: OrdenServicioRequest): Promise<OrdenServicioResponse> => {
    console.log('💾 Creando orden de servicio:', orden);
    const response = await api.post('/api/OrdenServicio', orden);
    console.log('✅ Orden creada:', response.data);
    return response.data;
  },

  update: async (id: number, orden: OrdenServicioRequest): Promise<OrdenServicioResponse> => {
    console.log('📝 Actualizando orden:', id, orden);
    const response = await api.put(`/api/OrdenServicio/${id}`, orden);
    console.log('✅ Orden actualizada:', response.data);
    return response.data;
  },

  updateEstado: async (id: number, estado: string): Promise<OrdenServicioResponse> => {
    console.log('🔄 Actualizando estado de orden:', id, estado);
    const response = await api.patch(`/api/OrdenServicio/${id}/estado`, { estado });
    console.log('✅ Estado actualizado:', response.data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    console.log('🗑️ Eliminando orden:', id);
    await api.delete(`/api/OrdenServicio/${id}`);
    console.log('✅ Orden eliminada');
  },
};