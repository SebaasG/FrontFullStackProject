import React from 'react';
import { X, User, Car, Calendar, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';
import { Order, Client, Vehicle } from '../../types';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  clients: Client[];
  vehicles: Vehicle[];
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  clients,
  vehicles
}) => {
  if (!isOpen || !order) return null;

  const client = clients.find(c => c.id === order.client);
  const vehicle = vehicles.find(v => v.id === order.vehicle);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada': return 'bg-green-100 text-green-700 border-green-200';
      case 'En Proceso': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cancelada': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completada': return <CheckCircle className="w-5 h-5" />;
      case 'En Proceso': return <Clock className="w-5 h-5" />;
      case 'Pendiente': return <Clock className="w-5 h-5" />;
      case 'Cancelada': return <X className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Orden de Servicio {order.id}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-2 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span>{order.status}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cliente y Vehículo */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Información del Cliente
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">{client?.name || 'No encontrado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-medium">{client?.phone || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{client?.email || 'No disponible'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Información del Vehículo
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehículo:</span>
                    <span className="font-medium">
                      {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'No encontrado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Año:</span>
                    <span className="font-medium">{vehicle?.year || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Placa:</span>
                    <span className="font-medium">{vehicle?.licensePlate || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VIN:</span>
                    <span className="font-medium font-mono text-sm">{vehicle?.vin || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kilometraje:</span>
                    <span className="font-medium">{vehicle?.mileage.toLocaleString() || 'No disponible'} km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas y Costos */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Fechas Importantes
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Creada:</span>
                    <span className="font-medium">{new Date(order.time).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última actualización:</span>
                    <span className="font-medium">{new Date(order.time).toLocaleString()}</span>
                  </div>
                  {order.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completada:</span>
                      <span className="font-medium">{new Date(order.status).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Información de Costos
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mano de obra:</span>
                    <span className="font-medium">${order.laborCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repuestos:</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-900 font-semibold">Total:</span>
                    <span className="font-bold text-lg">${order.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción del Trabajo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Descripción del Trabajo
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{order.description}</p>
            </div>
          </div>

          {/* Repuestos Utilizados */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Repuestos Utilizados
            </h3>
            {order.parts.length > 0 ? (
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Repuesto</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio Unit.</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.parts.map((part, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-900">Repuesto #{part.partId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{part.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">${part.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">${part.totalPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">No se han utilizado repuestos en esta orden</p>
              </div>
            )}
          </div>

          {/* Registro de Trabajo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Registro de Trabajo
            </h3>
            {order.workLog.length > 0 ? (
              <div className="space-y-4">
                {order.workLog.map((log, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">Mecánico #{log.mechanicId}</span>
                      <span className="text-sm text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{log.description}</p>
                    <span className="text-sm text-gray-600">Horas trabajadas: {log.hoursWorked}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">No hay registros de trabajo para esta orden</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};