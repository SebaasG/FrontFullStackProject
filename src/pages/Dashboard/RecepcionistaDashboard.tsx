import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RecepcionistaLayout from '../../layouts/RecepcionistaLayout';
import CrearOrden from './CrearOrden';
import ClientesPage from '../Admin/ClientesPage';
import VehiculosPage from '../Admin/VehiculosPage';
import OrdenesPage from '../Admin/OrdenesPage';

const RecepcionistaDashboard: React.FC = () => {
  return (
    <RecepcionistaLayout>
      <Routes>
        <Route path="crear-orden" element={<CrearOrden />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="vehiculos" element={<VehiculosPage />} />
        <Route path="ordenes" element={<OrdenesPage />} />
        <Route path="" element={<CrearOrden />} />
      </Routes>
    </RecepcionistaLayout>
  );
};

export default RecepcionistaDashboard;