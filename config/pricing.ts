export type PlanId =
  | "CARER_FREE"
  | "CARER_VERIFIED"
  | "CARER_PRO"
  | "HOME_BASIC"
  | "HOME_ENHANCED"
  | "HOME_PREMIUM"
  | "AGENCY_STARTER"
  | "AGENCY_GROWTH"
  | "AGENCY_GROWTH_PLUS"
  | "AGENCY_ENTERPRISE"
  | "FAMILY_FREE";
export type BillingInterval = "monthly" | "annual";
export type PricingPlan = {
  id: PlanId;
  category: "CAREGIVER" | "CARE_HOME" | "CARE_AGENCY" | "CARE_SEEKER";
  tier: string;
  title: string;
  subtitle: string;
  pricePence: number;
  annualPricePence: number;
  trialMonths: number;
  currency: string;
  defaultRole: "CARE_SEEKER" | "CAREGIVER";
  features: string[];
  featureRows: { section: string; label: string; value: string }[];
  entitlements: Record<string, boolean | number | null>;
};
export const formatPrice = (pence: number, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: pence % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(pence / 100);
