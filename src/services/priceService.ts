import axios from 'axios';
import finnhub, { Quote } from 'finnhub';
import { AssetType, MarketData } from '../types/asset';
import { Asset } from '../types';
import { updateAsset } from '../repositories/assetRepository';

export class PriceService {
  private static readonly COINCAP_BASE_URL = 'https://rest.coincap.io/v3';
  private static readonly finnhubClient = (() => {
    if (!process.env.FINNHUB_API_KEY) {
      throw new Error('FINNHUB_API_KEY not set');
    }
    finnhub.ApiClient.instance.authentications['api_key'].apiKey = process.env.FINNHUB_API_KEY;
    return new finnhub.DefaultApi();
  })();

  static async findCoinCapId(symbol: string): Promise<string | null> {
    try {
      const apiKey = `apiKey=${process.env.COINCAP_API_KEY}`;
      const response = await axios.get(
        `${this.COINCAP_BASE_URL}/assets?search=${symbol}&limit=1&${apiKey}`
      );

      const { data } = response.data;
      if (data && data.length > 0) {
        return data[0].id;
      }
      return null;
    } catch (error) {
      console.error(`Error finding CoinCap ID for ${symbol}:`, error);
      return null;
    }
  }

  static async getCryptoPrice(asset: Asset): Promise<MarketData> {
    try {
      if (!asset.coincap_id) {
        const coincapId = await this.findCoinCapId(asset.symbol);
        if (coincapId) {
          await updateAsset(asset.id, { coincap_id: coincapId });
          asset.coincap_id = coincapId;
        } else {
          throw new Error(`Could not find CoinCap ID for ${asset.symbol}`);
        }
      }

      const apiKey = `apiKey=${process.env.COINCAP_API_KEY}`;
      const response = await axios.get(
        `${this.COINCAP_BASE_URL}/assets/${asset.coincap_id}?${apiKey}`
      );

      const { data } = response.data;
      return {
        price_usd: parseFloat(data.priceUsd),
        price_change: parseFloat(data.changePercent24Hr),
        price_updated_at: new Date(response.data.timestamp),
      };
    } catch (error) {
      console.error(`Error fetching crypto price for ${asset.symbol}:`, error);
      throw new Error(`Failed to fetch price for ${asset.symbol}`);
    }
  }

  static async getStockPrice(symbol: string): Promise<MarketData> {
    try {
      const quote = await new Promise<Quote>((resolve, reject) => {
        this.finnhubClient.quote(symbol, (error, data) => {
          if (error) reject(error);
          else resolve(data);
        });
      });

      return {
        price_usd: quote.c,
        price_change: quote.dp,
        price_updated_at: new Date(),
      };
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error);
      throw new Error(`Failed to fetch price for ${symbol}`);
    }
  }

  static async getPrice(asset: Asset): Promise<MarketData> {
    return asset.type === 'crypto' ? this.getCryptoPrice(asset) : this.getStockPrice(asset.symbol);
  }
}
