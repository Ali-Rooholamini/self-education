# Backend agent context

Read the root [AGENTS.md](../AGENTS.md), the product [README](../README.md), and this application's [README](README.md).

This is a NestJS 12 API using TypeScript and ESM. Feature modules live under `src/`; all HTTP routes use the `/api` prefix. `configure-app.ts` is shared by bootstrap and HTTP tests.

The frontend uses the health endpoint and a configurable public API URL. Consider frontend impact when changing routes, payloads, ports, or CORS behavior.

From the root, validate backend changes with `npm run typecheck --workspace backend`, `npm test --workspace backend`, and `npm run build --workspace backend`; lint when relevant. Build output and compiled test output are generated and ignored.

There is no chosen database or AI provider. Detailed API, persistence, validation, security, testing, and agent standards will be discussed later; see [docs/standards.md](docs/standards.md).
