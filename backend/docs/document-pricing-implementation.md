# Client document pricing implementation

Source: `public/My-Carer-Pricing.docx`. Every source table cell is retained in `pricing-source.json`; the extracted ten-tier catalogue is recorded in `pricing-catalogue.json`. The database is the runtime source for prices, comparison rows and entitlements.

| Category | Tier | Monthly GBP | Annual GBP |
| --- | --- | ---: | ---: |
| Individual carer | Free | 0 | 0 |
| Individual carer | Verified | 9.99 | 99 |
| Individual carer | Pro | 19.99 | 199 |
| Care home | Basic | 0 | 0 |
| Care home | Enhanced | 79 | 790 |
| Care home | Premium | 149 | 1,490 |
| Care agency | Starter | 49 | 490 |
| Care agency | Growth | 129 | 1,290 |
| Care agency | Growth+ | 129 | 1,290 |
| Care agency | Enterprise | 249 | 2,490 |

The document contains three categories, rather than the previous four. Care Seeker registration remains a separate free account, pending client confirmation; Local Authority is absent from public pricing. Existing accounts are retained. Growth and Growth+ have identical monthly prices and feature columns in the source. The stated Agency annual £1,290 rate is applied to both £129 tiers.

## Account and trial behaviour

- Authentication roles remain Admin, Care Seeker and Caregiver. Carer packages require Caregiver; Care Home and Agency packages use Care Seeker authentication with their distinct organisation category.
- Pricing cards fix the selected category/tier. Their signup popups have no role tabs or package selector. Monthly/annual billing is carried from the pricing page.
- The server chooses the price from the catalogue. Signup rejects supplied prices, trial dates, admin roles and incompatible package/role combinations. Organisation signup requires an organisation name.
- Paid tiers start a six-calendar-month free trial on the first account approval, without a payment or card. Month-end dates are clamped correctly. A first upgrade from a free tier can also start that one trial.
- Tier or billing changes within a category retain the original trial dates. Expired trials cannot be restarted. Changing account category through the membership endpoint is blocked.
- Paid period changes require the current paid period to end. Cancellation preserves trial/paid access until its recorded end. Expiry is evaluated on every protected action; no background timer is required.
- Payment activation remains manual and requires an administrator to record payment evidence. There is no automatic card charge or payment webhook integration.
- Approved Care Seeker/organisation users must still complete their personal profile before dashboard access. Completed organisation accounts enter the organisation dashboard.

## Implemented actions and enforcement

- Individual carer: basic profile and postcode directory search; 1/5/unlimited specialism limits; bio, qualifications, calendar, DBS/right-to-work reference submission, direct messaging, review responses, in-dashboard agency job alerts and activity analytics according to tier. Historic paid fields and badges are removed from public directory responses when not entitled. Paid membership never grants a verified badge without an approved verification.
- Organisation profile: contact details, coverage text, service details, gallery URL limits, team description, fee range, virtual-tour URL and Enterprise branch records. Public listings show only entitled fields.
- Administrator-reviewed CQC ratings require an official CQC source URL. Unverified/self-supplied CQC references do not create public ratings.
- Job postings: Home Basic 0, Home Enhanced 3, Home Premium unlimited; Agency Starter 3, Growth/Growth+ 10, Enterprise unlimited. Limits apply to open postings, with transactions and row locks to protect creation/reopening races. Closed postings release capacity. The document does not specify a monthly reset, so no reset is invented.
- Growth and Enterprise: applicant shortlisting and verification filters. Application ownership and decisions remain protected.
- Reviews: collection requires an accepted application or a two-way enquiry conversation, plus the recipient's package permission. Entitled recipients can respond or flag a review for administrator review. Organisation listings provide an invitation/share link and a review form.
- Agency Growth and higher: actual organisation entries can appear in a homepage carousel and carry the agency badge. Enterprise and Home Premium receive top listing placement; Pro carers receive featured placement.
- Analytics use actual job, application, incoming-message and review records. Enterprise can download a monthly activity CSV and authenticated recruitment JSON export. These are records owned by the signed-in organisation, not fabricated dashboard totals.

## Services still requiring setup

These source-document services are represented in package comparisons, but are not claimed as connected:

- Automatic CQC preload/import and refresh: requires a verified dataset or configured data source. Manual administrator verification is available.
- Secure profile photos and certificate file uploads: require a private storage/upload service. Organisation galleries currently use HTTPS image URLs; verification uses certificate references.
- Coverage-area maps and geocoding: coverage is currently stored and displayed as text.
- Actual profile-view tracking and full listing/enquiry conversion analytics: activity counts are available; view events are not instrumented.
- Email job alerts, chat support, priority support queues and dedicated account managers: require notification/support provider configuration and operational staffing. Dashboard job alerts are available.
- Scheduled report delivery, live ATS/CRM adapters, scoped integration API keys and a public integration API contract: require the chosen providers and credentials. Authenticated owner-scoped JSON export and monthly CSV download are available.

## Verification

- `npm test -- --maxWorkers=1` includes document-cell fidelity, price checks, role/package validation, trial boundaries and protected profile-field tests.
- `node scripts/verify-document-pricing.mjs` starts an isolated HTTP listener, creates clearly identified QA accounts, tests all eleven account/package combinations and removes only those records in a `finally` block. It tests real PostgreSQL transactions, approval trials, annual quotes, restrictions, concurrent job quotas, shortlisting, review responses and trial expiry.
- Frontend TypeScript checks and served Next.js page/CSS checks cover the pricing/homepage and new dashboard routes. Native browser screenshot capture was unavailable; no visual screenshot approval is claimed.
