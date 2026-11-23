# Backend modules and dashboard data

Review a feature in `src/modules/<feature>/`. Request flow is routes → controller → service → repository.

| File | Responsibility |
| --- | --- |
| `*.routes.ts` | HTTP method/path and authentication, role and request-protection middleware |
| `*.controller.ts` | HTTP input/output and async error forwarding |
| `*.validation.ts` | Zod body, parameter and query validation |
| `*.types.ts` | Input contracts and inferred response types |
| `*.service.ts` | Ownership, package permissions, business rules and response composition |
| `*.repository.ts` | Prisma/SQL queries, selected database fields and transaction access |

There are no mapper files. Simple response composition belongs to the owning service. Stateless package and profile policies remain named helper files. Modules without request bodies or query parameters do not need empty validation files.

## Feature ownership

- `auth`: signup, sign-in, password changes, sessions, cookies and reusable auth middleware.
- `account`: editable account profiles and the small shared access/membership shell. Care seeker profile routes live here and remain available before profile completion.
- `caregivers`: professional profiles, professional section projections, caregiver directory and application-modal profile summary.
- `care-requests`: public openings and protected care requirements.
- `applications`: applications, decisions, shortlist and accepted arrangements.
- `messages`, `saved-caregivers`, `reviews`, `verifications`: each owns its feature's reads and writes.
- `pricing`, `membership`, `organisations`, `package-tools`: plan catalogue, subscription lifecycle, organisation profiles and package tools.
- `dashboard`: bounded care seeker/caregiver overview queries and database counts.
- `notifications`: bounded header summaries, separate from message history.
- `admin`: overview, feature collections, account approvals, profile management and moderation.
- `shared`: pagination, common validation primitives, identity selects and operation context types.

`src/routes/index.ts` and `src/routes/platform.routes.ts` only assemble routers and common guards. The `/api/v1/platform` URL namespace is retained so existing action URLs continue to work; it is not a catch-all business module.

## Page data contracts

The bulk `/platform/workspace` and `/platform/admin/dashboard` endpoints have been removed.

| Screen | Data endpoint(s), relative to `/api/v1` |
| --- | --- |
| Shared care navigation | `GET /platform/account`, `GET /platform/notifications` |
| Care dashboard home | `GET /platform/overview` — counts and small lists for visible sections |
| Care seeker profile | `GET/PATCH /care-seekers/me` |
| Caregiver profile/settings | `GET/PATCH /platform/profile`, `GET /platform/professional?section=profile` |
| Caregiver services | `GET /platform/professional?section=services` |
| Caregiver availability | `GET /platform/professional?section=availability` |
| Job browsing preferences | `GET /platform/professional?section=job-preferences` |
| Professional section save | `PATCH /platform/professional` — partial update; other JSON sections are preserved |
| Application dialog | `GET /platform/application-profile` — photo and availability only |
| Requirements | `GET/POST /platform/requests`, `PATCH /platform/requests/:id` |
| Selected requirement | `GET /platform/requests?id=<uuid>` |
| Responses | `GET /platform/applications?requestId=<uuid>` |
| Arrangements | `GET /platform/applications?status=ACCEPTED` |
| Application actions | `PATCH /platform/applications/:id`, `/:id/shortlist`, `/:id/arrangement` |
| Messages | `GET/POST /platform/messages` |
| Saved caregivers | `GET/POST /platform/saved`, `DELETE /platform/saved/:id` |
| Reviews | `GET/POST /platform/reviews`, `GET /platform/reviews/candidates` for the review form |
| Verification | `GET/POST /platform/verifications` |
| Membership | `GET /platform/membership` and existing membership action routes |
| Organisation | `GET/PATCH /platform/organisation` |
| Admin home | `GET /platform/admin/overview` |
| Admin accounts/subscriptions | `GET /platform/admin/users` with role/id/view filters |
| Admin requests | `GET /platform/admin/requests` with id/owner filters; counts instead of nested application lists |
| Admin applicants/connections | `GET /platform/admin/applications?requestId=<uuid>` or `ownerId=<uuid>` |
| Admin reviews/documents | `GET /platform/admin/reviews`, `GET /platform/admin/verifications` |
| Admin messages | The same protected `/platform/messages`, scoped to the signed-in admin |

Feature collections accept `page` (starting at 1) and `limit` (default 25, maximum 100), returning `{ data, pagination: { page, limit, hasMore } }`. Overview and notification previews use fixed small limits. Counts use database count queries rather than lengths of preview arrays. A caregiver job row exposes an `applied` boolean instead of loading that caregiver's application history to decorate a card.

`components/platform/workspace-api.ts` and `components/admin/admin-api.ts` select requests by the current frontend route. The providers clear page data on navigation, ignore stale successful requests, and reload the current page after a mutation. Empty arrays in local React defaults are UI defaults, not unrelated API fields. Pagination keeps selected-record lookups on page 1 while paging their related collections.

## Verification

Run from `backend/`:

```text
npm run typecheck
npm run lint
npm test
npm run test:ui
npm run test:integration
npm run build
```

Integration tests require the explicitly configured `carer_auth_test` database. They create unique fixtures and remove only those fixtures. They exercise overview field boundaries, role isolation, ownership, CSRF, pagination and feature mutations. UI loading tests assert which endpoints each dashboard screen calls. Run `npm run typecheck` from the project root for frontend types.
