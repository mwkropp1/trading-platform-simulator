import { z } from 'zod';
import {
  tradeSchema,
  createTradeSchema,
  holdingSchema,
  tradeTypeSchema,
  tradeQuerySchema,
} from '../schemas/trade.schema';

export type Trade = z.infer<typeof tradeSchema>;
export type CreateTradeRequest = z.infer<typeof createTradeSchema>;
export type Holding = z.infer<typeof holdingSchema>;
export type TradeType = z.infer<typeof tradeTypeSchema>;
export type TradeQuery = z.infer<typeof tradeQuerySchema>;
