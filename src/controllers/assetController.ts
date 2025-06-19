import { Request, Response } from 'express';
import {
  getAllAssets,
  getAssetById,
  getAssetBySymbol,
  insertAsset,
} from '../repositories/assetRepository';
import { createAssetSchema, assetSchema } from '../schemas/asset.schema';
import { z } from 'zod';
import { getCachedPrice } from '../utils/priceCache';
import { Asset, AssetWithMarketData, MarketData } from '../types/asset';

export class AssetController {
  static getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const assets = await getAllAssets();
      const safeAssets = assets.map(asset => assetSchema.parse(asset));
      res.json(safeAssets);
    } catch (error) {
      console.error('Error fetching assets:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const asset = await getAssetById(req.params.id);
      if (!asset) {
        res.status(404).json({ error: 'Asset not found' });
        return;
      }
      const safeAsset = assetSchema.parse(asset);
      res.json(safeAsset);
    } catch (error) {
      console.error('Error fetching asset:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getBySymbol = async (req: Request, res: Response): Promise<void> => {
    try {
      const asset = await getAssetBySymbol(req.params.symbol);
      if (!asset) {
        res.status(404).json({ error: 'Asset not found' });
        return;
      }

      const marketData = await getCachedPrice(asset);

      const response: AssetWithMarketData = {
        ...asset,
        ...marketData,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching asset:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = createAssetSchema.parse(req.body);
      const asset = await insertAsset(data);
      const safeAsset = assetSchema.parse(asset);
      res.status(201).json(safeAsset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      console.error('Error creating asset:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
