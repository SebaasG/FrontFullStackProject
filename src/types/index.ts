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

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  createdAt: string;
  vehicles: Vehicle[];
}



export interface Vehicle {
  id: string;
  clientId: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  mileage: number;
  color?: string;
  createdAt: string;
}
