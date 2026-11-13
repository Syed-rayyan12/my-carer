import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import { rateLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';
import { router } from './routes/index.js';

export const app = express();

app.set('trust proxy', env.TRUST_PROXY);
app.disable('x-powered-by');
app.use(requestLogger);
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(rateLimiter);
app.use('/api/v1', router);
app.use(notFound);
app.use(errorHandler);
