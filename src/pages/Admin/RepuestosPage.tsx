import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, DollarSign } from 'lucide-react';
import { repuestosAPI } from '../../api/repuestos';
import { RepuestoResponse, RepuestoRequest } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const RepuestosPage: React.FC = () => {
  const [repuestos, setRepuestos] = useState<RepuestoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRepuesto, setEditingRepuesto] = useState<RepuestoResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<RepuestoRequest>({
    id: 0,
    nombre: '',
    codigo: '',
    descripcion: '',
    stock: 0,
    precioUnitario: 0,
  });

  useEffect(() => {
    loadRepuestos();
  }, []);

  const loadRepuestos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando repuestos...');
      
      const response = await repuestosAPI.getAll();
      console.log('✅ Repuestos cargados:', response.length);
      setRepuestos(response);
      
      if (response.length === 0) {
        toast.info('No hay repuestos registrados');
      }
    } catch (error: any) {
      console.error('❌ Error cargando repuestos:', error);
      toast.error('Error al cargar repuestos: ' + (error.message || 'Error desconocido'));
      setRepuestos([]);
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
    
    if (!formData.codigo.trim()) {
      toast.error('El código es requerido');
      return;
    }
    
    if (!formData.descripcion.trim()) {
      toast.error('La descripción es requerida');
      return;
    }
    
    if (formData.stock < 0) {
      toast.error('El stock debe ser un número positivo');
      return;
    }
    
    if (formData.precioUnitario <= 0) {
      toast.error('El precio unitario debe ser mayor a 0');
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('💾 Guardando repuesto:', formData);
      
      if (editingRepuesto) {
        await repuestosAPI.update(editingRepuesto.id, formData);
        toast.success('Repuesto actualizado correctamente');
      } else {
        await repuestosAPI.create(formData);
        toast.success('Repuesto creado correctamente');
      }
      
      setIsModalOpen(false);
      setEditingRepuesto(null);
      resetForm();
      await loadRepuestos(); // Recargar la lista
    } catch (error: any) {
      console.error('❌ Error guardando repuesto:', error);
      if (error.response?.status === 409) {
        toast.error('Ya existe un repuesto con ese código');
      } else {
        toast.error('Error al guardar repuesto: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (repuesto: RepuestoResponse) => {
    console.log('✏️ Editando repuesto:', repuesto);
    setEditingRepuesto(repuesto);
    setFormData({
      id: repuesto.id,
      nombre: repuesto.nombre,
      codigo: repuesto.codigo,
      descripcion: repuesto.descripcion,
      stock: repuesto.stock,
      precioUnitario: repuesto.precioUnitario,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este repuesto?')) {
      try {
        console.log('🗑️ Eliminando repuesto:', id);
        await repuestosAPI.delete(id);
        toast.success('Repuesto eliminado correctamente');
        await loadRepuestos(); // Recargar la lista
      } catch (error: any) {
        console.error('❌ Error eliminando repuesto:', error);
        if (error.response?.status === 409) {
          toast.error('No se puede eliminar el repuesto porque está siendo usado en órdenes de servicio');
        } else {
          toast.error('Error al eliminar repuesto: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      nombre: '',
      codigo: '',
      descripcion: '',
      stock: 0,
      precioUnitario: 0,
    });
  };

  const filteredRepuestos = repuestos.filter(repuesto =>
    repuesto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estadísticas
  const lowStockRepuestos = repuestos.filter(r => r.stock <= 5);
  const totalValue = repuestos.reduce((sum, r) => sum + (r.stock * r.precioUnitario), 0);
  const totalStock = repuestos.reduce((sum, r) => sum + r.stock, 0);
  const outOfStockRepuestos = repuestos.filter(r => r.stock === 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando repuestos...</span>
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
            Gestión de Repuestos
          </h1>
          <p className="text-white/70 mt-2">
            Administra el inventario de repuestos ({repuestos.length} registrados)
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingRepuesto(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Repuesto
        </Button>
      </div>

      {/* Search */}
      <Card variant="glass" className="p-6">
        <Input
          placeholder="Buscar repuestos por nombre, código o descripción..."
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
              <Package className="w-6 h-6 text-primary-electric" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Repuestos</p>
              <p className="text-2xl font-bold text-white">{repuestos.length}</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-orange/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Stock Bajo</p>
              <p className="text-2xl font-bold text-white">{lowStockRepuestos.length}</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-green/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Valor Total</p>
              <p className="text-2xl font-bold text-white">
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-purple/20 rounded-lg">
              <Package className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Stock Total</p>
              <p className="text-2xl font-bold text-white">
                {totalStock.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockRepuestos.length > 0 && (
        <Card variant="glass" className="p-6 border-accent-orange/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-accent-orange" />
            <h3 className="text-lg font-semibold text-accent-orange">
              Alerta de Stock Bajo ({lowStockRepuestos.length} repuestos)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockRepuestos.slice(0, 6).map((repuesto) => (
              <div key={repuesto.id} className="p-3 bg-accent-orange/10 rounded-lg">
                <p className="text-white font-medium">{repuesto.nombre}</p>
                <p className="text-accent-orange text-sm">Stock: {repuesto.stock}</p>
                <p className="text-white/60 text-xs">{repuesto.codigo}</p>
              </div>
            ))}
          </div>
          {lowStockRepuestos.length > 6 && (
            <p className="text-white/60 text-sm mt-3">
              Y {lowStockRepuestos.length - 6} repuestos más con stock bajo...
            </p>
          )}
        </Card>
      )}

      {/* Out of Stock Alert */}
      {outOfStockRepuestos.length > 0 && (
        <Card variant="glass" className="p-6 border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">
              Sin Stock ({outOfStockRepuestos.length} repuestos)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {outOfStockRepuestos.slice(0, 3).map((repuesto) => (
              <div key={repuesto.id} className="p-3 bg-red-500/10 rounded-lg">
                <p className="text-white font-medium">{repuesto.nombre}</p>
                <p className="text-red-400 text-sm">Sin stock</p>
                <p className="text-white/60 text-xs">{repuesto.codigo}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Parts List */}
      {filteredRepuestos.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'No se encontraron repuestos' : 'No hay repuestos registrados'}
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm 
              ? 'Intenta ajustar los términos de búsqueda'
              : 'Comienza agregando el primer repuesto al inventario'
            }
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setEditingRepuesto(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Primer Repuesto
            </Button>
          )}
        </Card>
      ) : (
        <motion.div
          variants={listVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRepuestos.map((repuesto) => (
            <motion.div key={repuesto.id} variants={listItemVariants}>
              <Card variant="glass" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      repuesto.stock === 0 ? 'bg-red-500/20' :
                      repuesto.stock <= 5 ? 'bg-accent-orange/20' : 'bg-gradient-primary'
                    }`}>
                      <Package className={`w-6 h-6 ${
                        repuesto.stock === 0 ? 'text-red-400' :
                        repuesto.stock <= 5 ? 'text-accent-orange' : 'text-white'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{repuesto.nombre}</h3>
                      <p className="text-white/60 text-sm">{repuesto.codigo}</p>
                    </div>
                  </div>
                  
                  {repuesto.stock === 0 && (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  {repuesto.stock > 0 && repuesto.stock <= 5 && (
                    <AlertTriangle className="w-5 h-5 text-accent-orange" />
                  )}
                </div>

                <p className="text-white/80 text-sm mb-4 line-clamp-2">
                  {repuesto.descripcion}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Stock:</span>
                    <span className={`font-medium ${
                      repuesto.stock === 0 ? 'text-red-400' :
                      repuesto.stock <= 5 ? 'text-accent-orange' : 'text-white'
                    }`}>
                      {repuesto.stock} unidades
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Precio:</span>
                    <span className="text-white font-medium">
                      ${repuesto.precioUnitario.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Valor Total:</span>
                    <span className="text-accent-green font-medium">
                      ${(repuesto.stock * repuesto.precioUnitario).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(repuesto)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(repuesto.id)}
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
          setEditingRepuesto(null);
          resetForm();
        }}
        title={editingRepuesto ? 'Editar Repuesto' : 'Nuevo Repuesto'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre *"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Aceite Motor 5W30"
              required
            />
            
            <Input
              label="Código *"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
              placeholder="ACE5W30"
              required
            />
          </div>

          <Input
            label="Descripción *"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Aceite sintético para motor de alta calidad"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Stock *"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              min={0}
              placeholder="25"
              required
            />
            
            <Input
              label="Precio Unitario *"
              type="number"
              value={formData.precioUnitario}
              onChange={(e) => setFormData({ ...formData, precioUnitario: Number(e.target.value) })}
              min={0}
              step={0.01}
              placeholder="20000"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingRepuesto(null);
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
              {editingRepuesto ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default RepuestosPage;