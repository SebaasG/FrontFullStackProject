import api from './axios';
import { VehiculoRequest, VehiculoResponse, PaginatedResponse, PaginationParams } from '../types';

export const vehiculosAPI = {
  getAll: async (params?: PaginationParams): Promise<VehiculoResponse[]> => {
    try {
      console.log('🔄 Llamando API vehículos...');
      const response = await api.get('/api/Vehiculo', { params });
      console.log('📦 Respuesta API vehículos:', response.data);
      
      // Manejar diferentes estructuras de respuesta del backend
      let vehiculosData: VehiculoResponse[] = [];
      
      if (Array.isArray(response.data)) {
        vehiculosData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        vehiculosData = response.data.data;
      } else if (response.data.items && Array.isArray(response.data.items)) {
        vehiculosData = response.data.items;
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
        vehiculosData = [];
      }

      // CRÍTICO: Enriquecer con información del cliente si no viene del backend
      const vehiculosEnriquecidos = await Promise.all(
        vehiculosData.map(async (vehiculo) => {
          // Si ya tiene clienteNombre, no hacer nada
          if (vehiculo.clienteNombre && vehiculo.clienteNombre !== 'Cliente no encontrado') {
            return vehiculo;
          }

          // Si no tiene clienteNombre, intentar obtenerlo
          try {
            const clienteResponse = await api.get(`/api/Cliente/${vehiculo.clienteId}`);
            return {
              ...vehiculo,
              clienteNombre: clienteResponse.data.nombre || 'Cliente no encontrado'
            };
          } catch (error) {
            console.warn(`⚠️ No se pudo obtener cliente ${vehiculo.clienteId}:`, error);
            return {
              ...vehiculo,
              clienteNombre: 'Cliente no encontrado'
            };
          }
        })
      );
      
      console.log('✅ Vehículos enriquecidos:', vehiculosEnriquecidos);
      return vehiculosEnriquecidos;
    } catch (error) {
      console.error('❌ Error en vehiculosAPI.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<VehiculoResponse> => {
    const response = await api.get(`/api/Vehiculo/${id}`);
    let vehiculo = response.data;

    // Enriquecer con información del cliente si no viene
    if (!vehiculo.clienteNombre || vehiculo.clienteNombre === 'Cliente no encontrado') {
      try {
        const clienteResponse = await api.get(`/api/Cliente/${vehiculo.clienteId}`);
        vehiculo.clienteNombre = clienteResponse.data.nombre;
      } catch (error) {
        console.warn(`⚠️ No se pudo obtener cliente ${vehiculo.clienteId}:`, error);
        vehiculo.clienteNombre = 'Cliente no encontrado';
      }
    }

    return vehiculo;
  },

  getByCliente: async (clienteId: number): Promise<VehiculoResponse[]> => {
    try {
      console.log('🔄 Obteniendo vehículos del cliente:', clienteId);
      const response = await api.get(`/api/Vehiculo?clienteId=${clienteId}`);
      console.log('📦 Vehículos del cliente:', response.data);
      
      let vehiculosData: VehiculoResponse[] = [];
      
      if (Array.isArray(response.data)) {
        vehiculosData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        vehiculosData = response.data.data;
      } else {
        vehiculosData = [];
      }

      // Enriquecer con información del cliente
      const vehiculosEnriquecidos = await Promise.all(
        vehiculosData.map(async (vehiculo) => {
          if (!vehiculo.clienteNombre || vehiculo.clienteNombre === 'Cliente no encontrado') {
            try {
              const clienteResponse = await api.get(`/api/Cliente/${vehiculo.clienteId}`);
              return {
                ...vehiculo,
                clienteNombre: clienteResponse.data.nombre
              };
            } catch (error) {
              return {
                ...vehiculo,
                clienteNombre: 'Cliente no encontrado'
              };
            }
          }
          return vehiculo;
        })
      );

      return vehiculosEnriquecidos;
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