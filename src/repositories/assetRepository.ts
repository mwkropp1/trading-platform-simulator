import db from '../db';
import { CreateAsset, DBAsset } from '../types/asset';

export async function getAllAssets(): Promise<DBAsset[]> {
  return db<DBAsset>('assets').select('*');
}

export async function getAssetById(id: string): Promise<DBAsset | null> {
  const asset = await db<DBAsset>('assets').where({ id }).first();
  return asset ?? null;
}

export async function getAssetBySymbol(symbol: string): Promise<DBAsset | null> {
  const asset = await db<DBAsset>('assets').where({ symbol: symbol.toUpperCase() }).first();
  return asset ?? null;
}

export async function insertAsset(asset: CreateAsset): Promise<DBAsset> {
  const [insertedAsset] = await db<DBAsset>('assets')
    .insert({
      ...asset,
      symbol: asset.symbol.toUpperCase(),
    })
    .returning('*');

  return insertedAsset;
}
