import React, { useState, useEffect } from 'react';
import { X, User, Car, FileText, DollarSign, Wrench } from 'lucide-react';
import { ServiceOrder, Client, Vehicle } from '../../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  order?: ServiceOrder | null;
  clients: Client[];
  vehicles: Vehicle[];
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  order,
  clients,
  vehicles
}) => {
  const [formData, setFormData] = useState({
    clientId: '',
    vehicleId: '',
    mechanicId: '',
    description: '',
    status: 'Pendiente' as ServiceOrder['status'],
    laborCost: 0,
    totalCost: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (order) {
      setFormData({
        clientId: order.clientId,
        vehicleId: order.vehicleId,
        mechanicId: order.mechanicId || '',
        description: order.description,
        status: order.status,
        laborCost: order.laborCost,
        totalCost: order.totalCost
      });
    } else {
      setFormData({
        clientId: '',
        vehicleId: '',
        mechanicId: '',
        description: '',
        status: 'Pendiente',
        laborCost: 0,
        totalCost: 0
      });
    }
    setErrors({});
  }, [order, isOpen]);

  useEffect(() => {
    if (formData.clientId) {
      const clientVehicles = vehicles.filter(v => v.clientId === formData.clientId);
      setFilteredVehicles(clientVehicles);
      
      // Si el vehículo seleccionado no pertenece al cliente actual, limpiarlo
      if (formData.vehicleId && !clientVehicles.find(v => v.id === formData.vehicleId)) {
        setFormData(prev => ({ ...prev, vehicleId: '' }));
      }
    } else {
      setFilteredVehicles([]);
      setFormData(prev => ({ ...prev, vehicleId: '' }));
    }
  }, [formData.clientId, vehicles]);

  useEffect(() => {
    // Calcular costo total cuando cambie el costo de mano de obra
    setFormData(prev => ({ ...prev, totalCost: prev.laborCost }));
  }, [formData.laborCost]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Selecciona un cliente';
    }

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Selecciona un vehículo';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.laborCost < 0) {
      newErrors.laborCost = 'El costo de mano de obra no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        parts: order?.parts || [],
        workLog: order?.workLog || [],
        completedAt: formData.status === 'Completada' ? new Date().toISOString() : order?.completedAt
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {order ? 'Editar Orden de Servicio' : 'Nueva Orden de Servicio'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Cliente *
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => handleChange('clientId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                errors.clientId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>
            )}
          </div>

          {/* Vehículo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Car className="w-4 h-4 inline mr-2" />
              Vehículo *
            </label>
            <select
              value={formData.vehicleId}
              onChange={(e) => handleChange('vehicleId', e.target.value)}
              disabled={!formData.clientId}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                errors.vehicleId ? 'border-red-300' : 'border-gray-300'
              } ${!formData.clientId ? 'bg-gray-100' : ''}`}
            >
              <option value="">
                {formData.clientId ? 'Seleccionar vehículo' : 'Primero selecciona un cliente'}
              </option>
              {filteredVehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleId}</p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Wrench className="w-4 h-4 inline mr-2" />
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Descripción del Trabajo *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe el trabajo a realizar..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Costo de Mano de Obra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Costo de Mano de Obra
            </label>
            <input
              type="number"
              value={formData.laborCost}
              onChange={(e) => handleChange('laborCost', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                errors.laborCost ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.laborCost && (
              <p className="text-red-500 text-sm mt-1">{errors.laborCost}</p>
            )}
          </div>

          {/* Total (solo lectura por ahora) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo Total
            </label>
            <input
              type="text"
              value={`$${formData.totalCost.toLocaleString()}`}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              El costo total se calculará automáticamente incluyendo repuestos
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              {order ? 'Actualizar' : 'Crear'} Orden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};