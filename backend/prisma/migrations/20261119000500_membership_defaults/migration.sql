ALTER TABLE "Membership" ALTER COLUMN "planId" SET DEFAULT 'FAMILY_FREE', ALTER COLUMN "pricePence" SET DEFAULT 0;
UPDATE "PricingPlan" SET "entitlements" = jsonb_set("entitlements", '{agencyBadge}', CASE WHEN "id" IN ('AGENCY_GROWTH','AGENCY_GROWTH_PLUS','AGENCY_ENTERPRISE') THEN 'true'::jsonb ELSE 'false'::jsonb END, true);
