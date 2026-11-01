# Self Education | مسیر یادگیری من

A personal learning workspace with a Persian, right-to-left interface. It brings roadmaps, a tutor chat, practice attempts, notes, and progress together so each session can continue from saved context. The long-term goal is an artifacts-like home for ongoing study and stronger frontend engineering judgment.

The project owner's learning currently includes React, TypeScript, and Testing, alongside Vue/Nuxt experience. JavaScript/Browser Fundamentals, Performance, and Frontend System Design are complementary paths. The supplied learning discussion is recorded in [the workflow brief](learning/sources/learning-workflow-brief.fa.md); previous ChatGPT website conversations have not been imported.

## What works now

- A responsive Persian RTL classroom using Nuxt 4, Vue 3, TypeScript, Pinia, plain CSS, and locally hosted Vazirmatn.
- Real roadmaps read from Markdown on the NestJS backend. [The original React plan](learning/roadmaps/react.md) is preserved byte-for-byte, including its 15 phases and project checkpoints.
- Topic selection, saved chat rooms, practice drafts, notes, session stages, and progress that survive refreshes and backend restarts.
- A real streaming tutor chat through the local Codex CLI's app-server, using its managed ChatGPT login. The tutor receives the selected roadmap, topic, stage, saved attempt, notes, and recent transcript.
- Five mastery checks plus explicit learner confirmation before a topic is completed. Chatting does not complete a topic or advance to the next one automatically.
- A separate SQLite/Prisma foundation with repeatable migration commands. **Roadmaps and current learning records do not use this database.**

The learning flow follows the supplied plan: concept → mental model → comparison with Vue → real example → exercise → review → interview scenario → confirmation. React follows one evolving admin-dashboard project, with larger exercises at the roadmap's checkpoints. Its suggested rhythm is Sunday and Tuesday, 45–75 minutes, with optional weekend practice.

## Learning sources and storage

| Location                                                                                 | Purpose                                                                      |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `learning/roadmaps/react.md`                                                             | Authoritative React plan supplied by the owner                               |
| `learning/sources/learning-workflow-brief.fa.md`                                         | Structured record of the supplied discussion, clearly labeled as a synthesis |
| `learning/roadmaps/javascript-browser.md`, `performance.md`, `frontend-system-design.md` | Proposed complementary plans drawn from that discussion                      |
| `learning/roadmaps/typescript.md`, `testing.md`                                          | Placeholders awaiting the actual plans; no invented syllabus or progress     |
| `learning/roadmaps/catalog.json`                                                         | Track metadata and source authority                                          |
| `learning/tutor-instructions.md`                                                         | Tutor behavior and step-by-step teaching contract                            |
| `learning/.local/workspace.json`                                                         | Personal sessions, transcript, attempts, notes, and progress; ignored by Git |
| `backend/data/self-education.db`                                                         | Separate SQLite foundation; ignored by Git                                   |

Markdown sources are committed. Personal learning records are written atomically to a local JSON file and are never seeded with demo progress. To transfer or back up personal work, stop the backend and copy `learning/.local/` separately; cloning the repository does not transfer it. Also back up the SQLite directory if you use it. Codex maintains its own authentication and thread storage outside this repository; the app saves a local transcript so a missing thread can be recreated with recent context.

Books such as _You Don't Know JS_ have not been supplied. PDF ingestion, automatic course updates, a code runner, and background agents are future work. This app does not access your ChatGPT website history. See [learning/README.md](learning/README.md) for the Persian source guide.

## Getting started

Use **Node.js 24.15+ in the 24.x line** and npm 10+:

```bash
nvm install
nvm use
npm ci
npm run setup
npm run dev
```

- Frontend: <http://localhost:3000>
- Backend health: <http://localhost:3001/api/health>

`npm run setup` generates Prisma Client and applies committed migrations to create the local SQLite file. It is repeatable and does not reset existing data. Backend development startup runs setup automatically, so the explicit command is optional for development. No database server or Docker is required.

The roadmaps and saved practice work without a model connection, while both applications must be running. For tutor replies, install the [official Codex CLI](https://developers.openai.com/codex/cli/) on the same machine, then authenticate:

```bash
npm install -g @openai/codex
codex login
codex login status
```

Alternatively, use **اتصال حساب ChatGPT** in the classroom and complete the official device-code login, then click the connection refresh button. The backend must be able to find `codex` on its PATH; set `CODEX_BIN` to its absolute path if necessary. The bridge was tested with Codex CLI **0.166.0**, a ChatGPT login, and a real streamed response. Account access and usage limits still apply. The default model is selected from the account's Codex model catalog; `CODEX_MODEL` can override it.

The browser receives connection status and device-login instructions. Codex manages credentials; no API key or token is put in frontend configuration. This connection creates app-specific tutor threads; it does not import existing ChatGPT conversations. See the [official app-server guide](https://developers.openai.com/codex/app-server) for the underlying protocol.

This is a **local, single-user workspace**. Learning endpoints accept loopback requests and the configured frontend origin. The tutor runs with read-only sandbox settings and tool execution disabled. Public hosting and multi-user authentication need a separate design.

## Configuration and commands

Defaults work without environment files. Optional overrides:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Restart the affected application after changes. Set `NUXT_PUBLIC_API_BASE` for the browser API address and `CORS_ORIGIN` for the matching frontend origin. Backend settings also include `DATABASE_URL`, `CODEX_BIN`, optional `CODEX_MODEL`, and optional `LEARNING_ROOT`. See the application READMEs for details.

Run commands from the repository root:

| Command                                        | Purpose                                                           |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `npm run setup` / `npm run db:setup`           | Generate the database client and apply committed migrations       |
| `npm run db:status`                            | Inspect migration state                                           |
| `npm run db:migrate`                           | Apply pending committed migrations                                |
| `npm run dev`                                  | Start both applications in watch mode                             |
| `npm run dev:frontend` / `npm run dev:backend` | Start one application                                             |
| `npm run typecheck`                            | Type-check both applications                                      |
| `npm run lint`                                 | Lint both applications                                            |
| `npm test`                                     | Run isolated backend HTTP, persistence, and Codex transport tests |
| `npm run build`                                | Build both applications                                           |
| `npm run format` / `npm run format:check`      | Format maintained files / check formatting                        |
| `npm run check`                                | Run formatting, lint, types, tests, and builds                    |

Tests use temporary learning directories and databases. Automated tests use a fake tutor/stdio peer and do not spend model quota. Live chat and responsive browser behavior are checked separately.

## Repository and agent context

```text
frontend/                 Nuxt app, Pinia learning store, Persian RTL classroom
backend/src/learning/     Markdown catalog, file persistence, local API, Codex bridge
backend/src/database/     SQLite/Prisma foundation
backend/prisma/           Schema and committed SQL migrations
learning/                 Roadmaps, supplied brief, tutor instructions
learning/.local/          Ignored personal learning records
AGENTS.md                 Context for development work across both apps
frontend/AGENTS.md        Frontend agent context and UI UX Pro Max entry point
backend/AGENTS.md         Backend agent context and data-preservation rules
docs/standards.md         Broader standards awaiting discussion
```

Use the root npm lockfile. App-specific setup and contracts live in [frontend/README.md](frontend/README.md) and [backend/README.md](backend/README.md).

The product tutor and development agents have different roles: the tutor teaches the current topic; development agents implement and verify repository changes. `AGENTS.md` files supply context and do not automatically launch agents. Detailed orchestration, standards, and review policies remain for future conversations.
