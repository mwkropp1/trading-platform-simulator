import { Router } from 'express';
import { TradeController } from '../controllers/tradeController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', TradeController.create);
router.get('/', TradeController.getTrades);

export default router;
