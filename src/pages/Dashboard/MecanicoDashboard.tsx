import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MecanicoLayout from '../../layouts/MecanicoLayout';
import OrdenesAsignadas from './OrdenesAsignadas';

const MecanicoDashboard: React.FC = () => {
  return (
    <MecanicoLayout>
      <Routes>
        <Route path="ordenes" element={<OrdenesAsignadas />} />
        <Route path="" element={<OrdenesAsignadas />} />
      </Routes>
    </MecanicoLayout>
  );
};

export default MecanicoDashboard;