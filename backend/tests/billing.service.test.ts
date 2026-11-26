import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import type Stripe from 'stripe';

const mock = vi.hoisted(() => ({
  tx: { $queryRaw: vi.fn(), user: { findUniqueOrThrow: vi.fn() },
    membership: { findUnique: vi.fn(), update: vi.fn() },
    pricingPlan: { findFirst: vi.fn(), findUnique: vi.fn() },
    stripeWebhookEvent: { findUnique: vi.fn(), create: vi.fn() } },
  stripe: { customers: { create: vi.fn() },
    subscriptions: { retrieve: vi.fn(), list: vi.fn(), update: vi.fn() },
    checkout: { sessions: { retrieve: vi.fn(), create: vi.fn(), list: vi.fn(), expire: vi.fn() } } },
}));
vi.mock('../src/config/env.js', () => ({ env: {
  STRIPE_ENABLED: 'true', STRIPE_MODE: 'test', STRIPE_SECRET_KEY: 'sk_test_unit_only',
  BILLING_RETURN_ORIGIN: 'https://app.example.test',
} }));
vi.mock('../src/config/db.js', () => ({ prisma: { $transaction: (fn: (tx: unknown) => unknown) => fn(mock.tx) } }));
vi.mock('stripe', () => ({ default: class { constructor() { return mock.stripe; } } }));
import { createCheckout, processStripeEvent } from '../src/modules/billing/billing.service.js';

const userId = 'f5be55c6-6857-4c37-a8ef-fcced3eb3c2f';
const plans: { id: string; category: string; title: string; pricePence: number; annualPricePence: number; trialMonths: number; currency: string }[] = JSON.parse(
  readFileSync(new URL('../docs/pricing-catalogue.json', import.meta.url), 'utf8'),
);
let member: Record<string, unknown>;
beforeEach(() => {
  vi.resetAllMocks();
  vi.useRealTimers();
  member = { userId, planId: 'CARER_VERIFIED', plan: plans.find(p => p.id === 'CARER_VERIFIED'),
    user: { role: 'CAREGIVER', accountCategory: 'CAREGIVER' },
    stripeCustomerId: 'cus_unit', stripeCheckoutId: null, stripeSubscriptionId: null,
    trialStartedAt: null, trialEndsAt: null, paidThrough: null };
  mock.tx.membership.findUnique.mockImplementation(async () => member);
  mock.tx.membership.update.mockImplementation(async ({ data }) => { Object.assign(member, data); return member; });
  mock.tx.user.findUniqueOrThrow.mockResolvedValue({ id: userId, status: 'ACTIVE', role: 'CAREGIVER', email: 'unit@example.test', firstName: 'Unit', lastName: 'Test' });
  mock.stripe.subscriptions.list.mockResolvedValue({ data: [] });
  mock.stripe.checkout.sessions.list.mockResolvedValue({ data: [] });
  mock.stripe.checkout.sessions.create.mockResolvedValue({ id: 'cs_unit', url: 'https://checkout.stripe.com/c/test' });
});

describe('catalogue subscription Checkout', () => {
  for (const plan of plans.filter(p => p.pricePence > 0)) {
    for (const interval of ['monthly', 'annual'] as const) {
      it(`${plan.id} ${interval} uses its stored recurring amount and six-month trial`, async () => {
        vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-26T12:00:00Z'));
        member.plan = plan;
        mock.tx.pricingPlan.findFirst.mockResolvedValue(plan);
        await createCheckout(userId, { planId: plan.id, billingInterval: interval });
        const params = mock.stripe.checkout.sessions.create.mock.calls[0]![0];
        expect(params.mode).toBe('subscription');
        expect(params.line_items[0].price_data.unit_amount).toBe(interval === 'annual' ? plan.annualPricePence : plan.pricePence);
        expect(params.line_items[0].price_data.recurring.interval).toBe(interval === 'annual' ? 'year' : 'month');
        expect(params.subscription_data.trial_end).toBe(Date.parse('2027-05-26T12:00:00Z') / 1000);
        expect(member.trialStartedAt).toBeNull(); // abandoning Checkout does not consume or activate a trial
        vi.useRealTimers();
      });
    }
  }
  it('rejects a posted amount rather than trusting browser pricing', async () => {
    await expect(createCheckout(userId, { planId: 'CARER_VERIFIED', billingInterval: 'monthly', amount: 1 })).rejects.toThrow();
    expect(mock.stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });
  it('rejects a plan in a different provider category', async () => {
    mock.tx.pricingPlan.findFirst.mockResolvedValue(plans.find(p => p.id === 'HOME_PREMIUM'));
    await expect(createCheckout(userId, { planId: 'HOME_PREMIUM', billingInterval: 'annual' })).rejects.toThrow('registered account category');
  });
  it('reuses an already open Checkout instead of creating duplicates', async () => {
    const plan = plans.find(p => p.id === 'CARER_VERIFIED')!;
    mock.tx.pricingPlan.findFirst.mockResolvedValue(plan);
    member.stripeCheckoutId = 'cs_existing';
    mock.stripe.checkout.sessions.retrieve.mockResolvedValue({ status: 'open', url: 'https://checkout.stripe.com/existing', metadata: { planId: plan.id, billingInterval: 'monthly', amount: String(plan.pricePence) } });
    expect(await createCheckout(userId, { planId: plan.id, billingInterval: 'monthly' })).toEqual({ url: 'https://checkout.stripe.com/existing' });
    expect(mock.stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });
});

describe('subscription webhook reconciliation', () => {
  function event(id = 'evt_unit', type = 'customer.subscription.updated'): Stripe.Event {
    return { id, type, livemode: false, data: { object: { id: 'sub_unit' } } } as unknown as Stripe.Event;
  }
  function subscription(status = 'trialing') {
    return { id: 'sub_unit', customer: 'cus_unit', status, cancel_at_period_end: false,
      metadata: { userId, planId: 'CARER_VERIFIED', billingInterval: 'monthly', amount: '999' },
      trial_start: 1795694400, trial_end: 1811332800,
      items: { data: [{ quantity: 1, current_period_end: 1814011200, price: { unit_amount: 999, currency: 'gbp', recurring: { interval: 'month', interval_count: 1 } } }] },
      latest_invoice: { status: 'paid', amount_due: 0, amount_remaining: 0 } };
  }
  beforeEach(() => {
    member.stripeSubscriptionId = 'sub_unit';
    mock.tx.pricingPlan.findUnique.mockResolvedValue(plans.find(p => p.id === 'CARER_VERIFIED'));
  });
  it('activates a trial but does not turn a zero-value invoice into a paid period', async () => {
    mock.stripe.subscriptions.retrieve.mockResolvedValue(subscription());
    await processStripeEvent(event());
    expect(member.status).toBe('TRIAL');
    expect(member.paidThrough).toBeNull();
    expect(mock.tx.stripeWebhookEvent.create).toHaveBeenCalledWith({ data: { id: 'evt_unit' } });
  });
  it('does not process an event twice', async () => {
    mock.stripe.subscriptions.retrieve.mockResolvedValue(subscription());
    mock.tx.stripeWebhookEvent.findUnique.mockResolvedValue({ id: 'evt_unit' });
    await processStripeEvent(event());
    expect(mock.tx.membership.update).not.toHaveBeenCalled();
  });
  it('never grants an unpaid renewal another paid period', async () => {
    const sub = subscription('past_due'); sub.latest_invoice.status = 'open'; sub.latest_invoice.amount_due = 999;
    mock.stripe.subscriptions.retrieve.mockResolvedValue(sub);
    const paid = new Date('2026-11-01'); member.paidThrough = paid;
    await processStripeEvent(event());
    expect(member.paidThrough).toEqual(paid);
  });
  it('uses the current subscription rather than rolling back to an old event payload', async () => {
    const sub = subscription('active'); sub.latest_invoice.amount_due = 999;
    mock.stripe.subscriptions.retrieve.mockResolvedValue(sub);
    await processStripeEvent(event('evt_old', 'customer.subscription.deleted'));
    expect(member.status).toBe('ACTIVE');
    expect(member.paidThrough).toEqual(new Date(sub.items.data[0]!.current_period_end * 1000));
  });
  it('ignores a subscription for the wrong Stripe customer', async () => {
    const sub = subscription(); sub.customer = 'cus_other';
    mock.stripe.subscriptions.retrieve.mockResolvedValue(sub);
    await processStripeEvent(event());
    expect(mock.tx.membership.update).not.toHaveBeenCalled();
  });
  it('requires a matching server-created checkout before attaching a new subscription', async () => {
    member.stripeSubscriptionId = null; member.stripeCheckoutId = 'cs_expected';
    mock.stripe.subscriptions.retrieve.mockResolvedValue(subscription());
    const received = { id: 'evt_checkout', type: 'checkout.session.completed', livemode: false,
      data: { object: { id: 'cs_other', mode: 'subscription', subscription: 'sub_unit', customer: 'cus_unit', client_reference_id: userId } } } as unknown as Stripe.Event;
    await processStripeEvent(received);
    expect(mock.tx.membership.update).not.toHaveBeenCalled();
  });
});
