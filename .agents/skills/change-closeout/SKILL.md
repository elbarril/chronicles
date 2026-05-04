# Change Closeout

## Description

Closes out a generic update by auditing what was built, capturing reusable
patterns into skills/workflows/rules, and synchronizing project documentation.
Triggered only when the change actually warrants documentation or skill
updates — trivial changes skip this step.

## Trigger Conditions

Use this skill when the implementation introduced any of:

- New domain entity, field, schema, or error code.
- Dexie schema version bump or migration.
- New dependency added to `package.json`.
- New route, top-level navigation entry, or feature module.
- New cross-cutting pattern that future work will reuse.
- New skill, workflow, or rule under `.agents/`.
- The user explicitly asks to close out the change.

Skip this skill when the change is self-contained (typo fixes, copy tweaks,
isolated bug fixes already covered by existing docs and tests).

## Prerequisites

- The implementation is functionally complete and `pnpm check` is green.
- The implementation commit has been proposed (it does not need to be
  approved yet — closeout work is its own commit).
- Mandatory bootstrap reads from `AGENTS.md` are complete.

## Steps

### 1. Inventory what was built

List the actual changes:

- Files created or modified — `git diff --name-status <base>..HEAD`.
- New dependencies in `package.json`.
- New or modified domain concepts.
- New patterns introduced (infra layers, conventions, component types).

### 2. Evaluate skill / workflow / rule needs

For each recurring pattern, tool, or flow introduced:

- **Does an existing skill cover it?** If yes, decide whether it needs
  updating (and update it).
- **Will future work reuse this?** If yes, create a new skill, workflow, or
  rule. Otherwise skip — adding low-value skills increases context overload.

For each new asset, delegate to the matching workflow:

- New skill → `.agents/workflows/create-skill.md`.
- New workflow → `.agents/workflows/create-workflow.md`.
- New rule → `.agents/workflows/create-rule.md`.

### 3. Synchronize project documentation

Delegate to `.agents/skills/update-project-docs/SKILL.md`. That skill covers,
in order, only the documents the change actually impacts:

- `docs/stack-and-architecture.md`
- `.agents/memory/project-context.md`
- `.agents/memory/decisions.md` (append-only)
- `.agents/memory/glossary.md`
- `README.md`
- `.agents/README.md`

Do not edit documents that are not affected by the change.

### 4. Verify consistency

Final checklist before proposing the closeout commit:

- [ ] Every new skill/workflow/rule has its mandatory sections complete.
- [ ] `decisions.md` has an entry only if a decision actually warrants it (do not pad with cosmetic changes).
- [ ] `project-context.md` reflects current state without redundant historical noise.
- [ ] `glossary.md` includes all new domain terms.
- [ ] `docs/stack-and-architecture.md` reflects stack, domain, or structure changes — and only those.
- [ ] `.agents/README.md` lists new shared skills/workflows.
- [ ] No duplicated information between documents (respect the
      Responsibility Matrix in `update-project-docs`).

### 5. Propose the closeout commit

Suggest a documentation-and-tooling commit to the user, separate from the
implementation commit. Suggested shape:

```
docs: update agents docs and architecture for <change>
```

If only `.agents/` files changed:

```
chore(agents): record <change> in agent workspace
```

Do not auto-commit.

## Outputs

- Updated documentation aligned with the change's actual scope.
- New or updated skills/workflows/rules where future reuse is likely.
- Closeout commit proposed (separate from the implementation commit).

## Constraints

- NEVER add skills, rules, or workflows for one-off patterns. The cost of carrying them across sessions outweighs the benefit.
- NEVER edit previous entries in `.agents/memory/decisions.md` — it is append-only.
- NEVER make automatic commits — always propose to the user.
- NEVER update documents that the change does not actually affect.
- NEVER skip the consistency checklist (step 4).
