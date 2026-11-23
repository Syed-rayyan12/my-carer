import { z } from 'zod';

import { text, uuid } from '../shared/validation.js';
export const sendMessageSchema = z.strictObject({ recipientId: uuid, body: text(4000) });
