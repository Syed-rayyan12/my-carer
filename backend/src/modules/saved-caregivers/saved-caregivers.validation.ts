import { z } from 'zod';

import { uuid } from '../shared/validation.js';
export const saveCaregiverSchema = z.strictObject({ caregiverId: uuid });
export const savedCaregiverIdSchema = uuid;
