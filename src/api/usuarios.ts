import api from './axios';
import { UsuarioRequest, UsuarioResponse, PaginatedResponse, PaginationParams } from '../types';

export const usuariosAPI = {
  getAll: async (params?: PaginationParams): Promise<UsuarioResponse[]> => {
    try {
      console.log('🔄 Llamando API usuarios...');
      const response = await api.get('/api/Usuario', { params });
      console.log('📦 Respuesta API usuarios:', response.data);
      
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
      console.error('❌ Error en usuariosAPI.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<UsuarioResponse> => {
    const response = await api.get(`/api/Usuario/${id}`);
    return response.data;
  },

  create: async (usuario: UsuarioRequest): Promise<UsuarioResponse> => {
    console.log('💾 Creando usuario:', usuario);
    const response = await api.post('/api/Usuario', usuario);
    console.log('✅ Usuario creado:', response.data);
    return response.data;
  },

  update: async (id: number, usuario: UsuarioRequest): Promise<UsuarioResponse> => {
    console.log('📝 Actualizando usuario:', id, usuario);
    const response = await api.put(`/api/Usuario/${id}`, usuario);
    console.log('✅ Usuario actualizado:', response.data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    console.log('🗑️ Eliminando usuario:', id);
    await api.delete(`/api/Usuario/${id}`);
    console.log('✅ Usuario eliminado');
  },

  getMecanicos: async (): Promise<UsuarioResponse[]> => {
    try {
      console.log('🔄 Obteniendo mecánicos...');
      
      // Obtener todos los usuarios y filtrar por rol de mecánico
      const todosUsuarios = await this.getAll();
      console.log('📦 Todos los usuarios obtenidos:', todosUsuarios);
      console.log('📋 Detalle de usuarios:', todosUsuarios.map(u => ({ 
        id: u.id, 
        nombre: u.nombre, 
        rolUsuarioId: u.rolUsuarioId, 
        rolUsuarioNombre: u.rolUsuarioNombre 
      })));
      
      // Filtrar mecánicos según tus datos: rolUsuarioId = 2
      const mecanicos = todosUsuarios.filter(usuario => {
        const esMecanico = usuario.rolUsuarioId === 2 || 
                          usuario.rolUsuarioNombre === 'Mecánico' ||
                          usuario.rolUsuarioNombre?.toLowerCase().includes('mecánico') ||
                          usuario.rolUsuarioNombre?.toLowerCase().includes('mecanico');
        
        console.log(`👤 Usuario ${usuario.nombre}: rolId=${usuario.rolUsuarioId}, rolNombre="${usuario.rolUsuarioNombre}", esMecanico=${esMecanico}`);
        return esMecanico;
      });
      
      console.log('🔧 Mecánicos filtrados:', mecanicos);
      console.log('🔧 Mecánicos encontrados:', mecanicos.map(m => ({ 
        id: m.id, 
        nombre: m.nombre, 
        correo: m.correo 
      })));
      
      return mecanicos;
    } catch (error) {
      console.error('❌ Error obteniendo mecánicos:', error);
      
      // En caso de error, devolver array vacío para que se maneje en el componente
      return [];
    }
  },
};