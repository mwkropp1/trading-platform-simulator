import { Request, Response } from 'express';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { AuthService } from '../services/authService';
import { userResponseSchema } from '../schemas/user.schema';
import type { AuthRequest } from '../middlewares/authMiddleware';
import { z } from 'zod';
import { AuthError } from '../errors';

export class AuthController {
  static register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password, role } = registerSchema.parse(req.body);
      const { user, token } = await AuthService.registerUser(username, email, password, role);
      const safeUser = userResponseSchema.parse(user);
      res.status(201).json({ user: safeUser, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          code: 'VALIDATION_ERROR',
          errors: error.errors,
        });
        return;
      }
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({
          code: error.code,
          message: error.message,
        });
        return;
      }
      res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      });
    }
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const { user, token } = await AuthService.loginUser(email, password);
      const safeUser = userResponseSchema.parse(user);
      res.json({ user: safeUser, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          code: 'VALIDATION_ERROR',
          errors: error.errors,
        });
        return;
      }
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({
          code: error.code,
          message: error.message,
        });
        return;
      }
      res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      });
    }
  };

  static getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw AuthError.unauthorized();
      }

      const user = await AuthService.getCurrentUser(req.user.id);
      const safeUser = userResponseSchema.parse(user);
      res.json(safeUser);
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({
          code: error.code,
          message: error.message,
        });
        return;
      }
      res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      });
    }
  };
}
