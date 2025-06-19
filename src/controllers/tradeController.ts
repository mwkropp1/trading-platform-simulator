import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { TradeService } from '../services/tradeService';
import { CreateTradeSchema } from '../schemas/tradeSchemas';
import { ValidationError } from '../errors';

export class TradeController {
  static create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw ValidationError.field('user', 'User ID is required');
      }

      const tradeRequest = CreateTradeSchema.parse(req.body);
      const trade = await TradeService.createTrade(req.user.id, tradeRequest);

      res.status(201).json(trade);
    } catch (error) {
      next(error);
    }
  };

  static getMyTrades = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw ValidationError.field('user', 'User ID is required');
      }

      const trades = await TradeService.getTradesByUser(req.user.id);
      res.json(trades);
    } catch (error) {
      next(error);
    }
  };
}
