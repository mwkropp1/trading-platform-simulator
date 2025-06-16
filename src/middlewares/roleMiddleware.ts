import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { AuthError } from '../errors';

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user?.role) {
        throw AuthError.unauthorized('User role not found');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw AuthError.forbidden(`Access restricted to ${allowedRoles.join(', ')}`);
      }

      next();
    } catch (error) {
      if (error instanceof AuthError) {
        console.error('Role middleware error:', {
          path: req.path,
          method: req.method,
          userRole: req.user?.role,
          requiredRoles: allowedRoles,
          error: error.message,
        });

        res.status(error.statusCode).json({
          code: error.code,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };
};
