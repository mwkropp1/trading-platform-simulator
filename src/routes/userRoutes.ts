import { Router } from 'express';
import { UserController } from '../controllers/userController';

export const userRouter = Router();

userRouter.get('/:id', UserController.getUser);
userRouter.post('/', UserController.createUser);
