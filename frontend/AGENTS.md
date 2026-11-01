# Frontend agent context

Read the root [AGENTS.md](../AGENTS.md), the product [README](../README.md), and this application's [README](README.md).

This app uses Nuxt 4's `app/` directory, Vue 3 Composition API with TypeScript, and Pinia through `@pinia/nuxt`. User-facing content is Persian; the document is RTL. Prefer CSS logical properties and use LTR direction for code when needed.

For interface design, layout, typography, interaction, responsive behavior, and accessibility work, use [UI UX Pro Max](.agents/skills/ui-ux-pro-max/SKILL.md). Its local search scripts require Python 3 and include `nuxtjs` and `vue` stack guidance. Apply recommendations in the context of Nuxt 4, Vue 3, Pinia, Persian RTL, and the locally hosted Vazirmatn font. General font or framework suggestions do not replace those project choices. Use the existing plain CSS unless a task calls for another approach.

Backend communication uses `runtimeConfig.public.apiBase`; the classroom uses `/api/learning/*` for Markdown roadmaps, local records, connection status, and streaming tutor chat. Read `app/data/learning.ts` and the backend contract before changing these payloads. Keep source authority visible, preserve attempts and notes, and require explicit learner confirmation for completion. No fabricated progress or automatic topic advancement. When changing integration behavior, inspect the backend contract and configuration too.

From the root, validate frontend changes with `npm run typecheck --workspace frontend` and `npm run build --workspace frontend`; lint when relevant. Generated `.nuxt/` and `.output/` files are not maintained source.

Detailed component, state, testing, design, and agent standards will be agreed later; see [docs/standards.md](docs/standards.md).
