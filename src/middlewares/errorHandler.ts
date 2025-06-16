import { Request, Response, NextFunction } from 'express';
import { ApiError, ValidationError } from '../errors';
import { ZodError } from 'zod';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('Error:', {
    path: req.path,
    method: req.method,
    error: error instanceof Error ? error.message : 'Unknown error',
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationError = ValidationError.fromZod(error);
    res.status(validationError.statusCode).json({
      code: validationError.code,
      message: validationError.message,
      details: validationError.validationDetails,
    });
    return;
  }

  // Handle all API errors (includes Auth, Validation, Database errors)
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    });
    return;
  }

  // Handle unexpected errors
  const internalError = ApiError.internal();
  res.status(internalError.statusCode).json({
    code: internalError.code,
    message: internalError.message,
  });
}
