# Self Education | مسیر یادگیری من

A personal learning workspace with a Persian, right-to-left interface and an AI agent behind it. The goal is to turn ongoing study into a continuous, documented journey: understand the whole roadmap, keep every learning step and exercise, and resume with the context of what has already happened.

This repository matters as a long-term home for that learning history. It starts with two applications: a Nuxt frontend and a NestJS backend.

## Why this project exists

Learning currently happens through conversations on the ChatGPT website, including topics such as TypeScript and software testing. Those conversations are useful, but the intended next step is an artifacts-like workspace: a dedicated interface where learning materials, practice, progress, and the agent's guidance belong to the same project.

The agent should eventually work with the documentation and materials for a chosen course, understand its full learning roadmap, and keep the project current as study continues. Each session should build on saved context instead of starting again from scratch.

This description comes from the project owner's initial brief. Previous ChatGPT conversations have not been imported or reviewed; their details can be added when they are made available.

## Intended learning experience

These are product intentions, not implemented features:

- **Course context:** keep the documentation, references, learning objectives, and relevant source/version information for each subject.
- **A complete roadmap:** understand the overall path, prerequisites, the current step, completed work, and what comes next.
- **A durable learning record:** save each learning step, notes, questions, explanations, decisions, and progress over time.
- **Practice alongside learning:** preserve exercises, attempts, solutions, and feedback so practice remains connected to its lesson.
- **An agent with continuity:** use the course materials and saved history to guide the next step and update the learning workspace as work progresses.
- **A Persian workspace:** provide Persian user-facing content, right-to-left layouts, and readable left-to-right presentation for code and technical identifiers when those are introduced.

How course materials are provided, how updates are triggered, and how learning data is stored will be decided in later steps. An automatic connection to ChatGPT conversation history is not assumed.

## Current scope

This first step provides documentation and a working application foundation:

| Area                | Foundation                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Frontend            | Nuxt 4, Vue 3 Composition API, TypeScript, Pinia                                                                      |
| Language and layout | Persian starter page, `lang="fa"`, `dir="rtl"`, responsive CSS using logical properties                               |
| Backend             | NestJS 12, TypeScript, Express adapter, ESM                                                                           |
| Integration         | `GET /api/health`, configurable API URL and frontend CORS origin                                                      |
| Tooling             | npm workspaces, one lockfile, development scripts, linting, formatting, type checks, builds, backend HTTP smoke tests |
| Agent documentation | Root coordination instructions and local instructions/documentation in each app                                       |

The scaffold starts with Nuxt **4.6.3**, Vue **3.5.44**, Pinia **4.1.0**, and NestJS **12.3.2**, verified against npm when setting up the repository. `package-lock.json` records the exact installed dependency tree. Nuxt stays within the requested 4.x release line.

There is no course engine, database, authentication, model-provider integration, document ingestion, background agent, or learning-data persistence yet. The main-page demo's progress, notes, and connection status are temporary UI state.

## Repository layout

```text
.
├── AGENTS.md                   # Instructions for work across both applications
├── docs/
│   └── standards.md            # Shared standards discussion placeholder
├── frontend/
│   ├── AGENTS.md              # Frontend context for agents
│   ├── README.md              # Frontend setup and commands
│   ├── docs/standards.md       # Frontend standards discussion placeholder
│   ├── app/
│   │   ├── app.vue
│   │   ├── assets/css/
│   │   ├── pages/
│   │   └── stores/
│   └── nuxt.config.ts
├── backend/
│   ├── AGENTS.md              # Backend context for agents
│   ├── README.md              # Backend setup and commands
│   ├── docs/standards.md       # Backend standards discussion placeholder
│   ├── src/
│   │   └── health/
│   └── test/
├── package.json               # Shared workspace commands
└── package-lock.json
```

The applications have separate source trees, configuration, package manifests, and build outputs. They share npm dependency management at the repository root.

## Getting started

Use **Node.js 24.15 or newer in the 24.x line** and npm 10 or newer. `.nvmrc` selects Node 24; the latest patch release is recommended. The current Nuxt toolchain requires a newer runtime than early Node 20/22 installations.

From the repository root:

```bash
nvm install
nvm use
npm ci
npm run dev
```

- Frontend: <http://localhost:3000>
- Backend health: <http://localhost:3001/api/health>

The defaults work without environment files. To customize them:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Restart the affected app after changing its environment. Nuxt reads `frontend/.env` during development/build. Backend scripts load `backend/.env` using Node's built-in environment-file support.

The main page now includes an interactive Persian RTL learning-dashboard demo. Courses, lesson completion, and notes use sample data held in memory; they reset on refresh. The **بررسی ارتباط با سرور** button is available under **وضعیت سرویس** in the footer. Both apps must be running for that connection check to succeed.

## Commands

Run these from the repository root:

| Command                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Start both applications with watch mode        |
| `npm run dev:frontend` | Start only Nuxt                                |
| `npm run dev:backend`  | Start only NestJS                              |
| `npm run typecheck`    | Type-check both applications                   |
| `npm run lint`         | Lint both applications                         |
| `npm test`             | Run the backend HTTP smoke tests               |
| `npm run build`        | Build both applications                        |
| `npm run format`       | Format maintained source and documentation     |
| `npm run format:check` | Check formatting                               |
| `npm run check`        | Run formatting, lint, types, tests, and builds |

See the [frontend README](frontend/README.md) and [backend README](backend/README.md) for app-specific details and production start commands.

## Agents and standards

There are two distinct future responsibilities:

1. **The product's learning agent:** helps the learner work through course materials, practice, and the roadmap.
2. **Development agents working on this repository:** implement and check changes across the frontend and backend, using root instructions for coordination and each app's local context.

`AGENTS.md` files establish those documentation entry points; they do not create a running agent or automatically launch separate agents. Detailed agent workflows, coding standards, review requirements, and architectural policies are deliberately left for future conversations. See [shared standards](docs/standards.md).

## Future decisions

The next discussions can define the first course and its source materials, the learning roadmap and saved-record format, storage, the learning-agent integration, and the standards for development and review. These are discussion topics rather than a committed implementation sequence.

## Framework references

- [Nuxt 4 documentation](https://nuxt.com/docs/4.x/getting-started/introduction)
- [Pinia with Nuxt](https://pinia.vuejs.org/ssr/nuxt.html)
- [NestJS first steps](https://docs.nestjs.com/first-steps)
