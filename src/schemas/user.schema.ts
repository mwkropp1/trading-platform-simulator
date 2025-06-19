import { z } from 'zod';
import { userRoleSchema, emailSchema, usernameSchema } from './auth.schema';

export const userBaseSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  role: userRoleSchema.default('user'),
  cash_balance: z
    .union([
      z
        .string()
        .regex(/^\d+(\.\d{0,2})?$/)
        .transform(Number),
      z.number().positive(),
    ])
    .optional()
    .default(100000),
});

export const createUserSchema = userBaseSchema.extend({
  password_hash: z.string().length(60, 'Invalid password hash format'),
});

export const userSchema = createUserSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const updateUserSchema = createUserSchema.partial();

export const userResponseSchema = userSchema.omit({
  password_hash: true,
});

export const userParamsSchema = z.object({
  id: z.string().uuid(),
});
