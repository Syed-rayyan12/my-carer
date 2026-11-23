# My Carer backend

Express 5, strict TypeScript, PostgreSQL, and Prisma 7 monolith. The working tree includes caregiver/care seeker authentication, admin approval and platform business modules. See [current work status](docs/work-status.md) for verified checks and remaining acceptance/setup work.

## Start locally

Use Node 26 LTS and npm. Docker Compose is optional if PostgreSQL is already installed.

1. Work from `backend/`, run `npm ci`, and copy `.env.example` to `.env` if needed.
2. Set a working `DATABASE_URL`. The example matches the Compose development credentials. If PostgreSQL already occupies port 5432, use its credentials or free the port before running Compose.
3. Run `npm run db:up` only when using Docker.
4. Run `npm run db:generate`, then `npm run db:deploy` to apply the included auth migration without a database reset.
5. Temporarily set `ADMIN_SEED_EMAIL` and a unique `ADMIN_SEED_PASSWORD` (12–128 characters) in `.env`. Run `npm run admin:create`, then remove the password from `.env`. This command never overwrites existing accounts and creates no default credentials.
6. Run `npm run dev`. In another terminal at the repository root, run `npm run dev` for Next.js.
7. Open `/signup` or `/signin`; use `/admin/signin` for the provisioned admin. Approve new Care Seekers on `/admin-dashboard` or `/admin-dashboard/care-seekers`.

Next's server-only `BACKEND_URL` defaults to `http://127.0.0.1:4000`. Change it in the frontend environment when the API runs elsewhere. Browser requests use `/api`, keeping cookies on the frontend origin. Backend `CORS_ORIGIN` must exactly include that origin, including its port. No email verification is required: new accounts stay pending until admin approval.

Same-browser tabs can now use separate accounts, including accounts of the same role. Session tokens remain in HttpOnly cookies; a non-secret per-tab context selects the cookie at the Next gateway. See [session isolation and startup troubleshooting](docs/session-isolation.md) for behavior, verification and local PostgreSQL recovery. `DATABASE_POOL_MAX` defaults to 5 connections per API process.

The migration was applied successfully to an isolated PostgreSQL test database during development. The configured application database on localhost:5432 rejected the example credentials (P1000), so applying it there and provisioning the real admin still require valid local configuration. Existing PostgreSQL users/databases were not altered.

## Scripts

| Script | Purpose |
| --- | --- |
| `dev` | tsx watch server |
| `build` / `start` | Compile source / run compiled server |
| `lint` / `lint:fix` | ESLint check / fixes |
| `format` | Prettier formatting |
| `typecheck` | Strict source type checking |
| `test` | Health, auth validation/crypto, production cookie/error tests |
| `test:integration` | Real PostgreSQL API/security tests using `.env.test.local` |
| `test:frontend` | Next-to-Express HTTP tests with local isolated servers |
| `db:generate` | Generate ignored Prisma client |
| `db:migrate` | Create future development migrations |
| `db:deploy` | Apply included migrations without resetting data |
| `db:studio` | Prisma Studio |
| `db:up` / `db:down` | Start/stop Compose; named data volume is retained |
| `admin:create` | Provision initial admin from temporary environment credentials |

## Architecture

Future and current modules follow route → controller → service → repository → PostgreSQL. Only repositories perform business Prisma queries. `config/db.ts` owns the shared client and infrastructure probes. `app.ts` configures Express without listening; `server.ts` verifies the database before listening and manages shutdown.

- `prisma/`: schema and versioned SQL migration.
- `src/config/`: typed environment, shared database connection, redacting logger.
- `src/modules/auth/`: validation, password/session crypto, middleware, controllers, services, repository, admin provisioning.
- `src/middlewares/`: request logging/IDs, rate limiting, consistent error responses.
- `src/routes/`: `/api/v1` mount and health endpoints.
- `src/types/`: Express auth request augmentation.
- `tests/`: unit/HTTP and opt-in PostgreSQL integration checks.
- `docs/auth-api.md`: endpoint table, requests/responses, security behavior, and deployment limits.

`GET /api/v1/health` is liveness without a DB query; `/health/ready` probes `SELECT 1` and returns 503 on failure. Invalid environment input exits early with readable field errors. SIGINT/SIGTERM drain HTTP, disconnect Prisma, then exit, with a 15-second shutdown bound. Startup/fatal errors exit with code 1.

## Environment and production

Required variables are documented in `.env.example`. Only `src/config/env.ts` accesses `process.env`. Optional session settings default to a 12-hour absolute session, 30-day remembered session, and 60-minute idle timeout. Passive session polling does not renew idle expiry. Cookies and session revocation are enforced server-side.

Set `NODE_ENV=production`, use HTTPS, explicit CORS origins, and an accurate reverse-proxy configuration. Keep database and admin credentials out of Git. Configure rate limiting at trusted ingress for multi-user production traffic; the Next gateway deliberately does not forward untrusted IP headers, so backend IP quotas are shared by gateway clients. See the API guide for exact boundaries.

## Checks

Generate the client first, then run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. To run DB tests, provide `.env.test.local` with a dedicated `DATABASE_URL` whose database name is `carer_auth_test`, apply the migration to that database, then run `npm run test:integration`. Never point tests at application or production data. The frontend HTTP suite additionally needs its local servers running as described in the API guide.

The project targets Node 26 LTS; the available development machine currently runs Node 24.10.0. Verify the deployment on the target Node LTS runtime as well.

## Feature module and page API guide

See [backend-structure.md](docs/backend-structure.md) for feature ownership, the route/controller/service/repository structure, page-specific endpoints and test commands.

## Railway backend deployment

Set the backend service root directory to `/backend` and provide the runtime variables listed in `.env.example` through Railway Variables, including `DATABASE_URL` and the exact frontend `CORS_ORIGIN`.

- Build command: `npm run build` (generates the Prisma client, then compiles TypeScript).
- Pre-deploy command: `npm run db:deploy` (applies committed migrations before the new backend starts).
- Start command: `npm run start`.

Keep Prisma CLI available in the deployment image for the pre-deploy command. Do not enable dependency pruning that removes it without moving Prisma to production dependencies.

Prisma generation only needs the schema and does not connect to the database. Database migration requires the database service to be running and reachable; Railway pre-deploy commands can reach its private network. Do not use `prisma migrate dev` or reset commands against the deployed database.
