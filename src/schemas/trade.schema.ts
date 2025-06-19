import { z } from 'zod';
import { assetTypeSchema } from './asset.schema';

export const tradeTypeSchema = z.enum(['buy', 'sell']);
export const tradeStatusSchema = z.enum(['pending', 'completed', 'cancelled']);

export const createTradeSchema = z.object({
  symbol: z.string().min(1).max(10),
  type: assetTypeSchema,
  quantity: z.number().positive(),
  trade_type: tradeTypeSchema,
});

export const tradeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  asset_id: z.string().uuid(),
  type: tradeTypeSchema,
  quantity: z.number().positive(),
  price_usd: z.number().positive(),
  status: tradeStatusSchema,
  trade_date: z.date(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const holdingSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  asset_id: z.string().uuid(),
  quantity: z.number().min(0),
  avg_price_usd: z.number().positive(),
  updated_at: z.date(),
  created_at: z.date(),
});

export const tradeQuerySchema = z.object({
  symbol: z.string().min(1).max(10).optional(),
  type: assetTypeSchema.optional(),
});
