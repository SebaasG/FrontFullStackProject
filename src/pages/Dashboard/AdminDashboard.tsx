import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardHome from './DashboardHome';
import UsuariosPage from '../Admin/UsuariosPage';
import ClientesPage from '../Admin/ClientesPage';
import VehiculosPage from '../Admin/VehiculosPage';
import OrdenesPage from '../Admin/OrdenesPage';
import RepuestosPage from '../Admin/RepuestosPage';
import FacturasPage from '../Admin/FacturasPage';
import TiposServicioPage from '../Admin/TiposServicioPage';
import AuditoriaPage from '../Admin/AuditoriaPage';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="vehiculos" element={<VehiculosPage />} />
        <Route path="ordenes" element={<OrdenesPage />} />
        <Route path="repuestos" element={<RepuestosPage />} />
        <Route path="facturas" element={<FacturasPage />} />
        <Route path="tipos-servicio" element={<TiposServicioPage />} />
        <Route path="auditoria" element={<AuditoriaPage />} />
        <Route path="" element={<DashboardHome />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;