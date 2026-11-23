import { z } from 'zod';
export const blogId = z.string().min(1).max(100).regex(/^[a-z0-9-]+$/);
export const blogSchema = z.strictObject({
  id: blogId, title: z.string().trim().min(1).max(200), description: z.string().trim().max(1000),
  content: z.string().trim().max(100000), category: z.string().trim().max(100),
  author: z.string().trim().min(1).max(160), date: z.string().max(40),
  status: z.enum(['Published', 'Draft']),
  image: z.string().max(2_800_000).refine(v => !v || /^\/images\/[a-zA-Z0-9_./% -]+$/.test(v) ||
    /^https:\/\//.test(v) || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(v), 'Use an uploaded image or HTTPS image URL'),
  seoTitle: z.string().max(200), metaDescription: z.string().max(1000),
}).superRefine((p, ctx) => {
  if(p.status === 'Published') for(const key of ['description', 'content', 'category'] as const)
    if(!p[key]) ctx.addIssue({ code: 'custom', path:[key], message:'Required before publishing' });
});
