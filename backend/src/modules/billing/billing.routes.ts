import type { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { env } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { stripeClient, processStripeEvent, createCheckout, createPortal, billingStatus } from './billing.service.js';

export const stripeWebhook = asyncHandler(async (req, res) => {
  if (!env.STRIPE_WEBHOOK_SECRET) throw new ApiError(503, 'Stripe webhook is not configured.');
  const signature = req.get('stripe-signature');
  if (!signature || !Buffer.isBuffer(req.body)) throw new ApiError(400, 'Invalid Stripe webhook request.');
  const stripe = stripeClient();
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET); }
  catch { throw new ApiError(400, 'Invalid Stripe webhook signature.'); }
  await processStripeEvent(event);
  res.json({ received: true });
});
const billingLimiter = rateLimit({ windowMs: 60_000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });
export const checkoutRoute: RequestHandler[] = [billingLimiter, asyncHandler(async (req, res) => {
  res.json({ data: await createCheckout(req.auth!.user.id, req.body) });
})];
export const portalRoute: RequestHandler[] = [billingLimiter, asyncHandler(async (req, res) => {
  res.json({ data: await createPortal(req.auth!.user.id) });
})];
export const billingStatusRoute = asyncHandler(async (req, res) => {
  res.json({ data: await billingStatus(req.auth!.user.id) });
});
