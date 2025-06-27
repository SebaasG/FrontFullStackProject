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

export type OrderStatus = 'En Proceso' | 'Completada' | 'Pendiente' | 'Cancelada';

export interface Part {
  id: string;
  name: string;
  quantity: number;
  totalPrice: number;
}

export interface WorkLogEntry {
  date: string;
  note: string;
}

export interface ServiceOrder {
  id: string;
  clientId: string;
  vehicleId: string;
  mechanicId?: string;
  description: string;
  status: OrderStatus;
  laborCost: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
  parts: Part[];
  workLog: WorkLogEntry[];
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
