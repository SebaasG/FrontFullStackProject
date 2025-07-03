import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Phone, Mail, FileText, Eye } from 'lucide-react';
import { clientesAPI } from '../../api/clientes';
import { ClienteResponse } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DetalleModal from '../../components/ui/DetalleModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const ClientesReadOnly: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteResponse | null>(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando clientes (solo lectura)...');
      
      const response = await clientesAPI.getAll();
      console.log('📦 Respuesta completa:', response);
      
      let clientesData: ClienteResponse[] = [];
      
      if (Array.isArray(response)) {
        clientesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        clientesData = response.data;
      } else if (response.items && Array.isArray(response.items)) {
        clientesData = response.items;
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', response);
        clientesData = [];
      }
      
      console.log('✅ Clientes cargados:', clientesData);
      setClientes(clientesData);
      
      if (clientesData.length === 0) {
        toast.info('No hay clientes registrados');
      }
    } catch (error: any) {
      console.error('❌ Error cargando clientes:', error);
      toast.error('Error al cargar clientes: ' + (error.message || 'Error desconocido'));
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (cliente: ClienteResponse) => {
    setSelectedCliente(cliente);
    setIsDetalleModalOpen(true);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.documento.includes(searchTerm) ||
    cliente.telefono.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando clientes...</span>
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
            Consulta de Clientes
          </h1>
          <p className="text-white/70 mt-2">
            Vista de solo lectura para recepcionistas ({clientes.length} clientes)
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
          placeholder="Buscar clientes por nombre, correo, documento o teléfono..."
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
              <User className="w-6 h-6 text-primary-electric" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Clientes</p>
              <p className="text-2xl font-bold text-white">{clientes.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-green/20 rounded-lg">
              <Mail className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Con Email</p>
              <p className="text-2xl font-bold text-white">
                {clientes.filter(c => c.correo).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-orange/20 rounded-lg">
              <Phone className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Con Teléfono</p>
              <p className="text-2xl font-bold text-white">
                {clientes.filter(c => c.telefono).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-purple/20 rounded-lg">
              <FileText className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Documentos</p>
              <p className="text-2xl font-bold text-white">
                {clientes.filter(c => c.documento).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Clients List */}
      {filteredClientes.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </h3>
          <p className="text-white/60">
            {searchTerm 
              ? 'Intenta ajustar los términos de búsqueda'
              : 'Los clientes aparecerán aquí cuando sean registrados por un administrador'
            }
          </p>
        </Card>
      ) : (
        <motion.div
          variants={listVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredClientes.map((cliente) => (
            <motion.div key={cliente.id} variants={listItemVariants}>
              <Card variant="glass" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{cliente.nombre}</h3>
                      <p className="text-white/60 text-sm">ID: {cliente.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary-electric" />
                    <span className="text-white/80 truncate">{cliente.correo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-accent-green" />
                    <span className="text-white/80">{cliente.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-accent-orange" />
                    <span className="text-white/80">{cliente.documento}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewDetails(cliente)}
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
          setSelectedCliente(null);
        }}
        cliente={selectedCliente || undefined}
        type="cliente"
      />
    </motion.div>
  );
};

export default ClientesReadOnly;