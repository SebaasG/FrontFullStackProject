import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Wrench, 
  Package, 
  FileText, 
  Shield,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['Admin', 'Mecánico', 'Recepcionista'] },
  { name: 'Clientes', href: '/clients', icon: Users, roles: ['Admin', 'Recepcionista'] },
  { name: 'Vehículos', href: '/vehicles', icon: Car, roles: ['Admin', 'Recepcionista'] },
  { name: 'Órdenes de Servicio', href: '/service-orders', icon: Wrench, roles: ['Admin', 'Mecánico', 'Recepcionista'] },
  { name: 'Repuestos', href: '/parts', icon: Package, roles: ['Admin', 'Mecánico'] },
  { name: 'Facturas', href: '/invoices', icon: FileText, roles: ['Admin', 'Mecánico'] },
  { name: 'Auditoría', href: '/audit', icon: Shield, roles: ['Admin'] },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user, logout, hasRole } = useAuth()

  const filteredNavigation = navigation.filter(item => 
    item.roles.some(role => hasRole(role))
  )

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <Wrench className="w-8 h-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-lg font-bold text-gray-900">TallerPro</h1>
          <p className="text-sm text-gray-500">Sistema de Gestión</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-blue-700">
              {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}