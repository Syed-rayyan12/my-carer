# Care Seeker authentication API

Express base: `http://localhost:4000/api/v1`. Browser requests go through the same-origin Next.js gateway at `/api`.

This phase implements Care Seeker authentication, profile management, password changes, and authenticated admin approval. Caregiver tabs are visible but disabled; public signup never accepts `ADMIN` or `CAREGIVER`. Email verification is intentionally absent. Password recovery and two-factor enrolment are not implemented in this phase.

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Guest | Create pending Care Seeker and profile atomically |
| POST | `/auth/login` | Guest | Sign in as `CARE_SEEKER` or provisioned `ADMIN` |
| GET | `/auth/me` | Session | Return current user and session-bound CSRF token |
| POST | `/auth/logout` | Session + CSRF | Revoke this browser's session |
| POST | `/auth/password` | Session + CSRF | Change password and revoke all sessions |
| GET | `/care-seekers/me` | Care Seeker | Read own profile |
| PATCH | `/care-seekers/me` | Care Seeker + CSRF | Update own profile; cannot change login email or role |
| GET | `/admin/registrations` | Admin | Latest 100 Care Seeker registrations |
| PATCH | `/admin/registrations/:id/status` | Admin + CSRF | Approve, reject, or suspend a Care Seeker |

All mutation requests require `Content-Type: application/json` and an `Origin` matching `CORS_ORIGIN`. Authenticated mutations also require `X-CSRF-Token` from `/auth/me` or successful login. Cookies are sent automatically by same-origin browser fetch; JavaScript never reads the session cookie. API clients must retain cookies themselves. Never put session tokens in URLs or browser storage.

## Signup

```http
POST /api/v1/auth/signup
Origin: http://localhost:3000
Content-Type: application/json

{
  "firstName": "Aisha",
  "lastName": "Khan",
  "email": "aisha@example.com",
  "password": "a unique long passphrase",
  "confirmPassword": "a unique long passphrase",
  "role": "CARE_SEEKER",
  "consent": true,
  "phone": "+44 7700 900123",
  "location": "Manchester"
}
```

Phone and location are optional. Email is trimmed, normalized to lowercase, and unique across account roles. First/last names contain letters and are each at most 80 characters. Passwords are 12–128 characters with no leading/trailing whitespace; repeated-character passwords and a small local list of common passwords are rejected. This is not a comprehensive breached-password screening service. Confirmation is validated and never stored. Unknown properties such as `status`, `userId`, and privileged roles are rejected.

201 response, without a session cookie:

```json
{
  "status": "success",
  "message": "Your account is awaiting admin approval. You can sign in after approval."
}
```

Duplicate email: 409. Invalid fields/consent/mismatched passwords: 400. Disallowed origin: 403. Repeated registrations: 429.

## Login and approval

```json
{
  "email": "aisha@example.com",
  "password": "a unique long passphrase",
  "role": "CARE_SEEKER",
  "remember": false
}
```

Pending account, after validating the password: 403.

```json
{ "status": "error", "message": "Your account is awaiting admin approval." }
```

Admin approves with `PATCH /admin/registrations/<user-id>/status`:

```json
{ "status": "ACTIVE" }
```

Reject a pending registration with `{"status":"REJECTED","reason":"Details incomplete"}`. Suspend an active account with `{"status":"SUSPENDED","reason":"Account review"}`. Both require a nonempty reason. Approval/reenabling, status history, and session revocation happen in one transaction. Login and approval operations lock the user row to avoid issuing sessions during a suspension or password change.

Successful login: 200 plus an HttpOnly cookie.

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "<user-id>",
      "firstName": "Aisha",
      "lastName": "Khan",
      "email": "aisha@example.com",
      "role": "CARE_SEEKER",
      "status": "ACTIVE"
    },
    "csrfToken": "<session-bound-csrf-token>"
  }
}
```

Wrong credentials/role: 401. Five failed attempts lock that account for 15 minutes, including across restarts. Authentication requests also have an in-memory 20-per-15-minute IP limiter; signup has a 5-per-hour limiter. Password hashing has a separate concurrency bound. A currently authenticated browser cannot switch accounts through login/signup: it must log out first (409).

## Sessions and device isolation

- Each login generates a fresh random 256-bit token. Only its SHA-256 hash is stored in PostgreSQL.
- Cookies are host-only, HttpOnly, SameSite=Lax, Path=/; production adds Secure and the `__Host-` prefix. No session secret is returned in JSON.
- Without Remember, the browser cookie is a session cookie and the database session lasts at most `SESSION_HOURS` (12 by default). Remember sets a persistent cookie capped at `SESSION_REMEMBER_DAYS` (30 by default).
- `SESSION_IDLE_MINUTES` defaults to 60. Passive `/auth/me` polling does not extend idle lifetime. Foreground activity can send `X-Session-Activity: 1`; absolute expiry is never extended.
- Every protected API request checks the database session and the current user's active status. Browser redirects are an additional UI guard, never the authorization boundary.
- Device A's cookie is independent of device B's cookie. Device B remains anonymous until it signs in. Logout revokes only that session; password changes and suspension revoke every session for that account.
- Tabs in the same browser profile share cookies. Logout is broadcast to those tabs. No promise is made that a stolen/copied bearer cookie is unusable elsewhere; HTTPS and protection of the browser remain necessary.
- Authenticated users are redirected from signup/sign-in to their dashboard. Anonymous/wrong-role requests to dashboards fail closed. Auth data and gateway responses use `no-store`; focus and back/forward restoration recheck the session.

## Profile and password

Profile fields: `firstName`, `lastName`, contact `email`, `phone`, `dateOfBirth` (`YYYY-MM-DD` or empty), `location`, `address`, `postcode`, `about`, `emergencyName`, `relationship`, `emergencyPhone`, and `language`. Allowed languages match the UI. GET also returns read-only `accountEmail`. Omit that read-only property from PATCH. Profile contact email is separate from login email. User ownership comes exclusively from the session, not a submitted ID. Phone numbers, when supplied, have 7–15 digits. Future/impossible birth dates and oversized fields are rejected.

Password change request:

```json
{
  "currentPassword": "current password",
  "newPassword": "a different long passphrase",
  "confirmPassword": "a different long passphrase"
}
```

After a successful change, all sessions are revoked and the cookie is cleared. Users must sign in again. Passwords use Node's scrypt with random salts, N=131072, r=8, p=1, and timing-safe comparisons.

## Deployment boundaries

Set `NODE_ENV=production`, use HTTPS, explicit `CORS_ORIGIN`, private access to PostgreSQL, and a suitably sized Node process. The Next gateway forwards only allowlisted paths and headers, bounds request bodies to 16 KiB, and never trusts user-supplied account IDs for ownership.

The gateway intentionally does not forward untrusted client IP headers. Consequently, backend IP limits are shared by gateway clients. Before a multi-user production rollout, configure ingress rate limiting with trustworthy client addresses and size these limits for expected traffic; do not blindly trust client-supplied forwarded headers. In-memory IP limits are per backend process; account lockout remains database-backed. Expired/revoked session records are rejected but not automatically purged yet.

Other dashboard modules still contain preview data and are not implemented as business APIs in this phase. Their browser storage is scoped by authenticated user ID; the live profile and auth credentials do not use localStorage. Admin metrics/other sections are labelled as preview; account approval panels use PostgreSQL.

## Verification evidence

`npm test` runs health, validation/crypto, and production-cookie/error-response checks. `npm run test:integration` runs against the explicit disposable database in `.env.test.local`; the database name must be `carer_auth_test`. It covers the approval lifecycle, role/field tampering, CSRF/origin checks, separate device sessions, cross-user profile isolation, logout, suspension, password-change revocation, expiry, passive polling, lockout, and throttling. It deletes only its own fixtures.

Sanitized responses captured by the database suite are written to `coverage/auth-api-responses.json`. Session secrets are not included. `npm run test:frontend` additionally tests the actual Next-to-Express HTTP path on localhost:3100, against an isolated backend on port 4010 configured with `CORS_ORIGIN=http://localhost:3100`. It verifies cookie forwarding, route redirects, account approval, anonymous device isolation, body limits, and logout.

References: [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [Node crypto](https://nodejs.org/api/crypto.html).
