import { 
  Home,
  ClipboardList,
  Users,
  Car,
  Package,
  Receipt,
  BarChart3,
  Settings,
  Wrench,
  DollarSign,
  Clock,
  Plus,
  Calendar
} from 'lucide-react';
import { NavItem, DashboardCard, Order, QuickAction } from '../types';

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Órdenes', icon: ClipboardList, badge: 3 },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'vehicles', label: 'Vehículos', icon: Car },
  { id: 'inventory', label: 'Inventario', icon: Package },
  { id: 'billing', label: 'Facturación', icon: Receipt },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  
  { id: 'settings', label: 'Configuración', icon: Settings }
];

export const dashboardCards: DashboardCard[] = [
  {
    title: 'Órdenes Activas',
    value: 12,
    change: '+15%',
    changeType: 'positive',
    icon: Wrench,
    color: 'bg-blue-500'
  },
  {
    title: 'Ingresos del Mes',
    value: '$45,230',
    change: '+8.2%',
    changeType: 'positive',
    icon: DollarSign,
    color: 'bg-green-500'
  },
  {
    title: 'Clientes Nuevos',
    value: 28,
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    color: 'bg-orange-500'
  },
  {
    title: 'Tiempo Promedio',
    value: '2.5h',
    change: '-18min',
    changeType: 'positive',
    icon: Clock,
    color: 'bg-purple-500'
  }
];

export const recentOrders: Order[] = [
  { id: 'ORD-001', client: 'Juan Pérez', vehicle: 'Toyota Corolla 2020', status: 'En Progreso', time: '2h restantes' },
  { id: 'ORD-002', client: 'María García', vehicle: 'Honda Civic 2019', status: 'Completado', time: 'Finalizado' },
  { id: 'ORD-003', client: 'Carlos López', vehicle: 'Ford Focus 2021', status: 'Pendiente', time: 'En cola' },
  { id: 'ORD-004', client: 'Ana Martínez', vehicle: 'Chevrolet Spark 2018', status: 'En Progreso', time: '45min restantes' },
];

export const quickActions: QuickAction[] = [
  { id: 'new-client', label: 'Nuevo Cliente', icon: Plus, color: 'bg-blue-100 text-blue-600' },
  { id: 'register-vehicle', label: 'Registrar Vehículo', icon: Car, color: 'bg-green-100 text-green-600' },
  { id: 'add-part', label: 'Agregar Repuesto', icon: Package, color: 'bg-purple-100 text-purple-600' },
  { id: 'view-schedule', label: 'Ver Agenda', icon: Calendar, color: 'bg-orange-100 text-orange-600' }
];