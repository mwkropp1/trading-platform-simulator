import { ApiError } from './ApiError';

export class AuthError extends ApiError {
  constructor(message: string, code: string = 'AUTH_ERROR', statusCode: number = 401) {
    super(message, statusCode, code);
    this.name = 'AuthError';
  }

  static invalidCredentials(): AuthError {
    return new AuthError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
  }

  static userExists(field: 'email' | 'username'): AuthError {
    return new AuthError(`User with this ${field} already exists`, 'USER_EXISTS', 409);
  }

  static unauthorized(message: string = 'Authentication required'): AuthError {
    return new AuthError(message, 'UNAUTHORIZED', 401);
  }

  static forbidden(message: string = 'Access forbidden'): AuthError {
    return new AuthError(message, 'FORBIDDEN', 403);
  }

  static tokenExpired(): AuthError {
    return new AuthError('Token has expired', 'TOKEN_EXPIRED', 401);
  }

  static invalidToken(): AuthError {
    return new AuthError('Invalid token', 'INVALID_TOKEN', 401);
  }
}
