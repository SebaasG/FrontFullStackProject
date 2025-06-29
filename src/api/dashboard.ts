import api from './axios';

export interface DashboardStats {
  totalClientes: number;
  totalVehiculos: number;
  ordenesActivas: number;
  facturacionMensual: number;
  crecimientoMensual: number;
}

export interface ActivityLog {
  id: number;
  entidad: string;
  accion: string;
  usuarioNombre: string;
  fecha: string;
  detalles?: string;
}

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/Dashboard/stats');
    return response.data;
  },

  getRecentActivity: async (limit: number = 10): Promise<ActivityLog[]> => {
    const response = await api.get(`/api/Dashboard/activity?limit=${limit}`);
    return response.data;
  },

  getChartData: async (type: 'ordenes' | 'facturacion', period: 'week' | 'month' | 'year') => {
    const response = await api.get(`/api/Dashboard/chart/${type}?period=${period}`);
    return response.data;
  },
};