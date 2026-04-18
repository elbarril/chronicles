# Agent Workspace Manager

## Description

Coordinates changes in `.agents/` by delegating execution to canonical workflows and validating conformity with `AGENTS.md`.

## Trigger Conditions

Use this skill when:

- A new skill is being created in `.agents/skills/`
- A workflow is being created or modified in `.agents/workflows/`
- A memory file is being created or updated in `.agents/memory/`
- A general consistency review of the agent workspace is needed

## Invariant Rules

- Keep `AGENTS.md` as the source of truth for global principles.
- Avoid duplication between `AGENTS.md`, `.agents/README.md`, skills, and workflows.
- Use plain Markdown and tool-agnostic content within `.agents/`.
- Record significant decisions in `.agents/memory/decisions.md`.

## Delegation by Task Type

| Task | Canonical Workflow |
|------|-------------------|
| Create a skill | `.agents/workflows/create-skill.md` |
| Create a workflow | `.agents/workflows/create-workflow.md` |
| Update memory | `.agents/workflows/update-memory.md` |

## Quality Checklist

Before finalizing any change to the workspace, verify:

- [ ] The file uses plain Markdown with no tool-exclusive syntax
- [ ] The file is self-contained and its internal references are valid
- [ ] The name follows kebab-case convention where applicable
- [ ] `decisions.md` was updated if there was a significant change
- [ ] No duplication with existing skills, memory, or workflows
- [ ] No principle of `AGENTS.md` was violated
- [ ] All mandatory template sections are complete

## Constraints

- NEVER duplicate detailed steps that already exist in canonical workflows.
- NEVER edit previous entries in `.agents/memory/decisions.md`.
- NEVER introduce external dependencies without documenting and justifying them.
