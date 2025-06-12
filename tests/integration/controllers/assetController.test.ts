import { Request, Response } from 'express';
import { AssetController } from '../../../src/controllers/assetController';
import * as assetRepository from '../../../src/repositories/assetRepository';
import { DBAsset } from '../../../src/types/asset';

jest.mock('../../../src/repositories/assetRepository');

describe('AssetController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {};
    mockResponse = { json: mockJson, status: mockStatus };
  });

  describe('getAll', () => {
    it('should return all assets', async () => {
      const mockAssets: DBAsset[] = [
        {
          id: '1',
          symbol: 'AAPL',
          name: 'Apple Inc.',
          type: 'stock',
          exchange: 'NASDAQ',
          price_usd: 150,
          price_updated_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '2',
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          type: 'stock',
          exchange: 'NASDAQ',
          price_usd: 2800,
          price_updated_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(assetRepository, 'getAllAssets').mockResolvedValue(mockAssets);

      await AssetController.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ symbol: 'AAPL' }),
          expect.objectContaining({ symbol: 'GOOGL' }),
        ])
      );
    });
  });
});
