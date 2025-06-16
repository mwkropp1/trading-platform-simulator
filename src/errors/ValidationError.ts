import { ApiError } from './ApiError';

interface ValidationDetails {
  field: string;
  message: string;
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public readonly details: ValidationDetails[]
  ) {
    super(message, 400, 'VALIDATION_ERROR');
  }

  static fromZodError(zodError: any): ValidationError {
    const details = zodError.errors.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return new ValidationError('Validation failed', details);
  }

  static field(message: string, field: string): ValidationError {
    return new ValidationError(message, [
      {
        field,
        message,
      },
    ]);
  }
}
