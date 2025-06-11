import { Request, Response } from 'express';
import { LoginSchema, RegisterSchema } from '../schemas/authSchemas';
import { AuthService } from '../services/authService';
import { UserResponseSchema } from '../schemas/userSchemas';
import type { AuthRequest } from '../middlewares/authMiddleware';
import { z } from 'zod';

export class AuthController {
  static register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password } = RegisterSchema.parse(req.body);

      const { user, token } = await AuthService.registerUser(username, email, password);

      const safeUser = UserResponseSchema.parse(user);
      res.status(201).json({ user: safeUser, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const { user, token } = await AuthService.loginUser(email, password);

      const safeUser = UserResponseSchema.parse(user);
      res.json({ user: safeUser, token });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const user = await AuthService.getCurrentUser(req.user.id);
      const safeUser = UserResponseSchema.parse(user);
      res.json(safeUser);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
