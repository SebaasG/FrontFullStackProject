import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../auth/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';
import Login from '../pages/Login';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import RecepcionistaDashboard from '../pages/Dashboard/RecepcionistaDashboard';
import MecanicoDashboard from '../pages/Dashboard/MecanicoDashboard';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes - Admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes - Recepcionista */}
          <Route
            path="/recepcion/*"
            element={
              <ProtectedRoute allowedRoles={['Recepcionista']}>
                <RecepcionistaDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes - Mecánico */}
          <Route
            path="/mecanico/*"
            element={
              <ProtectedRoute allowedRoles={['Mecánico']}>
                <MecanicoDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(10, 14, 39, 0.9)',
              color: '#fff',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#39FF14',
                secondary: '#000',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;