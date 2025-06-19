import { z } from 'zod';

export const assetTypeSchema = z.enum(['stock', 'crypto', 'etf', 'forex']);

export const createAssetSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .max(10)
    .transform(val => val.toUpperCase()),
  name: z.string().min(1).max(100),
  type: assetTypeSchema,
  exchange: z.string().nullable(),
});

export const assetSchema = createAssetSchema.extend({
  id: z.string().uuid(),
  coincap_id: z.string().nullable(),
  price_usd: z.number().positive().nullable(),
  price_updated_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const marketDataSchema = z.object({
  price_usd: z.number().positive(),
  price_change: z.number(),
  price_updated_at: z.date(),
});

export const assetWithMarketDataSchema = assetSchema.merge(marketDataSchema);
