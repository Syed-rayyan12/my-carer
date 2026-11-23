import { z } from 'zod';

export const organisationCategorySchema = z.enum(['CARE_HOME', 'CARE_AGENCY']).optional();
