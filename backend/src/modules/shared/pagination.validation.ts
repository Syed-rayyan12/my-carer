import { z } from 'zod';
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});
export function pagination(query: unknown) {
  const { page, limit } = paginationSchema.parse(query);
  return { page, limit, skip: (page - 1) * limit, take: limit + 1 };
}
export function paginated<T>(rows: T[], page: number, limit: number) {
  return { data: rows.slice(0, limit), pagination: { page, limit, hasMore: rows.length > limit } };
}
