import express from 'express';
import request from 'supertest';
import { expect, it } from 'vitest';
import { publicPlansLimiter, rateLimiter } from '../src/middlewares/rateLimiter.middleware.js';

it('keeps public plans available after the shared API budget is exhausted', async () => {
  const app = express();
  app.use(publicPlansLimiter, rateLimiter);
  app.use((_req, res) => { res.json({ ok: true }); });
  for (let i = 0; i < 100; i++) {
    expect((await request(app).get('/api/v1/platform/account')).status).toBe(200);
  }
  expect((await request(app).get('/api/v1/platform/account')).status).toBe(429);
  expect((await request(app).get('/api/v1/platform/plans?includeFamilies=true')).status).toBe(200);
  expect((await request(app).get('/api/v1/platform/plans/')).status).toBe(200);
  expect((await request(app).post('/api/v1/platform/plans')).status).toBe(429);
});
