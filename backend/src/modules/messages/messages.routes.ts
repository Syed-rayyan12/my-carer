import { Router } from 'express';
import { messageReadLimiter } from '../../middlewares/rateLimiter.middleware.js';
import * as controller from './messages.controller.js';
export const messagesRouter = Router();
messagesRouter.get('/messages', messageReadLimiter, controller.getMessages);
messagesRouter.post('/messages', controller.postMessages);
