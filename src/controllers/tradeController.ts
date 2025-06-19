import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { TradeService } from '../services/tradeService';
import { createTradeSchema, tradeQuerySchema } from '../schemas/trade.schema';
import { ValidationError } from '../errors';

export class TradeController {
  static create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw ValidationError.field('user', 'User ID is required');
      }

      const tradeRequest = createTradeSchema.parse(req.body);
      const trade = await TradeService.createTrade(req.user.id, tradeRequest);

      res.status(201).json(trade);
    } catch (error) {
      next(error);
    }
  };

  static getTrades = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw ValidationError.field('user', 'User ID is required');
      }

      const query = tradeQuerySchema.parse(req.query);

      const trades = await TradeService.getTradesByUser(req.user.id, query);

      res.json(trades);
    } catch (error) {
      next(error);
    }
  };
}
