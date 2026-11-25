import { Router } from 'express';
import { requireRole } from '../auth/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { blogId, blogSchema } from './blog.validation.js';
import * as repository from './blog.repository.js';
import { z } from 'zod';
import { createHash } from 'node:crypto';
export const blogPublicRouter = Router();
export const blogAdminRouter = Router();
blogPublicRouter.get(
  '/blog',
  asyncHandler(async (req, res) => {
    const limit = z.coerce.number().int().min(1).max(100).default(100).parse(req.query.limit);
    res.json({ data: await repository.listPosts(true, limit) });
  }),
);
blogPublicRouter.get(
  '/blog/:id/image',
  asyncHandler(async (req, res) => {
    const post = await repository.findPostImage(blogId.parse(req.params.id));
    const image = post?.image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+=*)$/);
    if (!image?.[1] || !image[2]) throw new ApiError(404, 'Article image not found');
    const bytes = Buffer.from(image[2], 'base64');
    const etag = '"' + createHash('sha256').update(bytes).digest('hex') + '"';
    res.set({
      'Content-Type': image[1],
      'Cache-Control': 'public, max-age=3600',
      ETag: etag,
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.get('If-None-Match') === etag) {
      res.status(304).end();
      return;
    }
    res.send(bytes);
  }),
);
blogPublicRouter.get(
  '/blog/:id',
  asyncHandler(async (req, res) => {
    const post = await repository.findPost(blogId.parse(req.params.id), true);
    if (!post) throw new ApiError(404, 'Article not found');
    res.json({
      data: {
        ...post,
        image: post.image.startsWith('data:')
          ? `/api/platform/blog/${post.id}/image?v=${post.updatedAt.getTime()}`
          : post.image,
      },
    });
  }),
);
blogAdminRouter.use('/admin/blog', requireRole('ADMIN'));
blogAdminRouter.get(
  '/admin/blog',
  asyncHandler(async (_req, res) => {
    res.json({ data: await repository.listPosts(false) });
  }),
);
blogAdminRouter.post(
  '/admin/blog',
  asyncHandler(async (req, res) => {
    const data = blogSchema.parse(req.body);
    res.status(201).json({ data: await repository.savePost(data) });
  }),
);
blogAdminRouter.delete(
  '/admin/blog/:id',
  asyncHandler(async (req, res) => {
    await repository.deletePost(blogId.parse(req.params.id));
    res.json({ data: null });
  }),
);
