# Backend agent context

Read the root [AGENTS.md](../AGENTS.md), the product [README](../README.md), and this application's [README](README.md).

This is a NestJS 12 API using TypeScript and ESM. Feature modules live under `src/`; all HTTP routes use the `/api` prefix. `configure-app.ts` is shared by bootstrap and HTTP tests.

The frontend uses the learning REST/streaming API and a configurable public API URL. Consider frontend impact when changing routes, payloads, ports, or CORS behavior.

From the root, validate backend changes with `npm run typecheck --workspace backend`, `npm test --workspace backend`, and `npm run build --workspace backend`; lint when relevant. Build output and compiled test output are generated and ignored.

The local database is SQLite, managed with pinned Prisma 7 tooling and versioned SQL migrations. From the repository root, use `npm run db:setup` to create/update it and `npm run db:status` to inspect migration state. These commands also work for agents. Backend development startup runs setup automatically. Relative `DATABASE_URL` paths always resolve from `backend/`.

For schema changes, edit `prisma/schema.prisma`, run `npm run db:migration:create -- --name describe_change`, review the generated SQL, then apply it with `npm run db:migrate`. Commit schema and migration files together. Keep applied migrations unchanged. Do not use reset, `db push`, table drops, or delete a learner's database without explicit authorization. Preserve existing learning data; rerunning setup should not replace it.

Tests create isolated databases in the OS temporary directory and must never point at the learner's database. Database files and generated Prisma Client files are ignored by Git. Learning roadmaps stay in Markdown and current sessions/progress stay in `learning/.local/workspace.json`; do not migrate them into SQL without a new task. The tutor uses the local Codex app-server with managed account authentication, read-only settings, and tool execution disabled. Preserve the loopback/origin guard and never expose credentials. Detailed database learning-domain models and broader standards are still pending; see [docs/standards.md](docs/standards.md).
