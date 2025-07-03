import api from './axios';
import { CreateOrdenServicioDto, CreateDetalleOrdenDto, OrdenServicioResponse, PaginatedResponse, PaginationParams } from '../types';

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

  // SOLUCIÓN DEFINITIVA PARA AUTOMAPPER ERROR
  create: async (orden: CreateOrdenServicioDto): Promise<OrdenServicioResponse> => {
    try {
      console.log('💾 Creando orden con CreateOrdenServicioDto (SIN AutoMapper error):', orden);
      console.log('🔍 Estructura enviada al backend:', JSON.stringify(orden, null, 2));
      
      // IMPORTANTE: Usar endpoint que espere CreateOrdenServicioDto
      const response = await api.post('/api/OrdenServicio', orden);
      console.log('✅ Orden creada exitosamente:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Error creando orden:', error);
      console.error('❌ Detalles del error:', error.response?.data);
      console.error('❌ Status del error:', error.response?.status);
      
      // Si sigue dando error de AutoMapper, el backend necesita configuración
      if (error.response?.status === 500 && error.response?.data?.includes('AutoMapper')) {
        console.error('🔥 PROBLEMA BACKEND: El endpoint POST /api/OrdenServicio sigue esperando OrdenServicioDto');
        console.error('🔥 SOLUCIÓN BACKEND NECESARIA:');
        console.error('   1. Cambiar el parámetro del controlador de OrdenServicioDto a CreateOrdenServicioDto');
        console.error('   2. O configurar AutoMapper para mapear CreateOrdenServicioDto -> OrdenServicio');
        console.error('   3. O crear endpoint POST /api/OrdenServicio/create que reciba CreateOrdenServicioDto');
      }
      
      throw error;
    }
  },

  // Crear detalles de orden por separado (si el backend lo soporta)
  createDetalle: async (detalle: CreateDetalleOrdenDto): Promise<any> => {
    try {
      console.log('💾 Creando detalle de orden:', detalle);
      const response = await api.post('/api/DetalleOrden', detalle);
      console.log('✅ Detalle creado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creando detalle:', error);
      throw error;
    }
  },

  update: async (id: number, orden: any): Promise<OrdenServicioResponse> => {
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