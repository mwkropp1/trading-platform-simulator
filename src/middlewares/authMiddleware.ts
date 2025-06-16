import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthError, ApiError } from '../errors';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      throw AuthError.unauthorized('Invalid authorization header format');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw AuthError.unauthorized('No token provided');
    }

    try {
      req.user = verifyToken(token);
      next();
    } catch (error) {
      throw AuthError.invalidToken();
    }
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
      });
      return;
    }

    const apiError = ApiError.internal('Authentication failed');
    res.status(apiError.statusCode).json({
      code: apiError.code,
      message: apiError.message,
    });
  }
};
