import { prisma } from '../../config/db.js';
import type { z } from 'zod';
import type { blogSchema } from './blog.validation.js';
const card = { id:true, title:true, description:true, category:true, author:true, date:true, status:true,
  image:true, seoTitle:true, metaDescription:true, createdAt:true } as const;
export const listPosts = (published: boolean, limit = 100) => prisma.blogPost.findMany({
  where: published ? { status:'Published' } : {}, orderBy:[{ createdAt:'desc' }, { id:'desc' }], take:limit,
  ...(published ? { select: card } : {}),
});
export const findPost = (id: string, published: boolean) => prisma.blogPost.findFirst({
  where: { id, ...(published ? {status:'Published'} : {}) },
});
export const savePost = (data: z.infer<typeof blogSchema>) => prisma.blogPost.upsert({ where:{ id:data.id }, create:data, update:data });
export const deletePost = (id: string) => prisma.blogPost.delete({where:{id}});
