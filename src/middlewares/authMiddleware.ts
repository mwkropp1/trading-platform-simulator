import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

enum AuthErrorType {
  MISSING_TOKEN = 'MISSING_TOKEN',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_TOKEN = 'INVALID_TOKEN',
}

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
      console.error({
        type: AuthErrorType.INVALID_FORMAT,
        message: 'Authorization header missing or invalid format',
        path: req.path,
        method: req.method,
        headers: req.headers,
      });

      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error({
        type: AuthErrorType.MISSING_TOKEN,
        message: 'Token not provided in Authorization header',
        path: req.path,
        method: req.method,
      });

      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    req.user = verifyToken(token);
    next();
  } catch (error) {
    console.error({
      type: AuthErrorType.INVALID_TOKEN,
      message: error instanceof Error ? error.message : 'Unknown error',
      path: req.path,
      method: req.method,
      error: error,
    });

    res.status(401).json({ error: 'Unauthorized' });
  }
};
