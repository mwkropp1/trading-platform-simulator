import { Trade, CreateTradeRequest } from '../types';
import { ValidationError } from '../errors';
import { PriceService } from '../utils/priceService';
import { getAssetBySymbol } from '../repositories/assetRepository';
import { getHoldingByUserAndAsset } from '../repositories/holdingRepository';
import { createTrade } from '../repositories/tradeRepository';

export class TradeService {
  static async createTrade(userId: string, tradeRequest: CreateTradeRequest): Promise<Trade> {
    const asset = await getAssetBySymbol(tradeRequest.symbol);
    if (!asset) {
      throw ValidationError.field('symbol', 'Asset not found');
    }

    if (tradeRequest.quantity <= 0) {
      throw ValidationError.field('quantity', 'Quantity must be greater than 0');
    }

    const marketData = await PriceService.getPrice(tradeRequest.symbol, tradeRequest.type);

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
        ? (holding.quantity * holding.avg_price_usd + tradeRequest.quantity * marketData.price) /
          (holding.quantity + tradeRequest.quantity)
        : marketData.price;

    return createTrade(
      userId,
      asset.id,
      {
        trade_type: tradeRequest.trade_type,
        quantity: tradeRequest.quantity,
        price_usd: marketData.price,
      },
      {
        quantity: newQuantity,
        avg_price_usd: newAvgPrice,
      }
    );
  }
}
