import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  onSidebarOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onSidebarOpen}
          className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar órdenes, clientes, vehículos..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-96"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900">Admin Usuario</div>
            <div className="text-gray-500">Administrador</div>
          </div>
        </div>
      </div>
    </header>
  );
};