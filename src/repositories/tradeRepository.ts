import db from '../db';
import { DatabaseError } from '../errors';
import { AssetType, Trade, TradeType } from '../types';

export async function createTrade(
  userId: string,
  assetId: string,
  tradeData: {
    trade_type: TradeType;
    quantity: number;
    price_usd: number;
  },
  holdingData: {
    quantity: number;
    avg_price_usd: number;
  }
): Promise<Trade> {
  return db.transaction(async trx => {
    try {
      const [trade] = await trx('trades')
        .insert({
          user_id: userId,
          asset_id: assetId,
          type: tradeData.trade_type,
          quantity: tradeData.quantity,
          price_usd: tradeData.price_usd,
          status: 'completed',
          trade_date: new Date(),
        })
        .returning('*');

      await trx('holdings')
        .insert({
          user_id: userId,
          asset_id: assetId,
          quantity: holdingData.quantity,
          avg_price_usd: holdingData.avg_price_usd,
        })
        .onConflict(['user_id', 'asset_id'])
        .merge(['quantity', 'avg_price_usd']);

      return trade;
    } catch (error) {
      throw DatabaseError.queryFailed(error instanceof Error ? error : new Error('Unknown error'));
    }
  });
}

export async function getTrades(filters: {
  userId: string;
  symbol?: string;
  type?: AssetType;
}): Promise<Trade[]> {
  try {
    const query = db('trades')
      .join('assets', 'trades.asset_id', '=', 'assets.id')
      .select('trades.*', 'assets.symbol', 'assets.type')
      .where('trades.user_id', filters.userId)
      .orderBy('trade_date', 'desc');

    if (filters.symbol) {
      query.andWhere('assets.symbol', filters.symbol);
    }

    if (filters.type) {
      query.andWhere('assets.type', filters.type);
    }

    return await query;
  } catch (error) {
    throw DatabaseError.queryFailed(error instanceof Error ? error : new Error('Unknown error'));
  }
}
