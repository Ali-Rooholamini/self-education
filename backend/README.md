# Backend

NestJS API for the personal learning workspace, using TypeScript, ESM, and the Express adapter. Local persistence uses **SQLite + Prisma 7**. See the [root README](../README.md) for the product vision.

## After cloning

Use Node 24.15+ and install dependencies from the repository root:

```bash
nvm use
npm ci
npm run setup
npm run dev
```

`npm run setup` generates Prisma Client and creates the local database by applying the committed migrations. It can be run again after pulling changes; already-applied migrations are skipped. Setup does not reset or reseed the database. New migrations change the schema and data according to their reviewed SQL.

Setup is also run automatically before `npm run dev:backend` and the backend part of `npm run dev`, so an explicit setup command is optional for development. It is useful when preparing the database without starting a server. There is no need to install PostgreSQL, Docker, a SQLite command-line tool, or a global Prisma CLI.

The API listens on port 3001 by default. All routes have the `/api` prefix.

## How the database works

SQLite stores the database in a local file, **`backend/data/self-education.db`**. Every clone gets its own file when setup runs. The Git repository includes the schema and migration history, rather than anyone's personal database or learning records.

Prisma provides the typed database client. The local libSQL adapter reads/writes the SQLite file; no remote libSQL/Turso account is used. The Nest `DatabaseModule` exports `DatabaseService`, which other feature modules can import and inject. The service opens the database on startup, verifies the initial table, and closes the connection on shutdown.

The initial schema contains a small `Workspace` table with `id`, `name`, `locale`, `createdAt`, and `updatedAt`. The default locale is `fa`. Setup creates the structure without inserting fake courses or personal records. Course, lesson, practice, and learning-history models will be designed in later tasks.

The classroom reads roadmaps from `learning/roadmaps/` and saves learning records in `learning/.local/workspace.json`, independently of Prisma. No learning-domain tables were added. See the learning API below.

## Database commands

From the repository root:

| Command                                                 | Purpose                                                                            |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `npm run setup` or `npm run db:setup`                   | Generate the client and apply committed migrations; create the database if missing |
| `npm run db:migrate`                                    | Apply pending committed migrations to the configured database                      |
| `npm run db:status`                                     | Inspect whether migrations are up to date                                          |
| `npm run db:migration:create -- --name describe_change` | Generate a new development migration for review                                    |
| `npm run db:studio`                                     | Open Prisma's local database browser                                               |

The same `db:*` commands are available inside `backend/`. There is also `npm run db:generate` there for regenerating Prisma Client only.

Humans and agents use the same commands. Ordinary setup and updates use Prisma's `migrate deploy`, which applies pending migrations without resetting the database. New schema changes use `migrate dev --create-only` so their SQL can be reviewed before being applied. Keep the pinned Prisma 7 packages: the npm `prisma@latest` tag currently points to a different CLI release candidate.

### Changing the schema

1. Edit `backend/prisma/schema.prisma`.
2. From the root, run `npm run db:migration:create -- --name describe_change`.
3. Review the new `backend/prisma/migrations/.../migration.sql`, particularly any data-removing operations.
4. Run `npm run db:setup`, then the relevant checks.
5. Commit the schema, migration SQL, and migration lock file together.

Do not edit previously applied migrations or use reset/delete commands on a database containing learning history. If the migration tool requests a reset, stop and resolve the schema/history mismatch instead of accepting it automatically. Changing the database provider later would require a planned data migration.

### Keeping your data

Database files, journals, and generated client code are ignored by Git. Cloning or pulling the repository does not transfer learning records between machines.

For a local backup, stop the backend and copy the `backend/data/` directory (or your custom database file and any SQLite sidecar files). Keep the backup outside the Git repository. Restore it with the backend stopped, then run `npm run db:setup` to apply any newer committed migrations.

## Configuration

Defaults work without `.env`. Copy `backend/.env.example` to `backend/.env` when you need overrides:

| Variable       | Default                         | Purpose                                                   |
| -------------- | ------------------------------- | --------------------------------------------------------- |
| `PORT`         | `3001`                          | HTTP port, from 1 to 65535                                |
| `CORS_ORIGIN`  | `http://localhost:3000`         | Allowed browser frontend origin                           |
| `DATABASE_URL` | `file:./data/self-education.db` | Local SQLite file; relative paths resolve from `backend/` |

Both Prisma commands and the backend resolve database paths the same way, whether invoked from the root or backend directory. A custom parent directory is created by the setup command. An absolute `file:` URL is also supported. This local setup accepts file-backed SQLite only.

Development, database commands, and `npm start` load `backend/.env` through Node's built-in environment-file support. Existing process environment values take precedence. No credentials are required for the default local database.

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

The health endpoint now queries the database before returning success. If that query fails, it returns HTTP 503. Its successful response is unchanged, so the frontend connection check keeps working. If the database is missing or the initial table is unavailable at startup, the backend reports that `npm run db:setup` is needed.

## Learning files and Codex tutor

`LearningModule` reads the catalog and Markdown under `<repo>/learning/` on each request. React is the original supplied plan; other tracks retain their source authority. Personal sessions, messages, notes, attempts, and completion checks are stored in `.local/workspace.json` under that learning root. Writes are serialized and use atomic file replacement. Invalid stored JSON returns an error rather than being silently overwritten. This storage supports one backend process at a time; stop it before copying `.local/` for backup or transfer.

Optional backend environment settings:

| Variable        | Default                 | Purpose                                                                                |
| --------------- | ----------------------- | -------------------------------------------------------------------------------------- |
| `CODEX_BIN`     | `codex`                 | CLI executable on the backend machine                                                  |
| `CODEX_MODEL`   | Account catalog default | Override with a model available to the Codex account                                   |
| `LEARNING_ROOT` | `<repo>/learning`       | Absolute directory containing catalog, roadmaps, tutor instructions, and local records |

Install the [official Codex CLI](https://developers.openai.com/codex/cli/) separately and run `codex login`, or use the frontend device-code login. CLI 0.166.0 was tested with a managed ChatGPT account and a real streamed turn. The bridge launches `codex app-server --listen stdio://` lazily and communicates over JSON-RPC. Codex owns authentication; the API exposes only sanitized status and official device-login instructions. Model access and account limits affect whether a turn succeeds.

Each local room owns a Codex thread ID. The bridge resumes that thread or creates another if its stored thread is missing; recent local messages are supplied for continuity. The selected Markdown, current stage, notes, and attempt accompany the message. The tutor runs with read-only sandbox settings, no approvals, shell and web search disabled, and no automatic completion. It is a teaching chat, not a repository editing agent or code runner.

All `/api/learning/*` routes use a local-access guard: loopback remote address, localhost hostname, and, when a browser Origin is present, exact `CORS_ORIGIN`. CLI requests without Origin are allowed from loopback. This protects a local single-user workflow; it is not a public multi-user authentication system. The ordinary health endpoint remains separate.

| Method and path (under `/api/learning`) | Behavior                                                           |
| --------------------------------------- | ------------------------------------------------------------------ |
| `GET /workspace`                        | Markdown roadmaps, revisions, progress, session summaries          |
| `GET /roadmaps/:id/source`              | Original catalog-listed Markdown as text                           |
| `GET /connection`                       | Sanitized Codex account/model status                               |
| `POST /connection/login`                | Start official ChatGPT device-code login                           |
| `POST /sessions`                        | Create room with `{ trackId, topicId }`                            |
| `GET /sessions/:id`                     | Read a saved room                                                  |
| `PATCH /sessions/:id`                   | Save `stage`, `notes`, and/or `exercise`                           |
| `PATCH /progress`                       | Update `{ trackId, topicId, revision, status, checks, confirmed }` |
| `POST /sessions/:id/messages`           | Send `{ text }`; stream the tutor reply                            |
| `POST /sessions/:id/cancel`             | Interrupt the room's active turn                                   |

Progress updates must match the current Markdown revision. `completed` requires all five criteria (`explain`, `apply`, `compare`, `pitfalls`, `exercise`) and `confirmed: true`. Topic IDs derive from source headings and titles; renaming a topic can create a new identity, while old sessions remain saved.

Chat returns `text/event-stream` over a POST fetch response. Each `data:` JSON block has `type: started | delta | done | error`; session snapshots accompany started/done/error and delta carries `text`. The stream sends heartbeat comments. Stop/disconnect interrupts the turn; completed and partial replies are retained with their status. Errors during a stream arrive as error events. A connection-status success alone does not guarantee model entitlement or available quota.

## Structure

- `prisma/schema.prisma`: maintained data model.
- `prisma/migrations/`: versioned SQL migrations and provider lock.
- `prisma.config.ts`: Prisma CLI schema, migration, and connection settings.
- `scripts/prisma.mjs`: shared local CLI launcher and database path normalization.
- `src/database/`: shared path resolver and Nest database module/service.
- `src/generated/prisma/`: generated client, ignored and recreated by commands.
- `data/`: local database storage, ignored by Git.
- `src/main.ts`: bootstrap and port validation.
- `src/configure-app.ts`: HTTP prefix, CORS, and shutdown setup.
- `src/health/`: health feature with a database readiness check.
- `src/learning/`: roadmap parser, atomic file storage, local guard, REST/streaming routes, and Codex bridge.
- `test/`: HTTP and persistence tests using temporary, migrated databases.

TypeScript compiles to ESM; relative runtime imports use `.js` extensions. The CLI launcher imports the decorator-free TypeScript path helper using Node 24's native TypeScript support. This keeps CLI and runtime paths consistent without another TypeScript runner.

## Checks and production start

From `backend/`:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

Type checking, tests, and builds generate the client automatically. Tests create separate databases in the OS temporary directory, verify persisted Persian data and repeatable migrations, and remove only those test databases. They never use the development database. Learning tests also use temporary Markdown/state directories and fake tutor/stdio peers, so automated tests do not call a live model.

`npm start` requires a build and an initialized database. For a new local installation running the production build, run `npm run db:setup` explicitly before `npm start`; production startup does not automatically apply migrations. Keep the database directory on persistent storage if deploying this file-backed setup.

PDF ingestion, public/multi-user authentication, and background automation remain future work. The current tutor uses the local Codex account; it does not import ChatGPT website conversations. Read [AGENTS.md](AGENTS.md) for agent context; broader standards remain [pending discussion](docs/standards.md).

## References

- [NestJS Prisma integration](https://docs.nestjs.com/recipes/prisma)
- [Prisma 7 SQLite support](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/sqlite)
- [Prisma 7 migration workflows](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production)
