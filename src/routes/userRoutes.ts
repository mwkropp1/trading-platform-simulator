import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get('/:id', UserController.getUser);
userRouter.post('/', UserController.createUser);
