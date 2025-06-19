import { z } from 'zod';
import {
  userSchema,
  createUserSchema,
  updateUserSchema,
  userResponseSchema,
  userParamsSchema,
} from '../schemas/user.schema';

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserParams = z.infer<typeof userParamsSchema>;
