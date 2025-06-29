import api from './axios';
import { FacturaRequest, FacturaResponse, PaginatedResponse, PaginationParams } from '../types';

export const facturasAPI = {
  getAll: async (params?: PaginationParams): Promise<FacturaResponse[]> => {
    try {
      console.log('🔄 Llamando API facturas...');
      const response = await api.get('/api/Factura', { params });
      console.log('📦 Respuesta API facturas:', response.data);
      
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
      console.error('❌ Error en facturasAPI.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<FacturaResponse> => {
    const response = await api.get(`/api/Factura/${id}`);
    return response.data;
  },

  create: async (factura: FacturaRequest): Promise<FacturaResponse> => {
    console.log('💾 Creando factura:', factura);
    const response = await api.post('/api/Factura', factura);
    console.log('✅ Factura creada:', response.data);
    return response.data;
  },

  update: async (id: number, factura: FacturaRequest): Promise<FacturaResponse> => {
    console.log('📝 Actualizando factura:', id, factura);
    const response = await api.put(`/api/Factura/${id}`, factura);
    console.log('✅ Factura actualizada:', response.data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    console.log('🗑️ Eliminando factura:', id);
    await api.delete(`/api/Factura/${id}`);
    console.log('✅ Factura eliminada');
  },
};