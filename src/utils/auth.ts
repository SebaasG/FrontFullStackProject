// utils/auth.ts - Versión mejorada
export interface DecodedToken {
  email: string;
  exp: number;
  iss?: string;
  aud?: string;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    // Validar formato básico del token
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token inválido: formato incorrecto');
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    
    // Validar que tenga los campos requeridos
    if (!payload.exp) {
      console.error('Token inválido: sin fecha de expiración');
      return null;
    }

    return {
      email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] 
             || payload.name 
             || payload.email,
      exp: payload.exp,
      iss: payload.iss,
      aud: payload.aud
    };
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded) {
      return false;
    }

    // Verificar si el token ha expirado
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error validando token:', error);
    return false;
  }
};