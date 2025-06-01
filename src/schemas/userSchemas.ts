import { z } from 'zod';

export const CreateUserSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password_hash: z.string().min(1),
  role: z.enum(['user', 'admin']).default('user'),
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

export const UpdateUserSchema = CreateUserSchema.partial();

export const UserParamsSchema = z.object({
  id: z.string().uuid(),
});

export const UserResponseSchema = CreateUserSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
}).omit({ password_hash: true });

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
