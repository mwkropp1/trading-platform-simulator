import { Request, Response, NextFunction } from 'express';
import { ApiError, ValidationError } from '../errors';
import { ZodError } from 'zod';

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', {
    path: req.path,
    method: req.method,
    error: error instanceof Error ? error.message : 'Unknown error',
  });

  if (error instanceof ZodError) {
    const validationError = ValidationError.fromZod(error);
    res.status(validationError.statusCode).json({
      code: validationError.code,
      message: validationError.message,
      details: validationError.validationDetails,
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    });
    return;
  }

  const internalError = ApiError.internal();
  res.status(internalError.statusCode).json({
    code: internalError.code,
    message: internalError.message,
  });
}
