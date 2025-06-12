import {
  getAllAssets,
  getAssetById,
  getAssetBySymbol,
} from '../../../src/repositories/assetRepository';
import db from '../../../src/db';

jest.mock('../../../src/db');

describe('assetRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAssets', () => {
    it('should return all assets', async () => {
      const mockAssets = [
        { id: '1', symbol: 'AAPL', name: 'Apple Inc.' },
        { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc.' },
      ];

      (db as jest.Mocked<typeof db>).select = jest.fn().mockResolvedValue(mockAssets);

      const result = await getAllAssets();
      expect(result).toEqual(mockAssets);
    });
  });
});
