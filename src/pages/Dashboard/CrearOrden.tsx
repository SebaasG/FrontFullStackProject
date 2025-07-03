import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Car, User, Package, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp } from '../../animations/pageTransitions';
import { clientesAPI } from '../../api/clientes';
import { vehiculosAPI } from '../../api/vehiculos';
import { repuestosAPI } from '../../api/repuestos';
import { ordenesAPI } from '../../api/ordenes';
import { usuariosAPI } from '../../api/usuarios';
import { tiposServicioAPI } from '../../api/tiposServicio';
import { ClienteResponse, VehiculoResponse, RepuestoResponse, UsuarioResponse, TipoServicioResponse, CreateOrdenServicioDto, CreateDetalleOrdenDto, DetalleOrdenRequest } from '../../types';
import toast from 'react-hot-toast';

interface OrdenFormData {
  clienteId: number;
  vehiculoId: number;
  tipoServicioId: number;
  usuarioId: number;
  fechaEstimada: string;
  detalleOrdenes: DetalleOrdenRequest[];
}

const CrearOrden: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [vehiculos, setVehiculos] = useState<VehiculoResponse[]>([]);
  const [repuestos, setRepuestos] = useState<RepuestoResponse[]>([]);
  const [mecanicos, setMecanicos] = useState<UsuarioResponse[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicioResponse[]>([]);
  const [searchCliente, setSearchCliente] = useState('');
  const [searchRepuesto, setSearchRepuesto] = useState('');
  const [isRepuestoModalOpen, setIsRepuestoModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<OrdenFormData>({
    clienteId: 0,
    vehiculoId: 0,
    tipoServicioId: 0,
    usuarioId: 0,
    fechaEstimada: '',
    detalleOrdenes: [],
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.clienteId > 0) {
      loadVehiculos();
    }
  }, [formData.clienteId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos iniciales para crear orden...');
      
      const [clientesData, repuestosData, mecanicosData, tiposServicioData] = await Promise.allSettled([
        clientesAPI.getAll(),
        repuestosAPI.getAll(),
        usuariosAPI.getMecanicos(), // USAR getMecanicos() que filtra SOLO rolUsuarioId = 2
        tiposServicioAPI.getAll()
      ]);
      
      // Procesar clientes
      if (clientesData.status === 'fulfilled') {
        const clientesResult = clientesData.value;
        const clientesArray = Array.isArray(clientesResult) ? clientesResult : 
                             clientesResult?.data ? clientesResult.data : [];
        setClientes(clientesArray);
        console.log('✅ Clientes cargados:', clientesArray.length);
      } else {
        console.error('❌ Error cargando clientes:', clientesData.reason);
        setClientes([]);
        toast.error('Error al cargar clientes');
      }
      
      // Procesar repuestos
      if (repuestosData.status === 'fulfilled') {
        const repuestosResult = repuestosData.value;
        const repuestosArray = Array.isArray(repuestosResult) ? repuestosResult : 
                              repuestosResult?.data ? repuestosResult.data : [];
        setRepuestos(repuestosArray);
        console.log('✅ Repuestos cargados:', repuestosArray.length);
      } else {
        console.error('❌ Error cargando repuestos:', repuestosData.reason);
        setRepuestos([]);
        toast.error('Error al cargar repuestos');
      }
      
      // Procesar mecánicos - USAR getMecanicos() que ya filtra correctamente por rolUsuarioId = 2
      if (mecanicosData.status === 'fulfilled') {
        const mecanicosResult = mecanicosData.value;
        console.log('🔧 Mecánicos obtenidos directamente (SOLO rolUsuarioId = 2):', mecanicosResult);
        setMecanicos(mecanicosResult);
        console.log('✅ Mecánicos cargados:', mecanicosResult.length);
        
        if (mecanicosResult.length === 0) {
          console.log('⚠️ No se encontraron mecánicos en la base de datos');
          toast.error('No se encontraron mecánicos disponibles. Verifica que existan usuarios con rol de mecánico (rolUsuarioId = 2).');
        } else {
          console.log('🎉 Mecánicos disponibles para asignar:', mecanicosResult.map(m => `${m.nombre} (ID: ${m.id}, Rol: ${m.rolUsuarioId})`));
        }
      } else {
        console.error('❌ Error cargando mecánicos:', mecanicosData.reason);
        setMecanicos([]);
        toast.error('Error al cargar mecánicos');
      }
      
      // Procesar tipos de servicio
      if (tiposServicioData.status === 'fulfilled') {
        const tiposResult = tiposServicioData.value;
        const tiposArray = Array.isArray(tiposResult) ? tiposResult : 
                          tiposResult?.data ? tiposResult.data : [];
        setTiposServicio(tiposArray);
        console.log('✅ Tipos de servicio cargados:', tiposArray.length);
      } else {
        console.error('❌ Error cargando tipos de servicio:', tiposServicioData.reason);
        const tiposEjemplo = [
          { id: 1, nombre: 'Mantenimiento General', ordenServiciosIds: [] },
          { id: 2, nombre: 'Reparación de Motor', ordenServiciosIds: [] },
          { id: 3, nombre: 'Diagnóstico', ordenServiciosIds: [] },
          { id: 4, nombre: 'Cambio de Aceite', ordenServiciosIds: [] }
        ];
        setTiposServicio(tiposEjemplo);
        console.log('⚠️ Usando tipos de servicio de ejemplo:', tiposEjemplo.length);
      }
      
    } catch (error) {
      console.error('❌ Error cargando datos iniciales:', error);
      toast.error('Error al cargar datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  const loadVehiculos = async () => {
    try {
      console.log('🔄 Cargando vehículos del cliente:', formData.clienteId);
      const vehiculosData = await vehiculosAPI.getByCliente(formData.clienteId);
      const vehiculosArray = Array.isArray(vehiculosData) ? vehiculosData : 
                            vehiculosData?.data ? vehiculosData.data : [];
      setVehiculos(vehiculosArray);
      console.log('✅ Vehículos cargados:', vehiculosArray.length);
    } catch (error) {
      console.error('❌ Error cargando vehículos:', error);
      toast.error('Error al cargar vehículos del cliente');
      setVehiculos([]);
    }
  };

  const handleClienteSelect = (cliente: ClienteResponse) => {
    console.log('👤 Cliente seleccionado:', cliente);
    setFormData(prev => ({
      ...prev,
      clienteId: cliente.id,
      vehiculoId: 0,
    }));
    setStep(2);
  };

  const handleVehiculoSelect = (vehiculo: VehiculoResponse) => {
    console.log('🚗 Vehículo seleccionado:', vehiculo);
    setFormData(prev => ({
      ...prev,
      vehiculoId: vehiculo.id,
    }));
    setStep(3);
  };

  const handleAddRepuesto = (repuesto: RepuestoResponse, cantidad: number) => {
    if (cantidad > repuesto.stock) {
      toast.error(`Solo hay ${repuesto.stock} unidades disponibles`);
      return;
    }

    // Verificar si ya existe el repuesto
    const existingIndex = formData.detalleOrdenes.findIndex(d => d.repuestoId === repuesto.id);
    
    if (existingIndex >= 0) {
      // Actualizar cantidad existente
      const newCantidad = formData.detalleOrdenes[existingIndex].cantidad + cantidad;
      if (newCantidad > repuesto.stock) {
        toast.error(`Solo hay ${repuesto.stock} unidades disponibles`);
        return;
      }
      
      const updatedDetalles = [...formData.detalleOrdenes];
      updatedDetalles[existingIndex] = {
        ...updatedDetalles[existingIndex],
        cantidad: newCantidad,
        precioTotal: repuesto.precioUnitario * newCantidad,
      };
      
      setFormData(prev => ({
        ...prev,
        detalleOrdenes: updatedDetalles,
      }));
    } else {
      // Agregar nuevo repuesto
      const nuevoDetalle: DetalleOrdenRequest = {
        repuestoId: repuesto.id,
        repuestoNombre: repuesto.nombre,
        cantidad,
        precioTotal: repuesto.precioUnitario * cantidad,
      };

      setFormData(prev => ({
        ...prev,
        detalleOrdenes: [...prev.detalleOrdenes, nuevoDetalle],
      }));
    }
    
    setIsRepuestoModalOpen(false);
    toast.success(`${repuesto.nombre} agregado a la orden`);
  };

  const handleRemoveRepuesto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      detalleOrdenes: prev.detalleOrdenes.filter((_, i) => i !== index),
    }));
    toast.success('Repuesto removido de la orden');
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      console.log('💾 Creando orden de servicio con CreateOrdenServicioDto...');
      
      const selectedCliente = clientes.find(c => c.id === formData.clienteId);
      const selectedVehiculo = vehiculos.find(v => v.id === formData.vehiculoId);
      const selectedMecanico = mecanicos.find(m => m.id === formData.usuarioId);
      const selectedTipoServicio = tiposServicio.find(t => t.id === formData.tipoServicioId);

      if (!selectedCliente || !selectedVehiculo || !selectedMecanico || !selectedTipoServicio) {
        toast.error('Faltan datos requeridos');
        return;
      }

      // Validar fecha estimada
      const fechaEstimada = new Date(formData.fechaEstimada);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaEstimada <= hoy) {
        toast.error('La fecha estimada debe ser futura');
        return;
      }

      // PASO 1: Crear orden con CreateOrdenServicioDto (SIN AutoMapper error)
      const ordenSimple: CreateOrdenServicioDto = {
        vehiculoId: formData.vehiculoId,
        tipoServicioId: formData.tipoServicioId,
        usuarioId: formData.usuarioId,
        fechaIngreso: new Date().toISOString(),
        fechaEstimada: new Date(formData.fechaEstimada).toISOString(),
      };

      console.log('📋 Creando orden con CreateOrdenServicioDto (SIN AutoMapper error):', ordenSimple);
      console.log('🔍 JSON enviado al backend:', JSON.stringify(ordenSimple, null, 2));
      
      const ordenCreada = await ordenesAPI.create(ordenSimple);
      console.log('✅ Orden creada exitosamente:', ordenCreada);
      
      // PASO 2: Crear detalles de repuestos por separado (si los hay)
      if (formData.detalleOrdenes.length > 0) {
        console.log('📦 Creando detalles de repuestos...');
        
        for (const detalle of formData.detalleOrdenes) {
          const detalleDto: CreateDetalleOrdenDto = {
            ordenServicioId: ordenCreada.id,
            repuestoId: detalle.repuestoId,
            cantidad: detalle.cantidad,
            precioTotal: detalle.precioTotal,
          };
          
          try {
            await ordenesAPI.createDetalle(detalleDto);
            console.log(`✅ Detalle creado: ${detalle.repuestoNombre}`);
          } catch (detalleError) {
            console.warn(`⚠️ Error creando detalle ${detalle.repuestoNombre}:`, detalleError);
            // Continuar con los demás detalles
          }
        }
      }
      
      toast.success('¡Orden de servicio creada exitosamente!');
      
      // Reset form
      setFormData({
        clienteId: 0,
        vehiculoId: 0,
        tipoServicioId: 0,
        usuarioId: 0,
        fechaEstimada: '',
        detalleOrdenes: [],
      });
      setStep(1);
      setVehiculos([]);
      
    } catch (error: any) {
      console.error('❌ Error creando orden:', error);
      console.error('❌ Detalles del error:', error.response?.data);
      console.error('❌ Status del error:', error.response?.status);
      
      // Manejo específico del error 500 de AutoMapper
      if (error.response?.status === 500) {
        if (error.response?.data?.includes('AutoMapper')) {
          toast.error('Error de AutoMapper en el backend. El controlador necesita usar CreateOrdenServicioDto.');
          console.error('🔥 SOLUCIÓN BACKEND NECESARIA:');
          console.error('   1. Cambiar el parámetro del controlador POST de OrdenServicioDto a CreateOrdenServicioDto');
          console.error('   2. O configurar AutoMapper para mapear CreateOrdenServicioDto -> OrdenServicio');
          console.error('   3. O crear endpoint POST /api/OrdenServicio/simple que reciba CreateOrdenServicioDto');
        } else {
          toast.error('Error interno del servidor. Verifica la configuración del backend.');
        }
      } else if (error.response?.status === 400) {
        toast.error('Datos inválidos. Verifica que todos los campos estén correctos.');
      } else {
        toast.error('Error al crear la orden: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchCliente.toLowerCase()) ||
    cliente.documento.includes(searchCliente) ||
    cliente.correo.toLowerCase().includes(searchCliente.toLowerCase())
  );

  const filteredRepuestos = repuestos.filter(repuesto =>
    repuesto.nombre.toLowerCase().includes(searchRepuesto.toLowerCase()) ||
    repuesto.codigo.toLowerCase().includes(searchRepuesto.toLowerCase())
  ).filter(repuesto => repuesto.stock > 0); // Solo mostrar repuestos con stock

  const totalOrden = formData.detalleOrdenes.reduce((sum, detalle) => sum + detalle.precioTotal, 0);

  const canProceedToStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 2:
        return formData.clienteId > 0;
      case 3:
        return formData.vehiculoId > 0;
      case 4:
        return formData.usuarioId > 0 && formData.fechaEstimada !== '' && formData.tipoServicioId > 0;
      default:
        return true;
    }
  };

  if (loading && step === 1) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando datos...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white neon-text">
            Crear Orden de Servicio
          </h1>
          <p className="text-white/70 mt-2">
            Gestión completa de órdenes de servicio con repuestos
          </p>
        </div>
      </div>

      {/* Debug Info */}
      <Card variant="glass" className="p-4 bg-blue-500/10 border-blue-500/20">
        <h3 className="text-blue-300 font-semibold mb-2">🔧 Estado de Carga de Datos:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-200">Clientes:</span>
            <span className={`ml-2 font-bold ${clientes.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {clientes.length}
            </span>
          </div>
          <div>
            <span className="text-blue-200">Repuestos:</span>
            <span className={`ml-2 font-bold ${repuestos.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {repuestos.length}
            </span>
          </div>
          <div>
            <span className="text-blue-200">Mecánicos (SOLO ID=2):</span>
            <span className={`ml-2 font-bold ${mecanicos.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {mecanicos.length}
            </span>
          </div>
          <div>
            <span className="text-blue-200">Tipos Servicio:</span>
            <span className={`ml-2 font-bold ${tiposServicio.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {tiposServicio.length}
            </span>
          </div>
        </div>
        {mecanicos.length > 0 && (
          <div className="mt-2">
            <span className="text-blue-200">Mecánicos disponibles (SOLO rolUsuarioId = 2):</span>
            <span className="ml-2 text-green-400">
              {mecanicos.map(m => `${m.nombre} (ID: ${m.id}, Rol: ${m.rolUsuarioId})`).join(', ')}
            </span>
          </div>
        )}
        {mecanicos.length === 0 && (
          <div className="mt-2 p-2 bg-red-500/20 rounded">
            <span className="text-red-400">⚠️ No se encontraron mecánicos con rolUsuarioId = 2</span>
          </div>
        )}
      </Card>

      {/* Wizard Steps */}
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step >= stepNumber 
                      ? 'bg-primary-electric text-black' 
                      : 'bg-white/20 text-white'
                  }`}>
                    {step > stepNumber ? <CheckCircle className="w-5 h-5" /> : stepNumber}
                  </div>
                  <span className={`font-medium ${
                    step >= stepNumber ? 'text-white' : 'text-white/60'
                  }`}>
                    {stepNumber === 1 && 'Cliente'}
                    {stepNumber === 2 && 'Vehículo'}
                    {stepNumber === 3 && 'Servicio'}
                    {stepNumber === 4 && 'Confirmación'}
                  </span>
                </div>
                {stepNumber < 4 && <div className="w-12 h-0.5 bg-white/30" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-primary-electric" />
              Seleccionar Cliente
            </h2>

            {clientes.length === 0 ? (
              <Card variant="glass" className="p-8 text-center border-accent-orange/30">
                <AlertCircle className="w-12 h-12 text-accent-orange mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-accent-orange mb-2">
                  No hay clientes registrados
                </h3>
                <p className="text-white/70 mb-4">
                  Debes crear al menos un cliente antes de crear órdenes de servicio.
                </p>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/admin/clientes'}
                >
                  Ir a Gestión de Clientes
                </Button>
              </Card>
            ) : (
              <>
                <Input
                  label="Buscar Cliente"
                  placeholder="Nombre, documento o correo..."
                  value={searchCliente}
                  onChange={(e) => setSearchCliente(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                  variant="glass"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredClientes.map((cliente) => (
                    <motion.div
                      key={cliente.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleClienteSelect(cliente)}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-primary-electric/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{cliente.nombre}</h3>
                          <p className="text-white/60 text-sm">{cliente.documento}</p>
                          <p className="text-white/60 text-sm">{cliente.correo}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Car className="w-6 h-6 text-primary-electric" />
                Seleccionar Vehículo
              </h2>
              <Button variant="secondary" onClick={() => setStep(1)}>
                <X className="w-4 h-4 mr-1" />
                Cambiar Cliente
              </Button>
            </div>

            {vehiculos.length === 0 ? (
              <Card variant="glass" className="p-8 text-center border-accent-orange/30">
                <AlertCircle className="w-12 h-12 text-accent-orange mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-accent-orange mb-2">
                  El cliente no tiene vehículos registrados
                </h3>
                <p className="text-white/70 mb-4">
                  Debes registrar al menos un vehículo para este cliente.
                </p>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/admin/vehiculos'}
                >
                  Ir a Gestión de Vehículos
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehiculos.map((vehiculo) => (
                  <motion.div
                    key={vehiculo.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleVehiculoSelect(vehiculo)}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-primary-electric/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {vehiculo.marca} {vehiculo.modelo}
                        </h3>
                        <p className="text-white/60 text-sm">{vehiculo.year}</p>
                        <p className="text-white/60 text-sm">{vehiculo.kilometraje.toLocaleString()} km</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Package className="w-6 h-6 text-primary-electric" />
                Configurar Servicio
              </h2>
              <Button variant="secondary" onClick={() => setStep(2)}>
                <X className="w-4 h-4 mr-1" />
                Cambiar Vehículo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Tipo de Servicio *
                </label>
                <select
                  value={formData.tipoServicioId}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipoServicioId: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg border bg-white/10 border-white/20 text-white focus:border-primary-electric focus:ring-2 focus:ring-primary-electric/50"
                  required
                >
                  <option value={0}>Seleccionar tipo</option>
                  {tiposServicio.map((tipo) => (
                    <option key={tipo.id} value={tipo.id} className="bg-gray-800">
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Mecánico Asignado * (SOLO rolUsuarioId = 2)
                </label>
                <select
                  value={formData.usuarioId}
                  onChange={(e) => setFormData(prev => ({ ...prev, usuarioId: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg border bg-white/10 border-white/20 text-white focus:border-primary-electric focus:ring-2 focus:ring-primary-electric/50"
                  required
                >
                  <option value={0}>Seleccionar mecánico</option>
                  {mecanicos.map((mecanico) => (
                    <option key={mecanico.id} value={mecanico.id} className="bg-gray-800">
                      {mecanico.nombre} - {mecanico.correo} (Rol: {mecanico.rolUsuarioId})
                    </option>
                  ))}
                </select>
                {mecanicos.length === 0 && (
                  <p className="text-red-400 text-sm mt-1">
                    ⚠️ No hay mecánicos disponibles. Verifica que existan usuarios con rolUsuarioId = 2.
                  </p>
                )}
              </div>

              <Input
                label="Fecha Estimada de Entrega *"
                type="date"
                value={formData.fechaEstimada}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaEstimada: e.target.value }))}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Mínimo mañana
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Repuestos (Opcional)</h3>
                <Button
                  variant="primary"
                  onClick={() => setIsRepuestoModalOpen(true)}
                  disabled={repuestos.length === 0}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar Repuesto
                </Button>
              </div>

              {formData.detalleOrdenes.length > 0 ? (
                <div className="space-y-3">
                  {formData.detalleOrdenes.map((detalle, index) => {
                    const repuesto = repuestos.find(r => r.id === detalle.repuestoId);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{detalle.repuestoNombre}</h4>
                          <p className="text-white/60 text-sm">Cantidad: {detalle.cantidad}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-accent-green font-medium">
                            ${detalle.precioTotal.toLocaleString()}
                          </span>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveRepuesto(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-xl font-bold text-accent-green">
                      ${totalOrden.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-white/60">
                  No hay repuestos agregados (opcional)
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => setStep(4)}
                disabled={!canProceedToStep(4)}
                className="flex-1"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Save className="w-6 h-6 text-primary-electric" />
              Confirmación
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="glass" className="p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Resumen de la Orden</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Cliente:</span>
                    <span className="text-white">
                      {clientes.find(c => c.id === formData.clienteId)?.nombre}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Vehículo:</span>
                    <span className="text-white">
                      {vehiculos.find(v => v.id === formData.vehiculoId)?.marca} {vehiculos.find(v => v.id === formData.vehiculoId)?.modelo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Tipo de Servicio:</span>
                    <span className="text-white">
                      {tiposServicio.find(t => t.id === formData.tipoServicioId)?.nombre}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Mecánico:</span>
                    <span className="text-white">
                      {mecanicos.find(m => m.id === formData.usuarioId)?.nombre}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Fecha Estimada:</span>
                    <span className="text-white">
                      {new Date(formData.fechaEstimada).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-white/10">
                    <span className="text-white">Total Repuestos:</span>
                    <span className="text-accent-green">${totalOrden.toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              {formData.detalleOrdenes.length > 0 && (
                <Card variant="glass" className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Repuestos</h3>
                  <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                    {formData.detalleOrdenes.map((detalle, index) => {
                      return (
                        <div key={index} className="flex justify-between">
                          <span className="text-white/80">{detalle.repuestoNombre} x{detalle.cantidad}</span>
                          <span className="text-accent-green">${detalle.precioTotal.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => setStep(3)}
                className="flex-1"
                disabled={submitting}
              >
                Volver
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={submitting}
                disabled={submitting}
                className="flex-1"
              >
                Crear Orden
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal para agregar repuestos */}
      <Modal
        isOpen={isRepuestoModalOpen}
        onClose={() => setIsRepuestoModalOpen(false)}
        title="Agregar Repuesto"
      >
        <div className="space-y-4">
          <Input
            placeholder="Buscar repuesto..."
            value={searchRepuesto}
            onChange={(e) => setSearchRepuesto(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />

          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredRepuestos.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                {repuestos.length === 0 
                  ? 'No hay repuestos registrados'
                  : 'No hay repuestos disponibles con stock'
                }
              </div>
            ) : (
              filteredRepuestos.map((repuesto) => (
                <RepuestoItem
                  key={repuesto.id}
                  repuesto={repuesto}
                  onAdd={handleAddRepuesto}
                />
              ))
            )}
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

// Componente para item de repuesto
interface RepuestoItemProps {
  repuesto: RepuestoResponse;
  onAdd: (repuesto: RepuestoResponse, cantidad: number) => void;
}

const RepuestoItem: React.FC<RepuestoItemProps> = ({ repuesto, onAdd }) => {
  const [cantidad, setCantidad] = useState(1);

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
      <div>
        <h4 className="text-white font-medium">{repuesto.nombre}</h4>
        <p className="text-white/60 text-sm">${repuesto.precioUnitario.toLocaleString()}</p>
        <p className="text-white/60 text-sm">Stock: {repuesto.stock}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={repuesto.stock}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="w-16 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-center"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAdd(repuesto, cantidad)}
          disabled={cantidad > repuesto.stock || cantidad < 1}
        >
          Agregar
        </Button>
      </div>
    </div>
  );
};

export default CrearOrden;