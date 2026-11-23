import { z } from 'zod';
import { ApiError } from '../../utils/ApiError.js';

export const uploadSchema = z.strictObject({
  name: z.string().trim().min(1).max(200),
  type: z.enum(['image/jpeg', 'image/png', 'application/pdf']),
  purpose: z.enum(['photo', 'qualification', 'verification']),
  content: z.string().min(4).max(14_000_000).regex(/^[A-Za-z0-9+/]+={0,2}$/),
});
export function validateFile(input: z.infer<typeof uploadSchema>) {
  const bytes = Buffer.from(input.content, 'base64');
  const max = (input.purpose === 'photo' ? 2 : 10) * 1024 * 1024;
  if (!bytes.length || bytes.length > max) throw new ApiError(400, 'File exceeds the allowed size');
  const valid = input.type === 'application/pdf' ? bytes.subarray(0, 5).toString() === '%PDF-'
    : input.type === 'image/png' ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (!valid || (input.purpose === 'photo' && input.type === 'application/pdf'))
    throw new ApiError(400, 'Choose a valid JPG, PNG or PDF file');
  return bytes;
}
