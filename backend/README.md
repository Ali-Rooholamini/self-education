# Backend

NestJS API for the personal learning workspace, using TypeScript, ESM, and the Express adapter. See the [root README](../README.md) for the product vision.

## Setup

Use Node 24.15+ and install dependencies from the repository root with `npm ci`. This workspace uses the root `package-lock.json`.

From the repository root:

```bash
npm run dev:backend
```

The API listens on port 3001 by default. All routes have the `/api` prefix.

## Configuration

Copy `.env.example` to `.env` in this directory if you need overrides:

| Variable      | Default                 | Purpose                         |
| ------------- | ----------------------- | ------------------------------- |
| `PORT`        | `3001`                  | HTTP port, from 1 to 65535      |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed browser frontend origin |

`npm run dev` and `npm start` load this directory's `.env` through Node's built-in `--env-file-if-exists` support. Existing process environment values take precedence. `start:dev` is the internal Nest watch command; use `dev` to load `.env`.

## Current API

```http
GET /api/health
```

```json
{
  "status": "ok",
  "service": "self-education-api"
}
```

This endpoint checks that the API responds. There is no database or external learning-agent dependency to check yet.

## Structure

- `src/main.ts`: bootstrap and port validation.
- `src/configure-app.ts`: shared HTTP prefix, CORS, and shutdown setup.
- `src/app.module.ts`: root module.
- `src/health/`: initial feature module and health controller.
- `test/health.test.ts`: HTTP smoke tests using Nest's testing module, a temporary port, and Node's built-in test runner.

TypeScript compiles to ESM; relative TypeScript imports use `.js` extensions for the emitted runtime files. Tests compile with TypeScript so Nest decorator metadata is preserved.

## Commands

From this directory:

```bash
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

`npm start` runs `dist/main.js` and requires a successful build first. Tests verify the prefixed health route, the configured CORS origin, and the absence of an unprefixed health route. They do not require the development server to be running.

Storage, course ingestion, learning records, authentication, and the learning-agent runtime will be designed later.

Read [AGENTS.md](AGENTS.md) for agent context. Detailed standards are [pending discussion](docs/standards.md).
