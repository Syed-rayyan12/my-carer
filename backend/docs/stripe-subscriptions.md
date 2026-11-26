# Stripe subscriptions

The app uses Stripe-hosted Checkout in subscription mode. Prices, currency, account category and trial length come from the backend PricingPlan record. Browser-submitted amounts are never accepted. Inline recurring prices are created from that catalogue, so no manual Price ID mapping is needed.

## Trial and annual billing

All eight paid plans currently have a six-calendar-month introductory trial for either monthly or annual billing. The annual "Save 2 months" label describes the stored annual price, not a second trial. The configured annual prices are authoritative; the backend does not calculate or apply another discount. Free plans (CARER_FREE, HOME_BASIC, FAMILY_FREE) do not use Stripe. Changing tier or restarting Checkout does not restart a used trial. Existing manual trials retain their original end date. A remaining trial shorter than Stripe Checkout's two-day minimum must finish before Checkout is available; it is not extended or charged early.

Signup and admin account approval remain separate from billing. After approval, sign in and open Membership. Choose a package and interval, then Continue to Stripe (or Start subscription for the existing selected paid plan). Checkout collects a card, charges nothing during the trial, and starts recurring billing after the displayed trial end. Only verified webhook events activate the Stripe membership, never the success redirect. Card entry happens on Stripe; this hosted integration needs no frontend publishable key.

## Where to add test keys

For Railway: existing BACKEND service -> Variables. For local development: `backend/.env` (not tracked by Git).

```dotenv
STRIPE_ENABLED=true
STRIPE_MODE=test
STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_TEST_SECRET
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_YOUR_ENDPOINT_SIGNING_SECRET
BILLING_RETURN_ORIGIN=https://YOUR_APPLICATION_FRONTEND_DOMAIN
```

Use the application frontend, not the coming-soon service. BILLING_RETURN_ORIGIN must exactly match one of the CORS_ORIGIN entries (no trailing slash). Do not add secrets to the frontend or commit `.env`. Keys must match STRIPE_MODE; test is the default. STRIPE_ENABLED defaults to false, retaining the existing manual flow until configured.

## Deployment order

1. Deploy the source and database migration. Backend pre-deploy command: `npm run db:deploy`. The migration adds Stripe IDs and a webhook event receipt table; it does not change existing memberships.
2. In the SAME Stripe sandbox as your test API key, configure the webhook URL as `https://YOUR_BACKEND_DOMAIN/api/v1/stripe/webhook`. This is the direct backend URL, not the frontend proxy or coming-soon domain. If you already made an endpoint, edit that endpoint to this URL; do not create a second one unnecessarily.
3. Subscribe to `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`, `invoice.paid`, `invoice.payment_failed`, and `invoice.payment_action_required`. Configure snapshot events. Current SDK API version is selected by the pinned Stripe SDK; older invoice event formats also have a subscription-ID fallback.
4. Copy THAT endpoint's signing secret into STRIPE_WEBHOOK_SECRET; a Stripe CLI forwarding secret is different. Add the remaining Variables above and redeploy the backend. Configure the Stripe Customer Portal in the same sandbox: enable payment-method updates and cancellation at period end; leave plan switching disabled for this release.
5. Confirm webhook event deliveries return 200. Unknown events and other applications' subscriptions are ignored; events for this app require matching account, customer, Checkout session, plan category, recurring amount, currency and interval. A processing failure returns an error so Stripe retries. Repeated IDs are processed once and events reconcile the latest Stripe subscription under an account lock.

Existing Stripe subscriptions use Manage Billing. Renewal cancellation retains access until the trial/paid period ends. New plan/interval selection is supported through Checkout before subscribing and after a subscription has ended. Mid-subscription plan switching/proration is deliberately unavailable; the portal must not offer it. Past-due renewals never extend access beyond the previously paid-through date. Admins cannot manually override Stripe-managed paid periods.

## Acceptance tests in the sandbox

Create 19 separate test accounts with unique emails and phones: 8 paid plans x 2 billing intervals, plus 3 free plans. Approve each account before signing in. Use test cards only, such as 4242 4242 4242 4242 with a future expiry and any valid CVC.

Verify each account's category, caregiver/care-seeker dashboard, plan, amount, interval, trial end, included/excluded features and Stripe customer/subscription. The role remains CAREGIVER for all provider plans and CARE_SEEKER for FAMILY_FREE. Payment success must not approve an account or change its role.

Test abandoned and repeated Checkout, wrong-category plan submission, forged and repeated webhooks, cancellation before/after trial, payment failure, payment-method recovery and renewal. Use Stripe test-clock simulations for trial/renewal lifecycle testing; application access also depends on local time, so verify date boundaries with policy tests or a controlled test environment. Advancing a Stripe test clock alone does not advance the application's clock. Do not shorten live trial configuration for tests. Verify the first invoice amount and annual renewal schedule separately from the zero-value trial invoice.

After sandbox acceptance, create/configure live-mode webhook and portal, set the live secret/signing secret and STRIPE_MODE=live in the backend service. Test and live customers/subscriptions are separate; do not reuse test membership Stripe IDs as live IDs. Use a separate database/environment for sandbox tests so test IDs never contaminate live memberships.
