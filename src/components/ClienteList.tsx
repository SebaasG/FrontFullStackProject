// src/components/ClienteList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cliente } from '../types';

export const ClienteList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AdGFsbGVyLmNvbSIsImV4cCI6MTc1MDk5MDk5MSwiaXNzIjoiQXBpU2d0YSIsImF1ZCI6IkFwaVNndGFVc2VycyJ9.KiZdddTivdLfyH8c60N-RRZ1eXcJbt4h2DC_cID9VbM"
//   var token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
      const response = await axios.get('http://localhost:5105/api/Cliente', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
        });  // Ajusta la URL según tu backend
         // Ajusta la URL según tu backend
        setClientes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los clientes');
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) return <p className="text-gray-600">Cargando clientes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Listado de Clientes</h3>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Nombre</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Correo</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Teléfono</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Dirección</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td className="px-4 py-2 text-gray-800">{cliente.nombre}</td>
              <td className="px-4 py-2 text-gray-600">{cliente.correo}</td>
              <td className="px-4 py-2 text-gray-600">{cliente.telefono}</td>
              <td className="px-4 py-2 text-gray-600">{cliente.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
