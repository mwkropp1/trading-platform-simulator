import { ApiError } from './ApiError';
import { z } from 'zod';

interface ValidationDetails {
  field: string;
  message: string;
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    statusCode: number = 400,
    code: string = 'VALIDATION_ERROR',
    public readonly validationDetails: ValidationDetails[]
  ) {
    super(message, statusCode, code, { validationDetails });
    this.name = 'ValidationError';
  }

  static field(field: string, message: string): ValidationError {
    return new ValidationError('Validation failed', 400, 'VALIDATION_ERROR', [{ field, message }]);
  }

  static fromZod(error: z.ZodError): ValidationError {
    const validationDetails: ValidationDetails[] = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return new ValidationError('Validation failed', 400, 'VALIDATION_ERROR', validationDetails);
  }

  // Helper method to access validation details
  getDetails(): ValidationDetails[] {
    return this.validationDetails;
  }
}
