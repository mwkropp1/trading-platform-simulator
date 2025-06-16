import NodeCache from 'node-cache';
import { PriceService } from './priceService';
import { AssetType, MarketData } from '../types/asset';

const cache = new NodeCache({ stdTTL: 300 });

export async function getCachedPrice(symbol: string, type: AssetType): Promise<MarketData> {
  const cacheKey = `price:${type}:${symbol}`;
  const cachedData = cache.get<MarketData>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const price = await PriceService.getPrice(symbol, type);
  cache.set(cacheKey, price);
  return price;
}
