import { requireRole } from '../auth/auth.middleware.js';
import { Router } from 'express';
import * as controller from './reviews.controller.js';
export const reviewsRouter = Router();
reviewsRouter.get('/reviews', controller.getReviews);
reviewsRouter.post('/reviews', controller.postReviews);
reviewsRouter.patch('/reviews/:id/response', controller.patchReviewsByIdResponse);
reviewsRouter.post('/reviews/:id/dispute', controller.postReviewsByIdDispute);

reviewsRouter.get('/reviews/candidates', requireRole('CARE_SEEKER'), controller.getCandidates);
