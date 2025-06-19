import { Trade, CreateTradeRequest, AssetType } from '../types';
import { ValidationError } from '../errors';
import { PriceService } from './priceService';
import { getAssetBySymbol } from '../repositories/assetRepository';
import { getHoldingByUserAndAsset } from '../repositories/holdingRepository';
import { createTrade, getTrades } from '../repositories/tradeRepository';

export class TradeService {
  static async createTrade(userId: string, tradeRequest: CreateTradeRequest): Promise<Trade> {
    const asset = await getAssetBySymbol(tradeRequest.symbol);
    if (!asset) {
      throw ValidationError.field('symbol', 'Asset not found');
    }

    if (tradeRequest.quantity <= 0) {
      throw ValidationError.field('quantity', 'Quantity must be greater than 0');
    }

    const marketData = await PriceService.getPrice(asset);

    const holding = await getHoldingByUserAndAsset(userId, asset.id);
    if (tradeRequest.trade_type === 'sell') {
      if (!holding) {
        throw ValidationError.field('symbol', 'No holding found for this asset');
      }
      if (holding.quantity < tradeRequest.quantity) {
        throw ValidationError.field('quantity', 'Insufficient holding quantity');
      }
    }

    const newQuantity = holding
      ? tradeRequest.trade_type === 'buy'
        ? holding.quantity + tradeRequest.quantity
        : holding.quantity - tradeRequest.quantity
      : tradeRequest.quantity;

    const newAvgPrice =
      holding && tradeRequest.trade_type === 'buy'
        ? (holding.quantity * holding.avg_price_usd +
            tradeRequest.quantity * marketData.price_usd) /
          (holding.quantity + tradeRequest.quantity)
        : marketData.price_usd;

    return createTrade(
      userId,
      asset.id,
      {
        trade_type: tradeRequest.trade_type,
        quantity: tradeRequest.quantity,
        price_usd: marketData.price_usd,
      },
      {
        quantity: newQuantity,
        avg_price_usd: newAvgPrice,
      }
    );
  }

  static async getTradesByUser(
    userId: string,
    options?: { symbol?: string; type?: AssetType }
  ): Promise<Trade[]> {
    if (!userId) {
      throw ValidationError.field('userId', 'User ID is required');
    }

    const trades = await getTrades({ userId, symbol: options?.symbol, type: options?.type });
    return trades;
  }
}
