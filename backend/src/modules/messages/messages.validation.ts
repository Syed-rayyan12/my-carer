import { z } from 'zod';

import { text, uuid } from '../shared/validation.js';
import { paginationSchema } from '../shared/pagination.validation.js';
export const messageQuerySchema = paginationSchema.extend({
  since: z.iso.datetime({ offset: true }).optional(),
});
export const sendMessageSchema = z.strictObject({ recipientId: uuid, body: text(4000) });
