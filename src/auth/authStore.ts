import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { decodeToken, isTokenValid } from '../utils/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User, role: UserRole) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,

      login: (token: string, user: User, role: UserRole) => {
        set({
          user,
          token,
          role,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
      },

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        });
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkAuth: () => {
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('userRole') as UserRole;
        
        if (!token || !role) {
          get().logout();
          return false;
        }

        if (!isTokenValid(token)) {
          get().logout();
          return false;
        }

        const decoded = decodeToken(token);
        if (!decoded) {
          get().logout();
          return false;
        }

        // Si el token es válido pero no tenemos el usuario en el store, lo establecemos
        if (!get().isAuthenticated) {
          set({
            token,
            role,
            isAuthenticated: true,
            user: {
              id: 0, // Se actualizará con datos reales del backend
              rolUsuarioId: 0,
              rolUsuarioNombre: role,
              nombre: decoded.email,
              correo: decoded.email,
              documento: '',
              telefono: '',
            },
          });
        }

        return true;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);