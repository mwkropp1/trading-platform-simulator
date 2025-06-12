import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from './routes/userRoutes';
import { authRouter } from './routes/authRoutes';
import { assetRouter } from './routes/assetRoutes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/assets', assetRouter);

app.get('/health', (req: Request, res: Response): void => {
  res.status(200).send('OK');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
