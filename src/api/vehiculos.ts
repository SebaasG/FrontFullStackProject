import api from './axios';
import { VehiculoRequest, VehiculoResponse, PaginatedResponse, PaginationParams } from '../types';

export const vehiculosAPI = {
  getAll: async (params?: PaginationParams): Promise<VehiculoResponse[]> => {
    try {
      console.log('🔄 Llamando API vehículos...');
      const response = await api.get('/api/Vehiculo', { params });
      console.log('📦 Respuesta API vehículos:', response.data);
      
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
      console.error('❌ Error en vehiculosAPI.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<VehiculoResponse> => {
    const response = await api.get(`/api/Vehiculo/${id}`);
    return response.data;
  },

  getByCliente: async (clienteId: number): Promise<VehiculoResponse[]> => {
    try {
      console.log('🔄 Obteniendo vehículos del cliente:', clienteId);
      const response = await api.get(`/api/Vehiculo?clienteId=${clienteId}`);
      console.log('📦 Vehículos del cliente:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error obteniendo vehículos del cliente:', error);
      throw error;
    }
  },

  create: async (vehiculo: VehiculoRequest): Promise<VehiculoResponse> => {
    console.log('💾 Creando vehículo:', vehiculo);
    const response = await api.post('/api/Vehiculo', vehiculo);
    console.log('✅ Vehículo creado:', response.data);
    return response.data;
  },

  update: async (id: number, vehiculo: VehiculoRequest): Promise<VehiculoResponse> => {
    console.log('📝 Actualizando vehículo:', id, vehiculo);
    const response = await api.put(`/api/Vehiculo/${id}`, vehiculo);
    console.log('✅ Vehículo actualizado:', response.data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    console.log('🗑️ Eliminando vehículo:', id);
    await api.delete(`/api/Vehiculo/${id}`);
    console.log('✅ Vehículo eliminado');
  },
};