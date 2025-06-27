// src/components/clients/ClientList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, Edit, Trash2, Car, Phone, Mail } from 'lucide-react';
import { Client } from '../../types';
import { ClientModal } from '../clients/ClienteModal';

export const ClienteList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usa tu token real aquí
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AdGFsbGVyLmNvbSIsImV4cCI6MTc1MDk5NjAwNiwiaXNzIjoiQXBpU2d0YSIsImF1ZCI6IkFwaVNndGFVc2VycyJ9.nKnVND1OaXjUIhiVdk9bAp8QsSjfDFX9Tk9Eljr4K3k"

useEffect(() => {
  const fetchClients = async () => {


    try {
      const response = await axios.get('http://localhost:5105/api/cliente', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📦 Clientes desde backend:', response.data);

      // 🔁 Mapeo de los datos del backend al modelo del frontend
      const adaptedClients = response.data.map((cliente: any) => ({
        id: cliente.id.toString(), // por si el id es número
        name: cliente.nombre,
        phone: cliente.telefono,
        email: cliente.correo,
        address: cliente.direccion ?? '',
        createdAt: cliente.fechaCreacion ?? new Date().toISOString(),
        vehicles: [], // puedes adaptarlo si el backend lo tiene
      }));

      setClients(adaptedClients);
    } catch (err) {
      console.error('❌ Error al cargar clientes:', err);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  fetchClients();
}, []);


  const filteredClients = clients.filter((client) => {
  const name = client.name || '';
  const email = client.email || '';
  const phone = client.phone || '';
  return (
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phone.includes(searchTerm)
  );
});

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'vehicles'>) => {
    if (selectedClient) {
      setClients(clients.map(client =>
        client.id === selectedClient.id
          ? { ...client, ...clientData }
          : client
      ));
    } else {
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        vehicles: []
      };
      setClients([...clients, newClient]);
    }
    setIsModalOpen(false);
  };

  if (loading) return <p className="text-gray-600">Cargando clientes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h2>
          <p className="text-gray-600 mt-1">Administra la información de tus clientes</p>
        </div>
        <button
          onClick={handleAddClient}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{client.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Car className="w-4 h-4 mr-2" />
                    <span className="text-sm">{client.vehicles?.length ?? 0} vehículos</span>
                  </div>
                </div>
              </div>
            </div>

            {client.address && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{client.address}</p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Cliente desde {new Date(client.createdAt).toLocaleDateString()}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClient(client)}
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer cliente'}
          </p>
        </div>
      )}

      {/* Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient}
        client={selectedClient}
      />
    </div>
  );
};
