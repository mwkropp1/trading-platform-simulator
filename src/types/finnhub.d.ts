declare module 'finnhub' {
  export interface FinnhubConfig {
    api_key: string;
  }

  export interface Quote {
    c: number;
    d: number;
    dp: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
  }

  export interface CompanyProfile {
    country: string;
    currency: string;
    exchange: string;
    finnhubIndustry: string;
    ipo: string;
    logo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
  }

  export interface CandleData {
    c: number[];
    h: number[];
    l: number[];
    o: number[];
    s: string;
    t: number[];
    v: number[];
  }

  export interface NewsItem {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
  }

  export interface SymbolLookupResult {
    count: number;
    result: SymbolInfo[];
  }

  export interface SymbolInfo {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }

  export interface EarningsData {
    actual: number;
    estimate: number;
    period: string;
    quarter: number;
    surprise: number;
    surprisePercent: number;
    symbol: string;
    year: number;
  }

  export interface BasicFinancials {
    metric: {
      '10DayAverageTradingVolume': number;
      '13WeekPriceReturnDaily': number;
      '26WeekPriceReturnDaily': number;
      '3MonthAverageTradingVolume': number;
      '52WeekHigh': number;
      '52WeekHighDate': string;
      '52WeekLow': number;
      '52WeekLowDate': string;
      '52WeekPriceReturnDaily': number;
      '5DayPriceReturnDaily': number;
      beta: number;
      dividendGrowthRate5Y: number;
      dividendPerShare5Y: number;
      dividendYield5Y: number;
      epsGrowth5Y: number;
      marketCapitalization: number;
      peBasicExclExtraTTM: number;
      peNormalizedAnnual: number;
      revenueGrowth5Y: number;
      revenuePerShareTTM: number;
      roaa5Y: number;
      roe5Y: number;
      rps5Y: number;
      salesPerShare5Y: number;
      [key: string]: number | string;
    };
    metricType: string;
    series: {
      annual: Record<string, any>;
      quarterly: Record<string, any>;
    };
  }

  export interface RecommendationTrend {
    buy: number;
    hold: number;
    period: string;
    sell: number;
    strongBuy: number;
    strongSell: number;
    symbol: string;
  }

  export interface PriceTarget {
    lastUpdated: string;
    symbol: string;
    targetHigh: number;
    targetLow: number;
    targetMean: number;
    targetMedian: number;
  }

  export interface InsiderTransaction {
    change: number;
    filingDate: string;
    name: string;
    share: number;
    symbol: string;
    transactionCode: string;
    transactionDate: string;
    transactionPrice: number;
  }

  export class DefaultApi {
    constructor();
    setApiKey(provider: string, key: string): void;
    quote(
      symbol: string,
      callback?: (error: any, data: Quote, response: any) => void
    ): Promise<Quote>;
    companyProfile2(
      opts: { symbol: string },
      callback?: (error: any, data: CompanyProfile, response: any) => void
    ): Promise<CompanyProfile>;
    stockCandles(
      symbol: string,
      resolution: string,
      from: number,
      to: number,
      opts?: any,
      callback?: (error: any, data: CandleData, response: any) => void
    ): Promise<CandleData>;
    companyNews(
      symbol: string,
      from: string,
      to: string,
      callback?: (error: any, data: NewsItem[], response: any) => void
    ): Promise<NewsItem[]>;
    generalNews(
      category: string,
      opts?: any,
      callback?: (error: any, data: NewsItem[], response: any) => void
    ): Promise<NewsItem[]>;
    symbolSearch(
      q: string,
      callback?: (error: any, data: SymbolLookupResult, response: any) => void
    ): Promise<SymbolLookupResult>;
    companyEarnings(
      symbol: string,
      opts?: any,
      callback?: (error: any, data: EarningsData[], response: any) => void
    ): Promise<EarningsData[]>;
    companyBasicFinancials(
      symbol: string,
      metric: string,
      callback?: (error: any, data: BasicFinancials, response: any) => void
    ): Promise<BasicFinancials>;
    recommendationTrends(
      symbol: string,
      callback?: (error: any, data: RecommendationTrend[], response: any) => void
    ): Promise<RecommendationTrend[]>;
    priceTarget(
      symbol: string,
      callback?: (error: any, data: PriceTarget, response: any) => void
    ): Promise<PriceTarget>;
    insiderTransactions(
      symbol: string,
      from?: string,
      to?: string,
      callback?: (error: any, data: { data: InsiderTransaction[] }, response: any) => void
    ): Promise<{ data: InsiderTransaction[] }>;
    [key: string]: any;
  }

  export interface ApiClient {
    authentications: {
      api_key: {
        apiKey: string;
        apiKeyPrefix?: string;
      };
    };
  }

  export const ApiClient: {
    instance: ApiClient;
  };

  const finnhub: {
    ApiClient: typeof ApiClient;
    DefaultApi: typeof DefaultApi;
  };

  export default finnhub;
}

declare module 'finnhub/dist/index' {
  export * from 'finnhub';
}

declare module 'finnhub/dist/index.js' {
  export * from 'finnhub';
}
