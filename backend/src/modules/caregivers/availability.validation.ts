import { z } from 'zod';
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const slot = z.strictObject({ start: time, end: time }).refine(row => row.end > row.start, 'End time must be after start time');
export const adminAvailabilitySchema = z.strictObject({
  weekly: z.array(z.strictObject({ day: z.enum(days), slots: z.array(slot).max(2).refine(rows => rows.length < 2 || rows[1]!.start >= rows[0]!.end, 'Time slots must not overlap') })).length(7).refine(rows => new Set(rows.map(row => row.day)).size === 7, 'Include each weekday once'),
  minimumVisitMinutes: z.number().int().min(30).max(1440),
});
