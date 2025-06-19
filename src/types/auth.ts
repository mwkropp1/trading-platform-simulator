import { z } from 'zod';
import { registerSchema, loginSchema, userRoleSchema } from '../schemas/auth.schema';

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
