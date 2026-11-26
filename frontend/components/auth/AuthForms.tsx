"use client";
import { registrationRole } from '@/config/pricing';
import Link from "next/link";
import type { PlanId, PricingPlan, BillingInterval } from "@/config/pricing";
import { accountDestination } from "@/config/auth-routing";
import { useEffect, useId, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import {
  accountApi,
  AuthApiError,
  type AuthSession,
} from "./auth-client";
const inputClass =
  "mt-2 h-12 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-base outline-none focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/15";
export function SigninForm({ admin = false }: { admin?: boolean }) {
  const [tab, setTab] = useState<"CARE_SEEKER" | "CAREGIVER">("CARE_SEEKER");
  return (
    <>
      {!admin && (
        <div
          role="tablist"
          aria-label="Sign in account type"
          className="mb-6 grid grid-cols-2 gap-2"
        >
          {(["CARE_SEEKER", "CAREGIVER"] as const).map((role) => (
            <button
              key={role}
              id={`tab-${role}`}
              type="button"
              role="tab"
              aria-selected={tab === role}
              aria-controls="signin-panel"
              onClick={() => setTab(role)}
              className={`flex min-h-16 items-center justify-center gap-2 rounded-lg border border-[#ff2f68] text-sm font-semibold ${tab === role ? "bg-[#ff2f68] text-white" : "text-[#ff2f68]"}`}
            >
              {role === "CARE_SEEKER" ? "Care Seeker" : "Caregiver"}
            </button>
          ))}
        </div>
      )}
      <div
        id="signin-panel"
        role={admin ? undefined : "tabpanel"}
        aria-labelledby={admin ? undefined : `tab-${tab}`}
      >
        <LoginFields key={admin ? "ADMIN" : tab} role={admin ? "ADMIN" : tab} />
      </div>
    </>
  );
}
function LoginFields({
  role,
}: {
  role: "ADMIN" | "CARE_SEEKER" | "CAREGIVER";
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy) return;
        const data = new FormData(event.currentTarget);
        setBusy(true);
        setError("");
        try {
          const response = await accountApi<{ data: AuthSession }>(
            "auth/login",
            {
              method: "POST",
              body: {
                email: data.get("email"),
                password: data.get("password"),
                role,
                remember: data.get("remember") === "on",
              },
            },
          );
          if (response.data.user.role !== role)
            throw new Error("Unexpected account type");
          window.location.replace(accountDestination(response.data.user));
        } catch (issue) {
          setError(
            issue instanceof AuthApiError
              ? issue.message
              : "Unable to sign in. Please try again.",
          );
          setBusy(false);
        }
      }}
    >
      <label htmlFor={`${id}-email`} className="block text-sm">
        Email address <span className="text-[#ff2f68]">*</span>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
          className={inputClass}
        />
      </label>
      <label htmlFor={`${id}-password`} className="block text-sm">
        Password <span className="text-[#ff2f68]">*</span>
        <span className="relative block">
          <input
            id={`${id}-password`}
            name="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            required
            maxLength={128}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute bottom-0 right-0 grid h-12 w-12 place-items-center text-[#667085]"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      <label className="flex items-center gap-2 text-sm text-[#667085]">
        <input type="checkbox" name="remember" className="accent-[#ff2f68]" />
        Remember this device
      </label>
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <button
        disabled={busy}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#ff2f68] text-white hover:bg-[#e92359] disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign In"}
        <ArrowRight size={18} />
      </button>
      {role !== "ADMIN" && (
        <p className="text-center text-sm text-[#667085]">
          New to My Carer?{" "}
          <Link href="/signup" className="font-semibold text-[#ff2f68]">
            Create an account
          </Link>
        </p>
      )}
    </form>
  );
}
export function SignupForm({
  initialRole = "CARE_SEEKER",
  initialPlanId,
  initialBillingInterval = "monthly",
  dedicatedPlan = false,
}: {
  initialRole?: "CARE_SEEKER" | "CAREGIVER";
  initialPlanId?: PlanId;
  initialBillingInterval?: BillingInterval;
  dedicatedPlan?: boolean;
}) {
  const startingRole = initialPlanId ? registrationRole(initialPlanId) : initialRole;
  const [role, setRole] = useState(startingRole);
  const [planId, setPlanId] = useState<PlanId>(
    initialPlanId ??
      (startingRole === "CAREGIVER" ? "CARER_FREE" : "FAMILY_FREE"),
  );
  const billingInterval = initialBillingInterval;
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!dedicatedPlan) return;
    let active = true;
    accountApi<{ data: PricingPlan[] }>("platform/plans?includeFamilies=true")
      .then((r) => {
        if (active) setPlans(r.data);
      })
      .catch(() => {
        if (active) setError("Unable to load packages. Please refresh.");
      });
    return () => {
      active = false;
    };
  }, [dedicatedPlan]);
  const selected = plans.find((p) => p.id === planId);
  return (
    <>
      {!dedicatedPlan && (
        <>
          <div
            className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-[#eee5e8] bg-[#f7f4f5] p-1"
            role="group"
            aria-label="Account type"
          >
            {(["CARE_SEEKER", "CAREGIVER"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={role === item}
                onClick={() => {
                  setRole(item);
                  setPlanId(
                    item === "CAREGIVER" ? "CARER_FREE" : "FAMILY_FREE",
                  );
                }}
                className={`flex min-h-11 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2f68] ${role === item ? "bg-[#ff2f68] text-white shadow-sm" : "text-[#667085] hover:bg-white hover:text-[#202925]"}`}
              >
                {item === "CARE_SEEKER" ? "Care Seeker" : "Caregiver"}
              </button>
            ))}
          </div>
        </>
      )}
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {dedicatedPlan && !selected && !error && (
        <p role="status" className="mb-4 text-sm">
          Loading your package...
        </p>
      )}
      {(!dedicatedPlan || selected) && (
        <>
          {dedicatedPlan && selected && (
            <div className="mb-5 rounded-xl border border-[#ffd3df] bg-[#fff5f8] p-4">
              <p className="text-base font-semibold">{selected.title}</p>
              <p className="mt-1 text-sm text-[#667085]">
                {new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "GBP",
                }).format(
                  (billingInterval === "annual"
                    ? selected.annualPricePence
                    : selected.pricePence) / 100,
                )}{" "}
                / {billingInterval === "annual" ? "year" : "month"}
                {selected.pricePence > 0
                  ? " after your 6-month free trial"
                  : " ? always free"}
              </p>
              {selected.pricePence > 0 && (
                <p className="mt-2 text-xs text-[#a31b47]">
                  After account approval, open Membership to activate your selected plan.
                </p>
              )}
            </div>
          )}
          <SignupFields
            key={role}
            role={role}
            planId={planId}
            billingInterval={billingInterval}
          />
        </>
      )}
    </>
  );
}
function SignupFields({
  role,
  planId,
  billingInterval,
}: {
  role: "CARE_SEEKER" | "CAREGIVER";
  planId: PlanId;
  billingInterval: BillingInterval;
}) {
  const id = useId();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy) return;
        const form = event.currentTarget;
        const data = new FormData(form);
        setError("");
        if (data.get("password") !== data.get("confirmPassword")) {
          setError("Passwords do not match.");
          return;
        }
        setBusy(true);
        try {
          const response = await accountApi<{ message: string }>(
            "auth/signup",
            {
              method: "POST",
              body: {
                firstName: String(data.get("firstName")).trim(),
                lastName: String(data.get("lastName")).trim(),
                email: data.get("email"),
                password: data.get("password"),
                confirmPassword: data.get("confirmPassword"),
                consent: data.get("consent") === "on",
                role,
                planId,
                billingInterval,
                ...(data.get("organisationName")
                  ? { organisationName: data.get("organisationName") }
                  : {}),
                phone: data.get("phone") ?? "",
                location: data.get("location") ?? "",
              },
            },
          );
          form.reset();
          setNotice(response.message);
        } catch (issue) {
          setError(
            issue instanceof AuthApiError
              ? issue.message
              : "Unable to register. Please try again.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      {notice ? (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-5 text-sm leading-6 text-green-800"
        >
          {notice}
          <Link href="/signin" className="mt-3 block font-bold underline">
            Go to sign in
          </Link>
        </div>
      ) : (
        <>
          {(planId.startsWith("HOME_") || planId.startsWith("AGENCY_")) && (
            <label className="block text-sm">
              Organisation name <span className="text-[#ff2f68]">*</span>
              <input
                name="organisationName"
                required
                maxLength={160}
                autoComplete="organization"
                className={inputClass}
              />
            </label>
          )}
          <div className="grid grid-cols-2 gap-3">
            {["firstName", "lastName"].map((name) => (
              <label
                key={name}
                htmlFor={`${id}-${name}`}
                className="block text-sm"
              >
                {name === "firstName" ? "First Name" : "Last Name"}{" "}
                <span className="text-[#ff2f68]">*</span>
                <input
                  id={`${id}-${name}`}
                  name={name}
                  required
                  maxLength={80}
                  pattern=".*\S.*"
                  autoComplete={
                    name === "firstName" ? "given-name" : "family-name"
                  }
                  className={inputClass}
                />
              </label>
            ))}
          </div>
          <label htmlFor={`${id}-email`} className="block text-sm">
            Email Address <span className="text-[#ff2f68]">*</span>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              className={inputClass}
            />
          </label>
          {["password", "confirmPassword"].map((name) => (
            <label
              key={name}
              htmlFor={`${id}-${name}`}
              className="block text-sm"
            >
              {name === "password" ? "Password" : "Confirm Password"}{" "}
              <span className="text-[#ff2f68]">*</span>
              <span className="relative block">
                <input
                  id={`${id}-${name}`}
                  name={name}
                  type={visiblePasswords[name] ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={12}
                  maxLength={128}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setVisiblePasswords((current) => ({ ...current, [name]: !current[name] }))}
                  aria-label={`${visiblePasswords[name] ? "Hide" : "Show"} ${name === "password" ? "password" : "confirm password"}`}
                  aria-controls={`${id}-${name}`}
                  aria-pressed={Boolean(visiblePasswords[name])}
                  className="absolute bottom-0 right-0 grid h-12 w-12 place-items-center rounded-lg text-[#667085] focus-visible:outline-2 focus-visible:outline-[#ff2f68]"
                >
                  {visiblePasswords[name] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
          ))}
          <p className="text-xs text-[#667085]">
            Use 12–128 characters. Avoid common passwords and reuse.
          </p>
          <label className="block text-sm">
            UK phone number (optional)
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="07712 345678 or +44 7712 345678"
              maxLength={64}
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-[#667085]">
              Use a UK mobile or landline number. Spaces, brackets and hyphens
              are accepted.
            </span>
          </label>
          <label className="block text-sm">
            Town / city (optional)
            <input
              name="location"
              autoComplete="address-level2"
              maxLength={120}
              className={inputClass}
            />
          </label>
          <label className="flex items-start gap-2 text-xs leading-5">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 accent-[#ff2f68]"
            />
            <span>
              I agree to the{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="underline"
              >
                Privacy Policy
              </Link>{" "}
              &amp;{" "}
              <Link href="/terms" target="_blank" className="underline">
                Terms &amp; Conditions
              </Link>
              .
            </span>
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#ff2f68] text-white hover:bg-[#e92359] disabled:opacity-60"
          >
            {busy ? "Creating account…" : "Create Account"}
            <ArrowRight size={18} />
          </button>
          <p className="text-center text-sm text-[#667085]">
            Already registered?{" "}
            <Link href="/signin" className="font-semibold text-[#ff2f68]">
              Sign in
            </Link>
          </p>
        </>
      )}
    </form>
  );
}
