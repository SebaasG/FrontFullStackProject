import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, FileText, DollarSign, Calendar, Eye } from 'lucide-react';
import { facturasAPI } from '../../api/facturas';
import { FacturaResponse, FacturaRequest } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import DetalleModal from '../../components/ui/DetalleModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const FacturasPage: React.FC = () => {
  const [facturas, setFacturas] = useState<FacturaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<FacturaResponse | null>(null);
  const [editingFactura, setEditingFactura] = useState<FacturaResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FacturaRequest>({
    ordenServicioId: 0,
    montoTotal: 0,
    manoObra: 0,
    valorTotal: 0,
  });

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando facturas...');
      
      const response = await facturasAPI.getAll();
      console.log('📦 Respuesta API facturas:', response);
      
      // Manejar diferentes estructuras de respuesta del backend
      let facturasData: FacturaResponse[] = [];
      
      if (Array.isArray(response)) {
        facturasData = response;
      } else if (response.data && Array.isArray(response.data)) {
        facturasData = response.data;
      } else if (response.items && Array.isArray(response.items)) {
        facturasData = response.items;
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', response);
        facturasData = [];
      }
      
      console.log('✅ Facturas procesadas:', facturasData);
      setFacturas(facturasData);
      
      if (facturasData.length === 0) {
        toast.info('No hay facturas registradas');
      } else {
        console.log(`✅ ${facturasData.length} facturas cargadas correctamente`);
      }
    } catch (error: any) {
      console.error('❌ Error cargando facturas:', error);
      toast.error('Error al cargar facturas: ' + (error.message || 'Error desconocido'));
      setFacturas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.ordenServicioId === 0) {
      toast.error('Debe seleccionar una orden de servicio');
      return;
    }
    
    if (formData.montoTotal <= 0) {
      toast.error('El monto total debe ser mayor a 0');
      return;
    }
    
    if (formData.manoObra < 0) {
      toast.error('La mano de obra no puede ser negativa');
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('💾 Guardando factura:', formData);
      
      // Calcular valor total automáticamente
      const facturaData = {
        ...formData,
        valorTotal: formData.montoTotal + formData.manoObra
      };
      
      if (editingFactura) {
        await facturasAPI.update(editingFactura.id, facturaData);
        toast.success('Factura actualizada correctamente');
      } else {
        await facturasAPI.create(facturaData);
        toast.success('Factura creada correctamente');
      }
      
      setIsModalOpen(false);
      setEditingFactura(null);
      resetForm();
      await loadFacturas(); // Recargar la lista
    } catch (error: any) {
      console.error('❌ Error guardando factura:', error);
      toast.error('Error al guardar factura: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (factura: FacturaResponse) => {
    console.log('✏️ Editando factura:', factura);
    setEditingFactura(factura);
    setFormData({
      ordenServicioId: factura.ordenServicioId,
      montoTotal: factura.montoTotal,
      manoObra: factura.manoObra,
      valorTotal: factura.valorTotal,
    });
    setIsModalOpen(true);
  };

  const handleViewDetails = (factura: FacturaResponse) => {
    setSelectedFactura(factura);
    setIsDetalleModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta factura?')) {
      try {
        console.log('🗑️ Eliminando factura:', id);
        await facturasAPI.delete(id);
        toast.success('Factura eliminada correctamente');
        await loadFacturas(); // Recargar la lista
      } catch (error: any) {
        console.error('❌ Error eliminando factura:', error);
        toast.error('Error al eliminar factura: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ordenServicioId: 0,
      montoTotal: 0,
      manoObra: 0,
      valorTotal: 0,
    });
  };

  const filteredFacturas = facturas.filter(factura =>
    factura.id.toString().includes(searchTerm) ||
    factura.ordenServicioId.toString().includes(searchTerm) ||
    factura.valorTotal.toString().includes(searchTerm)
  );

  // Estadísticas
  const totalFacturado = facturas.reduce((sum, f) => sum + f.valorTotal, 0);
  const promedioFactura = facturas.length > 0 ? totalFacturado / facturas.length : 0;
  const facturaMaxima = facturas.length > 0 ? Math.max(...facturas.map(f => f.valorTotal)) : 0;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando facturas...</span>
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
            Gestión de Facturas
          </h1>
          <p className="text-white/70 mt-2">
            Administra las facturas del sistema ({facturas.length} registradas)
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingFactura(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Factura
        </Button>
      </div>

      {/* Search */}
      <Card variant="glass" className="p-6">
        <Input
          placeholder="Buscar facturas por ID, orden de servicio o valor..."
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
              <FileText className="w-6 h-6 text-primary-electric" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Facturas</p>
              <p className="text-2xl font-bold text-white">{facturas.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-green/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Facturado</p>
              <p className="text-2xl font-bold text-white">
                ${totalFacturado.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-orange/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Promedio</p>
              <p className="text-2xl font-bold text-white">
                ${Math.round(promedioFactura).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-purple/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Factura Máxima</p>
              <p className="text-2xl font-bold text-white">
                ${facturaMaxima.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Facturas List */}
      {filteredFacturas.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'No se encontraron facturas' : 'No hay facturas registradas'}
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm 
              ? 'Intenta ajustar los términos de búsqueda'
              : 'Las facturas se generan automáticamente al completar órdenes de servicio'
            }
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setEditingFactura(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Primera Factura
            </Button>
          )}
        </Card>
      ) : (
        <motion.div
          variants={listVariants}
          className="space-y-4"
        >
          {filteredFacturas.map((factura) => (
            <motion.div key={factura.id} variants={listItemVariants}>
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        Factura #{factura.id.toString().padStart(4, '0')}
                      </h3>
                      <p className="text-white/60 text-sm">
                        Orden de Servicio #{factura.ordenServicioId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent-green">
                      ${factura.valorTotal.toLocaleString()}
                    </p>
                    <p className="text-white/60 text-sm">Valor Total</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-white/60 text-sm">Monto Repuestos</p>
                    <p className="text-white font-medium">
                      ${factura.montoTotal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Mano de Obra</p>
                    <p className="text-white font-medium">
                      ${factura.manoObra.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Fecha</p>
                    <p className="text-white font-medium">
                      {formatDate((factura as any).fecha)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleViewDetails(factura)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(factura)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(factura.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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
          setEditingFactura(null);
          resetForm();
        }}
        title={editingFactura ? 'Editar Factura' : 'Nueva Factura'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ID Orden de Servicio *"
            type="number"
            value={formData.ordenServicioId}
            onChange={(e) => setFormData({ ...formData, ordenServicioId: Number(e.target.value) })}
            min={1}
            placeholder="1"
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Monto Repuestos *"
              type="number"
              value={formData.montoTotal}
              onChange={(e) => setFormData({ ...formData, montoTotal: Number(e.target.value) })}
              min={0}
              step={0.01}
              placeholder="150000"
              required
            />
            
            <Input
              label="Mano de Obra *"
              type="number"
              value={formData.manoObra}
              onChange={(e) => setFormData({ ...formData, manoObra: Number(e.target.value) })}
              min={0}
              step={0.01}
              placeholder="80000"
              required
            />
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Valor Total:</span>
              <span className="text-xl font-bold text-accent-green">
                ${(formData.montoTotal + formData.manoObra).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingFactura(null);
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
              {editingFactura ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detalle Modal */}
      <DetalleModal
        isOpen={isDetalleModalOpen}
        onClose={() => {
          setIsDetalleModalOpen(false);
          setSelectedFactura(null);
        }}
        factura={selectedFactura || undefined}
        type="factura"
      />
    </motion.div>
  );
};

export default FacturasPage;