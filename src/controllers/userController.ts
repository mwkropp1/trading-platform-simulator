import { Request, Response, NextFunction } from 'express';
import { getUserById, insertUser } from '../repositories/userRepository';
import { CreateUserSchema, UserParamsSchema, UserResponseSchema } from '../schemas/userSchemas';
import { z } from 'zod';

export class UserController {
  static getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = UserParamsSchema.parse({ id: req.params.id });
      const user = await getUserById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const safeUser = UserResponseSchema.parse(user);
      res.json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      console.error('Error fetching user: ', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      const newUser = await insertUser(validatedData);
      const safeUser = UserResponseSchema.parse(newUser);
      res.status(201).json(safeUser);
    } catch (error) {
      next(error);
    }
  };
}
