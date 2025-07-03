import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Car, Package, DollarSign, Clock, CheckCircle, AlertCircle, Wrench, Mail, Phone, FileText, Shield } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import StatusBadge from './StatusBadge';
import { OrdenServicioResponse, ClienteResponse, VehiculoResponse, UsuarioResponse, FacturaResponse } from '../../types';

interface DetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  orden?: OrdenServicioResponse;
  cliente?: ClienteResponse;
  vehiculo?: VehiculoResponse;
  usuario?: UsuarioResponse;
  factura?: FacturaResponse;
  type: 'orden' | 'cliente' | 'vehiculo' | 'usuario' | 'factura';
}

const DetalleModal: React.FC<DetalleModalProps> = ({
  isOpen,
  onClose,
  orden,
  cliente,
  vehiculo,
  usuario,
  factura,
  type,
}) => {
  const getTitle = () => {
    switch (type) {
      case 'orden':
        return `Orden de Servicio #${orden?.id?.toString().padStart(3, '0')}`;
      case 'cliente':
        return `Cliente: ${cliente?.nombre}`;
      case 'vehiculo':
        return `Vehículo: ${vehiculo?.marca} ${vehiculo?.modelo}`;
      case 'usuario':
        return `Usuario: ${usuario?.nombre}`;
      case 'factura':
        return `Factura #${factura?.id?.toString().padStart(4, '0')}`;
      default:
        return 'Detalles';
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const renderOrdenDetails = () => {
    if (!orden) return null;

    return (
      <div className="space-y-6">
        {/* Información Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Car className="w-5 h-5 text-primary-electric" />
                Información del Vehículo
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Descripción:</span>
                  <span className="text-white font-medium">{orden.vehiculoDescripcion || 'No especificada'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">ID Vehículo:</span>
                  <span className="text-white">{orden.vehiculoId}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-accent-green" />
                Mecánico Asignado
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Nombre:</span>
                  <span className="text-white font-medium">{orden.usuarioNombre || 'No asignado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">ID Usuario:</span>
                  <span className="text-white">{orden.usuarioId}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-accent-orange" />
                Información del Servicio
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Tipo:</span>
                  <span className="text-white font-medium">{orden.tipoServicioNombre || 'No especificado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Estado:</span>
                  <StatusBadge status={orden.estado as any} />
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">ID Orden:</span>
                  <span className="text-white">{orden.id}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent-purple" />
                Fechas Importantes
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-white/60 block">Fecha de Ingreso:</span>
                  <span className="text-white font-medium">
                    {formatDate(orden.fechaIngreso)}
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block">Fecha Estimada:</span>
                  <span className="text-white font-medium">
                    {formatDate(orden.fechaEstimada)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Repuestos */}
        {orden.detalleOrdenes && orden.detalleOrdenes.length > 0 && (
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-electric" />
              Repuestos Utilizados ({orden.detalleOrdenes.length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {orden.detalleOrdenes.map((detalle, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/5">
                  <div>
                    <p className="text-white font-medium">{detalle.repuestoNombre || 'Repuesto'}</p>
                    <p className="text-white/60 text-sm">Cantidad: {detalle.cantidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent-green font-medium">
                      ${detalle.precioTotal?.toLocaleString() || '0'}
                    </p>
                    <p className="text-white/60 text-xs">
                      ${Math.round((detalle.precioTotal || 0) / detalle.cantidad).toLocaleString()} c/u
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-white">Total Repuestos:</span>
                <span className="text-xl font-bold text-accent-green">
                  ${orden.detalleOrdenes.reduce((sum, d) => sum + (d.precioTotal || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Facturas */}
        {orden.facturas && orden.facturas.length > 0 && (
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent-green" />
              Facturas Asociadas ({orden.facturas.length})
            </h3>
            <div className="space-y-3">
              {orden.facturas.map((factura, index) => (
                <div key={index} className="p-3 bg-white/5 rounded border border-white/5">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Repuestos:</p>
                      <p className="text-white font-medium">${factura.montoTotal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Mano de Obra:</p>
                      <p className="text-white font-medium">${factura.manoObra.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Total:</p>
                      <p className="text-accent-green font-bold">${factura.valorTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderClienteDetails = () => {
    if (!cliente) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-electric" />
              Información Personal
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm block">Nombre Completo:</span>
                <span className="text-white font-medium text-lg">{cliente.nombre}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">Documento de Identidad:</span>
                <span className="text-white font-medium">{cliente.documento}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">ID Cliente:</span>
                <span className="text-white">{cliente.id}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent-green" />
              Información de Contacto
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm block">Correo Electrónico:</span>
                <span className="text-white font-medium">{cliente.correo}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">Teléfono:</span>
                <span className="text-white font-medium">{cliente.telefono}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVehiculoDetails = () => {
    if (!vehiculo) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-primary-electric" />
              Información del Vehículo
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm block">Marca:</span>
                <span className="text-white font-medium text-lg">{vehiculo.marca}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">Modelo:</span>
                <span className="text-white font-medium">{vehiculo.modelo}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">Año:</span>
                <span className="text-white font-medium">{vehiculo.year}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">VIN:</span>
                <span className="text-white font-mono text-sm bg-white/5 px-2 py-1 rounded">{vehiculo.vin}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-orange" />
              Detalles Adicionales
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm block">Kilometraje:</span>
                <span className="text-white font-medium">{vehiculo.kilometraje.toLocaleString()} km</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">Propietario:</span>
                <span className="text-white font-medium">{vehiculo.clienteNombre || 'No especificado'}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">ID Vehículo:</span>
                <span className="text-white">{vehiculo.id}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">ID Cliente:</span>
                <span className="text-white">{vehiculo.clienteId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUsuarioDetails = () => {
    if (!usuario) return null;

    const getRoleColor = (role: string) => {
      switch (role) {
        case 'Admin':
          return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'Mecánico':
          return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'Recepcionista':
          return 'bg-green-500/20 text-green-400 border-green-500/30';
        default:
          return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    };

    const getRoleIcon = (role: string) => {
      switch (role) {
        case 'Admin':
          return <Shield className="w-4 h-4" />;
        case 'Mecánico':
          return <Wrench className="w-4 h-4" />;
        case 'Recepcionista':
          return <User className="w-4 h-4" />;
        default:
          return <User className="w-4 h-4" />;
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-electric" />
              Información Personal
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm block">Nombre Completo:</span>
                <span className="text-white font-medium text-lg">{usuario.nombre}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">Documento:</span>
                <span className="text-white font-medium">{usuario.documento}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">Teléfono:</span>
                <span className="text-white font-medium">{usuario.telefono}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-green" />
              Información del Sistema
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm block">Correo Electrónico:</span>
                <span className="text-white font-medium">{usuario.correo}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">Rol del Usuario:</span>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm border flex items-center gap-2 w-fit ${getRoleColor(usuario.rolUsuarioNombre)}`}>
                    {getRoleIcon(usuario.rolUsuarioNombre)}
                    {usuario.rolUsuarioNombre}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-white/60 text-sm block">ID Usuario:</span>
                <span className="text-white">{usuario.id}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">ID Rol:</span>
                <span className="text-white">{usuario.rolUsuarioId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFacturaDetails = () => {
    if (!factura) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-electric" />
              Detalles de Facturación
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm block">Orden de Servicio:</span>
                <span className="text-white font-medium">#{factura.ordenServicioId}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">Monto Repuestos:</span>
                <span className="text-white font-medium">${factura.montoTotal.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">Mano de Obra:</span>
                <span className="text-white font-medium">${factura.manoObra.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm block">ID Factura:</span>
                <span className="text-white">{factura.id}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent-green" />
              Resumen Financiero
            </h3>
            <div className="text-center space-y-4">
              <div>
                <p className="text-4xl font-bold text-accent-green">
                  ${factura.valorTotal.toLocaleString()}
                </p>
                <p className="text-white/60 text-sm mt-1">Valor Total de la Factura</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-white/5 rounded">
                  <p className="text-white/60">Repuestos</p>
                  <p className="text-white font-medium">${factura.montoTotal.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white/5 rounded">
                  <p className="text-white/60">Mano de Obra</p>
                  <p className="text-white font-medium">${factura.manoObra.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'orden':
        return renderOrdenDetails();
      case 'cliente':
        return renderClienteDetails();
      case 'vehiculo':
        return renderVehiculoDetails();
      case 'usuario':
        return renderUsuarioDetails();
      case 'factura':
        return renderFacturaDetails();
      default:
        return <div className="text-white">No hay detalles disponibles</div>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="full"
    >
      {renderContent()}
    </Modal>
  );
};

export default DetalleModal;