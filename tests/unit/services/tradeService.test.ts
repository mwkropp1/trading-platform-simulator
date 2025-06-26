import { TradeService } from '../../../src/services/tradeService';
import { PriceService } from '../../../src/services/priceService';
import { getAssetBySymbol } from '../../../src/repositories/assetRepository';
import { getHoldingByUserAndAsset } from '../../../src/repositories/holdingRepository';
import { ValidationError } from '../../../src/errors';
import { mockTransaction } from '../../tests/helpers/';

jest.mock('../../utils/priceService');
jest.mock('../../repositories/assetRepository');
jest.mock('../../repositories/holdingRepository');

describe('TradeService', () => {
  const mockUserId = 'user-123';
  const mockAsset = {
    id: 'asset-123',
    symbol: 'BTC',
    type: 'crypto',
    name: 'Bitcoin',
  };
  const mockPrice = {
    price: 30000,
    priceChange: 1.5,
    lastUpdated: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAssetBySymbol as jest.Mock).mockResolvedValue(mockAsset);
    (PriceService.getPrice as jest.Mock).mockResolvedValue(mockPrice);
  });

  describe('createTrade', () => {
    it('should create a buy trade successfully', async () => {
      const tradeRequest = {
        symbol: 'BTC',
        type: 'crypto',
        quantity: 1.0,
        trade_type: 'buy',
      };

      const result = await TradeService.createTrade(mockUserId, tradeRequest);

      expect(result).toMatchObject({
        user_id: mockUserId,
        asset_id: mockAsset.id,
        quantity: tradeRequest.quantity,
        price_usd: mockPrice.price,
        trade_type: 'buy',
      });
    });

    it('should throw error for non-existent asset', async () => {
      (getAssetBySymbol as jest.Mock).mockResolvedValue(null);

      const tradeRequest = {
        symbol: 'INVALID',
        type: 'crypto',
        quantity: 1.0,
        trade_type: 'buy',
      };

      await expect(TradeService.createTrade(mockUserId, tradeRequest)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw error for insufficient holdings on sell', async () => {
      const tradeRequest = {
        symbol: 'BTC',
        type: 'crypto',
        quantity: 2.0,
        trade_type: 'sell',
      };

      (getHoldingByUserAndAsset as jest.Mock).mockResolvedValue({
        quantity: 1.0,
      });

      await expect(TradeService.createTrade(mockUserId, tradeRequest)).rejects.toThrow(
        ValidationError
      );
    });
  });
});
