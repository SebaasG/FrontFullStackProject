import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RecepcionistaLayout from '../../layouts/RecepcionistaLayout';
import CrearOrden from './CrearOrden';
import ClientesReadOnly from '../Recepcion/ClientesReadOnly';
import VehiculosReadOnly from '../Recepcion/VehiculosReadOnly';
import OrdenesManagement from '../Recepcion/OrdenesManagement';

const RecepcionistaDashboard: React.FC = () => {
  return (
    <RecepcionistaLayout>
      <Routes>
        <Route path="crear-orden" element={<CrearOrden />} />
        <Route path="clientes" element={<ClientesReadOnly />} />
        <Route path="vehiculos" element={<VehiculosReadOnly />} />
        <Route path="ordenes" element={<OrdenesManagement />} />
        <Route path="" element={<CrearOrden />} />
      </Routes>
    </RecepcionistaLayout>
  );
};

export default RecepcionistaDashboard;