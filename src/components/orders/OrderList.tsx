import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Eye, Filter, Calendar, User, Car } from 'lucide-react';
import { ServiceOrder, Client, Vehicle } from '../../types';
import { OrderModal } from './OrderModal';
import { OrderDetailModal } from './OrderDetailModal';
import axios from 'axios';

export const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AdGFsbGVyLmNvbSIsImV4cCI6MTc1MTAzMDM2MiwiaXNzIjoiQXBpU2d0YSIsImF1ZCI6IkFwaVNndGFVc2VycyJ9.LWOQsguBTTNd-bryWdHtYfw2xzBp8vKdw6W7TjBmB2Q"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordenesRes, clientesRes, vehiculosRes] = await Promise.all([
          axios.get('http://localhost:5105/api/ordenServicio', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5105/api/cliente', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5105/api/vehiculo', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const adaptedOrders: ServiceOrder[] = ordenesRes.data.map((orden: any) => {
          const factura = Array.isArray(orden.facturas) ? orden.facturas[0] || {} : {};
          const totalCost = factura.valorTotal ?? 0;
          const laborCost = factura.manoObra ?? 0;

          return {
            id: orden.id?.toString() ?? '',
            clientId: '', // Asociado más abajo
            vehicleId: orden.vehiculoId?.toString() ?? '',
            mechanicId: orden.usuarioId?.toString() ?? '',
            description: orden.tipoServicioNombre || 'Sin descripción',
            status: totalCost > 0 ? 'Completada' : 'En Proceso',
            laborCost,
            totalCost,
            createdAt: orden.fechaIngreso,
            updatedAt: orden.fechaEstimada ?? orden.fechaIngreso,
            parts: [],
            workLog: [],
          };
        });

        const adaptedClients: Client[] = clientesRes.data.map((cliente: any) => ({
          id: cliente.cliente_id?.toString() ?? '',
          name: cliente.nombre,
          phone: cliente.telefono,
          email: cliente.correo,
          createdAt: new Date().toISOString(),
          vehicles: [],
        }));

        const adaptedVehicles: Vehicle[] = vehiculosRes.data.map((vehiculo: any) => ({
          id: vehiculo.vehiculo_id?.toString() ?? '',
          clientId: vehiculo.cliente_id?.toString() ?? '',
          brand: vehiculo.marca,
          model: vehiculo.modelo,
          year: new Date(vehiculo.year).getFullYear(),
          vin: vehiculo.vin,
          licensePlate: vehiculo.placa ?? 'N/A',
          mileage: Number(vehiculo.kilometraje ?? 0),
          createdAt: new Date().toISOString(),
        }));

        for (const order of adaptedOrders) {
          const vehicle = adaptedVehicles.find(v => v.id === order.vehicleId);
          if (vehicle) order.clientId = vehicle.clientId;
        }

        setOrders(adaptedOrders);
        setClients(adaptedClients);
        setVehicles(adaptedVehicles);
      } catch (err) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.name || 'Cliente no encontrado';
  const getVehicleInfo = (vehicleId: string) => {
    const v = vehicles.find(v => v.id === vehicleId);
    return v ? `${v.brand} ${v.model} (${v.licensePlate})` : 'Vehículo no encontrado';
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada': return 'bg-green-100 text-green-700 border-green-200';
      case 'En Proceso': return 'bg-blue-100 text-blue-700 border-blue-200';
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

    return matchesSearch && (!statusFilter || order.status === statusFilter);
  });

  const handleViewOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Órdenes de Servicio</h2>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="">Todos los estados</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          Total: {filteredOrders.length} órdenes
        </div>
      </div>

      {/* Tarjetas */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-gray-600">
                  <div className="flex items-center"><User className="w-4 h-4 mr-2" /> {getClientName(order.clientId)}</div>
                  <div className="flex items-center"><Car className="w-4 h-4 mr-2" /> {getVehicleInfo(order.vehicleId)}</div>
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>

                <p className="text-gray-700 mb-4">{order.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Actualizado: {new Date(order.updatedAt).toLocaleString()}</span>
                  <span className="text-lg font-semibold text-gray-900">${order.totalCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button onClick={() => handleViewOrder(order)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-gray-500">No se encontraron órdenes</div>
      )}

      {/* Modales */}
      <OrderModal
        isOpen={!!selectedOrder && isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => setIsModalOpen(false)} // Completa tu lógica
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
