import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Eye, Trash2, Wrench, Clock, CheckCircle, AlertCircle, Car, User, Calendar } from 'lucide-react';
import { ordenesAPI } from '../../api/ordenes';
import { OrdenServicioResponse } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const OrdenesManagement: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenServicioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadOrdenes();
  }, []);

  const loadOrdenes = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando órdenes para gestión...');
      
      const response = await ordenesAPI.getAll();
      console.log('📦 Respuesta API órdenes:', response);
      
      // Manejar diferentes estructuras de respuesta del backend
      let ordenesData: OrdenServicioResponse[] = [];
      
      if (Array.isArray(response)) {
        ordenesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        ordenesData = response.data;
      } else if (response.items && Array.isArray(response.items)) {
        ordenesData = response.items;
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', response);
        ordenesData = [];
      }
      
      console.log('✅ Órdenes procesadas:', ordenesData);
      setOrdenes(ordenesData);
      
      if (ordenesData.length === 0) {
        toast.info('No hay órdenes registradas');
      } else {
        console.log(`✅ ${ordenesData.length} órdenes cargadas correctamente`);
      }
    } catch (error: any) {
      console.error('❌ Error cargando órdenes:', error);
      toast.error('Error al cargar órdenes: ' + (error.message || 'Error desconocido'));
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const orden = ordenes.find(o => o.id === id);
    if (!orden) return;

    // Verificar si la orden se puede eliminar
    if (orden.estado === 'En Proceso') {
      toast.error('No se puede eliminar una orden que está en proceso');
      return;
    }

    if (orden.estado === 'Completada') {
      toast.error('No se puede eliminar una orden completada');
      return;
    }

    const confirmMessage = `¿Estás seguro de eliminar la orden #${id.toString().padStart(3, '0')}?\n\nVehículo: ${orden.vehiculoDescripcion}\nEstado: ${orden.estado}`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setDeletingId(id);
        console.log('🗑️ Eliminando orden:', id);
        
        await ordenesAPI.delete(id);
        toast.success('Orden eliminada correctamente');
        
        // Recargar la lista
        await loadOrdenes();
      } catch (error: any) {
        console.error('❌ Error eliminando orden:', error);
        if (error.response?.status === 409) {
          toast.error('No se puede eliminar la orden porque tiene dependencias asociadas');
        } else {
          toast.error('Error al eliminar orden: ' + (error.response?.data?.message || error.message));
        }
      } finally {
        setDeletingId(null);
      }
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

  const canDeleteOrder = (orden: OrdenServicioResponse): boolean => {
    return orden.estado === 'Pendiente' || orden.estado === 'Cancelada';
  };

  const filteredOrdenes = ordenes.filter(orden => {
    const matchesSearch = 
      orden.vehiculoDescripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.usuarioNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.tipoServicioNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.id.toString().includes(searchTerm);
    
    const matchesEstado = filterEstado === '' || orden.estado === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  const estadosCount = {
    total: ordenes.length,
    pendiente: ordenes.filter(o => o.estado === 'Pendiente').length,
    enProceso: ordenes.filter(o => o.estado === 'En Proceso').length,
    completada: ordenes.filter(o => o.estado === 'Completada').length,
    eliminables: ordenes.filter(o => canDeleteOrder(o)).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando órdenes...</span>
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
            Gestión de Órdenes
          </h1>
          <p className="text-white/70 mt-2">
            Crea y gestiona órdenes de servicio ({ordenes.length} registradas)
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => window.location.href = '/recepcion/crear-orden'}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Orden
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-electric/20 rounded-lg">
              <Wrench className="w-6 h-6 text-primary-electric" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Órdenes</p>
              <p className="text-2xl font-bold text-white">{estadosCount.total}</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-white">{estadosCount.pendiente}</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-orange/20 rounded-lg">
              <Clock className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <p className="text-white/70 text-sm">En Proceso</p>
              <p className="text-2xl font-bold text-white">{estadosCount.enProceso}</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-green/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Completadas</p>
              <p className="text-2xl font-bold text-white">{estadosCount.completada}</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Eliminables</p>
              <p className="text-2xl font-bold text-white">{estadosCount.eliminables}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Buscar por vehículo, mecánico, tipo de servicio o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            variant="glass"
          />
          
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-3 rounded-lg border bg-white/10 border-white/20 text-white focus:border-primary-electric focus:ring-2 focus:ring-primary-electric/50"
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
      </Card>

      {/* Info Card */}
      <Card variant="glass" className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-blue-300 font-semibold mb-1">Información sobre eliminación de órdenes</h3>
            <p className="text-blue-200 text-sm">
              Solo puedes eliminar órdenes que estén en estado <strong>Pendiente</strong> o <strong>Cancelada</strong>. 
              Las órdenes en proceso o completadas no se pueden eliminar por seguridad.
            </p>
          </div>
        </div>
      </Card>

      {/* Orders List */}
      {filteredOrdenes.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Wrench className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm || filterEstado 
              ? 'No se encontraron órdenes' 
              : 'No hay órdenes registradas'
            }
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm || filterEstado
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza creando tu primera orden de servicio'
            }
          </p>
          {!searchTerm && !filterEstado && (
            <Button
              variant="primary"
              onClick={() => window.location.href = '/recepcion/crear-orden'}
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Primera Orden
            </Button>
          )}
        </Card>
      ) : (
        <motion.div
          variants={listVariants}
          className="space-y-4"
        >
          {filteredOrdenes.map((orden) => (
            <motion.div key={orden.id} variants={listItemVariants}>
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        Orden #{orden.id.toString().padStart(3, '0')}
                      </h3>
                      <p className="text-white/60 text-sm">{orden.vehiculoDescripcion || 'Vehículo no especificado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm border flex items-center gap-2 ${getEstadoColor(orden.estado)}`}>
                      {getEstadoIcon(orden.estado)}
                      {orden.estado}
                    </span>
                    {canDeleteOrder(orden) && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
                        Eliminable
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-white/60 text-sm">Mecánico</p>
                    <p className="text-white font-medium">{orden.usuarioNombre || 'No asignado'}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Tipo de Servicio</p>
                    <p className="text-white font-medium">{orden.tipoServicioNombre || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Fecha Ingreso</p>
                    <p className="text-white font-medium">
                      {orden.fechaIngreso ? new Date(orden.fechaIngreso).toLocaleDateString() : 'No especificada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Fecha Estimada</p>
                    <p className="text-white font-medium">
                      {orden.fechaEstimada ? new Date(orden.fechaEstimada).toLocaleDateString() : 'No especificada'}
                    </p>
                  </div>
                </div>

                {/* Repuestos */}
                {orden.detalleOrdenes && orden.detalleOrdenes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-white/60 text-sm mb-2">Repuestos utilizados:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {orden.detalleOrdenes.slice(0, 4).map((detalle, index) => (
                        <div key={index} className="flex justify-between text-sm bg-white/5 p-2 rounded">
                          <span className="text-white">{detalle.repuestoNombre || 'Repuesto'}</span>
                          <span className="text-accent-green">x{detalle.cantidad} - ${detalle.precioTotal?.toLocaleString() || '0'}</span>
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
                    <span>Ingreso: {orden.fechaIngreso ? new Date(orden.fechaIngreso).toLocaleDateString() : 'N/A'}</span>
                    <span>Estimada: {orden.fechaEstimada ? new Date(orden.fechaEstimada).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </Button>
                    
                    {canDeleteOrder(orden) ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(orden.id)}
                        loading={deletingId === orden.id}
                        disabled={deletingId === orden.id}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    ) : (
                      <div className="text-white/60 text-sm px-3 py-2">
                        {orden.estado === 'En Proceso' && '⚠️ En proceso'}
                        {orden.estado === 'Completada' && '✅ Completada'}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrdenesManagement;