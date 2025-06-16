export type AssetType = 'stock' | 'crypto' | 'etf' | 'forex';

export interface CreateAsset {
  symbol: string;
  name: string;
  type: AssetType;
  exchange: string | null;
}

export interface DBAsset extends CreateAsset {
  id: string;
  price_usd: number | null;
  price_updated_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface MarketData {
  price: number;
  priceChange: number;
  lastUpdated: Date;
}

export interface AssetResponse extends Omit<DBAsset, 'price_usd'> {
  current_price: number;
  price_change: number;
}
