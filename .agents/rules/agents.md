# Agent Bootstrap (Canonical Rule)

This repository follows the `AGENTS.md` convention. Every agent — Devin CLI,
Windsurf/Cascade, Cursor, Claude Code, Codex CLI, Aider, and any compatible
tool — bootstraps the same way and shares the same operational layer
under `.agents/`.

## Mandatory reads at session start

Keep the bootstrap lean to avoid context overload:

1. `AGENTS.md` at the repository root.
2. `.agents/rules/language-policy.md` (short, applies to every change).
3. `.agents/memory/project-context.md` (concise current state).

That is the whole bootstrap. Do **not** load `.agents/memory/decisions.md`
preventively: it is a long, append-only log. Read it only when the task
revisits a past decision or you are about to append a new one.

## On-demand reads

Read the following only when the active task warrants it:

- `docs/stack-and-architecture.md` — task touches stack, architecture, folder structure, persistence, or domain. Respect its maintenance protocol (section 8).
- `.agents/memory/decisions.md` — historical traceability or new decision to append.
- `.agents/memory/glossary.md` — naming or renaming domain concepts.
- `.agents/README.md` — modifying anything inside `.agents/`.
- A specific `SKILL.md` — its trigger conditions match the active task.

If the task affects `.agents/`, delegate to
`.agents/skills/agent-workspace-manager/SKILL.md`.

## Governance for Workflows and Rules

- Define canonical rules under `.agents/rules/`.
- Define canonical workflows under `.agents/workflows/`.
- Define canonical skills under `.agents/skills/<skill-name>/SKILL.md`.
- Files in `.windsurf/workflows/` and `.windsurf/rules/` are lightweight
  delegation stubs that point to `.agents/`. The same pattern applies if
  `.cursor/rules/` bridges are added in the future (Cursor is not actively
  wired today).
- Never duplicate business logic between canonical files in `.agents/` and
  IDE-specific bridge files.

## Generic-update working model

Implementation work is organized around generic updates, not roadmap phases.

| Skill | Use when |
| --- | --- |
| `.agents/skills/change-planner/SKILL.md` | A non-trivial change needs a confirmed plan before code is written. |
| `.agents/skills/change-implementer/SKILL.md` | A confirmed plan is ready and implementation can begin. |
| `.agents/skills/change-closeout/SKILL.md` | The change introduced new patterns, dependencies, domain concepts, or anything that must reach `docs/`, memory, or skills. Skip otherwise. |

Trivial edits (typos, copy tweaks, isolated bug fixes already covered by an
existing test) do not need these skills. Use judgment.
