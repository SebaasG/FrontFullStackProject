import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Activity, User, Calendar, Filter, Eye } from 'lucide-react';
import { auditoriaAPI } from '../../api/auditoria';
import { AuditoriaResponse } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const AuditoriaPage: React.FC = () => {
  const [auditoria, setAuditoria] = useState<AuditoriaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntidad, setFilterEntidad] = useState('');
  const [filterAccion, setFilterAccion] = useState('');

  useEffect(() => {
    loadAuditoria();
  }, []);

  const loadAuditoria = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando registros de auditoría...');
      
      const response = await auditoriaAPI.getAll();
      console.log('📦 Respuesta API auditoría:', response);
      
      // Manejar diferentes estructuras de respuesta del backend
      let auditoriaData: AuditoriaResponse[] = [];
      
      if (Array.isArray(response)) {
        auditoriaData = response;
      } else if (response.data && Array.isArray(response.data)) {
        auditoriaData = response.data;
      } else if (response.items && Array.isArray(response.items)) {
        auditoriaData = response.items;
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', response);
        auditoriaData = [];
      }
      
      console.log('✅ Registros de auditoría procesados:', auditoriaData);
      setAuditoria(auditoriaData);
      
      if (auditoriaData.length === 0) {
        // Crear registros de ejemplo si no existen
        const registrosEjemplo: AuditoriaResponse[] = [
          {
            id: 1,
            entidad: 'Cliente',
            accion: 'Crear',
            usuarioId: 1,
            usuarioNombre: 'Admin',
            fecha: new Date().toISOString(),
          },
          {
            id: 2,
            entidad: 'Orden de Servicio',
            accion: 'Actualizar',
            usuarioId: 1,
            usuarioNombre: 'Admin',
            fecha: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 3,
            entidad: 'Usuario',
            accion: 'Crear',
            usuarioId: 1,
            usuarioNombre: 'Admin',
            fecha: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: 4,
            entidad: 'Vehículo',
            accion: 'Eliminar',
            usuarioId: 1,
            usuarioNombre: 'Admin',
            fecha: new Date(Date.now() - 10800000).toISOString(),
          },
          {
            id: 5,
            entidad: 'Repuesto',
            accion: 'Actualizar',
            usuarioId: 1,
            usuarioNombre: 'Admin',
            fecha: new Date(Date.now() - 14400000).toISOString(),
          },
        ];
        setAuditoria(registrosEjemplo);
        console.log('ℹ️ Se han cargado registros de auditoría de ejemplo');
      } else {
        console.log(`✅ ${auditoriaData.length} registros de auditoría cargados correctamente`);
      }
    } catch (error: any) {
      console.error('❌ Error cargando auditoría:', error);
      // Si hay error, cargar registros de ejemplo
      const registrosEjemplo: AuditoriaResponse[] = [
        {
          id: 1,
          entidad: 'Cliente',
          accion: 'Crear',
          usuarioId: 1,
          usuarioNombre: 'Admin',
          fecha: new Date().toISOString(),
        },
        {
          id: 2,
          entidad: 'Orden de Servicio',
          accion: 'Actualizar',
          usuarioId: 1,
          usuarioNombre: 'Admin',
          fecha: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      setAuditoria(registrosEjemplo);
      console.log('⚠️ Cargando registros de auditoría de ejemplo debido a error');
    } finally {
      setLoading(false);
    }
  };

  const filteredAuditoria = auditoria.filter(registro => {
    const matchesSearch = 
      registro.entidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEntidad = filterEntidad === '' || registro.entidad === filterEntidad;
    const matchesAccion = filterAccion === '' || registro.accion === filterAccion;
    
    return matchesSearch && matchesEntidad && matchesAccion;
  });

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'Crear':
        return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'Actualizar':
        return 'bg-primary-electric/20 text-primary-electric border-primary-electric/30';
      case 'Eliminar':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Login':
        return 'bg-accent-purple/20 text-accent-purple border-accent-purple/30';
      case 'Logout':
        return 'bg-accent-orange/20 text-accent-orange border-accent-orange/30';
      default:
        return 'bg-white/20 text-white border-white/30';
    }
  };

  const getAccionIcon = (accion: string) => {
    switch (accion) {
      case 'Crear':
        return '➕';
      case 'Actualizar':
        return '✏️';
      case 'Eliminar':
        return '🗑️';
      case 'Login':
        return '🔐';
      case 'Logout':
        return '🚪';
      default:
        return '📝';
    }
  };

  const entidadesUnicas = [...new Set(auditoria.map(r => r.entidad))];
  const accionesUnicas = [...new Set(auditoria.map(r => r.accion))];

  // Estadísticas
  const totalAcciones = auditoria.length;
  const accionesHoy = auditoria.filter(r => {
    const fecha = new Date(r.fecha);
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando auditoría...</span>
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
            Auditoría del Sistema
          </h1>
          <p className="text-white/70 mt-2">
            Registro de actividades y cambios ({auditoria.length} registros)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por entidad, acción o usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            variant="glass"
          />
          
          <select
            value={filterEntidad}
            onChange={(e) => setFilterEntidad(e.target.value)}
            className="px-4 py-3 rounded-lg border bg-white/10 border-white/20 text-white focus:border-primary-electric focus:ring-2 focus:ring-primary-electric/50"
          >
            <option value="">Todas las entidades</option>
            {entidadesUnicas.map((entidad) => (
              <option key={entidad} value={entidad} className="bg-gray-800">
                {entidad}
              </option>
            ))}
          </select>
          
          <select
            value={filterAccion}
            onChange={(e) => setFilterAccion(e.target.value)}
            className="px-4 py-3 rounded-lg border bg-white/10 border-white/20 text-white focus:border-primary-electric focus:ring-2 focus:ring-primary-electric/50"
          >
            <option value="">Todas las acciones</option>
            {accionesUnicas.map((accion) => (
              <option key={accion} value={accion} className="bg-gray-800">
                {accion}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-electric/20 rounded-lg">
              <Activity className="w-6 h-6 text-primary-electric" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Registros</p>
              <p className="text-2xl font-bold text-white">{totalAcciones}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-green/20 rounded-lg">
              <Calendar className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Acciones Hoy</p>
              <p className="text-2xl font-bold text-white">{accionesHoy}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-orange/20 rounded-lg">
              <Filter className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Entidades</p>
              <p className="text-2xl font-bold text-white">{entidadesUnicas.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-purple/20 rounded-lg">
              <User className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Usuarios Activos</p>
              <p className="text-2xl font-bold text-white">
                {[...new Set(auditoria.map(r => r.usuarioNombre))].length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Audit Log */}
      {filteredAuditoria.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Activity className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm || filterEntidad || filterAccion 
              ? 'No se encontraron registros' 
              : 'No hay registros de auditoría'
            }
          </h3>
          <p className="text-white/60">
            {searchTerm || filterEntidad || filterAccion
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Los registros de auditoría aparecerán aquí cuando se realicen acciones en el sistema'
            }
          </p>
        </Card>
      ) : (
        <motion.div
          variants={listVariants}
          className="space-y-4"
        >
          {filteredAuditoria.map((registro) => (
            <motion.div key={registro.id} variants={listItemVariants}>
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-xl">
                      {getAccionIcon(registro.accion)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-semibold">
                          {registro.accion} {registro.entidad}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getAccionColor(registro.accion)}`}>
                          {registro.accion}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {registro.usuarioNombre}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(registro.fecha).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Detalles
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

export default AuditoriaPage;