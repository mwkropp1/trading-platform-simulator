import axios from 'axios';
import Finnhub, { Quote, CandleData } from 'finnhub';
import { AssetType, MarketData } from '../types/asset';

interface PriceData {
  price: number;
  change24h: number;
  volume24h: number;
  lastUpdated: Date;
}

export class PriceService {
  private static readonly COINCAP_BASE_URL = 'https://api.coincap.io/v2';
  private static readonly finnhubClient = new Finnhub.DefaultApi();

  private static initializeFinnhubClient(): void {
    if (!process.env.FINNHUB_API_KEY) {
      throw new Error('FINNHUB_API_KEY not set');
    }
    this.finnhubClient.setApiKey('finnhub', process.env.FINNHUB_API_KEY);
  }

  static async getCryptoPrice(symbol: string): Promise<MarketData> {
    try {
      const response = await axios.get(`${this.COINCAP_BASE_URL}/assets/${symbol.toLowerCase()}`);

      const { data } = response.data;
      return {
        price: parseFloat(data.priceUsd),
        change24h: parseFloat(data.changePercent24Hr),
        volume24h: parseFloat(data.volumeUsd24Hr),
        lastUpdated: new Date(data.updatedAt),
      };
    } catch (error) {
      console.error(`Error fetching crypto price for ${symbol}:`, error);
      throw new Error(`Failed to fetch price for ${symbol}`);
    }
  }

  static async getStockPrice(symbol: string): Promise<MarketData> {
    try {
      const [quote, candles] = await Promise.all([
        new Promise<Quote>((resolve, reject) => {
          this.finnhubClient.quote(symbol, (error, data) => {
            if (error || !data) reject(error || new Error('No data received'));
            else resolve(data);
          });
        }),
        new Promise<CandleData>((resolve, reject) => {
          const now = Math.floor(Date.now() / 1000);
          const oneDayAgo = now - 24 * 60 * 60;
          this.finnhubClient.stockCandles(symbol, 'D', oneDayAgo, now, {}, (error, data) => {
            if (error || !data) reject(error || new Error('No data received'));
            else resolve(data);
          });
        }),
      ]);

      return {
        price: quote.c,
        change24h: ((quote.c - quote.pc) / quote.pc) * 100,
        volume24h: candles.v?.[0] || 0,
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
