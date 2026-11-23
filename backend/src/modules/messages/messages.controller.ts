import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './messages.service.js';
export const getMessages = asyncHandler(async (req, res) => {
  const result = await service.getMessages({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const postMessages = asyncHandler(async (req, res) => {
  const result = await service.postMessages({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
