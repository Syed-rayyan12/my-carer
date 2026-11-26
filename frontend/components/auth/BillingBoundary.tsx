"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { accountApi, AuthApiError, type AuthSession } from './auth-client';

type BillingState = {
  enabled: boolean; mode: string; subscribed: boolean; requiresCheckout: boolean;
  plan: {
    id: string; title: string; pricePence: number; billingInterval: string;
    currency: string; trialMonths: number; trialStartedAt: string | null; trialEndsAt: string | null;
  } | null;
};

export default function BillingBoundary({ session, children }: { session: AuthSession; children: ReactNode }) {
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [error, setError] = useState('');
  const [opening, setOpening] = useState(false);
  const pending = useRef(false);
  const admin = session.user.role === 'ADMIN';
  const refresh = useCallback(async () => {
    if (admin) return;
    try {
      const response = await accountApi<{ data: BillingState }>('platform/membership/billing');
      if (typeof response.data.requiresCheckout !== 'boolean') throw new Error('Subscription setup is being updated. Please retry shortly.');
      setBilling(response.data); setError('');
    } catch (issue) {
      const message = issue instanceof Error ? issue.message : 'Unable to check your subscription.';
      setError(issue instanceof AuthApiError ? `${message} (HTTP ${issue.statusCode})` : message);
    }
  }, [admin]);
  useEffect(() => {
    void refresh();
    const focus = () => { void refresh(); };
    window.addEventListener('focus', focus);
    return () => window.removeEventListener('focus', focus);
  }, [refresh]);
  useEffect(() => {
    if (admin || new URLSearchParams(window.location.search).get('billing') !== 'success' || billing?.requiresCheckout === false) return;
    let attempts = 0;
    let checking = false;
    const timer = window.setInterval(() => {
      if (checking) return;
      if (++attempts > 30) { window.clearInterval(timer); return; }
      checking = true;
      void refresh().finally(() => { checking = false; });
    }, 2000);
    return () => window.clearInterval(timer);
  }, [admin, billing?.requiresCheckout, refresh]);

  if (admin || (billing && !billing.requiresCheckout)) return children;

  async function openStripe() {
    if (!billing?.plan || pending.current) return;
    pending.current = true; setOpening(true); setError('');
    try {
      const action = billing.subscribed ? 'portal' : 'checkout';
      const result = await accountApi<{ data: { url: string } }>(`platform/membership/${action}`, {
        method: 'POST', csrfToken: session.csrfToken,
        body: action === 'checkout' ? { planId: billing.plan.id, billingInterval: billing.plan.billingInterval } : {},
      });
      const target = new URL(result.data.url);
      if (target.protocol !== 'https:' || !['checkout.stripe.com', 'billing.stripe.com'].includes(target.hostname))
        throw new Error('Unable to open secure billing. Please retry.');
      window.location.assign(target.href);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Unable to start Checkout.');
      pending.current = false; setOpening(false);
    }
  }
  async function signOut() {
    try {
      await accountApi('auth/logout', { method: 'POST', body: {}, csrfToken: session.csrfToken });
      window.location.replace('/signin');
    } catch { setError('Unable to sign out. Please retry.'); }
  }
  const plan = billing?.plan;
  const price = plan ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: plan.currency }).format(plan.pricePence / 100) : '';
  const returning = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('billing') === 'success';
  return <main className="flex min-h-screen items-center justify-center bg-[#fff7f9] px-5 py-12 text-[#17212f]">
    <section className="w-full max-w-xl rounded-3xl border border-[#f4c8d6] bg-white p-7 shadow-xl shadow-pink-100/40 sm:p-10">
      <img src="/logo.png" alt="My Carer" width={105} height={68} className="mb-8 h-auto w-[105px]" />
      <p className="text-xs font-bold uppercase tracking-widest text-[#c71d50]">Your account is approved</p>
      <h1 className="mt-3 text-3xl font-bold">{returning ? 'Confirming your subscription' : 'Complete billing to unlock your dashboard'}</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">Welcome, {session.user.firstName}. Your dashboard features become available after Stripe confirms billing for your selected package.</p>
      {!billing && !error && <p role="status" className="mt-6 text-sm">Checking your selected package...</p>}
      {plan && <div className="mt-6 rounded-2xl bg-[#fff4f7] p-5">
        <h2 className="font-bold">{plan.title}</h2>
        <p className="mt-2 text-xl font-semibold">{price}<span className="text-sm font-normal"> / {plan.billingInterval === 'annual' ? 'year' : 'month'}</span></p>
        {!plan.trialStartedAt && plan.trialMonths > 0 && <p className="mt-2 text-sm">Your first {plan.trialMonths} months are free. £0 due today; billing starts after the trial unless you cancel.</p>}
        {plan.trialStartedAt && plan.trialEndsAt && new Date(plan.trialEndsAt) > new Date() && <p className="mt-2 text-sm">Your existing trial ends on {new Date(plan.trialEndsAt).toLocaleDateString('en-GB')}. Completing Checkout does not restart it.</p>}
      </div>}
      {billing?.mode === 'test' && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Stripe test mode: use a test card. No real money is collected.</p>}
      {billing && !billing.enabled && <p role="alert" className="mt-4 text-sm text-red-700">Billing is currently unavailable. Please retry shortly.</p>}
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-7 flex flex-wrap gap-3">
        {plan && <button type="button" disabled={!billing?.enabled || opening} onClick={() => void openStripe()} className="rounded-xl bg-[#ff2f68] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{opening ? 'Opening Stripe...' : billing?.subscribed ? 'Manage billing' : 'Continue to Stripe'}</button>}
        <button type="button" onClick={() => void refresh()} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold">{returning ? 'Check confirmation' : 'Retry billing settings'}</button>
        <button type="button" onClick={() => void signOut()} className="px-3 py-3 text-sm text-slate-500 underline">Sign out</button>
      </div>
    </section>
  </main>;
}
