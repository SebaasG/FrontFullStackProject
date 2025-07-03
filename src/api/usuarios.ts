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

  // SOLUCIÓN DEFINITIVA: Usar consulta SQL directa como sugeriste
  getMecanicos: async (): Promise<UsuarioResponse[]> => {
    try {
      console.log('🔄 Obteniendo SOLO mecánicos (rolUsuarioId = 2)...');
      
      // OPCIÓN 1: Intentar endpoint específico para mecánicos
      try {
        const response = await api.get('/api/Usuario/mecanicos');
        console.log('✅ Mecánicos obtenidos desde endpoint específico:', response.data);
        return Array.isArray(response.data) ? response.data : [];
      } catch (endpointError) {
        console.log('⚠️ Endpoint específico no disponible, usando filtro SQL...');
      }

      // OPCIÓN 2: Usar parámetro de consulta SQL (como sugeriste)
      try {
        const response = await api.get('/api/Usuario?rolUsuarioId=2');
        console.log('✅ Mecánicos obtenidos con parámetro rolUsuarioId=2:', response.data);
        const mecanicosSql = Array.isArray(response.data) ? response.data : 
                            response.data?.data ? response.data.data : [];
        
        if (mecanicosSql.length > 0) {
          console.log('🎉 Mecánicos encontrados con SQL:', mecanicosSql.map(m => `${m.nombre} (ID: ${m.id})`));
          return mecanicosSql;
        }
      } catch (sqlError) {
        console.log('⚠️ Consulta SQL no disponible, usando filtro frontend...');
      }

      // OPCIÓN 3: Filtro manual ESTRICTO en frontend (fallback)
      const todosUsuarios = await this.getAll();
      console.log('📦 Todos los usuarios obtenidos:', todosUsuarios);
      console.log('📋 Detalle de usuarios:', todosUsuarios.map(u => ({ 
        id: u.id, 
        nombre: u.nombre, 
        rolUsuarioId: u.rolUsuarioId, 
        rolUsuarioNombre: u.rolUsuarioNombre 
      })));
      
      // FILTRO ESTRICTO: SOLO rolUsuarioId === 2 (Mecánico)
      const mecanicos = todosUsuarios.filter(usuario => {
        const esMecanico = usuario.rolUsuarioId === 2;
        console.log(`👤 Usuario ${usuario.nombre}: rolId=${usuario.rolUsuarioId}, esMecanico=${esMecanico}`);
        return esMecanico;
      });
      
      console.log('🔧 Mecánicos filtrados ESTRICTAMENTE (rolUsuarioId = 2):', mecanicos);
      console.log('🔧 Mecánicos encontrados:', mecanicos.map(m => ({ 
        id: m.id, 
        nombre: m.nombre, 
        correo: m.correo,
        rolUsuarioId: m.rolUsuarioId
      })));
      
      if (mecanicos.length === 0) {
        console.warn('⚠️ No se encontraron mecánicos con rolUsuarioId = 2');
        console.log('💡 SOLUCIÓN BACKEND: Crear endpoint GET /api/Usuario/mecanicos que ejecute:');
        console.log('   SELECT * FROM usuarios WHERE rolUsuarioId = 2;');
        console.log('💡 Usuarios disponibles por rol:');
        const usuariosPorRol = todosUsuarios.reduce((acc, u) => {
          acc[u.rolUsuarioId] = acc[u.rolUsuarioId] || [];
          acc[u.rolUsuarioId].push(u.nombre);
          return acc;
        }, {} as Record<number, string[]>);
        console.log(usuariosPorRol);
      }
      
      return mecanicos;
    } catch (error) {
      console.error('❌ Error obteniendo mecánicos:', error);
      return [];
    }
  },
};