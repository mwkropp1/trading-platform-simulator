import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      console.error({
        type: 'INSUFFICIENT_PERMISSIONS',
        message: 'User does not have required role',
        userRole: req.user?.role,
        requiredRoles: allowedRoles,
        path: req.path,
        method: req.method,
      });

      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    next();
  };
};
