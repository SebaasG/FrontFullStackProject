import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Wrench, 
  FileText, 
  Package, 
  Settings, 
  LogOut,
  Plus,
  ClipboardList,
  Shield,
  DollarSign,
  Activity
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { UserRole } from '../../types';
import toast from 'react-hot-toast';

interface SidebarProps {
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (userRole) {
      case 'Admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'Usuarios', path: '/admin/usuarios' },
          { icon: Users, label: 'Clientes', path: '/admin/clientes' },
          { icon: Car, label: 'Vehículos', path: '/admin/vehiculos' },
          { icon: Wrench, label: 'Órdenes', path: '/admin/ordenes' },
          { icon: Package, label: 'Repuestos', path: '/admin/repuestos' },
          { icon: DollarSign, label: 'Facturas', path: '/admin/facturas' },
          { icon: Settings, label: 'Tipos de Servicio', path: '/admin/tipos-servicio' },
          { icon: Activity, label: 'Auditoría', path: '/admin/auditoria' },
        ];
      case 'Recepcionista':
        return [
          { icon: Plus, label: 'Crear Orden', path: '/recepcion/crear-orden' },
          { icon: Users, label: 'Clientes', path: '/recepcion/clientes' },
          { icon: Car, label: 'Vehículos', path: '/recepcion/vehiculos' },
          { icon: Wrench, label: 'Órdenes', path: '/recepcion/ordenes' },
        ];
      case 'Mecánico':
        return [
          { icon: Wrench, label: 'Mis Órdenes', path: '/mecanico/ordenes' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-full w-64 glass border-r border-white/20 z-30"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg neon-text">
              Taller Pro
            </h1>
            <p className="text-white/60 text-sm">{userRole}</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-primary text-white shadow-neon'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;