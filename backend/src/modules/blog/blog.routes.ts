import { Router } from 'express';
import { requireRole } from '../auth/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { blogId, blogSchema } from './blog.validation.js';
import * as repository from './blog.repository.js';
import { z } from 'zod';
export const blogPublicRouter = Router();
export const blogAdminRouter = Router();
blogPublicRouter.get('/blog', asyncHandler(async (req,res) => {
  const limit = z.coerce.number().int().min(1).max(100).default(100).parse(req.query.limit);
  res.json({data:await repository.listPosts(true, limit)});
}));
blogPublicRouter.get('/blog/:id', asyncHandler(async (req,res) => {
  const post = await repository.findPost(blogId.parse(req.params.id), true);
  if(!post) throw new ApiError(404,'Article not found');
  res.json({data:post});
}));
blogAdminRouter.use('/admin/blog', requireRole('ADMIN'));
blogAdminRouter.get('/admin/blog', asyncHandler(async (_req,res) => {
  res.json({data:await repository.listPosts(false)});
}));
blogAdminRouter.post('/admin/blog', asyncHandler(async (req,res) => {
  const data = blogSchema.parse(req.body);
  res.status(201).json({data:await repository.savePost(data)});
}));
blogAdminRouter.delete('/admin/blog/:id', asyncHandler(async (req,res) => {
  await repository.deletePost(blogId.parse(req.params.id)); res.json({data:null});
}));
