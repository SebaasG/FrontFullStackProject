export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

export interface DashboardCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

export interface Order {
  id: string;
  client: string;
  vehicle: string;
  status: 'En Progreso' | 'Completado' | 'Pendiente';
  time: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}
