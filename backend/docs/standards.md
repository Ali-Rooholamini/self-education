# Backend standards — pending discussion

The current setup is NestJS 12, TypeScript, ESM, the Express adapter, and a prefixed health endpoint. Local persistence uses SQLite and Prisma 7 with committed migrations. There is no database server to install. The local tutor uses Codex app-server and its managed ChatGPT authentication; public/multi-user authentication remains undecided. Roadmaps and current learning records use Markdown and local JSON rather than SQL.

The database setup commands and data-preservation rules are documented in the [backend README](../README.md) and [agent context](../AGENTS.md). The initial `Workspace` table is a small foundation; course, learning-history, and exercise models will be designed separately.

Future discussions can define modules and boundaries, API contracts, request validation, error handling, saved learning records, course ingestion, agent integration, and backend implementation/review responsibilities.

See [shared standards](../../docs/standards.md) and [backend agent context](../AGENTS.md).
