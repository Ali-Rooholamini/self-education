# Repository context for agents

Read [README.md](README.md) for the project vision and current scope.

This is an npm-workspaces repository with a Nuxt frontend in `frontend/` and a NestJS backend in `backend/`. For a task, consider its impact on both applications, including API contracts, configuration, Persian/RTL behavior, and documentation. Read the local `AGENTS.md` before changing that application's files.

For frontend UI/UX tasks, also read the installed [UI UX Pro Max skill](frontend/.agents/skills/ui-ux-pro-max/SKILL.md); it is scoped to the frontend directory.

The product UI is Persian and right-to-left. Preserve the learner's work and history. Roadmaps are Markdown; sessions, progress, practice and notes are local JSON under `learning/.local/`. Read `learning/README.md` for source authority and storage. The product tutor uses Codex app-server; keep credentials managed by Codex and require explicit learner confirmation for completion. Do not present planned product features as implemented behavior.

Use the root lockfile and workspace commands. Validate the applications affected by a change and report what was checked and any limitations. Keep credentials and local environment files out of Git.

Detailed agent roles, implementation standards, review policies, and automation are pending discussion with the project owner. [docs/standards.md](docs/standards.md) records that status. These initial instructions provide context, not a finalized agent orchestration system.
