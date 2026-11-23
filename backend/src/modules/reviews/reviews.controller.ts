import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './reviews.service.js';
export const getReviews = asyncHandler(async (req, res) => {
  const result = await service.getReviews({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const postReviews = asyncHandler(async (req, res) => {
  const result = await service.postReviews({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchReviewsByIdResponse = asyncHandler(async (req, res) => {
  const result = await service.patchReviewsByIdResponse({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const postReviewsByIdDispute = asyncHandler(async (req, res) => {
  const result = await service.postReviewsByIdDispute({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});

export const getCandidates = asyncHandler(async (req, res) => {
  const r = await service.getCandidates({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.json(r.body);
});
