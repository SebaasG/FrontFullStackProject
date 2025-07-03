// Auth Types
export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface DecodedToken {
  email: string;
  exp: number;
  iss: string;
  aud: string;
}

export interface User {
  id: number;
  rolUsuarioId: number;
  rolUsuarioNombre: string;
  nombre: string;
  correo: string;
  documento: string;
  telefono: string;
}

// Cliente Types
export interface ClienteRequest {
  nombre: string;
  telefono: string;
  documento: string;
  correo: string;
}

export interface ClienteResponse {
  id: number;
  nombre: string;
  telefono: string;
  documento: string;
  correo: string;
}

// Vehículo Types
export interface VehiculoRequest {
  clienteId: number;
  marca: string;
  modelo: string;
  year: number;
  vin: string;
  kilometraje: number;
}

export interface VehiculoResponse {
  id: number;
  clienteId: number;
  clienteNombre: string;
  marca: string;
  modelo: string;
  year: number;
  vin: string;
  kilometraje: number;
}

// ===== SOLUCIÓN PARA AUTOMAPPER ERROR =====

// DTO SIMPLE PARA CREAR ORDEN (basado en tu CreateOrdenServicioDto del backend)
export interface CreateOrdenServicioDto {
  vehiculoId: number;
  tipoServicioId: number;
  usuarioId: number;
  fechaIngreso: string; // DateTime ISO
  fechaEstimada: string; // DateTime ISO
}

// DTO SIMPLE PARA CREAR DETALLE (basado en tu CreateDetalleOrdenDto del backend)
export interface CreateDetalleOrdenDto {
  ordenServicioId: number; // Se asigna después de crear la orden
  repuestoId: number;
  cantidad: number;
  precioTotal: number;
}

// ESTRUCTURA COMPLETA DEL SWAGGER (solo para lectura)
export interface OrdenServicioDto {
  id: number;
  vehiculoId: number;
  vehiculoDescripcion: string;
  tipoServicioId: number;
  tipoServicioNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  fechaIngreso: string; // DateTime ISO
  fechaEstimada: string; // DateTime ISO
  detalleOrdenes: DetalleOrdenDto[];
  facturas: FacturaDto[];
}

export interface DetalleOrdenDto {
  id: number;
  ordenServicioId: number;
  repuestoId: number;
  repuestoNombre: string;
  cantidad: number;
  precioTotal: number;
}

export interface FacturaDto {
  id: number;
  ordenServicioId: number;
  montoTotal: number;
  manoObra: number;
  valorTotal: number;
}

// Para uso interno del frontend
export interface DetalleOrdenRequest {
  repuestoId: number;
  repuestoNombre: string;
  cantidad: number;
  precioTotal: number;
}

export interface OrdenServicioResponse {
  id: number;
  vehiculoId: number;
  vehiculoDescripcion: string;
  tipoServicioId: number;
  tipoServicioNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  fechaIngreso: string;
  fechaEstimada: string;
  estado: string;
  detalleOrdenes: DetalleOrdenRequest[];
  facturas: FacturaDto[];
}

// Factura Types
export interface FacturaRequest {
  ordenServicioId: number;
  montoTotal: number;
  manoObra: number;
  valorTotal: number;
}

export interface FacturaResponse {
  id: number;
  ordenServicioId: number;
  montoTotal: number;
  manoObra: number;
  valorTotal: number;
  fecha?: string;
}

// Repuesto Types
export interface RepuestoRequest {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  stock: number;
  precioUnitario: number;
}

export interface RepuestoResponse {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  stock: number;
  precioUnitario: number;
}

// Usuario Types
export interface UsuarioRequest {
  rolUsuarioId: number;
  nombre: string;
  correo: string;
  password: string;
  documento: string;
  telefono: string;
}

export interface UsuarioResponse {
  id: number;
  rolUsuarioId: number;
  rolUsuarioNombre: string;
  nombre: string;
  correo: string;
  documento: string;
  telefono: string;
}

// Auditoría Types
export interface AuditoriaRequest {
  entidad: string;
  accion: string;
  usuarioId: number;
  fecha: string;
}

export interface AuditoriaResponse {
  id: number;
  entidad: string;
  accion: string;
  usuarioId: number;
  usuarioNombre: string;
  fecha: string;
}

// Tipo de Servicio Types
export interface TipoServicioRequest {
  id: number;
  nombre: string;
  ordenServiciosIds: number[];
}

export interface TipoServicioResponse {
  id: number;
  nombre: string;
  ordenServiciosIds: number[];
}

// Rol de Usuario Types
export interface RolUsuarioRequest {
  id: number;
  nombre: string;
  usuariosNombres: string[];
}

export interface RolUsuarioResponse {
  id: number;
  nombre: string;
  usuariosNombres: string[];
}

// Pagination Types
export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// UI Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Dashboard Types
export interface DashboardStats {
  totalClientes: number;
  totalVehiculos: number;
  ordenesActivas: number;
  facturacionMensual: number;
  crecimientoMensual: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

// Role Types
export type UserRole = 'Admin' | 'Recepcionista' | 'Mecánico';

export interface RolePermissions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
}