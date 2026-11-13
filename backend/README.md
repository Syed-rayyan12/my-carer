# Backend foundation

Standalone Express 5 / TypeScript monolith skeleton with PostgreSQL and Prisma 7. No authentication, models, business modules, or migrations are included.

## Prerequisites

- Node.js 26 LTS (26.13.0 or later in the 26.x line) and npm.
- Docker Engine/Desktop with Compose v2, or an existing PostgreSQL instance.
- Git for version control; this backend uses the existing parent repository.

TypeScript is intentionally on the approved 6.0.x line: the current TypeScript ESLint release does not support TypeScript 7. Other dependencies use stable versions, locked in `package-lock.json`. Prisma CLI, client, and PostgreSQL adapter use the same 7.x release; the npm `latest` CLI tag currently points to a Prisma 8 release candidate.

## Local setup

Run commands from `backend/` so the environment loader and Prisma resolve the correct files.

```sh
cd backend
nvm install 26
nvm use 26
npm ci
```

If `.env` does not exist, copy `.env.example` to `.env` (`Copy-Item .env.example .env` in PowerShell, or `cp .env.example .env` on Unix). A local `.env` is already provided in the initial setup and is ignored by Git. The example contains public local-development credentials, not production secrets.

```sh
npm run db:up
npm run db:generate
npm run dev
```

The API listens on port 4000 by default:

- `GET http://localhost:4000/api/v1/health`: liveness, no database call, status and process uptime in seconds.
- `GET http://localhost:4000/api/v1/health/ready`: executes `SELECT 1`, returning 503 if the database is unavailable.

The server verifies database connectivity before opening its HTTP port. `app.ts` can be imported independently without listening or connecting. Readiness uses the infrastructure helper in `config/db.ts`; future business queries belong exclusively in repositories.

Compose needs host port 5432 to be free. If you already run PostgreSQL on that port, set `DATABASE_URL` to valid credentials for that instance instead, or stop that instance before starting Compose. The setup does not modify existing PostgreSQL users or databases.

No migration is needed for this empty schema. After setting `DATABASE_URL` and later adding your first model, the exact command to create and apply the first development migration is:

```sh
npm run db:migrate -- --name init
```

For production, apply existing, reviewed migrations using `npm run db:deploy`. No migration has been generated or run by this setup.

## Configuration

Only `src/config/env.ts` accesses `process.env`. It loads `.env` with Node's built-in loader, preserves externally supplied values, validates with Zod, and exits with readable field errors if invalid. Never commit deployment secrets.

| Variable               | Meaning                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `PORT`                 | HTTP port, 1–65535                                                                             |
| `NODE_ENV`             | `development`, `test`, or `production`                                                         |
| `DATABASE_URL`         | PostgreSQL connection URL; matches Compose in the example                                      |
| `CORS_ORIGIN`          | Comma-separated HTTP(S) origins, without trailing slashes; `*` allowed only outside production |
| `LOG_LEVEL`            | Pino level from `trace` to `fatal`, or `silent`                                                |
| `RATE_LIMIT_WINDOW_MS` | Positive rate-limit window in milliseconds                                                     |
| `RATE_LIMIT_MAX`       | Maximum requests per client IP in that window                                                  |
| `TRUST_PROXY`          | Trusted reverse-proxy hop count; defaults to `0`                                               |

Set `TRUST_PROXY` to match your actual network topology. All paths to the server must have the configured number of proxy hops, and the proxy must sanitize forwarded headers. The default rate-limit store is in memory, suitable for this single-process skeleton; limits reset on restart. Health routes are subject to the global limiter.

Logs are pretty in development and JSON in test/production. Requests receive generated `X-Request-Id` values. Request bodies, query strings, and headers are omitted from request logs; common secret fields and database credentials are redacted. Production error responses omit internal details and stack traces. 5xx failures log the error server-side.

SIGINT/SIGTERM stop new requests, drain the HTTP server, disconnect Prisma, then exit. A 15-second deadline bounds shutdown. Startup errors, uncaught exceptions, and unhandled rejections exit with code 1.

## Scripts

| Script                | Purpose                                                             |
| --------------------- | ------------------------------------------------------------------- |
| `npm run dev`         | Run with tsx watch                                                  |
| `npm run build`       | Compile `src/` into `dist/` with tsc                                |
| `npm start`           | Run compiled server                                                 |
| `npm run lint`        | Check ESLint rules                                                  |
| `npm run lint:fix`    | Apply ESLint fixes                                                  |
| `npm run format`      | Format supported project files with Prettier                        |
| `npm run typecheck`   | Type-check source without emitting                                  |
| `npm test`            | Run Vitest and Supertest health checks                              |
| `npm run db:generate` | Generate the Prisma client; does not connect or migrate             |
| `npm run db:migrate`  | Create/apply development migrations, only when explicitly requested |
| `npm run db:deploy`   | Apply existing production migrations                                |
| `npm run db:studio`   | Open Prisma Studio                                                  |
| `npm run db:up`       | Start PostgreSQL and wait for its healthcheck                       |
| `npm run db:down`     | Stop PostgreSQL, retaining its named data volume                    |

Generate the client before type-checking, testing, or building on a clean checkout:

```sh
npm run db:generate
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

The health tests mock the database probe to verify liveness, successful readiness, unavailable readiness, and 404 JSON without a live database. They do not verify an actual PostgreSQL connection. To verify that connection, start PostgreSQL and the server, then request `/api/v1/health/ready`.

For a production deployment, generate and build with development dependencies available, then run `dist/server.js` with production dependencies and production environment values. Inject a real database URL and explicit CORS origins. The Compose service and its public credentials are for local development only.

## Folder layout

- `prisma/schema.prisma`: generator and datasource only; `prisma/migrations/` is empty apart from its Git placeholder.
- `prisma.config.ts`: Prisma CLI schema, migration path, and validated database URL.
- `src/config/`: environment validation, logger, shared Prisma client and lifecycle/probe helpers.
- `src/constants/`: reserved for shared constants.
- `src/modules/`: reserved for future feature modules.
- `src/middlewares/`: request logging, global rate limiting, not-found and error handling.
- `src/utils/`: operational API errors and async route wrapper.
- `src/types/express.d.ts`: placeholder for future Express request augmentation.
- `src/routes/index.ts`: health router mounted at `/api/v1`.
- `src/app.ts`: HTTP middleware wiring without listening.
- `src/server.ts`: database startup, HTTP listener, process lifecycle.
- `src/generated/prisma/`: generated, ignored client compiled alongside the source.
- `tests/`: Vitest setup and Supertest health tests.

## Adding a module later

Use `src/modules/<feature>/` with `<feature>.routes.ts`, `<feature>.controller.ts`, `<feature>.service.ts`, `<feature>.repository.ts`, and `<feature>.schema.ts`. Use named exports and dot-separated filenames. Mount the feature router in `src/routes/index.ts`.

The flow is route → controller → service → repository → PostgreSQL. Routes wire middleware and Zod request validation. Controllers handle HTTP input/output only. Services contain business rules. Only repositories import the shared `prisma` instance from `config/db.ts` and issue business queries. Never create a Prisma client per module or request. Throw `ApiError` for operational failures and forward other errors to the central handler. Prisma P2002 maps to 409; P2025 maps to 404. No feature implementation is included here.

## References

- [Prisma 7 setup and adapter requirements](https://www.prisma.io/docs/orm/v7)
- [Prisma client generator configuration](https://www.prisma.io/docs/orm/v7/prisma-schema/overview/generators)
- [PostgreSQL official Docker image and volume layout](https://hub.docker.com/_/postgres)

## Initial verification

Verified on the available Node 24.10.0 runtime with TypeScript 6.0.3 and Prisma 7.10.1: client generation, source type-checking, ESLint, four health tests, production compilation, and Prettier all passed. The project targets Node 26 LTS; verification on that deployment runtime remains necessary. Invalid environment input exited with code 1 and a readable field error.

Docker was unavailable on the setup machine. An existing PostgreSQL instance on localhost:5432 rejected the public example credentials. The server logged the startup failure, disconnected, and exited with code 1 without listening. A successful live database connection and graceful shutdown with active requests were not verified. No migrations were run.
