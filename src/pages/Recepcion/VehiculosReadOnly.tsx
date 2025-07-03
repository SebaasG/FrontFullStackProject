import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Car, User, Calendar, Eye } from 'lucide-react';
import { vehiculosAPI } from '../../api/vehiculos';
import { VehiculoResponse } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DetalleModal from '../../components/ui/DetalleModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const VehiculosReadOnly: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<VehiculoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<VehiculoResponse | null>(null);

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando vehículos (solo lectura)...');
      
      const response = await vehiculosAPI.getAll();
      console.log('✅ Vehículos cargados:', response.length);
      setVehiculos(response);
      
      if (response.length === 0) {
        toast.info('No hay vehículos registrados');
      }
    } catch (error: any) {
      console.error('❌ Error cargando vehículos:', error);
      toast.error('Error al cargar vehículos: ' + (error.message || 'Error desconocido'));
      setVehiculos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (vehiculo: VehiculoResponse) => {
    setSelectedVehiculo(vehiculo);
    setIsDetalleModalOpen(true);
  };

  const filteredVehiculos = vehiculos.filter(vehiculo =>
    vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.clienteNombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estadísticas
  const marcasUnicas = [...new Set(vehiculos.map(v => v.marca))].length;
  const vehiculosRecientes = vehiculos.filter(v => v.year >= new Date().getFullYear() - 5).length;
  const promedioKilometraje = vehiculos.length > 0 
    ? Math.round(vehiculos.reduce((sum, v) => sum + v.kilometraje, 0) / vehiculos.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando vehículos...</span>
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
            Consulta de Vehículos
          </h1>
          <p className="text-white/70 mt-2">
            Vista de solo lectura para recepcionistas ({vehiculos.length} vehículos)
          </p>
        </div>
        
        {/* Indicador de Solo Lectura */}
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-lg border-accent-orange/30">
          <Eye className="w-5 h-5 text-accent-orange" />
          <span className="text-accent-orange font-medium">Solo Lectura</span>
        </div>
      </div>

      {/* Search */}
      <Card variant="glass" className="p-6">
        <Input
          placeholder="Buscar vehículos por marca, modelo, VIN o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-5 h-5" />}
          variant="glass"
        />
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-electric/20 rounded-lg">
              <Car className="w-6 h-6 text-primary-electric" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Vehículos</p>
              <p className="text-2xl font-bold text-white">{vehiculos.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-green/20 rounded-lg">
              <User className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Marcas Diferentes</p>
              <p className="text-2xl font-bold text-white">{marcasUnicas}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-orange/20 rounded-lg">
              <Calendar className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Vehículos Recientes</p>
              <p className="text-2xl font-bold text-white">{vehiculosRecientes}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-purple/20 rounded-lg">
              <Car className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Km Promedio</p>
              <p className="text-2xl font-bold text-white">{promedioKilometraje.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Vehicles List */}
      {filteredVehiculos.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Car className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'No se encontraron vehículos' : 'No hay vehículos registrados'}
          </h3>
          <p className="text-white/60">
            {searchTerm 
              ? 'Intenta ajustar los términos de búsqueda'
              : 'Los vehículos aparecerán aquí cuando sean registrados por un administrador'
            }
          </p>
        </Card>
      ) : (
        <motion.div
          variants={listVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVehiculos.map((vehiculo) => (
            <motion.div key={vehiculo.id} variants={listItemVariants}>
              <Card variant="glass" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {vehiculo.marca} {vehiculo.modelo}
                      </h3>
                      <p className="text-white/60 text-sm">{vehiculo.year}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary-electric" />
                    <span className="text-white/80">{vehiculo.clienteNombre || 'Cliente no encontrado'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">VIN:</span>
                    <span className="text-white font-mono text-xs">{vehiculo.vin}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Kilometraje:</span>
                    <span className="text-white">{vehiculo.kilometraje.toLocaleString()} km</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewDetails(vehiculo)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalles
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detalle Modal */}
      <DetalleModal
        isOpen={isDetalleModalOpen}
        onClose={() => {
          setIsDetalleModalOpen(false);
          setSelectedVehiculo(null);
        }}
        vehiculo={selectedVehiculo || undefined}
        type="vehiculo"
      />
    </motion.div>
  );
};

export default VehiculosReadOnly;