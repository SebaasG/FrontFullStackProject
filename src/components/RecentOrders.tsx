import React from 'react';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Order } from '../types';

interface RecentOrdersProps {
  orders: Order[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completado': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'En Progreso': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Pendiente': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return 'bg-green-100 text-green-700';
      case 'En Progreso': return 'bg-blue-100 text-blue-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                {getStatusIcon(order.status)}
                <div>
                  <div className="font-medium text-gray-900">{order.id}</div>
                  <div className="text-sm text-gray-600">{order.client} - {order.vehicle}</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <div className="text-sm text-gray-500 mt-1">{order.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};