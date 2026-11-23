import { Router } from 'express';
import * as controller from './messages.controller.js';
export const messagesRouter = Router();
messagesRouter.get('/messages', controller.getMessages);
messagesRouter.post('/messages', controller.postMessages);
