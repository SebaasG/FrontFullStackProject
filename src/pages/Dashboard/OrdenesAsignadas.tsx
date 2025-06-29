import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Clock, CheckCircle, AlertCircle, Car, User, Calendar, Play, Check } from 'lucide-react';
import { ordenesAPI } from '../../api/ordenes';
import { OrdenServicioResponse } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const OrdenesAsignadas: React.FC = () => {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState<OrdenServicioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingEstado, setUpdatingEstado] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadOrdenesAsignadas();
    }
  }, [user]);

  const loadOrdenesAsignadas = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando órdenes del mecánico:', user?.id);
      
      if (!user?.id) {
        console.warn('⚠️ No hay usuario autenticado');
        setOrdenes([]);
        return;
      }

      const response = await ordenesAPI.getByMecanico(user.id);
      console.log('✅ Órdenes del mecánico cargadas:', response.length);
      setOrdenes(response);
      
      if (response.length === 0) {
        toast.info('No tienes órdenes asignadas');
      }
    } catch (error: any) {
      console.error('❌ Error cargando órdenes del mecánico:', error);
      toast.error('Error al cargar órdenes asignadas');
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (ordenId: number, nuevoEstado: string) => {
    try {
      setUpdatingEstado(ordenId);
      console.log('🔄 Actualizando estado de orden:', ordenId, nuevoEstado);
      
      await ordenesAPI.updateEstado(ordenId, nuevoEstado);
      toast.success(`Orden ${nuevoEstado.toLowerCase()} correctamente`);
      
      // Recargar órdenes
      await loadOrdenesAsignadas();
    } catch (error: any) {
      console.error('❌ Error actualizando estado:', error);
      toast.error('Error al actualizar estado de la orden');
    } finally {
      setUpdatingEstado(null);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'En Proceso':
        return 'bg-accent-orange/20 text-accent-orange border-accent-orange/30';
      case 'Pendiente':
        return 'bg-primary-electric/20 text-primary-electric border-primary-electric/30';
      case 'Completada':
        return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'Cancelada':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-white/20 text-white border-white/30';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'En Proceso':
        return <Clock className="w-4 h-4" />;
      case 'Pendiente':
        return <AlertCircle className="w-4 h-4" />;
      case 'Completada':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  const getPrioridadColor = (fechaEstimada: string) => {
    const fecha = new Date(fechaEstimada);
    const hoy = new Date();
    const diffDays = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) {
      return 'bg-red-500/20 text-red-400 border-red-500/30'; // Vencida
    } else if (diffDays <= 1) {
      return 'bg-accent-orange/20 text-accent-orange border-accent-orange/30'; // Urgente
    } else if (diffDays <= 3) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'; // Alta
    } else {
      return 'bg-green-500/20 text-green-400 border-green-500/30'; // Normal
    }
  };

  const getPrioridadLabel = (fechaEstimada: string) => {
    const fecha = new Date(fechaEstimada);
    const hoy = new Date();
    const diffDays = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) {
      return 'Vencida';
    } else if (diffDays <= 1) {
      return 'Urgente';
    } else if (diffDays <= 3) {
      return 'Alta';
    } else {
      return 'Normal';
    }
  };

  // Estadísticas
  const ordenesEnProceso = ordenes.filter(o => o.estado === 'En Proceso').length;
  const ordenesPendientes = ordenes.filter(o => o.estado === 'Pendiente').length;
  const ordenesCompletadas = ordenes.filter(o => o.estado === 'Completada').length;
  const ordenesUrgentes = ordenes.filter(o => {
    const fecha = new Date(o.fechaEstimada);
    const hoy = new Date();
    const diffDays = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 1;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando órdenes asignadas...</span>
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
            Mis Órdenes Asignadas
          </h1>
          <p className="text-white/70 mt-2">
            Panel de trabajo para mecánico {user?.nombre} ({ordenes.length} órdenes)
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2 glass px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Wrench className="w-5 h-5 text-primary-electric" />
            <span className="text-white font-medium">{ordenes.length} Órdenes Activas</span>
          </motion.div>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={listVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <motion.div variants={listItemVariants}>
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-orange/20 rounded-lg">
                <Clock className="w-6 h-6 text-accent-orange" />
              </div>
              <div>
                <p className="text-white/70 text-sm">En Proceso</p>
                <p className="text-2xl font-bold text-white">{ordenesEnProceso}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={listItemVariants}>
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-electric/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-primary-electric" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Pendientes</p>
                <p className="text-2xl font-bold text-white">{ordenesPendientes}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={listItemVariants}>
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-green/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Completadas</p>
                <p className="text-2xl font-bold text-white">{ordenesCompletadas}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={listItemVariants}>
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Urgentes</p>
                <p className="text-2xl font-bold text-white">{ordenesUrgentes}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Órdenes List */}
      {ordenes.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Wrench className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No tienes órdenes asignadas
          </h3>
          <p className="text-white/60">
            Las órdenes asignadas a ti aparecerán aquí cuando sean creadas por recepción
          </p>
        </Card>
      ) : (
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Mis Órdenes de Trabajo
          </h2>
          
          <motion.div
            variants={listVariants}
            className="space-y-4"
          >
            {ordenes.map((orden) => (
              <motion.div
                key={orden.id}
                variants={listItemVariants}
                className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-primary-electric/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Orden #{orden.id.toString().padStart(3, '0')}
                      </h3>
                      <p className="text-white/60 text-sm">{orden.tipoServicioNombre}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm border flex items-center gap-2 ${getEstadoColor(orden.estado)}`}>
                      {getEstadoIcon(orden.estado)}
                      {orden.estado}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getPrioridadColor(orden.fechaEstimada)}`}>
                      {getPrioridadLabel(orden.fechaEstimada)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-primary-electric" />
                    <div>
                      <p className="text-white/60">Vehículo</p>
                      <p className="text-white font-medium">{orden.vehiculoDescripcion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent-green" />
                    <div>
                      <p className="text-white/60">Fecha Estimada</p>
                      <p className="text-white font-medium">
                        {new Date(orden.fechaEstimada).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-accent-orange" />
                    <div>
                      <p className="text-white/60">Fecha Ingreso</p>
                      <p className="text-white font-medium">
                        {new Date(orden.fechaIngreso).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Repuestos */}
                {orden.detalleOrdenes && orden.detalleOrdenes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-white/60 text-sm mb-2">Repuestos necesarios:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {orden.detalleOrdenes.slice(0, 4).map((detalle, index) => (
                        <div key={index} className="flex justify-between text-sm bg-white/5 p-2 rounded">
                          <span className="text-white">{detalle.repuestoNombre}</span>
                          <span className="text-accent-green">x{detalle.cantidad}</span>
                        </div>
                      ))}
                      {orden.detalleOrdenes.length > 4 && (
                        <div className="text-white/60 text-sm">
                          +{orden.detalleOrdenes.length - 4} repuestos más...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>Ingreso: {new Date(orden.fechaIngreso).toLocaleDateString()}</span>
                    <span>Estimada: {new Date(orden.fechaEstimada).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {orden.estado === 'Pendiente' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateEstado(orden.id, 'En Proceso')}
                        loading={updatingEstado === orden.id}
                        disabled={updatingEstado === orden.id}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Iniciar
                      </Button>
                    )}
                    {orden.estado === 'En Proceso' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleUpdateEstado(orden.id, 'Completada')}
                        loading={updatingEstado === orden.id}
                        disabled={updatingEstado === orden.id}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Completar
                      </Button>
                    )}
                    {orden.estado === 'En Proceso' && (
                      <div className="flex items-center gap-2 text-accent-orange">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">En progreso...</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      )}
    </motion.div>
  );
};

export default OrdenesAsignadas;