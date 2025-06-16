import { ApiError } from './ApiError';

export class DatabaseError extends ApiError {
  static queryFailed(error: Error): DatabaseError {
    return new DatabaseError('Database query failed', 500, 'DATABASE_ERROR', {
      originalError: error.message,
    });
  }

  static notFound(resource: string): DatabaseError {
    return new DatabaseError(`${resource} not found`, 404, 'NOT_FOUND');
  }

  static duplicate(field: string): DatabaseError {
    return new DatabaseError(`Duplicate entry for ${field}`, 409, 'DUPLICATE_ENTRY', { field });
  }
}
