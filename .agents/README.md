# Operational Index of `.agents/`

This directory concentrates the agent workspace infrastructure for Chronicle
and serves as a tool-agnostic layer for IDEs, CLIs, and human contributors.

It is **not** a bootstrap document. Read it only when you are about to modify
something inside `.agents/`.

## File Map

| Path | Role | When to read or edit |
|---|---|---|
| `memory/project-context.md` | Concise current project state | Mandatory bootstrap read every session |
| `memory/decisions.md` | Append-only log of decisions | On-demand: revisiting a past decision or appending a new one (do **not** load on every session) |
| `memory/glossary.md` | Canonical domain vocabulary | On-demand: when naming or renaming domain concepts |
| `templates/skill.template.md` | Template for new skills | When creating a new skill in `skills/` |
| `templates/workflow.template.md` | Template for new workflows | When creating a new workflow in `workflows/` |
| `templates/memory.template.md` | Base memory template | When creating a new file in `memory/` |
| `skills/agent-workspace-manager/SKILL.md` | Governance skill for `.agents/` | Whenever a task creates or modifies skills, workflows, rules, or memory |
| `skills/change-planner/SKILL.md` | Plan a generic update before implementation | Non-trivial change that needs a confirmed plan |
| `skills/change-implementer/SKILL.md` | Implement a confirmed change end-to-end | A confirmed plan exists and implementation can begin |
| `skills/change-closeout/SKILL.md` | Close out a change that warrants doc/skill updates | Change introduced new patterns, dependencies, domain concepts, or cross-cutting impact |
| `skills/update-project-docs/SKILL.md` | Synchronize project docs without duplication | Docs need updating after a change or on demand |
| `skills/test-fix/SKILL.md` | Diagnose and fix test failures | `pnpm test` or `pnpm test:e2e` exits with errors |
| `workflows/change-planner.md` | Slash-command entry to `change-planner` skill | When using `/change-planner` from Cascade |
| `workflows/change-implementer.md` | Slash-command entry to `change-implementer` skill | When using `/change-implementer` from Cascade |
| `workflows/change-closeout.md` | Slash-command entry to `change-closeout` skill | When using `/change-closeout` from Cascade |
| `workflows/create-skill.md` | Runbook to create skills | When adding a new capability |
| `workflows/create-rule.md` | Runbook to create canonical rules | When defining new agent rules |
| `workflows/create-workflow.md` | Runbook to create workflows | When converting a repeatable task into a formal process |
| `workflows/project-documentation.md` | Standalone documentation pass | Docs-only changes or periodic synchronization passes |
| `workflows/update-memory.md` | Runbook to update memory | When recording context, decisions, or terminology changes |
| `workflows/verify.md` | Run the test suite efficiently | During implementation, before committing, before closeout |
| `rules/agents.md` | Canonical bootstrap rule | Mandatory read every session (via `AGENTS.md`) |
| `rules/language-policy.md` | Language policy rule | Mandatory read every session (via `AGENTS.md`) |

## External References

- `../docs/stack-and-architecture.md`: source of truth for stack, architecture, domain model, and conventions. Read on demand when a task touches any of those.
- `../AGENTS.md`: global principles, bootstrap, and tool interoperability.

## Current State

See `.agents/memory/project-context.md` for current project state, active
routes, and key file references.

## Interoperability

- **Canonical:** rules, skills, and workflows live in `.agents/`.
- **Devin CLI:** auto-discovers skills under `.agents/skills/` and reads `AGENTS.md` for bootstrap. Session-scoped Devin config lives in `.devin/` (not duplicated here).
- **Windsurf/Cascade:** uses bridges in `/.windsurf/rules/` and slash-command stubs in `/.windsurf/workflows/` that delegate to `.agents/`.
- **Claude Code, Codex CLI, Aider, Jules:** bootstrap from `AGENTS.md` and treat `.agents/` as their operational layer.
- **Cursor:** not actively wired today. Add lightweight bridges under `/.cursor/rules/` pointing to `.agents/rules/` if Cursor support is needed again.
- **Human contributors:** use this index as an operational map and `decisions.md` as the historical log.
