import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Wrench, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';
import { authAPI } from '../api/auth';
import { decodeToken } from '../utils/auth';
import { USER_ROLES } from '../utils/constants';
import { UserRole } from '../types';
import ParticleBackground from '../components/layout/ParticleBackground';
import { loginParticleConfig } from '../animations/particleConfig';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    correo: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔐 Intentando login con:', credentials);
      console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL);
      
      const response = await authAPI.login(credentials);
      const { token } = response;

      console.log('✅ Login exitoso, token recibido');

      // Decodificar token para obtener información del usuario
      const decoded = decodeToken(token);
      if (!decoded) {
        throw new Error('Token inválido');
      }

      // Determinar rol basado en el email (esto debería venir del backend)
      let role: UserRole = 'Recepcionista'; // Default
      if (decoded.email.includes('admin')) {
        role = 'Admin';
      } else if (decoded.email.includes('mecanico')) {
        role = 'Mecánico';
      }

      // Crear objeto usuario temporal
      const user = {
        id: 1,
        rolUsuarioId: 1,
        rolUsuarioNombre: role,
        nombre: decoded.email.split('@')[0],
        correo: decoded.email,
        documento: '',
        telefono: '',
      };

      // Guardar en store
      login(token, user, role);

      // Mostrar mensaje de éxito
      toast.success(`¡Bienvenido, ${user.nombre}!`, {
        duration: 3000,
        icon: '🚀',
      });

      // Redirigir según el rol
      const roleRedirects: Record<UserRole, string> = {
        Admin: '/admin/dashboard',
        Recepcionista: '/recepcion/crear-orden',
        Mecánico: '/mecanico/ordenes',
      };

      navigate(roleRedirects[role] || from, { replace: true });

    } catch (error: any) {
      console.error('❌ Error en login:', error);
      
      // Manejo específico de errores de red
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('🔥 No se puede conectar al servidor. Verifica que el backend esté ejecutándose en http://localhost:5105');
      } else if (error.response?.status === 401) {
        toast.error('🔐 Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (error.response?.status === 400) {
        toast.error('📝 Datos de login inválidos. Verifica el formato de los campos.');
      } else {
        toast.error(
          error.response?.data?.message || 
          'Error al iniciar sesión. Verifica tus credenciales.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <ParticleBackground config={loginParticleConfig} />
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-deep via-black to-primary-deep opacity-90" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Wrench className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white neon-text mb-2">
            {import.meta.env.VITE_APP_NAME}
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-primary-electric" />
            Sistema de Gestión Futurista
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass rounded-2xl p-8 border border-white/20 shadow-glass"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Correo Electrónico"
              type="email"
              name="correo"
              value={credentials.correo}
              onChange={handleInputChange}
              placeholder="admin@taller.com"
              icon={<Mail className="w-5 h-5" />}
              variant="glass"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              variant="glass"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <p className="text-sm text-white/60 mb-2">Credenciales de prueba:</p>
            <div className="text-xs text-white/80 space-y-1">
              <div>📧 admin@taller.com</div>
              <div>🔑 hashedpassword1</div>
            </div>
          </motion.div>

          {/* Debug Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
          >
            <p className="text-xs text-blue-300 mb-1">🔧 Debug Info:</p>
            <div className="text-xs text-blue-200 space-y-1">
              <div>API URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5105'}</div>
              <div>Endpoint: /api/auth/login</div>
              <div>CORS: Configurado para localhost:5173</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-white/50 text-sm"
        >
          v{import.meta.env.VITE_APP_VERSION} • Powered by React & TypeScript
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;