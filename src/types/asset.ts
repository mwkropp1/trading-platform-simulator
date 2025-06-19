import { z } from 'zod';
import {
  assetSchema,
  createAssetSchema,
  marketDataSchema,
  assetTypeSchema,
  assetWithMarketDataSchema,
} from '../schemas/asset.schema';

export type Asset = z.infer<typeof assetSchema>;
export type CreateAsset = z.infer<typeof createAssetSchema>;
export type MarketData = z.infer<typeof marketDataSchema>;
export type AssetType = z.infer<typeof assetTypeSchema>;
export type AssetWithMarketData = z.infer<typeof assetWithMarketDataSchema>;
