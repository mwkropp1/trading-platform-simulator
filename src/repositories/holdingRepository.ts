import { Holding } from '../types/trade';
import { DatabaseError } from '../errors';
import db from '../db';

export async function getHoldingByUserAndAsset(
  userId: string,
  assetId: string
): Promise<Holding | null> {
  try {
    const holding = await db<Holding>('holdings')
      .where({ user_id: userId, asset_id: assetId })
      .first();
    return holding ?? null;
  } catch (error) {
    throw DatabaseError.queryFailed(error instanceof Error ? error : new Error('Unknown error'));
  }
}

export async function getHoldingsByUser(userId: string): Promise<Holding[]> {
  try {
    return await db<Holding>('holdings').where({ user_id: userId }).orderBy('created_at', 'desc');
  } catch (error) {
    throw DatabaseError.queryFailed(error instanceof Error ? error : new Error('Unknown error'));
  }
}

export async function upsertHolding(holding: Holding): Promise<Holding> {
  try {
    const [updatedHolding] = await db<Holding>('holdings')
      .insert(holding)
      .onConflict(['user_id', 'asset_id'])
      .merge(['quantity', 'avg_price_usd', 'updated_at'])
      .returning('*');

    return updatedHolding;
  } catch (error) {
    throw DatabaseError.queryFailed(error instanceof Error ? error : new Error('Unknown error'));
  }
}
