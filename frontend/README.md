# Frontend

Persian RTL frontend for the personal learning workspace, built with Nuxt 4, Vue 3, TypeScript, and Pinia. See the [root README](../README.md) for the product vision.

## Setup

Use Node 24.15+ and install dependencies from the repository root with `npm ci`. This workspace uses the root `package-lock.json`.

From the repository root:

```bash
npm run dev:frontend
```

The app serves at <http://localhost:3000>. Start the backend too (`npm run dev` from the root) to read roadmaps and save work.

## Learning classroom

The main page uses the real [learning Markdown](../learning/README.md), including all 15 React phases. The UI has six tracks, distinguishes the authoritative plan from proposed paths and missing plans, and shows actual saved progress.

The classroom combines a topic roadmap, a streaming Codex tutor chat, and tabs for practice, mastery checks, and sources. Eight session stages follow the supplied teaching flow. Code attempts are LTR; prose and navigation are Persian RTL. Vazirmatn, visible keyboard focus, keyboard-operable tabs, reduced-motion support, and responsive layouts support longer study sessions.

Notes and attempts save through the backend to `learning/.local/workspace.json`; they survive reloads. Use **ذخیرهٔ تمرین و یادداشت** before leaving the page. Drafts also save when navigating between topics or sending a message. Chat replies receive the saved attempt and notes. The practice editor stores text and does not execute code.

Topic completion requires all five mastery checks and your explicit confirmation. No automatic advancement occurs. Topic-specific rooms can be resumed from **جلسه‌های ذخیره‌شده**. Only the last-room ID is stored in browser localStorage; learning records live on the backend.

Chat uses the local Codex app-server and its managed ChatGPT login. Use the classroom connection controls or `codex login` on the backend machine; see the [root setup guide](../README.md). Replies stream over a POST fetch response and can be stopped. No model credentials belong in this application.

The design follows the installed UI UX Pro Max skill, adapted to the real roadmap workflow, Nuxt/Vue, Persian RTL, and the existing plain CSS. No component library or frontend runtime dependency was added for this classroom.

## Configuration

Copy `.env.example` to `.env` in this directory if you need to override the default:

| Variable               | Default                     | Purpose                            |
| ---------------------- | --------------------------- | ---------------------------------- |
| `NUXT_PUBLIC_API_BASE` | `http://localhost:3001/api` | Browser-accessible backend API URL |

Public runtime configuration is visible to the browser. Keep secrets out of `NUXT_PUBLIC_*` variables. The API URL must be reachable from the visitor's browser.

## Structure

- `app/app.vue`: application entry point and route announcements.
- `app/pages/index.vue`: roadmap, session stages, chat, practice, mastery, and sources.
- `app/data/learning.ts`: API types, stage labels/prompts, and mastery criteria.
- `app/stores/learning.ts`: Pinia workspace state, file API integration, draft saving, and streamed chat.
- `app/components/LearningMarkdown.vue`: safe text/code display without raw HTML rendering.
- `app/components/AppIcon.vue`: shared decorative SVG icons.
- `app/assets/css/main.css`: classroom styles, RTL logical properties, responsive and accessibility behavior.
- `nuxt.config.ts`: modules, Persian document metadata, strict TypeScript, and public API configuration.

The frontend reads `GET /api/learning/workspace`; mutations and chat use the same learning API. The complete contract is documented in [the backend guide](../backend/README.md). This is a local single-user application; the backend restricts learning routes to loopback access and the configured frontend origin.

## Typography

[Vazirmatn](https://rastikerdar.github.io/vazirmatn/en) is the interface font, chosen for clear Persian text and comfortable reading during lessons. The official **v33.003** variable WOFF2 file is bundled in `public/fonts/vazirmatn/` and served locally; visitors do not need a Google Fonts or CDN connection.

The single file supports weights **100–900** and includes Persian and Latin glyphs. It is preloaded in `nuxt.config.ts`, declared with `font-display: swap`, and applied globally in `app/assets/css/main.css`, including form controls. Code uses a system monospace font. The existing generous line height remains in place for lesson text.

The unmodified font comes from the [official tagged source](https://github.com/rastikerdar/vazirmatn/tree/v33.003). Its copyright notice and SIL Open Font License 1.1 are included in [public/fonts/vazirmatn/OFL.txt](public/fonts/vazirmatn/OFL.txt).

## UI/UX skill

[UI UX Pro Max](.agents/skills/ui-ux-pro-max/SKILL.md) is installed locally in `frontend/.agents/skills/ui-ux-pro-max/`, with its search scripts, reference data, and MIT license. It comes from [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) at commit `3a13158ff1f32156cbe144108de48eda2ecaed9a`. Installation details and local adaptations are recorded in [UPSTREAM.md](.agents/skills/ui-ux-pro-max/UPSTREAM.md).

Use it for frontend design and UI/UX review while preserving Nuxt 4, Vue 3, Pinia, Persian RTL, and the locally hosted Vazirmatn font. It supplies recommendations; the project's detailed standards are still to be discussed.

The search tools require **Python 3** and use only its standard library. No runtime npm dependency is added. From `frontend/`, for example:

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack nuxtjs
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "keyboard focus" --domain ux
```

Codex discovers this scoped skill when launched from `frontend/` or its descendants. When working from the repository root, follow the explicit link in `AGENTS.md` to read and use it. You can explicitly request `$ui-ux-pro-max` when the skill is in the discovered list. See the [official skill discovery documentation](https://learn.chatgpt.com/docs/build-skills).

## Commands

From this directory:

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

`npm run preview` previews the production build. For a production process, run `npm start` after building. Nuxt's production server does not automatically load `.env`; set runtime variables in the process environment:

```bash
PORT=3000 NUXT_PUBLIC_API_BASE=http://localhost:3001/api npm start
```

There are no frontend tests yet; type-checking, linting, and the production build validate this initial scaffold. Add behavior-focused tests when learning features are introduced.

Read [AGENTS.md](AGENTS.md) for agent context. Detailed standards are [pending discussion](docs/standards.md).
