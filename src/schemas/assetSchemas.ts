import { z } from 'zod';
import { AssetType } from '../types/asset';

export const CreateAssetSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .max(10)
    .transform(val => val.toUpperCase()),
  name: z.string().min(1).max(100),
  type: z.enum(['stock', 'crypto']),
  exchange: z.string().nullable(),
});

export const DBAssetSchema = CreateAssetSchema.extend({
  id: z.string().uuid(),
  price_usd: z.number().positive().nullable(),
  last_updated: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const AssetResponseSchema = z.object({
  id: z.string().uuid(),
  symbol: z.string(),
  name: z.string(),
  type: z.enum(['stock', 'crypto', 'etf', 'forex']),
  exchange: z.string().nullable(),
  price_usd: z.number().nullable(),
  price_updated_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateAssetRequest = z.infer<typeof CreateAssetSchema>;
export type AssetResponse = z.infer<typeof AssetResponseSchema>;
