# Agent Bootstrap (Canonical Rule)

This repository follows the `AGENTS.md` convention.

Before taking any action:

1. Read `AGENTS.md` at the repository root.
2. Read `.agents/rules/language-policy.md`.
3. Read `.agents/memory/project-context.md` and `.agents/memory/decisions.md`.
4. If the task affects `.agents/`, use `skills/agent-workspace-manager/SKILL.md`.

## Governance for Workflows and Rules

- Define canonical workflows under `.agents/workflows/`.
- Define canonical rules under `.agents/rules/`.
- Files in `.windsurf/workflows/` must be lightweight stubs that delegate to `.agents/workflows/`.
- Files in `.windsurf/rules/` must be lightweight bridges that point to `.agents/rules/`.
- Do not duplicate business logic between canonical `.agents` files and IDE-specific bridge files.
