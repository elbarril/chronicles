# Phase Closeout

## Description

Orchestrates the closure of an implementation phase: audits what was built, creates or updates relevant skills, and triggers full project documentation updates.

## Trigger Conditions

Use this skill when:

- A roadmap phase is completed (F0, F1, F2, ...).
- A significant implementation block is finished that introduces new concepts, patterns, or tools.
- The user explicitly requests closing or documenting a phase.

## Prerequisites

- The phase must be functionally complete (build, lint, tests green).
- The agent must have read `AGENTS.md`, `.agents/memory/project-context.md`, and `docs/stack-and-architecture.md` at session start.

## Steps

### 1. Inventory what was built

List all changes in the phase:

- Files created or modified (use `git diff --name-status` against the branch or the last close commit).
- New dependencies added to `package.json`.
- New or modified domain concepts.
- New technical patterns (e.g.: new infrastructure layer, new component type, new convention).

### 2. Evaluate need for new or updated skills

For each recurring pattern, tool, or flow introduced, evaluate:

- **Does an existing skill cover it?** If it exists, determine if it needs updating.
- **Is this a pattern that will repeat in future phases?** If yes, create a new skill.

### 3. Create identified skills

For each new skill, delegate to workflow `.agents/workflows/create-skill.md`:

1. Create directory in `.agents/skills/<skill-name>/`.
2. Complete `SKILL.md` with all mandatory sections.
3. Include support scripts if applicable.

### 4. Update existing skills

If an existing skill needs changes due to what was built in the phase:

1. Edit the corresponding `SKILL.md`.
2. Record the change in `.agents/memory/decisions.md`.

### 5. Execute skill `update-project-docs`

Delegate to `.agents/skills/update-project-docs/SKILL.md` to update all project documentation. This skill covers:

- `docs/stack-and-architecture.md` (stack, structure, domain, roadmap).
- `.agents/memory/project-context.md` (current project state).
- `.agents/memory/decisions.md` (record of the completed phase).
- `.agents/memory/glossary.md` (new terms).
- `README.md` (if commands or requirements changed).
- `.agents/README.md` (if new skills or workflows were created).

### 6. Verify consistency

Final checklist:

- [ ] Every new skill has a complete `SKILL.md` with all mandatory sections.
- [ ] `decisions.md` has an entry for the phase closure.
- [ ] `project-context.md` reflects the updated project state.
- [ ] `glossary.md` includes all new terms.
- [ ] `docs/stack-and-architecture.md` reflects any stack, domain, or structure changes.
- [ ] `.agents/README.md` lists new skills if they are for general use.
- [ ] No duplication between documents.

### 7. Propose commit

Suggest a commit to the user with documentation and skill changes, separate from the phase code commit.

## Outputs

- New skills in `.agents/skills/`.
- Complete and updated documentation.
- Entry in `decisions.md` recording the phase closure.
- Summary of changes made for the user.

## Constraints

- NEVER create skills that duplicate logic from existing ones — reference them instead.
- NEVER edit previous entries in `decisions.md`.
- NEVER make automatic commits — always propose to the user.
- NEVER skip the execution of `update-project-docs` — it is mandatory in every phase closure.
