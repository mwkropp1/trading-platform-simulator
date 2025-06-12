import { Router } from 'express';
import { AssetController } from '../controllers/assetController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

export const assetRouter = Router();

assetRouter.use(authMiddleware);

assetRouter.get('/', AssetController.getAll);
assetRouter.get('/:id', AssetController.getById);
assetRouter.get('/symbol/:symbol', AssetController.getBySymbol);

assetRouter.post('/', requireRole(['admin']), AssetController.create);
