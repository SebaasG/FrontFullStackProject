import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Settings, Wrench } from 'lucide-react';
import { tiposServicioAPI } from '../../api/tiposServicio';
import { TipoServicioResponse, TipoServicioRequest } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const TiposServicioPage: React.FC = () => {
  const [tiposServicio, setTiposServicio] = useState<TipoServicioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoServicioResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<TipoServicioRequest>({
    id: 0,
    nombre: '',
    ordenServiciosIds: [],
  });

  useEffect(() => {
    loadTiposServicio();
  }, []);

  const loadTiposServicio = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando tipos de servicio...');
      
      const response = await tiposServicioAPI.getAll();
      console.log('✅ Tipos de servicio cargados:', response.length);
      setTiposServicio(response);
      
      if (response.length === 0) {
        // Crear tipos de servicio por defecto si no existen
        const tiposDefault = [
          { id: 1, nombre: 'Mantenimiento General', ordenServiciosIds: [] },
          { id: 2, nombre: 'Reparación de Motor', ordenServiciosIds: [] },
          { id: 3, nombre: 'Diagnóstico', ordenServiciosIds: [] },
          { id: 4, nombre: 'Cambio de Aceite', ordenServiciosIds: [] },
          { id: 5, nombre: 'Revisión de Frenos', ordenServiciosIds: [] },
        ];
        setTiposServicio(tiposDefault);
        toast.info('Se han cargado tipos de servicio por defecto');
      }
    } catch (error: any) {
      console.error('❌ Error cargando tipos de servicio:', error);
      // Si hay error, cargar tipos por defecto
      const tiposDefault = [
        { id: 1, nombre: 'Mantenimiento General', ordenServiciosIds: [] },
        { id: 2, nombre: 'Reparación de Motor', ordenServiciosIds: [] },
        { id: 3, nombre: 'Diagnóstico', ordenServiciosIds: [] },
        { id: 4, nombre: 'Cambio de Aceite', ordenServiciosIds: [] },
        { id: 5, nombre: 'Revisión de Frenos', ordenServiciosIds: [] },
      ];
      setTiposServicio(tiposDefault);
      toast.warning('Cargando tipos de servicio por defecto');
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
    
    try {
      setSubmitting(true);
      console.log('💾 Guardando tipo de servicio:', formData);
      
      if (editingTipo) {
        await tiposServicioAPI.update(editingTipo.id, formData);
        toast.success('Tipo de servicio actualizado correctamente');
      } else {
        await tiposServicioAPI.create(formData);
        toast.success('Tipo de servicio creado correctamente');
      }
      
      setIsModalOpen(false);
      setEditingTipo(null);
      resetForm();
      await loadTiposServicio(); // Recargar la lista
    } catch (error: any) {
      console.error('❌ Error guardando tipo de servicio:', error);
      if (error.response?.status === 409) {
        toast.error('Ya existe un tipo de servicio con ese nombre');
      } else {
        toast.error('Error al guardar tipo de servicio: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tipo: TipoServicioResponse) => {
    console.log('✏️ Editando tipo de servicio:', tipo);
    setEditingTipo(tipo);
    setFormData({
      id: tipo.id,
      nombre: tipo.nombre,
      ordenServiciosIds: tipo.ordenServiciosIds || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este tipo de servicio?')) {
      try {
        console.log('🗑️ Eliminando tipo de servicio:', id);
        await tiposServicioAPI.delete(id);
        toast.success('Tipo de servicio eliminado correctamente');
        await loadTiposServicio(); // Recargar la lista
      } catch (error: any) {
        console.error('❌ Error eliminando tipo de servicio:', error);
        if (error.response?.status === 409) {
          toast.error('No se puede eliminar el tipo de servicio porque está siendo usado en órdenes');
        } else {
          toast.error('Error al eliminar tipo de servicio: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      nombre: '',
      ordenServiciosIds: [],
    });
  };

  const filteredTipos = tiposServicio.filter(tipo =>
    tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando tipos de servicio...</span>
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
            Tipos de Servicio
          </h1>
          <p className="text-white/70 mt-2">
            Administra los tipos de servicio disponibles ({tiposServicio.length} registrados)
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingTipo(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Tipo
        </Button>
      </div>

      {/* Search */}
      <Card variant="glass" className="p-6">
        <Input
          placeholder="Buscar tipos de servicio por nombre..."
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
              <Settings className="w-6 h-6 text-primary-electric" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Tipos</p>
              <p className="text-2xl font-bold text-white">{tiposServicio.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-green/20 rounded-lg">
              <Wrench className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Más Usado</p>
              <p className="text-lg font-bold text-white">Mantenimiento</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-orange/20 rounded-lg">
              <Settings className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Activos</p>
              <p className="text-2xl font-bold text-white">{tiposServicio.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-purple/20 rounded-lg">
              <Wrench className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Disponibles</p>
              <p className="text-2xl font-bold text-white">{tiposServicio.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tipos List */}
      {filteredTipos.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Settings className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'No se encontraron tipos de servicio' : 'No hay tipos de servicio registrados'}
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm 
              ? 'Intenta ajustar los términos de búsqueda'
              : 'Comienza agregando el primer tipo de servicio'
            }
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setEditingTipo(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Primer Tipo
            </Button>
          )}
        </Card>
      ) : (
        <motion.div
          variants={listVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTipos.map((tipo) => (
            <motion.div key={tipo.id} variants={listItemVariants}>
              <Card variant="glass" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{tipo.nombre}</h3>
                      <p className="text-white/60 text-sm">ID: {tipo.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Órdenes Asociadas:</span>
                    <span className="text-white font-medium">
                      {tipo.ordenServiciosIds?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Estado:</span>
                    <span className="text-accent-green font-medium">Activo</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(tipo)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(tipo.id)}
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
          setEditingTipo(null);
          resetForm();
        }}
        title={editingTipo ? 'Editar Tipo de Servicio' : 'Nuevo Tipo de Servicio'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Tipo de Servicio *"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Mantenimiento Preventivo"
            required
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingTipo(null);
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
              {editingTipo ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default TiposServicioPage;