import { DatabaseError } from 'src/errors';
import db from '../db';
import { CreateAsset, Asset } from '../types/asset';

export async function getAllAssets(): Promise<Asset[]> {
  return db<Asset>('assets').select('*');
}

export async function getAssetById(id: string): Promise<Asset | null> {
  const asset = await db<Asset>('assets').where({ id }).first();
  return asset ?? null;
}

export async function getAssetBySymbol(symbol: string): Promise<Asset | null> {
  const asset = await db<Asset>('assets').where({ symbol: symbol.toUpperCase() }).first();
  return asset ?? null;
}

export async function insertAsset(asset: CreateAsset): Promise<Asset> {
  const [insertedAsset] = await db<Asset>('assets')
    .insert({
      ...asset,
      symbol: asset.symbol.toUpperCase(),
    })
    .returning('*');

  return insertedAsset;
}

export async function updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
  try {
    const [updated] = await db('assets').where({ id }).update(data).returning('*');

    return updated;
  } catch (error) {
    throw DatabaseError.queryFailed(error instanceof Error ? error : new Error('Unknown error'));
  }
}
