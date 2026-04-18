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

## Current State

See `.agents/memory/project-context.md` for current project state, active routes, and key file references.

## Interoperability

- **Canonical:** workflows and rules live in `.agents/`.
- **Windsurf/Cascade:** uses bridges in `/.windsurf/rules/` and stubs in `/.windsurf/workflows/` that delegate to `.agents/`.
- **Cursor:** uses bridges in `/.cursor/rules/` that delegate to `.agents/rules/`.
- **Claude Code:** uses `AGENTS.md` by convention without an extra bridge file.
- **Codex CLI / Aider / Jules:** use `AGENTS.md` as the root instruction.
- **Human Contributors:** use this index as an operational map and `decisions.md` as historical log.
