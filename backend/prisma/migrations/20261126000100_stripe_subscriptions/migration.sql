ALTER TABLE "Membership"
  ADD COLUMN "stripeCustomerId" TEXT,
  ADD COLUMN "stripeSubscriptionId" TEXT,
  ADD COLUMN "stripeStatus" TEXT,
  ADD COLUMN "stripeCheckoutId" TEXT,
  ADD COLUMN "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;
CREATE UNIQUE INDEX "Membership_stripeCustomerId_key" ON "Membership"("stripeCustomerId");
CREATE UNIQUE INDEX "Membership_stripeSubscriptionId_key" ON "Membership"("stripeSubscriptionId");
CREATE UNIQUE INDEX "Membership_stripeCheckoutId_key" ON "Membership"("stripeCheckoutId");
CREATE TABLE "StripeWebhookEvent" (
  "id" VARCHAR(255) PRIMARY KEY,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
