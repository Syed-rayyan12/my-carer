"use client";
import { registrationRole } from '@/config/pricing';
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Gift,
  House,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { accountApi } from "@/components/auth/auth-client";
import { SignupModal } from "@/components/website/SignupModal";
import {
  formatPrice,
  type PricingPlan,
  type BillingInterval,
} from "@/config/pricing";
import styles from "./PricingSection.module.css";
const categories = [
  {
    id: "CAREGIVER",
    label: "Individual carers",
    name: "Individual carer",
    icon: UsersRound,
    description:
      "A place to grow your independent care career. Choose the visibility and tools that suit you.",
  },
  {
    id: "CARE_HOME",
    label: "Care homes",
    name: "Care home",
    icon: House,
    description:
      "Help families discover your home, build trust, and connect with your next team member.",
  },
  {
    id: "CARE_AGENCY",
    label: "Care agencies",
    name: "Care agency",
    icon: Building2,
    description:
      "From your first recruitment listing to a multi-branch agency. Find the right level for your organisation.",
  },
] as const;
export default function LivePricing({ home = false }: { home?: boolean }) {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [category, setCategory] = useState("CAREGIVER");
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [selected, setSelected] = useState<{
    plan: PricingPlan;
    interval: BillingInterval;
  } | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    accountApi<{ data: PricingPlan[] }>("platform/plans")
      .then((r) => {
        if (active) { setPlans(r.data); setError(""); }
      })
      .catch(() => {
        if (active)
          setError("We could not load the latest packages. Please try again.");
      });
    return () => {
      active = false;
    };
  }, [retry]);
  const group = categories.find((c) => c.id === category)!;
  const visible = plans.filter((p) => p.category === category);
  const Icon = group.icon;
  const featureRows = visible[0]?.featureRows ?? [];
  return (
    <section
      id="pricing"
      aria-labelledby={home ? "home-pricing-title" : "pricing-section-title"}
      className={styles.section}
    >
      <div className={styles.container}>
        <div className={styles.intro}>
          <div>
            <span className={styles.eyebrow}>A plan for your next step</span>
            <h2 id={home ? "home-pricing-title" : "pricing-section-title"}>
              Care that connects.
              <br />
              Pricing that makes sense.
            </h2>
          </div>
          <p>
            From independent carers to growing care organisations, find the
            right tools for the way you work.
          </p>
        </div>
        <div className={styles.offer}>
          <span className={styles.offerIcon}>
            <Gift size={23} />
          </span>
          <div>
            <strong>Your first 6 months are on us.</strong>
            <p>
              All paid plans include a six-month launch trial. No card required
              to start.
            </p>
          </div>
          <span className={styles.offerBadge}>Launch offer</span>
        </div>
        <div className={styles.toolbar}>
          <div
            role="group"
            aria-label="Choose your account category"
            className={styles.categories}
          >
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={styles.category}
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
              >
                <c.icon size={18} />
                {c.label}
              </button>
            ))}
          </div>
          <div
            role="group"
            aria-label="Billing interval"
            className={styles.cycles}
          >
            <button
              type="button"
              aria-pressed={interval === "monthly"}
              onClick={() => setInterval("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={interval === "annual"}
              onClick={() => setInterval("annual")}
            >
              Annually<span className={styles.saving}>Save 2 months</span>
            </button>
          </div>
        </div>
        <p className={styles.groupDescription}>{group.description}</p>
        {error ? (
          <div role="alert" className={styles.error}>
            {error}
            <button type="button" onClick={() => setRetry((n) => n + 1)}>
              Try again
            </button>
          </div>
        ) : (
          <div
            className={`${styles.grid} ${visible.length === 4 ? styles.four : ""}`}
          >
            {!plans.length &&
              [0, 1, 2].map((i) => (
                <div key={i} className={styles.skeleton} aria-hidden="true" />
              ))}
            {!plans.length && (
              <span role="status" className="sr-only">
                Loading packages
              </span>
            )}
            {visible.map((plan, index) => {
              const enhanced = index === 1;
              const amount =
                interval === "annual" ? plan.annualPricePence : plan.pricePence;
              const features = plan.features.slice(0, home ? 6 : 9);
              return (
                <article
                  key={plan.id}
                  className={`${styles.card} ${enhanced ? styles.cardAccent : ""}`}
                  aria-labelledby={`plan-${home ? "home-" : ""}${plan.id}`}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.tierIcon}>
                      <Icon size={22} strokeWidth={1.6} />
                    </span>
                    {plan.pricePence === 0 ? (
                      <span className={styles.tag}>Always free</span>
                    ) : (
                      <span className={styles.tag}>6 months free</span>
                    )}
                  </div>
                  <h3 id={`plan-${home ? "home-" : ""}${plan.id}`}>
                    {plan.tier}
                  </h3>
                  <p className={styles.audience}>{group.name}</p>
                  <div className={styles.priceRow}>
                    <strong className={styles.price}>
                      {formatPrice(amount, plan.currency)}
                    </strong>
                    <span className={styles.period}>
                      / {interval === "annual" ? "year" : "month"}
                    </span>
                  </div>
                  <p className={styles.annualNote}>
                    {amount === 0
                      ? "Your free listing. No subscription charge."
                      : interval === "annual"
                        ? `${formatPrice(amount, plan.currency)} billed annually after your trial.`
                        : `Monthly price after your six-month trial.`}
                  </p>
                  <p className={styles.trial}>
                    {plan.pricePence === 0
                      ? "Start with the essentials."
                      : "Pay nothing for your first 6 months."}
                  </p>
                  <button
                    type="button"
                    className={styles.cta}
                    onClick={() => setSelected({ plan, interval })}
                  >
                    {plan.pricePence === 0
                      ? "Get started free"
                      : "Start your free trial"}
                    <ArrowRight size={16} />
                  </button>
                  <div className={styles.features}>
                    <p className={styles.featuresLabel}>
                      Included in {plan.tier}
                    </p>
                    <ul>
                      {features.map((feature) => (
                        <li key={feature}>
                          <Check size={15} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.features.length > features.length && (
                      <a
                        href={
                          home
                            ? "/pricing#compare-packages"
                            : "#compare-packages"
                        }
                        className={styles.more}
                      >
                        Explore all {plan.features.length} features{" "}
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <div className={styles.footer}>
          <span>
            <LockKeyhole size={14} />
            No card to start
          </span>
          <span>
            <Gift size={14} />6 months free on paid plans
          </span>
          <span>
            <ShieldCheck size={14} />
            Approval before access
          </span>
        </div>
        {!home && visible.length > 0 && (
          <details id="compare-packages" className={styles.comparison} open>
            <summary>
              Every detail, side by side <ChevronDown size={18} />
            </summary>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <caption>
                  Compare {group.name.toLowerCase()} packages. Prices are in
                  GBP; annual prices apply after the launch trial.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Features &amp; service levels</th>
                    {visible.map((p) => (
                      <th key={p.id} scope="col">
                        {p.tier}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureRows.map((row, index) => {
                    const newSection =
                      index === 0 ||
                      featureRows[index - 1].section !== row.section;
                    return (
                      <FeatureRow
                        key={row.label}
                        row={row}
                        newSection={newSection}
                        plans={visible}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>
        )}
        <div className={styles.help}>
          <div>
            <strong>Finding care for yourself or a loved one?</strong>
            <p>
              Care Seeker registration remains free. Start by telling us the
              care you need.
            </p>
          </div>
          <Link className={styles.link} href="/signup">
            Create a Care Seeker account <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        {home && (
          <p className="mt-6 text-center">
            <Link href="/pricing" className={styles.link}>
              Compare every package &amp; feature{" "}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </p>
        )}
      </div>
      {selected && (
        <SignupModal
          key={`${selected.plan.id}-${selected.interval}`}
          dedicatedPlan
          initialRole={registrationRole(selected.plan.id)}
          initialPlanId={selected.plan.id}
          initialBillingInterval={selected.interval}
          title={`${selected.plan.tier} registration`}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
function FeatureRow({
  row,
  newSection,
  plans,
}: {
  row: PricingPlan["featureRows"][number];
  newSection: boolean;
  plans: PricingPlan[];
}) {
  return (
    <>
      {newSection && (
        <tr className={styles.sectionRow}>
          <th colSpan={plans.length + 1} scope="colgroup">
            {row.section}
          </th>
        </tr>
      )}
      <tr>
        <td>{row.label}</td>
        {plans.map((p) => {
          const value =
            p.featureRows.find((r) => r.label === row.label)?.value ?? "—";
          return (
            <td key={p.id}>
              {value === "✓" ? (
                <Check
                  size={16}
                  aria-label="Included"
                  className={`${styles.yes} mx-auto`}
                />
              ) : value === "—" ? (
                <X
                  size={14}
                  aria-label="Not included"
                  className={`${styles.no} mx-auto`}
                />
              ) : (
                value
              )}
            </td>
          );
        })}
      </tr>
    </>
  );
}
