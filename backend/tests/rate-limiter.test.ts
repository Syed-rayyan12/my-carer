import express from 'express';
import request from 'supertest';
import { expect, it } from 'vitest';
import {
  messageReadLimiter,
  isMessageReadRequest,
  publicPlansLimiter,
  rateLimiter,
} from '../src/middlewares/rateLimiter.middleware.js';

it('keeps public plans available after the shared API budget is exhausted', async () => {
  const app = express();
  app.use((req, res, next) => {
    if (!isMessageReadRequest(req)) return next();
    req.auth = { user: { id: req.get('X-Test-Account') ?? 'account-one' } } as NonNullable<
      typeof req.auth
    >;
    return messageReadLimiter(req, res, next);
  });
  app.use(publicPlansLimiter, rateLimiter);
  app.use((_req, res) => {
    res.json({ ok: true });
  });
  for (let i = 0; i < 100; i++) {
    expect((await request(app).get('/api/v1/platform/account')).status).toBe(200);
  }
  expect((await request(app).get('/api/v1/platform/account')).status).toBe(429);
  expect((await request(app).get('/api/v1/platform/plans?includeFamilies=true')).status).toBe(200);
  expect((await request(app).get('/api/v1/platform/plans/')).status).toBe(200);
  expect((await request(app).post('/api/v1/platform/plans')).status).toBe(429);
  // Polling retains its own bounded budget and does not bypass write limits.
  for (let i = 0; i < 120; i++) {
    expect((await request(app).get('/api/v1/platform/messages')).status).toBe(200);
  }
  expect((await request(app).get('/api/v1/platform/messages')).status).toBe(429);
  expect((await request(app).post('/api/v1/platform/messages')).status).toBe(429);
  expect(
    (await request(app).get('/api/v1/platform/messages').set('X-Test-Account', 'account-two'))
      .status,
  ).toBe(200);
});
