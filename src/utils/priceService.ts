import axios from 'axios';
import finnhub, { Quote } from 'finnhub';
import { AssetType, MarketData } from '../types/asset';

export class PriceService {
  private static readonly COINCAP_BASE_URL = 'https://api.coincap.io/v2';
  private static readonly finnhubClient = (() => {
    if (!process.env.FINNHUB_API_KEY) {
      throw new Error('FINNHUB_API_KEY not set');
    }
    finnhub.ApiClient.instance.authentications['api_key'].apiKey = process.env.FINNHUB_API_KEY;
    return new finnhub.DefaultApi();
  })();

  static async getCryptoPrice(symbol: string): Promise<MarketData> {
    try {
      const response = await axios.get(`${this.COINCAP_BASE_URL}/assets/${symbol.toLowerCase()}`);
      const { data } = response.data;

      return {
        price: parseFloat(data.priceUsd),
        priceChange: parseFloat(data.changePercent24Hr),
        lastUpdated: new Date(data.updatedAt),
      };
    } catch (error) {
      console.error(`Error fetching crypto price for ${symbol}:`, error);
      throw new Error(`Failed to fetch price for ${symbol}`);
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
        price: quote.c,
        priceChange: quote.dp,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error);
      throw new Error(`Failed to fetch price for ${symbol}`);
    }
  }

  static async getPrice(symbol: string, type: AssetType): Promise<MarketData> {
    return type === 'crypto' ? this.getCryptoPrice(symbol) : this.getStockPrice(symbol);
  }
}
