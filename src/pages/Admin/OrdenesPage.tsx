import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Edit, Wrench, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ordenesAPI } from '../../api/ordenes';
import { OrdenServicioResponse } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const OrdenesPage: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenServicioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  useEffect(() => {
    loadOrdenes();
  }, []);

  const loadOrdenes = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando órdenes...');
      
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

  const handleUpdateEstado = async (id: number, nuevoEstado: string) => {
    try {
      console.log('🔄 Actualizando estado de orden:', id, nuevoEstado);
      await ordenesAPI.updateEstado(id, nuevoEstado);
      toast.success('Estado actualizado correctamente');
      loadOrdenes();
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      toast.error('Error al actualizar estado');
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
            Administra todas las órdenes de servicio ({ordenes.length} registradas)
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div className="p-3 bg-accent-green/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Completadas</p>
              <p className="text-2xl font-bold text-white">{estadosCount.completada}</p>
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
          <p className="text-white/60">
            {searchTerm || filterEstado
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Las órdenes de servicio aparecerán aquí cuando sean creadas'
            }
          </p>
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
                  <div className="flex gap-2">
                    {orden.estado === 'Pendiente' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateEstado(orden.id, 'En Proceso')}
                      >
                        Iniciar
                      </Button>
                    )}
                    {orden.estado === 'En Proceso' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleUpdateEstado(orden.id, 'Completada')}
                      >
                        Completar
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalles
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrdenesPage;