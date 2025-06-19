import NodeCache from 'node-cache';
import { PriceService } from '../services/priceService';
import { Asset, MarketData } from '../types/asset';

const cache = new NodeCache({ stdTTL: 300 });

export async function getCachedPrice(asset: Asset): Promise<MarketData> {
  const cacheKey = `price:${asset.type}:${asset.symbol}`;
  const cachedData = cache.get<MarketData>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const price = await PriceService.getPrice(asset);
  cache.set(cacheKey, price);
  return price;
}
