# Work status — 22 November 2026

## Recovered work

The working tree contains the platform implementation beyond the committed backend foundation. It includes role-based signup/sign-in, approval, personal and professional profiles, care requirements, caregiver discovery and saved profiles, applications and arrangements, messages, reviews, verification, memberships and pricing, organisation profiles, package tools, notifications and blog management. See `backend-structure.md` for API ownership and `document-pricing-implementation.md` for package behavior and service limitations.

## Recovery and checks

- Frontend and backend TypeScript checks pass.
- Frontend production build passes (65 generated pages); backend compilation passes.
- Backend unit/API tests: 101 pass.
- Dashboard endpoint-loading, tab-context, public navigation and profile-rendering tests: 20 pass.
- PostgreSQL authentication/platform/profile integration tests: 36 pass.
- Next-to-Express HTTP proxy/session tests: 6 pass, using isolated test servers which were stopped after the run. With the profile checks, the recorded suites contain 163 passing tests.
- Frontend ESLint has no errors (existing warnings remain); backend ESLint passes.
- Recovered the existing disposable PostgreSQL cluster after the shutdown. Windows denied binding its former port 55432; it now runs on 127.0.0.1:55439. The private `backend/.env.test.local` was updated accordingly. Application database configuration was not changed.
- Corrected lint issues in maintenance scripts/tests and dashboard code, including form resets and stable membership date bounds. Async HTTP loader and browser-storage synchronization exceptions are documented at their call sites.

## Acceptance and external setup still outstanding

Same-browser multi-account support and backend startup recovery are documented in `session-isolation.md`. Accounts now select separate HttpOnly cookies through per-tab contexts; pgAdmin connection exhaustion and a duplicate backend instance were diagnosed and resolved locally.

Passing automated tests does not certify all browser interactions. The 35-row browser acceptance checklist in `testing-flow.md` remains unverified in this recovery session, including mobile and keyboard checks.

External setup remains as described in `document-pricing-implementation.md`: automatic payments, CQC imports, private file storage, map/geocoding, profile-view instrumentation, email/support delivery and provider-specific ATS/CRM connections. Membership payment activation is manual. Do not describe these services as connected.

## Repository state

The branch was seven commits ahead of origin when recovery started, with extensive uncommitted platform work. Recovery changes have not been committed, pushed or deployed. Preserve the working tree; do not reset or clean it.

Resume automated verification with `npm run test:flow` from the project root, with the disposable test database running. Follow with the HTTP suite and browser checklist before release acceptance.
