# Change Implementer

## Description

Implements a confirmed generic update end-to-end — branch creation, code
changes, tests, full verification, and (when warranted) handoff to
`change-closeout`. Adapts to the scope tags chosen during planning instead of
prescribing a fixed phase recipe.

## Trigger Conditions

Use this skill when:

- A plan from `change-planner` has been confirmed.
- The user asks to resume an interrupted implementation that already has a written plan.
- The change is large enough that working without `change-planner` would risk inconsistency, but a quick inline plan was agreed in the conversation.

## Prerequisites

- Mandatory bootstrap reads from `AGENTS.md` are complete.
- A confirmed plan exists (formal output from `change-planner` or an inline
  agreement captured in the session).
- The base branch is clean (`git status` shows no unrelated uncommitted
  changes).

## Steps

### 1. Create the branch

```bash
git checkout -b <type>/<short-slug>
```

`<type>` matches the Conventional Commit type chosen in the plan
(`feat`, `fix`, `refactor`, `chore`, `docs`, `perf`, `test`). Verify the new
branch is active before writing any code.

### 2. Apply the planned changes by scope

Implement only what the plan specifies. Match the existing project
conventions documented in `docs/stack-and-architecture.md`; do not reinvent
patterns. Concrete reminders:

- **Code conventions:** TypeScript strict, React Hook Form + Zod for forms, shadcn/ui primitives, services free of UI imports, repositories as the only Dexie boundary.
- **Language policy:** all internal artifacts in English, all user-visible strings in rioplatense Spanish (see `.agents/rules/language-policy.md`).
- **Errors:** throw `AppError` with stable English codes from `src/infra/error.ts`; map to Spanish copy at the UI/hook boundary via `messages.ts` per feature.
- **Persistence:** if the scope tag includes `persistence`, bump the Dexie schema version in `src/infra/db.ts` and write the `.upgrade(...)` callback. Keep prior version blocks intact.
- **Routing:** kebab-case paths, registered in `src/app/router.tsx`; nav labels in rioplatense Spanish.
- **Tests:** add or adjust unit specs in `tests/unit/` and E2E specs in `tests/e2e/` per the plan. Prefer `getByRole`/`getByLabel`; reach for `data-testid` only as a last resort. Always isolate test data — never depend on artifacts from previous runs.

### 3. Iterate locally

After each meaningful unit of work:

- Run focused unit tests for the area you changed.
- For UI flows, run the relevant E2E spec.

If a test fails, consult `.agents/skills/test-fix/SKILL.md` before retrying.

### 4. Full verification

Before proposing any commit, run:

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` runs `typecheck → lint → test → test:e2e` in sequence.

If `pnpm install --frozen-lockfile` fails with lockfile drift, run
`pnpm install` and stage `package.json` and `pnpm-lock.yaml` together in the
implementation commit.

If `pnpm check` fails:

- Test failures → consult `.agents/skills/test-fix/SKILL.md`.
- Type errors → trace to the source; never use `as any` or `@ts-ignore`.
- Lint errors → fix at the source; never disable rules globally.

See `.agents/workflows/verify.md` for the canonical verification reference.

### 5. Propose the implementation commit

Suggest a commit to the user using Conventional Commits, exactly as agreed in
the plan. Example shapes:

```
feat(forms): support per-instance label override
fix(chronicle): preserve order when regenerating with cache hit
refactor(infra/ai): split gemini client and prompt builder
docs(agents): switch from phase model to generic updates
```

Include a short body that lists what was actually built or fixed. Do not
commit until the user approves.

### 6. Decide whether closeout is needed

Closeout (`change-closeout`) is **mandatory** when the change introduced any
of the following:

- New domain entity, field, schema, or error code.
- Dexie schema version bump or migration.
- New dependency added to `package.json`.
- New route, top-level navigation entry, or feature module.
- New cross-cutting pattern that future work will reuse.
- New skill, workflow, or rule added under `.agents/`.

Closeout is **not** needed for self-contained edits whose scope was already
covered by existing docs and conventions (typo fixes, copy tweaks, isolated
bug fixes, internal refactors with no architectural impact).

If closeout is needed, hand off to `.agents/skills/change-closeout/SKILL.md`.
Otherwise stop here and let the user merge.

## Outputs

- Feature branch with all implementation committed (after user approval).
- Green `pnpm check` and frozen-lockfile preflight.
- Closeout handoff or explicit "no closeout needed" rationale.

## Constraints

- NEVER write code without a confirmed plan (formal or inline).
- NEVER commit without explicit user approval.
- NEVER use `as any`, `@ts-ignore`, or rule disables to silence type or lint errors.
- NEVER expose Dexie internals outside repositories.
- NEVER write user-facing strings in English — every UI text is rioplatense Spanish.
- NEVER skip full verification (`pnpm check`) before proposing the implementation commit.
- NEVER propose a commit with dependency metadata drift between `package.json` and `pnpm-lock.yaml`.
- NEVER merge directly to the default branch — propose a merge/PR to the user.
- NEVER skip closeout when the scope warrants it (see step 6).
