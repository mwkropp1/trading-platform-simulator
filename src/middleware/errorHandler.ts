import { Request, Response, NextFunction } from 'express';
import { ApiError, ValidationError, AuthError, DatabaseError } from '../errors';
import { ZodError } from 'zod';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: error.errors,
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
      ...(error instanceof ValidationError && { field: ValidationError.field }),
    });
    return;
  }

  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
  });
}
