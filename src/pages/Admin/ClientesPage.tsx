import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, User, Phone, Mail, FileText, Eye } from 'lucide-react';
import { clientesAPI } from '../../api/clientes';
import { ClienteResponse, ClienteRequest } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import DetalleModal from '../../components/ui/DetalleModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteResponse | null>(null);
  const [editingCliente, setEditingCliente] = useState<ClienteResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClienteRequest>({
    nombre: '',
    telefono: '',
    documento: '',
    correo: '',
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando clientes...');
      
      const response = await clientesAPI.getAll();
      console.log('📦 Respuesta completa:', response);
      
      // Manejar diferentes estructuras de respuesta
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    
    if (!formData.documento.trim()) {
      toast.error('El documento es requerido');
      return;
    }
    
    if (!formData.correo.trim()) {
      toast.error('El correo es requerido');
      return;
    }
    
    if (!formData.telefono.trim()) {
      toast.error('El teléfono es requerido');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      toast.error('El formato del correo no es válido');
      return;
    }
    
    // Validar documento (solo números, 8-10 dígitos)
    const documentoRegex = /^[0-9]{8,10}$/;
    if (!documentoRegex.test(formData.documento)) {
      toast.error('El documento debe tener entre 8 y 10 dígitos');
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('💾 Guardando cliente:', formData);
      
      if (editingCliente) {
        await clientesAPI.update(editingCliente.id, formData);
        toast.success('Cliente actualizado correctamente');
      } else {
        await clientesAPI.create(formData);
        toast.success('Cliente creado correctamente');
      }
      
      setIsModalOpen(false);
      setEditingCliente(null);
      resetForm();
      await loadClientes(); // Recargar la lista
    } catch (error: any) {
      console.error('❌ Error guardando cliente:', error);
      toast.error('Error al guardar cliente: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cliente: ClienteResponse) => {
    console.log('✏️ Editando cliente:', cliente);
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      documento: cliente.documento,
      correo: cliente.correo,
    });
    setIsModalOpen(true);
  };

  const handleViewDetails = (cliente: ClienteResponse) => {
    setSelectedCliente(cliente);
    setIsDetalleModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        console.log('🗑️ Eliminando cliente:', id);
        await clientesAPI.delete(id);
        toast.success('Cliente eliminado correctamente');
        await loadClientes(); // Recargar la lista
      } catch (error: any) {
        console.error('❌ Error eliminando cliente:', error);
        toast.error('Error al eliminar cliente: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      telefono: '',
      documento: '',
      correo: '',
    });
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
            Gestión de Clientes
          </h1>
          <p className="text-white/70 mt-2">
            Administra la base de datos de clientes ({clientes.length} registrados)
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingCliente(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </Button>
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
          <p className="text-white/60 mb-6">
            {searchTerm 
              ? 'Intenta ajustar los términos de búsqueda'
              : 'Comienza agregando tu primer cliente al sistema'
            }
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setEditingCliente(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Primer Cliente
            </Button>
          )}
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
                    Ver
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(cliente)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(cliente.id)}
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
          setEditingCliente(null);
          resetForm();
        }}
        title={editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre Completo *"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Juan Pérez García"
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Documento *"
              value={formData.documento}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value.replace(/\D/g, '') })}
              placeholder="12345678"
              maxLength={10}
              required
            />
            
            <Input
              label="Teléfono *"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="3001234567"
              required
            />
          </div>

          <Input
            label="Correo Electrónico *"
            type="email"
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            placeholder="cliente@email.com"
            required
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCliente(null);
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
              {editingCliente ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

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

export default ClientesPage;