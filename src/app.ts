import express from 'express';
import errorMiddleware from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(errorMiddleware);

app.use('/auth', authRoutes);

export default app;
