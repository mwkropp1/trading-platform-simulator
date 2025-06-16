import { ApiError } from './ApiError';

export class DatabaseError extends ApiError {
  constructor(message: string, originalError?: Error) {
    super(message, 500, 'DATABASE_ERROR', { originalError: originalError?.message });
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class DuplicateError extends ApiError {
  constructor(field: string) {
    super(`Duplicate entry for ${field}`, 409, 'DUPLICATE_ENTRY');
  }
}
