import { asyncHandler } from '../../utils/asyncHandler.js';
import type { Request } from 'express';
import * as service from './admin-pages.service.js';
const input = (req: Request) => ({
  user: req.auth?.user,
  body: req.body as unknown,
  params: req.params,
  query: req.query,
});
export const overview = asyncHandler(async (_req, res) => {
  res.json({ data: await service.getOverview() });
});
export const accounts = asyncHandler(async (req, res) => {
  res.json(await service.getAccounts(input(req)));
});
export const requests = asyncHandler(async (req, res) => {
  res.json(await service.getRequests(input(req)));
});
export const reviews = asyncHandler(async (req, res) => {
  res.json(await service.getReviews(input(req)));
});
export const verifications = asyncHandler(async (req, res) => {
  res.json(await service.getVerifications(input(req)));
});

export const applications = asyncHandler(async (req, res) => {
  res.json(await service.getApplications(input(req)));
});
