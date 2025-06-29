import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5105',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Configuración adicional para CORS
  withCredentials: false,
});

// Request interceptor para inyectar JWT automáticamente
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('📦 Request data:', config.data);
    
    const token = localStorage.getItem('authToken');
    if (token && !config.url?.includes('/auth/login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor para manejo de errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('📦 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    console.error('❌ Error config:', error.config);
    console.error('❌ Error response:', error.response);
    
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // Manejo específico de errores de red
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('🔥 Network Error - Posibles causas:');
      console.error('1. Backend no está corriendo en http://localhost:5105');
      console.error('2. CORS no está configurado correctamente');
      console.error('3. Firewall bloqueando la conexión');
      toast.error('Error de conexión. Verifica que el backend esté corriendo y CORS configurado.');
      return Promise.reject(error);
    }

    switch (status) {
      case 401:
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        break;
      case 403:
        toast.error('No tienes permisos para realizar esta acción');
        break;
      case 404:
        toast.error('Recurso no encontrado');
        break;
      case 422:
        toast.error('Datos inválidos. Verifica la información ingresada.');
        break;
      case 500:
        toast.error('Error del servidor. Intenta más tarde.');
        break;
      default:
        if (status >= 400) {
          toast.error(message || 'Ha ocurrido un error inesperado');
        }
    }

    return Promise.reject(error);
  }
);

export default api;