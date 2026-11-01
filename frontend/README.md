# Frontend

Persian RTL frontend for the personal learning workspace, built with Nuxt 4, Vue 3, TypeScript, and Pinia. See the [root README](../README.md) for the product vision.

## Setup

Use Node 24.15+ and install dependencies from the repository root with `npm ci`. This workspace uses the root `package-lock.json`.

From the repository root:

```bash
npm run dev:frontend
```

The app serves at <http://localhost:3000>. The main page is an interactive Persian RTL learning-dashboard demo with a dark green palette and locally hosted Vazirmatn.

## Main-page demo

The demo includes two sample courses (TypeScript and software testing), course selection, lesson previews with LTR code examples, a clickable roadmap, reversible lesson completion, calculated progress, and a temporary note. All learning data is illustrative and all edits stay in memory; refreshing the page resets them. The learning companion's suggestion is sample text, not an AI response.

The backend connection check remains available under **وضعیت سرویس** in the footer. It is the only live backend integration on the page. Course navigation, completion, and notes work without the API running.

The design uses the installed UI UX Pro Max skill's developer-workspace direction and web accessibility guidance, adapted to Persian RTL and the existing technology choices. No component library, external image service, or frontend runtime dependency was added.

## Configuration

Copy `.env.example` to `.env` in this directory if you need to override the default:

| Variable               | Default                     | Purpose                            |
| ---------------------- | --------------------------- | ---------------------------------- |
| `NUXT_PUBLIC_API_BASE` | `http://localhost:3001/api` | Browser-accessible backend API URL |

Public runtime configuration is visible to the browser. Keep secrets out of `NUXT_PUBLIC_*` variables. The API URL must be reachable from the visitor's browser.

## Structure

- `app/app.vue`: application entry point and route announcements.
- `app/pages/index.vue`: interactive learning-dashboard demo.
- `app/data/demo-courses.ts`: typed sample courses, lessons, and code examples.
- `app/components/AppIcon.vue`: shared decorative SVG icons.
- `app/stores/backend-health.ts`: Pinia setup store for connection state and a real health request.
- `app/assets/css/main.css`: global styles with logical properties for RTL layouts.
- `nuxt.config.ts`: modules, Persian document metadata, strict TypeScript, and public API configuration.

The document has `lang="fa"` and `dir="rtl"`. Future code snippets and technical input fields should explicitly use LTR direction where appropriate. There is no learning-data store or persistence yet.

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
