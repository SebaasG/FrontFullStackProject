import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, User, Shield, Mail, Phone, FileText } from 'lucide-react';
import { usuariosAPI } from '../../api/usuarios';
import { UsuarioResponse, UsuarioRequest } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { fadeInUp, listVariants, listItemVariants } from '../../animations/pageTransitions';
import toast from 'react-hot-toast';

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<UsuarioResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<UsuarioRequest>({
    rolUsuarioId: 1,
    nombre: '',
    correo: '',
    password: '',
    documento: '',
    telefono: '',
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando usuarios...');
      
      const response = await usuariosAPI.getAll();
      console.log('📦 Respuesta completa usuarios:', response);
      
      // Manejar diferentes estructuras de respuesta
      let usuariosData: UsuarioResponse[] = [];
      
      if (Array.isArray(response)) {
        usuariosData = response;
      } else if (response.data && Array.isArray(response.data)) {
        usuariosData = response.data;
      } else if (response.items && Array.isArray(response.items)) {
        usuariosData = response.items;
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', response);
        usuariosData = [];
      }
      
      console.log('✅ Usuarios procesados:', usuariosData);
      setUsuarios(usuariosData);
      
      if (usuariosData.length === 0) {
        toast.info('No hay usuarios registrados');
      } else {
        console.log(`✅ ${usuariosData.length} usuarios cargados correctamente`);
      }
    } catch (error: any) {
      console.error('❌ Error cargando usuarios:', error);
      toast.error('Error al cargar usuarios: ' + (error.message || 'Error desconocido'));
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    
    if (!formData.correo.trim()) {
      toast.error('El correo es requerido');
      return;
    }
    
    if (!formData.documento.trim()) {
      toast.error('El documento es requerido');
      return;
    }
    
    if (!formData.telefono.trim()) {
      toast.error('El teléfono es requerido');
      return;
    }
    
    if (!editingUsuario && !formData.password.trim()) {
      toast.error('La contraseña es requerida');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      toast.error('El formato del correo no es válido');
      return;
    }
    
    // Validar documento (solo números, 8-10 dígitos)
    const documentoRegex = /^[0-9]{8,10}$/;
    if (!documentoRegex.test(formData.documento)) {
      toast.error('El documento debe tener entre 8 y 10 dígitos');
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('💾 Guardando usuario:', formData);
      
      if (editingUsuario) {
        await usuariosAPI.update(editingUsuario.id, formData);
        toast.success('Usuario actualizado correctamente');
      } else {
        await usuariosAPI.create(formData);
        toast.success('Usuario creado correctamente');
      }
      
      setIsModalOpen(false);
      setEditingUsuario(null);
      resetForm();
      await loadUsuarios(); // Recargar la lista
    } catch (error: any) {
      console.error('❌ Error guardando usuario:', error);
      if (error.response?.status === 409) {
        toast.error('Ya existe un usuario con ese correo o documento');
      } else {
        toast.error('Error al guardar usuario: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (usuario: UsuarioResponse) => {
    console.log('✏️ Editando usuario:', usuario);
    setEditingUsuario(usuario);
    setFormData({
      rolUsuarioId: usuario.rolUsuarioId,
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: '', // No mostrar password actual
      documento: usuario.documento,
      telefono: usuario.telefono,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        console.log('🗑️ Eliminando usuario:', id);
        await usuariosAPI.delete(id);
        toast.success('Usuario eliminado correctamente');
        await loadUsuarios(); // Recargar la lista
      } catch (error: any) {
        console.error('❌ Error eliminando usuario:', error);
        toast.error('Error al eliminar usuario: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      rolUsuarioId: 1,
      nombre: '',
      correo: '',
      password: '',
      documento: '',
      telefono: '',
    });
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.documento.includes(searchTerm) ||
    usuario.rolUsuarioNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        return <User className="w-4 h-4" />;
      case 'Recepcionista':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // Estadísticas
  const adminCount = usuarios.filter(u => u.rolUsuarioNombre === 'Admin').length;
  const mecanicoCount = usuarios.filter(u => u.rolUsuarioNombre === 'Mecánico').length;
  const recepcionistaCount = usuarios.filter(u => u.rolUsuarioNombre === 'Recepcionista').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white">Cargando usuarios...</span>
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
            Gestión de Usuarios
          </h1>
          <p className="text-white/70 mt-2">
            Administra usuarios del sistema ({usuarios.length} registrados)
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingUsuario(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Search */}
      <Card variant="glass" className="p-6">
        <Input
          placeholder="Buscar usuarios por nombre, correo, documento o rol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-5 h-5" />}
          variant="glass"
        />
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-electric/20 rounded-lg">
              <User className="w-6 h-6 text-primary-electric" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Usuarios</p>
              <p className="text-2xl font-bold text-white">{usuarios.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Administradores</p>
              <p className="text-2xl font-bold text-white">{adminCount}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Mecánicos</p>
              <p className="text-2xl font-bold text-white">{mecanicoCount}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <User className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Recepcionistas</p>
              <p className="text-2xl font-bold text-white">{recepcionistaCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users List */}
      {filteredUsuarios.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm 
              ? 'Intenta ajustar los términos de búsqueda'
              : 'Comienza agregando el primer usuario al sistema'
            }
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setEditingUsuario(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Primer Usuario
            </Button>
          )}
        </Card>
      ) : (
        <motion.div
          variants={listVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredUsuarios.map((usuario) => (
            <motion.div key={usuario.id} variants={listItemVariants}>
              <Card variant="glass" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{usuario.nombre}</h3>
                      <p className="text-white/60 text-sm">ID: {usuario.id}</p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs border flex items-center gap-1 ${getRoleColor(usuario.rolUsuarioNombre)}`}>
                    {getRoleIcon(usuario.rolUsuarioNombre)}
                    {usuario.rolUsuarioNombre}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary-electric" />
                    <span className="text-white/80 truncate">{usuario.correo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-accent-green" />
                    <span className="text-white/80">{usuario.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-accent-orange" />
                    <span className="text-white/80">{usuario.documento}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(usuario)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(usuario.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUsuario(null);
          resetForm();
        }}
        title={editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre Completo *"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Juan Pérez García"
              required
            />
            
            <Input
              label="Correo Electrónico *"
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              placeholder="usuario@taller.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Documento *"
              value={formData.documento}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value.replace(/\D/g, '') })}
              placeholder="12345678"
              maxLength={10}
              required
            />
            
            <Input
              label="Teléfono *"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="3001234567"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Rol *
              </label>
              <select
                value={formData.rolUsuarioId}
                onChange={(e) => setFormData({ ...formData, rolUsuarioId: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border bg-white/10 border-white/20 text-white focus:border-primary-electric focus:ring-2 focus:ring-primary-electric/50"
                required
              >
                <option value={1} className="bg-gray-800">Admin</option>
                <option value={2} className="bg-gray-800">Recepcionista</option>
                <option value={3} className="bg-gray-800">Mecánico</option>
              </select>
            </div>
            
            <Input
              label={editingUsuario ? "Nueva Contraseña (opcional)" : "Contraseña *"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required={!editingUsuario}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingUsuario(null);
                resetForm();
              }}
              className="flex-1"
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="flex-1"
              loading={submitting}
              disabled={submitting}
            >
              {editingUsuario ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default UsuariosPage;