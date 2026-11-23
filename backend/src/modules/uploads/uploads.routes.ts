import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { requireRole } from '../auth/auth.middleware.js';
import { requireFeature } from '../membership/plans.js';
import { readUpload, storeFile } from './uploads.repository.js';
import { uploadSchema, validateFile } from './uploads.validation.js';

export const uploadsRouter = Router();
export const profilePhotosRouter = Router();
uploadsRouter.post('/uploads', requireRole('CAREGIVER'), asyncHandler(async (req, res) => {
  const data = uploadSchema.parse(req.body);
  await requireFeature(req.auth!.user.id, data.purpose === 'photo' ? 'bio'
    : data.purpose === 'qualification' ? 'qualifications' : 'basicProfile');
  const bytes = validateFile(data);
  const id = randomUUID();
  await storeFile({ id, userId: req.auth!.user.id, name: data.name, type: data.type,
    purpose: data.purpose, createdAt: new Date().toISOString() }, bytes);
  res.status(201).json({ data: { id, name: data.name, type: data.type,
    url: `/api/platform/${data.purpose === 'photo' ? 'profile-photos' : 'uploads'}/${id}` } });
}));
uploadsRouter.get('/uploads/:id', asyncHandler(async (req, res) => {
  const file = await readUpload(z.uuid().parse(req.params.id));
  if (!file || (file.meta.userId !== req.auth!.user.id && req.auth!.user.role !== 'ADMIN'))
    throw new ApiError(404, 'File not found');
  res.set({ 'Content-Type': file.meta.type, 'Cache-Control': 'no-store, private',
    'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(file.meta.name)}`,
    'Content-Security-Policy': "sandbox; default-src 'none'", 'X-Content-Type-Options': 'nosniff' });
  res.send(file.bytes);
}));
profilePhotosRouter.get('/profile-photos/:id', asyncHandler(async (req, res) => {
  const file = await readUpload(z.uuid().parse(req.params.id));
  if (!file || file.meta.purpose !== 'photo') throw new ApiError(404, 'Photo not found');
  res.set({ 'Content-Type': file.meta.type, 'Cache-Control': 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff' });
  res.send(file.bytes);
}));
