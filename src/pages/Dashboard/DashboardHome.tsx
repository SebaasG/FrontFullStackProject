import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Car, 
  Wrench, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Calendar,
  AlertTriangle,
  Package
} from 'lucide-react';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import { clientesAPI } from '../../api/clientes';
import { vehiculosAPI } from '../../api/vehiculos';
import { ordenesAPI } from '../../api/ordenes';
import { repuestosAPI } from '../../api/repuestos';
import { auditoriaAPI } from '../../api/auditoria';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalClientes: number;
  totalVehiculos: number;
  ordenesActivas: number;
  repuestosStockBajo: number;
  totalOrdenes: number;
  ordenesCompletadas: number;
}

interface RecentActivity {
  id: number;
  action: string;
  details: string;
  time: string;
  type: 'order' | 'vehicle' | 'client' | 'invoice';
  entidad: string;
  accion: string;
  usuarioNombre: string;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    totalVehiculos: 0,
    ordenesActivas: 0,
    repuestosStockBajo: 0,
    totalOrdenes: 0,
    ordenesCompletadas: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos del dashboard...');
      
      // Cargar datos en paralelo con manejo de errores individual
      const [clientesData, vehiculosData, ordenesData, repuestosData, auditoriaData] = await Promise.allSettled([
        clientesAPI.getAll().catch(() => []),
        vehiculosAPI.getAll().catch(() => []),
        ordenesAPI.getAll().catch(() => []),
        repuestosAPI.getLowStock().catch(() => []),
        auditoriaAPI.getAll().catch(() => [])
      ]);

      // Procesar clientes
      const clientes = clientesData.status === 'fulfilled' ? clientesData.value : [];
      console.log('👥 Clientes cargados:', clientes.length);

      // Procesar vehículos
      let vehiculos = [];
      if (vehiculosData.status === 'fulfilled') {
        const vehiculosResult = vehiculosData.value;
        vehiculos = Array.isArray(vehiculosResult) ? vehiculosResult : 
                   vehiculosResult?.data ? vehiculosResult.data : [];
      }
      console.log('🚗 Vehículos cargados:', vehiculos.length);

      // Procesar órdenes
      let ordenes = [];
      if (ordenesData.status === 'fulfilled') {
        const ordenesResult = ordenesData.value;
        ordenes = Array.isArray(ordenesResult) ? ordenesResult : 
                 ordenesResult?.data ? ordenesResult.data : [];
      }
      console.log('📋 Órdenes cargadas:', ordenes.length);

      // Procesar repuestos
      const repuestos = repuestosData.status === 'fulfilled' ? repuestosData.value : [];
      console.log('📦 Repuestos con stock bajo:', repuestos.length);

      // Procesar auditoría
      const auditoria = auditoriaData.status === 'fulfilled' ? auditoriaData.value : [];
      console.log('📊 Registros de auditoría:', auditoria.length);

      // Calcular estadísticas
      const ordenesActivas = ordenes.filter(orden => 
        orden.estado === 'Pendiente' || orden.estado === 'En Proceso'
      ).length;

      const ordenesCompletadas = ordenes.filter(orden => 
        orden.estado === 'Completada'
      ).length;

      const newStats = {
        totalClientes: clientes.length,
        totalVehiculos: vehiculos.length,
        ordenesActivas,
        repuestosStockBajo: repuestos.length,
        totalOrdenes: ordenes.length,
        ordenesCompletadas,
      };

      console.log('📊 Estadísticas calculadas:', newStats);
      setStats(newStats);

      // Generar actividades recientes basadas en auditoría real
      const activities: RecentActivity[] = auditoria
        .slice(0, 5)
        .map((registro) => ({
          id: registro.id,
          action: getActivityActionText(registro.entidad, registro.accion),
          details: `${registro.entidad} - ${registro.usuarioNombre}`,
          time: getRelativeTime(registro.fecha),
          type: getActivityType(registro.entidad),
          entidad: registro.entidad,
          accion: registro.accion,
          usuarioNombre: registro.usuarioNombre,
        }));

      // Si no hay auditoría, crear actividades basadas en órdenes
      if (activities.length === 0 && ordenes.length > 0) {
        const ordenActivities: RecentActivity[] = ordenes
          .slice(0, 5)
          .map((orden) => ({
            id: orden.id,
            action: getActivityActionFromOrder(orden.estado),
            details: `${orden.vehiculoDescripcion} - ${orden.usuarioNombre}`,
            time: getRelativeTime(orden.fechaIngreso),
            type: 'order' as const,
            entidad: 'Orden de Servicio',
            accion: orden.estado,
            usuarioNombre: orden.usuarioNombre,
          }));
        setRecentActivities(ordenActivities);
      } else {
        setRecentActivities(activities);
      }

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getActivityActionText = (entidad: string, accion: string): string => {
    const actionMap: Record<string, Record<string, string>> = {
      'Cliente': {
        'Crear': 'Nuevo cliente registrado',
        'Actualizar': 'Cliente actualizado',
        'Eliminar': 'Cliente eliminado',
      },
      'Orden de Servicio': {
        'Crear': 'Nueva orden de servicio',
        'Actualizar': 'Orden actualizada',
        'Completar': 'Orden completada',
        'Cancelar': 'Orden cancelada',
      },
      'Usuario': {
        'Crear': 'Nuevo usuario creado',
        'Actualizar': 'Usuario actualizado',
        'Login': 'Inicio de sesión',
        'Logout': 'Cierre de sesión',
      },
      'Vehículo': {
        'Crear': 'Vehículo registrado',
        'Actualizar': 'Vehículo actualizado',
        'Eliminar': 'Vehículo eliminado',
      },
      'Repuesto': {
        'Crear': 'Repuesto agregado',
        'Actualizar': 'Stock actualizado',
        'Eliminar': 'Repuesto eliminado',
      },
    };

    return actionMap[entidad]?.[accion] || `${accion} ${entidad}`;
  };

  const getActivityActionFromOrder = (estado: string): string => {
    switch (estado) {
      case 'Pendiente':
        return 'Nueva orden de servicio creada';
      case 'En Proceso':
        return 'Orden en proceso';
      case 'Completada':
        return 'Orden completada';
      case 'Cancelada':
        return 'Orden cancelada';
      default:
        return 'Orden actualizada';
    }
  };

  const getActivityType = (entidad: string): 'order' | 'vehicle' | 'client' | 'invoice' => {
    switch (entidad) {
      case 'Orden de Servicio':
        return 'order';
      case 'Vehículo':
        return 'vehicle';
      case 'Cliente':
        return 'client';
      case 'Factura':
        return 'invoice';
      default:
        return 'order';
    }
  };

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  const statsConfig = [
    {
      title: 'Total Clientes',
      value: stats.totalClientes.toString(),
      change: '+12%',
      icon: Users,
      color: 'text-primary-electric',
      bgColor: 'bg-primary-electric/10',
    },
    {
      title: 'Vehículos Registrados',
      value: stats.totalVehiculos.toString(),
      change: '+8%',
      icon: Car,
      color: 'text-accent-green',
      bgColor: 'bg-accent-green/10',
    },
    {
      title: 'Órdenes Activas',
      value: stats.ordenesActivas.toString(),
      change: `${stats.totalOrdenes} total`,
      icon: Wrench,
      color: 'text-accent-orange',
      bgColor: 'bg-accent-orange/10',
    },
    {
      title: 'Stock Bajo',
      value: stats.repuestosStockBajo.toString(),
      change: stats.repuestosStockBajo > 0 ? 'Atención' : 'OK',
      icon: AlertTriangle,
      color: stats.repuestosStockBajo > 0 ? 'text-red-400' : 'text-accent-green',
      bgColor: stats.repuestosStockBajo > 0 ? 'bg-red-400/10' : 'bg-accent-green/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando dashboard...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white neon-text">
            Dashboard Administrativo
          </h1>
          <p className="text-white/70 mt-2">
            Gestión completa del sistema de taller
          </p>
        </div>
        
        <motion.div
          className="flex items-center gap-2 glass px-4 py-2 rounded-lg"
          whileHover={{ scale: 1.05 }}
        >
          <Activity className="w-5 h-5 text-accent-green" />
          <span className="text-white font-medium">Sistema Activo</span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={listVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsConfig.map((stat, index) => (
          <motion.div key={stat.title} variants={listItemVariants}>
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-accent-green mr-1" />
                    <span className="text-accent-green text-sm font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Actividad Reciente
              </h2>
              <Calendar className="w-5 h-5 text-primary-electric" />
            </div>
            
            <motion.div
              variants={listVariants}
              className="space-y-4"
            >
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    variants={listItemVariants}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="w-2 h-2 bg-primary-electric rounded-full" />
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {activity.action}
                      </p>
                      <p className="text-white/60 text-sm">
                        {activity.details}
                      </p>
                    </div>
                    <span className="text-white/50 text-sm">
                      {activity.time}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60">No hay actividad reciente</p>
                </div>
              )}
            </motion.div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card variant="glass" className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Acciones Rápidas
            </h2>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/admin/usuarios'}
                className="w-full p-4 bg-gradient-primary rounded-lg text-white font-medium hover:shadow-neon transition-all"
              >
                Crear Usuario
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/admin/clientes'}
                className="w-full p-4 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-all border border-white/20"
              >
                Gestionar Clientes
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/admin/repuestos'}
                className="w-full p-4 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-all border border-white/20"
              >
                Gestionar Repuestos
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/admin/ordenes'}
                className="w-full p-4 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-all border border-white/20"
              >
                Ver Órdenes
              </motion.button>
            </div>
          </Card>

          {/* Alerts */}
          <Card variant="glass" className="p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-accent-orange" />
              <h3 className="text-lg font-semibold text-white">
                Alertas del Sistema
              </h3>
            </div>
            
            <div className="space-y-3">
              {stats.repuestosStockBajo > 0 && (
                <div className="p-3 bg-accent-orange/10 border border-accent-orange/30 rounded-lg">
                  <p className="text-accent-orange text-sm font-medium">
                    Stock bajo en repuestos
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    {stats.repuestosStockBajo} repuestos necesitan reposición
                  </p>
                </div>
              )}
              
              {stats.ordenesActivas > 0 && (
                <div className="p-3 bg-primary-electric/10 border border-primary-electric/30 rounded-lg">
                  <p className="text-primary-electric text-sm font-medium">
                    Órdenes activas
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    {stats.ordenesActivas} órdenes requieren atención
                  </p>
                </div>
              )}

              {stats.repuestosStockBajo === 0 && stats.ordenesActivas === 0 && (
                <div className="p-3 bg-accent-green/10 border border-accent-green/30 rounded-lg">
                  <p className="text-accent-green text-sm font-medium">
                    Todo en orden
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    No hay alertas pendientes
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;