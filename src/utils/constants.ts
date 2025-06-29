export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
  },
  CLIENTE: '/api/Cliente',
  VEHICULO: '/api/Vehiculo',
  ORDEN_SERVICIO: '/api/OrdenServicio',
  FACTURA: '/api/Factura',
  REPUESTO: '/api/Repuesto',
  USUARIO: '/api/Usuario',
  AUDITORIA: '/api/Auditoria',
  TIPO_SERVICIO: '/api/TipoServicio',
  ROL_USUARIO: '/api/RolUsuario',
};

export const USER_ROLES = {
  ADMIN: 'Admin',
  RECEPCIONISTA: 'Recepcionista',
  MECANICO: 'Mecánico',
} as const;

export const ORDEN_ESTADOS = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_NUMBER: 1,
};

export const VALIDATION_RULES = {
  DOCUMENTO: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 10,
    PATTERN: /^\d{8,10}$/,
  },
  TELEFONO: {
    PATTERN: /^\+?57\d{10}$/,
  },
  VIN: {
    LENGTH: 17,
    PATTERN: /^[A-HJ-NPR-Z0-9]{17}$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  YEAR: {
    MIN: 1990,
    MAX: new Date().getFullYear() + 1,
  },
};

export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

export const TOAST_DURATION = {
  SHORT: 3000,
  NORMAL: 5000,
  LONG: 8000,
};

export const COLORS = {
  PRIMARY: {
    ELECTRIC: '#00F5FF',
    DEEP: '#0A0E27',
  },
  ACCENT: {
    ORANGE: '#FF6B35',
    GREEN: '#39FF14',
    PURPLE: '#B537F2',
  },
  STATUS: {
    SUCCESS: '#39FF14',
    WARNING: '#FF6B35',
    ERROR: '#FF4444',
    INFO: '#00F5FF',
  },
};

export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};