"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Gift, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { accountApi, AuthApiError } from "@/components/auth/auth-client";
import {
  type PricingPlan,
  type PlanId,
  type BillingInterval,
  formatPrice,
} from "@/config/pricing";
import { useAuth } from "@/components/auth/AuthBoundary";
import { useLiveWorkspace } from "./LiveWorkspace";
export default function MembershipPage() {
  const { snapshot, user, mutate, busy, refresh } = useLiveWorkspace();
  const session = useAuth()!;
  const [billing, setBilling] = useState<{ enabled: boolean; mode: string; subscribed: boolean; cancelAtPeriodEnd: boolean } | null>(null);
  const [billingReload, setBillingReload] = useState(0);
  const [billingLoadError, setBillingLoadError] = useState("");
  const [billingBusy, setBillingBusy] = useState(false);
  const billingPending = useRef(false);
  async function redirectToBilling(action: 'checkout' | 'portal', selectedPlan = planId, selectedInterval = interval) {
    if (billingPending.current) return;
    billingPending.current = true; setBillingBusy(true); setError('');
    try {
      const response = await accountApi<{ data: { url: string } }>(`platform/membership/${action}`, {
        method: 'POST', csrfToken: session.csrfToken,
        body: action === 'checkout' ? { planId: selectedPlan, billingInterval: selectedInterval } : {},
      });
      const target = new URL(response.data.url);
      if (target.protocol !== 'https:' || !['checkout.stripe.com', 'billing.stripe.com'].includes(target.hostname)) throw new Error('Invalid billing destination');
      window.location.assign(target.href);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Unable to open billing.');
      billingPending.current = false; setBillingBusy(false);
    }
  }
  useEffect(() => {
    let active = true;
    setBillingLoadError("");
    accountApi<{ data: NonNullable<typeof billing> }>('platform/membership/billing')
      .then(result => { if (active) setBilling(result.data); })
      .catch(issue => {
        if (!active) return;
        const message = issue instanceof Error ? issue.message : 'Unable to load billing settings.';
        setBillingLoadError(issue instanceof AuthApiError ? `${message} (HTTP ${issue.statusCode})` : message);
      });
    return () => { active = false; };
  }, [snapshot.membership?.status, snapshot.membership?.planId, snapshot.membership?.trialEndsAt, snapshot.membership?.paidThrough, billingReload]);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('billing') !== 'success') return;
    let pending = false;
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (pending) return;
      if (++attempts > 15) { window.clearInterval(timer); return; }
      pending = true;
      void refresh().catch(() => {}).finally(() => { pending = false; });
    }, 2000);
    return () => window.clearInterval(timer);
  }, [refresh]);
  const m = snapshot.membership;
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const membershipKey = m ? m.planId + ":" + m.billingInterval : "";
  const [choice, setChoice] = useState<{
    sourceKey: string;
    planId?: PlanId;
    interval: BillingInterval;
  }>({ sourceKey: "", interval: "monthly" });
  const planId =
    choice.sourceKey === membershipKey
      ? choice.planId
      : (m?.planId as PlanId | undefined);
  const interval =
    choice.sourceKey === membershipKey
      ? choice.interval
      : (m?.billingInterval ?? "monthly");
  const setPlanId = (value: PlanId | undefined) =>
    setChoice({ sourceKey: membershipKey, planId: value, interval });
  const setInterval = (value: BillingInterval) =>
    setChoice({ sourceKey: membershipKey, planId, interval: value });
  const [error, setError] = useState("");
  useEffect(() => {
    accountApi<{ data: PricingPlan[] }>("platform/plans?includeFamilies=true")
      .then((r) => setPlans(r.data))
      .catch(() => setError("Unable to load package choices."));
  }, []);
  const selected = plans.find((p) => p.id === planId);
  const choices = plans.filter(
    (p) =>
      p.category ===
      (m?.plan?.category ??
        (user.role === "CAREGIVER" ? "CAREGIVER" : "CARE_SEEKER")),
  );
  const trial = snapshot.access?.trial === true;
  const root =
    user.role === "CAREGIVER"
      ? "/caregiver-dashboard"
      : "/care-seeker-dashboard";
  return (
    <main className="mx-auto max-w-[1400px] space-y-6 px-6 pb-10">
      <header className="rounded-xl border border-[#e5dce0] bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c71d50]">
          Your package
        </p>
        <h1 className="mt-2 text-3xl font-bold">Membership &amp; access</h1>
        <p className="mt-2 text-sm text-[#667085]">
          See what is included, manage your trial, and choose your next step.
        </p>
      </header>
      {billingLoadError && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
        <p>{billingLoadError}</p>
        <button type="button" onClick={() => setBillingReload(value => value + 1)} className="mt-2 font-semibold underline">Retry billing settings</button>
      </div>}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {billing?.mode === 'test' && billing.enabled && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Test billing: use Stripe test cards. No real payments are collected.</p>}
      <section className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-[#f6bdd0] bg-[#fff5f8] p-6">
          <div className="flex items-center gap-2 text-[#c71d50]">
            {trial ? <Gift size={21} /> : <ShieldCheck size={21} />}
            <span className="text-xs font-semibold">
              {snapshot.access?.trial
                ? "FREE LAUNCH TRIAL"
                : m?.pricePence === 0
                  ? "FREE PACKAGE"
                  : snapshot.access?.active
                    ? "ACTIVE MEMBERSHIP"
                    : "RENEWAL REQUIRED"}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold">
            {m?.plan?.title ?? "Loading package..."}
          </h2>
          <p className="mt-2 text-xl">
            {formatPrice(m?.pricePence ?? 0)}
            <span className="ml-1 text-sm text-[#667085]">
              / {m?.billingInterval === "annual" ? "year" : "month"}
              {trial ? " after your trial" : ""}
            </span>
          </p>
          {trial && (
            <p className="mt-4 text-sm">
              Free trial ends{" "}
              <strong>
                {new Date(m!.trialEndsAt!).toLocaleDateString("en-GB")}
              </strong>
              {billing?.enabled ? '. Your saved payment method is charged after the trial unless you cancel.' : '. No card required.'}
            </p>
          )}
          <p className="mt-3 text-xs leading-6 text-[#667085]">
            {m?.paidThrough
              ? `Paid access through ${new Date(m.paidThrough).toLocaleDateString("en-GB")}.`
              : "No paid period has been recorded."}{" "}
            Cancellation retains access until your trial or paid period ends.{" "}
            {billing?.enabled
              ? 'Subscriptions renew automatically after the trial. Manage your payment method and cancellation through Stripe.'
              : 'Payment is arranged with the administrator; no automatic charge is taken.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {billing && !billing.enabled && m && m.pricePence > 0 && !trial && (
              <button
                disabled={busy || billingBusy}
                onClick={() =>
                  void mutate("platform/membership/request", {}, "POST")
                }
                className="rounded-lg bg-[#ff2f68] px-4 py-2 text-sm font-semibold text-white"
              >
                Request renewal
              </button>
            )}
            {billing?.enabled && m && m.pricePence > 0 && !billing.subscribed && <button
              disabled={busy || billingBusy}
              onClick={() => void redirectToBilling('checkout', m.planId as PlanId, m.billingInterval)}
              className="rounded-lg bg-[#ff2f68] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >{billingBusy ? 'Opening Stripe...' : 'Start subscription'}</button>}
            {billing?.enabled && billing.subscribed && <button
              disabled={busy || billingBusy} onClick={() => void redirectToBilling('portal')}
              className="rounded-lg bg-[#ff2f68] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >Manage billing</button>}
            {billing?.cancelAtPeriodEnd && <p className="w-full text-sm">Renewal cancelled. Access continues until your current trial or paid period ends.</p>}
            {billing && m && m.pricePence > 0 && m.status !== "CANCELLED" && !billing.cancelAtPeriodEnd && (!billing.enabled || billing.subscribed) && (
              <button
                disabled={busy}
                onClick={() =>
                  void mutate("platform/membership/cancel", {}, "POST")
                }
                className="rounded-lg border border-[#f2bbcc] bg-white px-4 py-2 text-sm"
              >
                Cancel membership
              </button>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-[#e5dce0] bg-white p-6">
          <h2 className="text-lg font-semibold">Included in your package</h2>
          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto">
            {m?.plan?.features?.map((feature) => (
              <li
                key={feature}
                className="flex gap-2 text-xs leading-5 text-[#475467]"
              >
                <Check size={15} className="mt-0.5 shrink-0 text-[#c71d50]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="rounded-xl border border-[#e5dce0] bg-white p-6">
        <h2 className="text-xl font-semibold">Choose your package</h2>
        <p className="mt-2 text-xs leading-5 text-[#667085]">
          Your trial is shared across paid packages: changing tier does not
          restart it. Changes during an existing paid period are available after
          that period ends.
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!planId || !selected || !billing) return;
            if (billing.enabled && selected.pricePence > 0) {
              await redirectToBilling('checkout');
              return;
            }
            await mutate(
              "platform/membership/change",
              { planId, billingInterval: interval },
              "POST",
            );
          }}
        >
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {choices.map((plan) => (
              <label key={plan.id} className="cursor-pointer">
                <input
                  name="membership-plan"
                  type="radio"
                  checked={planId === plan.id}
                  onChange={() => setPlanId(plan.id)}
                  className="peer sr-only"
                />
                <span className="block h-full rounded-xl border border-[#ded7db] p-4 peer-checked:border-[#ff2f68] peer-checked:bg-[#fff5f8] peer-focus-visible:outline-2 peer-focus-visible:outline-[#ff2f68]">
                  <strong className="block text-sm">{plan.tier}</strong>
                  <span className="mt-2 block text-sm">
                    {formatPrice(
                      interval === "annual"
                        ? plan.annualPricePence
                        : plan.pricePence,
                    )}{" "}
                    / {interval === "annual" ? "year" : "month"}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-5 text-sm">
            {(["monthly", "annual"] as const).map((cycle) => (
              <label key={cycle} className="flex gap-2">
                <input
                  name="membership-interval"
                  type="radio"
                  checked={interval === cycle}
                  onChange={() => setInterval(cycle)}
                  className="accent-[#ff2f68]"
                />
                {cycle === "monthly" ? "Monthly" : "Annual · save 2 months"}
              </label>
            ))}
          </div>
          <button
            disabled={
              busy || billingBusy || !billing ||
              !selected ||
              (planId === m?.planId && interval === m?.billingInterval && !(billing?.enabled && selected?.pricePence > 0 && !billing.subscribed))
            }
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#ff2f68] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {busy || billingBusy ? "Please wait..." : billing?.enabled && (selected?.pricePence ?? 0) > 0 ? "Continue to Stripe" : "Update package"}
            <ArrowRight size={15} />
          </button>
        </form>
      </section>
      <p className="text-xs text-[#667085]">
        <Link href="/pricing" className="text-[#c71d50] underline">
          Compare all packages
        </Link>{" "}
        or{" "}
        <Link
          href={`${root}/package-tools`}
          className="text-[#c71d50] underline"
        >
          open package tools
        </Link>
        .
      </p>
    </main>
  );
}
