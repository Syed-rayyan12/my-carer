import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import Stripe from 'stripe';

const { processEvent } = vi.hoisted(() => ({ processEvent: vi.fn() }));
vi.mock('../src/config/env.js', () => ({ env: { STRIPE_WEBHOOK_SECRET: 'whsec_unit_test_only' } }));
vi.mock('../src/modules/billing/billing.service.js', async () => {
  const { default: StripeSdk } = await import('stripe');
  return { stripeClient: () => new StripeSdk('sk_test_unit_test_only'), processStripeEvent: processEvent,
    createCheckout: vi.fn(), createPortal: vi.fn(), billingStatus: vi.fn() };
});
import { stripeWebhook } from '../src/modules/billing/billing.routes.js';
const app = express();
app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.use((error: { statusCode?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(error.statusCode ?? 500).json({ error: true });
});
const payload = JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed', data: { object: {} } });
const stripe = new Stripe('sk_test_unit_test_only');
const sign = (body: string) => stripe.webhooks.generateTestHeaderString({ payload: body, secret: 'whsec_unit_test_only' });
beforeEach(() => { processEvent.mockReset(); processEvent.mockResolvedValue(undefined); });
describe('Stripe webhook authentication and retries', () => {
  it('rejects missing signatures before processing', async () => {
    expect((await request(app).post('/webhook').set('Content-Type', 'application/json').send(payload)).status).toBe(400);
    expect(processEvent).not.toHaveBeenCalled();
  });
  it('rejects tampered bodies', async () => {
    expect((await request(app).post('/webhook').set('Content-Type', 'application/json').set('stripe-signature', sign(payload)).send(payload + ' ')).status).toBe(400);
    expect(processEvent).not.toHaveBeenCalled();
  });
  it('accepts correctly signed raw bytes', async () => {
    expect((await request(app).post('/webhook').set('Content-Type', 'application/json').set('stripe-signature', sign(payload)).send(payload)).status).toBe(200);
    expect(processEvent).toHaveBeenCalledWith(expect.objectContaining({ id: 'evt_test' }));
  });
  it('returns a failure when processing fails, allowing Stripe to retry', async () => {
    processEvent.mockRejectedValueOnce(new Error('Temporary failure'));
    expect((await request(app).post('/webhook').set('Content-Type', 'application/json').set('stripe-signature', sign(payload)).send(payload)).status).toBe(500);
  });
});
