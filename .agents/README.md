# Operational Index of `.agents/`

This directory concentrates the agent workspace infrastructure for Chronicle and serves as a tool-agnostic layer for IDEs, CLIs, and human contributors.

## File Map

| Path | Role | When to read or edit |
|---|---|---|
| `memory/project-context.md` | Current project context | When starting any session or before defining technical scope |
| `memory/decisions.md` | Append-only log of decisions | Before implementing and after making significant decisions |
| `memory/glossary.md` | Canonical domain vocabulary | When naming entities, fields, or writing functional documentation |
| `templates/skill.template.md` | Template for new skills | When creating a new skill in `skills/` |
| `templates/workflow.template.md`| Template for new workflows | When creating a new workflow in `workflows/` |
| `templates/memory.template.md` | Base memory template | When creating a new file in `memory/` |
| `skills/agent-workspace-manager/SKILL.md` | Governance skill for `.agents/` | When a task creates or modifies skills, workflows, or memory |
| `skills/phase-closeout/SKILL.md` | Phase closeout | When completing a roadmap phase (F0, F1, ...) |
| `skills/update-project-docs/SKILL.md` | Consistent update of project docs | When stack, domain, structure change or a phase is closed |
| `workflows/create-skill.md` | Runbook to create skills | When adding a new capability |
| `workflows/create-rule.md` | Runbook to create canonical rules | When defining new agent rules |
| `workflows/create-workflow.md` | Runbook to create workflows | When converting a repeatable task into a formal process |
| `workflows/phase-closeout.md` | Canonical runbook for phase closeout | When executing the closeout of a roadmap phase |
| `workflows/project-documentation.md` | Canonical runbook for project docs | When technical functional documentation is requested |
| `workflows/update-memory.md` | Runbook to update memory | When recording context, decisions, or terminology changes |
| `rules/agents.md` | Canonical bootstrap rule | Always: before executing tasks with agents |
| `rules/language-policy.md` | Language policy rule | Always: dictates English/Spanish artifact boundaries |

## External References

- `../docs/stack-and-architecture.md`: source of truth for stack, architecture, domain model, and conventions. Mandatory reading when touching stack, persistence, or domain.

## Current Technical State (F1)

To accelerate new agent sessions on the product's actual state:

- **F1 Routes:** `../src/app/router.tsx` (`/fields`, `/fields/new`, `/fields/:id/edit`).
- **F1 UI:** `../src/features/field-definitions/pages/FieldListPage.tsx`, `../src/features/field-definitions/pages/FieldFormPage.tsx`.
- **Dynamic Form Component:** `../src/features/field-definitions/components/FieldForm.tsx`.
- **Field Domain:** `../src/domain/field.ts` (discriminated union by type + typed `config`).
- **Field Persistence:** `../src/infra/db/repositories/field-repository.ts` + Dexie v2 schema in `../src/infra/db/schema.ts`.
- **F1 Tests:** `../tests/unit/field-schema.test.ts`, `../tests/unit/slugify.test.ts`, `../tests/e2e/field-crud.spec.ts`.

## Encounter Protocol

1. Read `../AGENTS.md` for global behavior rules.
2. Read `rules/language-policy.md`.
3. Restore context with `memory/project-context.md` and `memory/decisions.md`.
4. If the task touches stack or architecture, read `../docs/stack-and-architecture.md`.
5. If the task affects `.agents/`, delegate execution to `skills/agent-workspace-manager/SKILL.md`.

## Interoperability

- **Canonical:** workflows and rules live in `.agents/`.
- **Windsurf/Cascade:** uses bridges in `/.windsurf/rules/` and stubs in `/.windsurf/workflows/` that delegate to `.agents/`.
- **Cursor:** uses bridges in `/.cursor/rules/` that delegate to `.agents/rules/`.
- **Claude Code:** uses `AGENTS.md` by convention without an extra bridge file.
- **Codex CLI / Aider / Jules:** use `AGENTS.md` as the root instruction.
- **Human Contributors:** use this index as an operational map and `decisions.md` as historical log.
