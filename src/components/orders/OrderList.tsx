import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Filter, Calendar, User, Car } from 'lucide-react';
import { ServiceOrder, Client, Vehicle } from '../../types';
import { OrderModal } from './OrderModal';
import { OrderDetailModal } from './OrderDetailModal';

// Mock data
const mockOrders: ServiceOrder[] = [
  {
    id: 'ORD-001',
    clientId: '1',
    vehicleId: '1',
    mechanicId: '1',
    description: 'Cambio de aceite y filtros',
    status: 'En Proceso',
    laborCost: 500,
    totalCost: 1200,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    parts: [],
    workLog: []
  },
  {
    id: 'ORD-002',
    clientId: '2',
    vehicleId: '2',
    description: 'Revisión general y cambio de frenos',
    status: 'Completada',
    laborCost: 800,
    totalCost: 2500,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    completedAt: '2024-01-12T16:00:00Z',
    parts: [],
    workLog: []
  }
];

const mockClients: Client[] = [
  { id: '1', name: 'Juan Pérez García', phone: '+52 55 1234 5678', email: 'juan.perez@email.com', createdAt: '2024-01-15T10:30:00Z', vehicles: [] },
  { id: '2', name: 'María González López', phone: '+52 55 9876 5432', email: 'maria.gonzalez@email.com', createdAt: '2024-01-20T14:15:00Z', vehicles: [] }
];

const mockVehicles: Vehicle[] = [
  { id: '1', clientId: '1', brand: 'Toyota', model: 'Corolla', year: 2020, vin: '1HGBH41JXMN109186', licensePlate: 'ABC-123', mileage: 45000, createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', clientId: '2', brand: 'Honda', model: 'Civic', year: 2019, vin: '2HGFC2F59KH123456', licensePlate: 'XYZ-789', mileage: 62000, createdAt: '2024-01-20T14:15:00Z' }
];

export const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>(mockOrders);
  const [clients] = useState<Client[]>(mockClients);
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente no encontrado';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})` : 'Vehículo no encontrado';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada': return 'bg-green-100 text-green-700 border-green-200';
      case 'En Proceso': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cancelada': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const clientName = getClientName(order.clientId);
    const vehicleInfo = getVehicleInfo(order.vehicleId);
    
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const handleEditOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleViewOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleSaveOrder = (orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedOrder) {
      // Editar orden existente
      setOrders(orders.map(order =>
        order.id === selectedOrder.id
          ? { ...order, ...orderData, updatedAt: new Date().toISOString() }
          : order
      ));
    } else {
      // Agregar nueva orden
      const newOrder: ServiceOrder = {
        ...orderData,
        id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setOrders([...orders, newOrder]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Órdenes de Servicio</h2>
          <p className="text-gray-600 mt-1">Gestiona las órdenes de trabajo del taller</p>
        </div>
        <button
          onClick={handleAddOrder}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Orden</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar órdenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Total: {filteredOrders.length} órdenes</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm">{getClientName(order.clientId)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Car className="w-4 h-4 mr-2" />
                    <span className="text-sm">{getVehicleInfo(order.vehicleId)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{order.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Última actualización: {new Date(order.updatedAt).toLocaleString()}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${order.totalCost.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleViewOrder(order)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditOrder(order)}
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Editar orden"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron órdenes</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter ? 'Intenta con otros filtros de búsqueda' : 'Comienza creando tu primera orden de servicio'}
          </p>
        </div>
      )}

      {/* Modals */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
        order={selectedOrder}
        clients={clients}
        vehicles={vehicles}
      />

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
        clients={clients}
        vehicles={vehicles}
      />
    </div>
  );
};