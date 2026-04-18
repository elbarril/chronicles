---
description: Create or update Chronicle project documentation from the current codebase.
---

# Project Documentation (Chronicle)

Analyze the Chronicle repository and create or update project documentation incrementally.
This workflow is for this codebase architecture (local-first React + TypeScript app).

## Operation Mode

### 1. Detect current documentation state

Check whether these core files already exist:

- `README.md`
- `docs/stack-and-architecture.md`
- `.agents/memory/project-context.md`
- `.agents/memory/decisions.md`
- `.agents/memory/glossary.md`
- `.agents/README.md`

If files exist, update them incrementally.
If a required file is missing, create it following project conventions.

### 2. Collect evidence from source of truth

Read these files before editing:

1. `AGENTS.md`
2. `.agents/memory/project-context.md`
3. `.agents/memory/decisions.md`
4. `docs/stack-and-architecture.md`
5. `README.md`
6. `.agents/README.md`

Then inspect implementation evidence in:

- `src/app/`
- `src/features/`
- `src/domain/`
- `src/infra/`
- `tests/unit/`
- `tests/e2e/`
- `package.json`

### 3. Detect changes before writing

Use Git to map what changed since the base branch:

```bash
git fetch origin main
git diff --name-status origin/main..HEAD -- '*.*'
git diff --stat origin/main..HEAD
```

If `main` is not the base branch in this repository, use the actual base branch.
Focus updates on files and modules that changed.

## Documentation Objectives

1. Keep documentation synchronized with real code and architecture.
2. Preserve the local-first product model and constraints.
3. Update only affected sections when possible.
4. Keep responsibilities separated across documents (no duplicated source of truth).
5. Record meaningful technical decisions with traceability.

## Deliverables

Update or create the following files as needed.

### A) `README.md`

Update only what changed:

- Project description and current roadmap phase.
- Main module references and key routes.
- Local development requirements and commands.
- Links to canonical technical documentation.

### B) `docs/stack-and-architecture.md`

Treat this file as canonical technical source of truth.
Follow its maintenance protocol (section 8) and update:

- Stack table and dependency decisions.
- Domain model entities and typed contracts.
- Folder structure at high level.
- Persistence model (Dexie/IndexedDB tables and schema versioning).
- Testing strategy and roadmap status.
- Last update date.

### C) `.agents/memory/project-context.md`

Keep concise and current:

- Current project state/phase.
- Active stack summary.
- Functional baseline implemented.
- Main active flows.

### D) `.agents/memory/decisions.md`

Append-only policy:

- Add a new entry only for significant product/technical decisions.
- Never edit or remove previous entries.
- Use standard structure: Context, Decision, Justification, Consequences.

### E) `.agents/memory/glossary.md`

Update only if domain concepts changed:

- Add new terms in alphabetical order.
- If redefining a term, register decision first in `decisions.md`.

### F) `.agents/README.md`

Update only if `.agents/` structure changed:

- New/removed skills.
- New/removed workflows.
- Updated references to operational files.

## Incremental Update Rules

- Do not rewrite entire documents when only one section changed.
- Preserve valid sections and update affected sections only.
- Add explicit change notes where useful.
- Keep cross-references consistent across all docs.
- Prefer evidence from code over assumptions.

## Quality Checklist

Before finalizing:

- [ ] Changes in docs match actual code.
- [ ] `docs/stack-and-architecture.md` reflects current stack/domain/structure.
- [ ] `project-context.md` and roadmap state are current.
- [ ] Significant changes are registered in `decisions.md` (append-only).
- [ ] No contradictory statements across docs.
- [ ] No duplicated ownership of information.

## Suggested Execution Order

1. Update `docs/stack-and-architecture.md`.
2. Update `.agents/memory/project-context.md`.
3. Append to `.agents/memory/decisions.md` if needed.
4. Update `.agents/memory/glossary.md` if needed.
5. Update `README.md`.
6. Update `.agents/README.md` if needed.
7. Run final consistency check.

## Notes

- Write documentation in English.
- Keep terminology aligned with `.agents/memory/glossary.md`.
- If implementation changed but architecture docs were not updated, fix docs in the same task.
- If you cannot validate a claim in code or canonical docs, mark it as unknown instead of guessing.
