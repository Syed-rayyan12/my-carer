import { prisma } from '../../config/db.js';
import type { z } from 'zod';
import type { blogSchema } from './blog.validation.js';

type PublicCard = {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  status: string;
  image: string;
  seoTitle: string;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
};
export const listPosts = (published: boolean, limit = 100) =>
  published
    ? // Select only card fields, and keep inline image bytes out of the JSON list.
      prisma.$queryRaw<PublicCard[]>`
      SELECT "id", "title", "description", "category", "author", "date", "status",
        CASE WHEN "image" LIKE 'data:%' THEN '/api/platform/blog/' || "id" || '/image?v=' || extract(epoch FROM "updatedAt")::text
          ELSE "image" END AS "image", "seoTitle", "metaDescription", "createdAt", "updatedAt"
      FROM "BlogPost" WHERE "status" = 'Published'
      ORDER BY "createdAt" DESC, "id" DESC LIMIT ${limit}`
    : prisma.blogPost.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: limit });
export const findPost = (id: string, published: boolean) =>
  prisma.blogPost.findFirst({
    where: { id, ...(published ? { status: 'Published' } : {}) },
  });
export const findPostImage = (id: string) =>
  prisma.blogPost.findFirst({
    where: { id, status: 'Published' },
    select: { image: true, updatedAt: true },
  });
export const savePost = (data: z.infer<typeof blogSchema>) =>
  prisma.blogPost.upsert({ where: { id: data.id }, create: data, update: data });
export const deletePost = (id: string) => prisma.blogPost.delete({ where: { id } });
