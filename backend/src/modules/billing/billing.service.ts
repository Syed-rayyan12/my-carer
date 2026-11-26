import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { ApiError } from '../../utils/ApiError.js';
import { planRole } from '../membership/plan-policy.js';
import { checkoutTrialEnd, subscriptionAccessStatus } from './billing.policy.js';

let client: Stripe | undefined;
export function stripeClient() {
  if (env.STRIPE_ENABLED !== 'true' || !env.STRIPE_SECRET_KEY)
    throw new ApiError(503, 'Subscription billing is not configured yet.');
  return client ??= new Stripe(env.STRIPE_SECRET_KEY, { timeout: 10000, maxNetworkRetries: 1 });
}
const checkoutInput = z.strictObject({
  planId: z.string().min(1).max(40),
  billingInterval: z.enum(['monthly', 'annual']),
});
function returnUrl(role: string) {
  return `${env.BILLING_RETURN_ORIGIN}/${role === 'CAREGIVER' ? 'caregiver-dashboard' : 'care-seeker-dashboard'}/membership`;
}
async function lockUser(tx: Prisma.TransactionClient, userId: string) {
  await tx.$queryRaw`SELECT id FROM "User" WHERE id=${userId}::uuid FOR UPDATE`;
}

export async function createCheckout(userId: string, body: unknown) {
  const input = checkoutInput.parse(body);
  const stripe = stripeClient();
  return prisma.$transaction(async tx => {
    await lockUser(tx, userId);
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const membership = await tx.membership.findUnique({ where: { userId }, include: { plan: true } });
    const plan = await tx.pricingPlan.findFirst({ where: { id: input.planId, active: true } });
    if (user.status !== 'ACTIVE' || user.role === 'ADMIN') throw new ApiError(403, 'An approved care account is required.');
    if (!membership || !plan || planRole(plan.id) !== user.role || plan.category !== membership.plan.category)
      throw new ApiError(403, 'Choose a package within your registered account category.');
    if (plan.pricePence === 0) throw new ApiError(400, 'Free packages do not need Stripe Checkout.');
    if (membership.paidThrough && membership.paidThrough > new Date())
      throw new ApiError(409, 'Your paid period is still active. Manage Billing to cancel renewal.');
    if (membership.stripeSubscriptionId) {
      const existing = await stripe.subscriptions.retrieve(membership.stripeSubscriptionId);
      if (!['canceled', 'incomplete_expired'].includes(existing.status))
        throw new ApiError(409, 'You already have a subscription. Use Manage Billing.');
    }
    const amount = input.billingInterval === 'annual' ? plan.annualPricePence : plan.pricePence;
    if (amount <= 0) throw new ApiError(409, 'This package has no configured recurring price.');
    if (membership.stripeCheckoutId) {
      const existing = await stripe.checkout.sessions.retrieve(membership.stripeCheckoutId);
      if (existing.status === 'complete') throw new ApiError(409, 'Checkout completed. Please wait for billing confirmation and refresh.');
      if (existing.status === 'open') {
        if (existing.metadata?.planId === plan.id && existing.metadata?.billingInterval === input.billingInterval && existing.metadata?.amount === String(amount)) {
          if (!existing.url) throw new ApiError(502, 'Checkout is unavailable.');
          return { url: existing.url };
        }
        await stripe.checkout.sessions.expire(existing.id);
      }
    }
    let customerId = membership.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email, name: `${user.firstName} ${user.lastName}`, metadata: { userId },
      }, { idempotencyKey: `carer-customer-${env.STRIPE_MODE}-${userId}` });
      customerId = customer.id;
    }
    // Recover Stripe-side creations if a previous database transaction rolled back
    // after Stripe accepted its request. Never create a second active subscription.
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 });
    if (subscriptions.data.some(s => s.metadata.userId === userId && !['canceled', 'incomplete_expired'].includes(s.status)))
      throw new ApiError(409, 'Your subscription is awaiting confirmation. Refresh shortly or use Manage Billing.');
    const sessions = await stripe.checkout.sessions.list({ customer: customerId, status: 'open', limit: 100 });
    for (const open of sessions.data.filter(s => s.mode === 'subscription' && s.client_reference_id === userId)) {
      if (open.metadata?.planId === plan.id && open.metadata?.billingInterval === input.billingInterval && open.metadata?.amount === String(amount) && open.url) {
        await tx.membership.update({ where: { userId }, data: { stripeCustomerId: customerId, stripeCheckoutId: open.id } });
        return { url: open.url };
      }
      await stripe.checkout.sessions.expire(open.id);
    }
    const trialEnd = checkoutTrialEnd(membership, plan.trialMonths);
    if (trialEnd && trialEnd < Date.now() / 1000 + 48 * 3600 + 60)
      throw new ApiError(409, 'Your current trial ends within two days. Start billing after it ends so you are not charged early.');
    const metadata = { userId, planId: plan.id, billingInterval: input.billingInterval, amount: String(amount) };
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', customer: customerId, client_reference_id: userId,
      payment_method_collection: 'always', allowed_payment_method_types: ['card'],
      success_url: `${returnUrl(user.role)}?billing=success`,
      cancel_url: `${returnUrl(user.role)}?billing=cancelled`,
      metadata,
      line_items: [{ quantity: 1, price_data: {
        currency: plan.currency.toLowerCase(), unit_amount: amount,
        recurring: { interval: input.billingInterval === 'annual' ? 'year' : 'month' },
        product_data: { name: plan.title, metadata: { planId: plan.id } },
      } }],
      subscription_data: { metadata, ...(trialEnd ? { trial_end: trialEnd } : {}) },
    }, { idempotencyKey: `carer-checkout-${userId}-${randomUUID()}` });
    if (!session.url) throw new ApiError(502, 'Stripe did not return a checkout URL.');
    await tx.membership.update({ where: { userId }, data: {
      stripeCustomerId: customerId, stripeCheckoutId: session.id,
    } });
    return { url: session.url };
  }, { timeout: 60000 });
}

export async function createPortal(userId: string) {
  const member = await prisma.membership.findUnique({ where: { userId }, include: { user: true } });
  if (!member?.stripeCustomerId) throw new ApiError(409, 'Complete subscription Checkout first.');
  const portal = await stripeClient().billingPortal.sessions.create({
    customer: member.stripeCustomerId, return_url: returnUrl(member.user.role),
  });
  return { url: portal.url };
}

export async function expirePendingCheckout(checkoutId: string) {
  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.retrieve(checkoutId);
  if (session.status === 'complete') throw new ApiError(409, 'Checkout completed. Wait for confirmation before changing packages.');
  if (session.status === 'open') await stripe.checkout.sessions.expire(checkoutId);
}

export async function cancelSubscription(userId: string) {
  const stripe = stripeClient();
  await prisma.$transaction(async tx => {
    await lockUser(tx, userId);
    const member = await tx.membership.findUniqueOrThrow({ where: { userId } });
    if (!member.stripeSubscriptionId) throw new ApiError(409, 'No subscription to cancel.');
    await stripe.subscriptions.update(member.stripeSubscriptionId, { cancel_at_period_end: true });
    await tx.membership.update({ where: { userId }, data: { cancelAtPeriodEnd: true, status: 'CANCELLED' } });
  }, { timeout: 30000 });
}

export async function billingStatus(userId: string) {
  const member = await prisma.membership.findUnique({ where: { userId } });
  return { enabled: env.STRIPE_ENABLED === 'true', mode: env.STRIPE_MODE,
    subscribed: !!member?.stripeSubscriptionId && !['canceled', 'incomplete_expired'].includes(member.stripeStatus ?? ''),
    cancelAtPeriodEnd: member?.cancelAtPeriodEnd ?? false };
}

function objectId(value: string | { id: string } | null | undefined) {
  return typeof value === 'string' ? value : value?.id;
}

export async function processStripeEvent(event: Stripe.Event) {
  if (event.livemode !== (env.STRIPE_MODE === 'live')) throw new ApiError(400, 'Stripe event mode does not match this service.');
  const stripe = stripeClient();
  let subscriptionId: string | undefined;
  let session: Stripe.Checkout.Session | undefined;
  if (event.type === 'checkout.session.completed') {
    session = event.data.object;
    if (session.mode !== 'subscription') return;
    subscriptionId = objectId(session.subscription);
  } else if (['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted', 'customer.subscription.paused', 'customer.subscription.resumed'].includes(event.type)) {
    subscriptionId = (event.data.object as Stripe.Subscription).id;
  } else if (['invoice.paid', 'invoice.payment_failed', 'invoice.payment_action_required'].includes(event.type)) {
    const invoice = event.data.object as Stripe.Invoice;
    subscriptionId = objectId(invoice.parent?.subscription_details?.subscription)
      ?? objectId((invoice as unknown as { subscription?: string | null }).subscription);
  }
  if (!subscriptionId) return;
  // Metadata comes from Stripe, never from client-supplied URLs or a Checkout success page.
  const hint = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = hint.metadata.userId;
  if (!userId || !z.uuid().safeParse(userId).success) return; // another application's subscription
  await prisma.$transaction(async tx => {
    await lockUser(tx, userId);
    if (await tx.stripeWebhookEvent.findUnique({ where: { id: event.id } })) return;
    const member = await tx.membership.findUnique({ where: { userId }, include: { user: true } });
    if (!member || member.stripeCustomerId !== objectId(hint.customer)) return;
    if (session) {
      if (session.id !== member.stripeCheckoutId || session.client_reference_id !== userId || objectId(session.customer) !== member.stripeCustomerId) return;
    } else if (member.stripeSubscriptionId !== subscriptionId) {
      // Subscription events can precede Checkout completion. Completion will reconcile latest state.
      return;
    }
    // Read current state while holding the account lock: retries and out-of-order events cannot roll it back.
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['latest_invoice'] });
    const { planId, billingInterval, amount } = subscription.metadata;
    const plan = planId ? await tx.pricingPlan.findUnique({ where: { id: planId } }) : null;
    const item = subscription.items.data[0];
    if (!plan || !item || subscription.items.data.length !== 1 || item.quantity !== 1 ||
      planRole(plan.id) !== member.user.role || plan.category !== member.user.accountCategory ||
      !['monthly', 'annual'].includes(billingInterval ?? '') || !/^\d+$/.test(amount ?? '') ||
      item.price.unit_amount !== Number(amount) || item.price.currency !== plan.currency.toLowerCase() ||
      item.price.recurring?.interval !== (billingInterval === 'annual' ? 'year' : 'month') ||
      item.price.recurring?.interval_count !== 1)
      throw new ApiError(409, 'Stripe subscription does not match this account and package.');
    const invoice = typeof subscription.latest_invoice === 'object' ? subscription.latest_invoice : null;
    const ended = ['canceled', 'incomplete_expired', 'unpaid', 'paused'].includes(subscription.status);
    const trialStart = subscription.trial_start ? new Date(subscription.trial_start * 1000) : null;
    const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
    let paidThrough = member.paidThrough;
    // Never extend paid access from a zero-value trial invoice or an unpaid renewal.
    if (subscription.status === 'active' && invoice?.status === 'paid' && !invoice.amount_remaining && invoice.amount_due > 0)
      paidThrough = new Date(item.current_period_end * 1000);
    if (ended) paidThrough = null;
    await tx.membership.update({ where: { userId }, data: {
      stripeSubscriptionId: subscription.id, stripeStatus: subscription.status, stripeCheckoutId: null,
      planId: plan.id, billingInterval: billingInterval!, pricePence: Number(amount),
      status: subscriptionAccessStatus(subscription.status, subscription.cancel_at_period_end),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialStartedAt: member.trialStartedAt ?? trialStart,
      trialEndsAt: ended ? (member.trialEndsAt && member.trialEndsAt < new Date() ? member.trialEndsAt : new Date()) : (member.trialEndsAt ?? trialEnd),
      paidThrough,
    } });
    await tx.stripeWebhookEvent.create({ data: { id: event.id } });
  }, { timeout: 60000 });
}
