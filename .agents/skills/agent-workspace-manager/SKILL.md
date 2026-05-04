# Agent Workspace Manager

## Description

Coordinates changes inside `.agents/` by delegating execution to canonical
workflows and validating conformity with `AGENTS.md`. Keeps the workspace
tool-agnostic and free of duplicated logic across IDE bridge files.

## Trigger Conditions

Use this skill when:

- A new skill is being created in `.agents/skills/`.
- A workflow is being created or modified in `.agents/workflows/`.
- A rule is being created or modified in `.agents/rules/`.
- A memory file is being created or updated in `.agents/memory/`.
- A general consistency review of the agent workspace is needed.

## Invariant Rules

- `AGENTS.md` is the source of truth for global principles and bootstrap.
- Avoid duplication between `AGENTS.md`, `.agents/README.md`, skills, workflows, and rules.
- Every file inside `.agents/` uses plain Markdown and stays tool-agnostic.
- Significant decisions are appended to `.agents/memory/decisions.md`.

## Delegation by Task Type

| Task | Canonical Workflow |
|---|---|
| Create a skill | `.agents/workflows/create-skill.md` |
| Create a workflow | `.agents/workflows/create-workflow.md` |
| Create a rule | `.agents/workflows/create-rule.md` |
| Update memory | `.agents/workflows/update-memory.md` |

## IDE Bridge Files

When a canonical asset needs an IDE-facing entry point:

- **Windsurf/Cascade:** add a stub under `.windsurf/rules/` (for rules) or
  `.windsurf/workflows/` (for workflows / slash commands). The stub must
  delegate to the canonical file in `.agents/` without duplicating logic.
- **Cursor:** add a bridge under `.cursor/rules/` only when the rule must be
  always-on for Cursor users. Otherwise skip.
- **Devin CLI:** no bridge file needed — Devin auto-discovers skills under
  `.agents/skills/` and reads `AGENTS.md`.

## Quality Checklist

Before finalizing any change to the workspace, verify:

- [ ] The file uses plain Markdown with no tool-exclusive syntax (Cascade `// turbo` comments are the only tolerated exception).
- [ ] The file is self-contained and its internal references resolve.
- [ ] The name follows kebab-case where applicable.
- [ ] `decisions.md` was updated only if the change is significant (do not pad).
- [ ] No duplication with existing skills, workflows, rules, or memory.
- [ ] No principle of `AGENTS.md` is violated.
- [ ] All mandatory template sections are complete (Description, Trigger Conditions, Steps, Constraints).

## Constraints

- NEVER duplicate detailed steps that already exist in canonical workflows.
- NEVER edit previous entries in `.agents/memory/decisions.md`.
- NEVER introduce external dependencies in skills/workflows without documenting and justifying them.
- NEVER add trivial skills, rules, or workflows whose context cost outweighs their reuse value.
