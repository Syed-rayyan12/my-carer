# Ordered acceptance testing

Use a disposable database, never production. Automated integration configuration refuses databases other than `carer_auth_test`. Keep `.env.test.local` private. Use unique fixture emails and remove only your own test records.

## Automated checks

From the repository root run `npm run test:flow`. This stops on the first failed stage: frontend types → backend types → unit/API tests → dashboard loading tests → PostgreSQL API integration. Start the disposable database configured in `backend/.env.test.local` first.

For the additional HTTP proxy/session suite, start the backend against that same test database and Next.js on port 3100, with its backend URL pointing to that backend; then run `npm --prefix backend run test:frontend`. This suite checks HTTP responses and redirects, not browser clicks.

The following acceptance steps require browser interaction. Record PASS/FAIL, actual result, account, and screenshot for every row. Automated checks alone do not certify every feature. Use separate browser profiles for each role and a second seeker for ownership checks.

## Accounts and approval (run first)

| Order | Action | Expected result |
|---|---|---|
| 1 | Register individual seeker, agency and caregiver with unique emails | Correct category; pending approval; no authenticated dashboard access |
| 2 | Try invalid phone, duplicate email, missing fields, weak password and an injected ADMIN role | Clear validation; no privileged account created |
| 3 | Sign in as admin; inspect pending registrations and each submitted profile | All three accounts appear with correct details |
| 4 | Reject a spare registration with a reason, approve the three test accounts | Rejected account cannot sign in; approved accounts can |
| 5 | Sign in through each role tab; try wrong password and wrong role | Correct dashboard; invalid combinations rejected |

## Individual care seeker

| Order | Action | Expected result |
|---|---|---|
| 6 | Complete profile, contact email, emergency contact and date of birth; refresh | Values persist; sign-in email unchanged; completion unlocks dashboard |
| 7 | Open membership; select an eligible package | Correct price, category, status and entitlements |
| 8 | Create a care requirement, view it, edit it and filter requests | Saved values, urgency and status persist |
| 9 | Browse caregivers, search/filter, open profile, save and unsave | Accurate results; saved list persists across reload |
| 10 | Send a caregiver message | Conversation visible to sender and intended recipient |

## Caregiver

| Order | Action | Expected result |
|---|---|---|
| 11 | Edit personal/professional profile, rates, qualifications, references and services | Values persist and public preview matches allowed visibility |
| 12 | Set weekly availability, minimum visit and time off | Values persist with valid dates; invalid ranges rejected |
| 13 | Submit verification documents | Pending record visible to admin; no premature verified badge |
| 14 | Choose package; test included and excluded premium features | Entitlements enforced on server and reflected in UI |
| 15 | Find seeker requirement, apply once, try duplicate, inspect applications | Correct job/application relationship; duplicates handled |
| 16 | Read and reply to seeker message | Both accounts see persisted conversation |

## Matching and completion

| Order | Action | Expected result |
|---|---|---|
| 17 | As seeker inspect responses and accept/reject candidates | Correct status on both dashboards and care arrangements |
| 18 | Manage arrangement and complete supported status transitions | Counts and statuses update after refresh |
| 19 | Submit eligible review; try an ineligible/duplicate review | Valid review persists; invalid submissions rejected |
| 20 | Inspect ratings from both roles and notification read state | Correct aggregation and notification persistence |

## Agency

Agency uses an organisation category/package; confirm its actual dashboard and enabled features rather than assuming a separate agency role.

| Order | Action | Expected result |
|---|---|---|
| 21 | Select agency package, edit organisation name/contact/coverage/services | Organisation persists; individual package cannot edit organisation |
| 22 | Edit team, gallery, branches and links at each relevant plan tier | Limits enforced; only valid HTTPS links accepted |
| 23 | Submit CQC reference and inspect public organisation listing | Submitted reference does not automatically become verified |
| 24 | Exercise agency-supported jobs, applications, messages and package tools | Organisation-owned data and correct package access |
| 25 | Open monthly reports, export, analytics and alerts where available | Allowed tools return correct data; excluded tools deny access |

## Admin audit and security (run last)

| Order | Action | Expected result |
|---|---|---|
| 26 | Inspect overview, seekers, caregivers, organisations and profile details | Counts and records match preceding actions |
| 27 | Inspect jobs, requests, applications and arrangements | Relationships and statuses match the two user dashboards |
| 28 | Approve/reject verification and CQC; reload public profiles | Only approved evidence shows verified status |
| 29 | Moderate review visibility; inspect subscriptions and change permitted membership fields | Public visibility and access reflect admin decision |
| 30 | Check admin messages, settings and supported account status actions | Saved changes persist; restricted accounts lose protected access |
| 31 | As seeker/caregiver/agency call admin URLs and another user's resource IDs | 403/404; no foreign data or writes |
| 32 | Send mutation without CSRF or from an untrusted origin | Rejected; no data changes |
| 33 | Change password, log out, revisit dashboard, reuse old session | Correct password/session invalidation and redirect behavior |
| 34 | Test caregiver hibernation/reactivation where supported | Directory visibility and dashboard state agree |
| 35 | Repeat key forms at mobile width and keyboard-only; inspect network/console | Usable layout, labelled controls, visible errors; no unexplained failures |

Release acceptance requires every applicable row to pass. Mark unsupported functionality explicitly as a gap, never PASS. Keep payment-provider settlement separate from membership entitlement checks unless a real sandbox payment integration exists.
