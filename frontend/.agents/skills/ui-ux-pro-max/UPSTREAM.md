# UI UX Pro Max installation

- Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Pinned commit: `3a13158ff1f32156cbe144108de48eda2ecaed9a`
- Source directory: `.claude/skills/ui-ux-pro-max`
- Installed directory: `frontend/.agents/skills/ui-ux-pro-max`
- Installer: Codex's `skill-installer` GitHub helper, using an explicit destination and commit.
- License: upstream repository's MIT license, included as `LICENSE`.

The skill's scripts, data, and references are copied from the pinned source. `SKILL.md` has a small local adaptation: command examples use `UI_UX_PRO_MAX_SKILL_DIR` instead of Claude's plugin environment variable, with instructions for resolving the installed directory. Project-specific application guidance lives in `frontend/AGENTS.md`.

This directory is vendored tooling, excluded from automatic Prettier formatting. To update it, review the upstream revision, preserve the license, reapply the invocation-path adaptation, record the new commit here, and verify the Nuxt/Vue and UX searches. Updates are manual; npm installation does not update this skill.
