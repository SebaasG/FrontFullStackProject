import { VALIDATION_RULES } from './constants';

export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL.PATTERN.test(email);
};

export const validateDocument = (document: string): boolean => {
  return VALIDATION_RULES.DOCUMENTO.PATTERN.test(document);
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.startsWith('57') && cleaned.length === 12);
};

export const validateVIN = (vin: string): boolean => {
  return VALIDATION_RULES.VIN.PATTERN.test(vin.toUpperCase());
};

export const validateYear = (year: number): boolean => {
  return year >= VALIDATION_RULES.YEAR.MIN && year <= VALIDATION_RULES.YEAR.MAX;
};

export const validateRequired = (value: string | number): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validatePositiveNumber = (value: number): boolean => {
  return value > 0;
};

export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getValidationMessage = (field: string, rule: string): string => {
  const messages: Record<string, Record<string, string>> = {
    email: {
      required: 'El correo electrónico es requerido',
      invalid: 'El correo electrónico no es válido',
    },
    document: {
      required: 'El documento es requerido',
      invalid: 'El documento debe tener entre 8 y 10 dígitos',
    },
    phone: {
      required: 'El teléfono es requerido',
      invalid: 'El teléfono no es válido',
    },
    vin: {
      required: 'El VIN es requerido',
      invalid: 'El VIN debe tener 17 caracteres alfanuméricos',
    },
    year: {
      required: 'El año es requerido',
      invalid: `El año debe estar entre ${VALIDATION_RULES.YEAR.MIN} y ${VALIDATION_RULES.YEAR.MAX}`,
    },
    name: {
      required: 'El nombre es requerido',
      minLength: 'El nombre debe tener al menos 2 caracteres',
    },
    password: {
      required: 'La contraseña es requerida',
      weak: 'La contraseña no cumple con los requisitos de seguridad',
    },
  };
  
  return messages[field]?.[rule] || 'Campo inválido';
};