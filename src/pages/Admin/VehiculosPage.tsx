import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Car, User, Calendar, AlertCircle } from 'lucide-react';
import { vehiculosAPI } from '../../api/vehiculos';
import { clientesAPI } from '../../api/clientes';
import { VehiculoResponse, VehiculoRequest, ClienteResponse } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const VehiculosPage: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<VehiculoResponse[]>([]);
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<VehiculoResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<VehiculoRequest>({
    clienteId: 0,
    marca: '',
    modelo: '',
    year: new Date().getFullYear(),
    vin: '',
    kilometraje: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando vehículos y clientes...');
      
      const [vehiculosData, clientesData] = await Promise.allSettled([
        vehiculosAPI.getAll(),
        clientesAPI.getAll()
      ]);

      // Procesar vehículos
      let vehiculosResult: VehiculoResponse[] = [];
      if (vehiculosData.status === 'fulfilled') {
        vehiculosResult = vehiculosData.value;
      }
      console.log('✅ Vehículos cargados:', vehiculosResult.length);
      setVehiculos(vehiculosResult);

      // Procesar clientes
      let clientesResult: ClienteResponse[] = [];
      if (clientesData.status === 'fulfilled') {
        clientesResult = clientesData.value;
      }
      console.log('✅ Clientes cargados:', clientesResult.length);
      setClientes(clientesResult);

      if (vehiculosResult.length === 0) {
        toast.info('No hay vehículos registrados');
      }
    } catch (error: any) {
      console.error('❌ Error cargando datos:', error);
      toast.error('Error al cargar datos: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.marca.trim()) {
      toast.error('La marca es requerida');
      return;
    }
    
    if (!formData.modelo.trim()) {
      toast.error('El modelo es requerido');
      return;
    }
    
    if (!formData.vin.trim()) {
      toast.error('El VIN es requerido');
      return;
    }
    
    if (formData.clienteId === 0) {
      toast.error('Debe seleccionar un cliente');
      return;
    }
    
    // Validar VIN (17 caracteres alfanuméricos)
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!vinRegex.test(formData.vin.toUpperCase())) {
      toast.error('El VIN debe tener exactamente 17 caracteres alfanuméricos');
      return;
    }
    
    // Validar año
    const currentYear = new Date().getFullYear();
    if (formData.year < 1990 || formData.year > currentYear + 1) {
      toast.error(`El año debe estar entre 1990 y ${currentYear + 1}`);
      return;
    }
    
    // Validar kilometraje
    if (formData.kilometraje < 0) {
      toast.error('El kilometraje debe ser un número positivo');
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('💾 Guardando vehículo:', formData);
      
      const vehiculoData = {
        ...formData,
        vin: formData.vin.toUpperCase()
      };
      
      if (editingVehiculo) {
        await vehiculosAPI.update(editingVehiculo.id, vehiculoData);
        toast.success('Vehículo actualizado correctamente');
      } else {
        await vehiculosAPI.create(vehiculoData);
        toast.success('Vehículo creado correctamente');
      }
      
      setIsModalOpen(false);
      setEditingVehiculo(null);
      resetForm();
      await loadData(); // Recargar la lista
    } catch (error: any) {
      console.error('❌ Error guardando vehículo:', error);
      if (error.response?.status === 409) {
        toast.error('Ya existe un vehículo con ese VIN');
      } else {
        toast.error('Error al guardar vehículo: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (vehiculo: VehiculoResponse) => {
    console.log('✏️ Editando vehículo:', vehiculo);
    setEditingVehiculo(vehiculo);
    setFormData({
      clienteId: vehiculo.clienteId,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      year: vehiculo.year,
      vin: vehiculo.vin,
      kilometraje: vehiculo.kilometraje,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este vehículo?')) {
      try {
        console.log('🗑️ Eliminando vehículo:', id);
        await vehiculosAPI.delete(id);
        toast.success('Vehículo eliminado correctamente');
        await loadData(); // Recargar la lista
      } catch (error: any) {
        console.error('❌ Error eliminando vehículo:', error);
        if (error.response?.status === 409) {
          toast.error('No se puede eliminar el vehículo porque tiene órdenes de servicio asociadas');
        } else {
          toast.error('Error al eliminar vehículo: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      clienteId: 0,
      marca: '',
      modelo: '',
      year: new Date().getFullYear(),
      vin: '',
      kilometraje: 0,
    });
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
            Gestión de Vehículos
          </h1>
          <p className="text-white/70 mt-2">
            Administra el registro de vehículos ({vehiculos.length} registrados)
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingVehiculo(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
          disabled={clientes.length === 0}
        >
          <Plus className="w-5 h-5" />
          Nuevo Vehículo
        </Button>
      </div>

      {/* Alerta si no hay clientes */}
      {clientes.length === 0 && (
        <Card variant="glass" className="p-6 border-accent-orange/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-accent-orange" />
            <div>
              <h3 className="text-lg font-semibold text-accent-orange">
                No hay clientes registrados
              </h3>
              <p className="text-white/70">
                Debes crear al menos un cliente antes de registrar vehículos.
              </p>
            </div>
          </div>
        </Card>
      )}

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
          <p className="text-white/60 mb-6">
            {searchTerm 
              ? 'Intenta ajustar los términos de búsqueda'
              : 'Comienza agregando el primer vehículo al sistema'
            }
          </p>
          {!searchTerm && clientes.length > 0 && (
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setEditingVehiculo(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Registrar Primer Vehículo
            </Button>
          )}
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
                    onClick={() => handleEdit(vehiculo)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(vehiculo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVehiculo(null);
          resetForm();
        }}
        title={editingVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Cliente *
            </label>
            <select
              value={formData.clienteId}
              onChange={(e) => setFormData({ ...formData, clienteId: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg border bg-white/10 border-white/20 text-white focus:border-primary-electric focus:ring-2 focus:ring-primary-electric/50"
              required
            >
              <option value={0}>Seleccionar cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id} className="bg-gray-800">
                  {cliente.nombre} - {cliente.documento}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Marca *"
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              placeholder="Toyota, Honda, Ford..."
              required
            />
            
            <Input
              label="Modelo *"
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              placeholder="Corolla, Civic, Focus..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Año *"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              min={1990}
              max={new Date().getFullYear() + 1}
              required
            />
            
            <Input
              label="Kilometraje *"
              type="number"
              value={formData.kilometraje}
              onChange={(e) => setFormData({ ...formData, kilometraje: Number(e.target.value) })}
              min={0}
              placeholder="45000"
              required
            />
          </div>

          <Input
            label="VIN (17 caracteres) *"
            value={formData.vin}
            onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
            maxLength={17}
            placeholder="1HGBH41JXMN109186"
            required
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingVehiculo(null);
                resetForm();
              }}
              className="flex-1"
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="flex-1"
              loading={submitting}
              disabled={submitting}
            >
              {editingVehiculo ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default VehiculosPage;