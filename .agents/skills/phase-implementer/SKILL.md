# Phase Implementer

## Description

Implements a Chronicle roadmap phase end-to-end: creates the git branch, builds domain models, persistence, feature modules, routing, unit and E2E tests, verifies all checks pass, and triggers `phase-closeout`.

## Trigger Conditions

Use this skill when:

- A phase plan has been confirmed (output of `phase-planner`).
- The user asks to implement a roadmap phase (F1, F2, F3, ...).
- A partial implementation needs to be resumed following the plan.

## Prerequisites

- A confirmed plan from `.agents/skills/phase-planner/SKILL.md` must exist for this phase.
- `master` branch is clean and up-to-date (`git status` shows no uncommitted changes).
- `AGENTS.md`, `.agents/memory/project-context.md`, and `docs/stack-and-architecture.md` have been read.
- Previous phase is closed (`decisions.md` has its closure entry and all tests are green on `master`).

## Steps

### 1. Create the feature branch

```bash
git checkout -b feat/f<N>-<slug>
```

Branch naming convention: `feat/f<N>-<slug>` (e.g., `feat/f4-export-import`).

Verify with `git branch` that the new branch is active before writing any code.

### 2. Implement domain models

For each new or modified entity in the plan:

1. Create or edit `src/domain/<entity>.ts`.
2. Define the TypeScript interface and its Zod schema.
3. Export both the type and the schema.
4. Follow the discriminated union pattern if the entity has subtypes (see `src/domain/field.ts`).
5. Add `createdAt`, `updatedAt`, `archivedAt` where applicable (ISO 8601 strings).
6. Add new error codes to `src/infra/error.ts` using the `<MODULE>_*` prefix convention.

### 3. Update Dexie schema and migrations

In `src/infra/db.ts`:

1. Bump the schema version constant: `v<N>` → `v<N+1>`.
2. Add new tables and indexes in the `version(<N+1>).stores(...)` call.
3. Write the `.upgrade(tx => ...)` callback for any required migration (seed rows, defaults, transforms).
4. Keep previous version blocks intact — Dexie requires them for upgrade chains.

### 4. Implement repositories

For each new repository in the plan:

1. Create `src/infra/repositories/<entity>-repository.ts`.
2. Implement CRUD operations using the Dexie table API.
3. Include `archive` / `restore` methods if the entity is archivable.
4. Return typed domain objects — never expose raw Dexie records outside the repository.

### 5. Implement services

For each feature service in the plan:

1. Create `src/features/<module>/service.ts`.
2. Implement each use case as an async function.
3. Call repositories and apply business rules (validation, snapshots, side effects).
4. Throw typed errors from `src/infra/error.ts` on failure.
5. Keep services pure of UI concerns — no React imports.

### 6. Implement React hooks

For each hook in the plan:

1. Create `src/features/<module>/use-<entity>.ts` or `use-<entity>-actions.ts`.
2. Use `useLiveQuery` (Dexie) for reactive reads; use `useCallback` for write actions.
3. Expose only the data and handlers components need — keep the hook interface minimal.
4. Handle loading and error states explicitly.

### 7. Implement UI pages and components

For each page or component in the plan:

1. Create files under `src/features/<module>/`.
2. Follow the existing naming pattern: `<Entity>ListPage.tsx`, `<Entity>FormPage.tsx`, `<Entity>Form.tsx`, `<Entity>ListTable.tsx`.
3. Use shadcn/ui primitives (Button, Input, Select, Dialog, etc.) for consistency.
4. Use React Hook Form + Zod for all forms.
5. All user-visible strings must be in **rioplatense Spanish** (labels, toasts, placeholders, aria-label).
6. Use semantic HTML elements (`<main>`, `<header>`, `<section>`, `<article>`, `<nav>`).
7. Add `data-testid` attributes only where `getByRole` / `getByLabel` selectors are insufficient for E2E.

### 8. Register routes and navigation

In `src/app/router.tsx`:

1. Import all new page components.
2. Add route entries following the kebab-case path convention.
3. Use nested routes where the plan specifies hierarchy (e.g., `/encounters/:id/observations/new`).

If the plan adds a new navigation entry:

1. Add it to the navigation component (check `src/app/` for the nav component).
2. Label must be in rioplatense Spanish.

### 9. Write unit tests

For each unit test in the plan:

1. Create `tests/unit/<entity>-schema.test.ts` for Zod schema validation.
2. Create `tests/unit/<module>-service.test.ts` for non-trivial service logic.
3. Mock Dexie calls using `vi.mock` — place mocks before any imports that use the module (hoisting rule).
4. Cover: valid input, invalid input (schema rejection), and edge cases identified in the plan.
5. Run `pnpm test` after each new test file — fix failures before moving on.

### 10. Write E2E tests

For each E2E spec in the plan:

1. Create `tests/e2e/<flow>.spec.ts`.
2. Scope each test to its own data — never rely on state left by another test.
3. Use `page.getByRole`, `page.getByLabel`, `page.getByText` as primary locators.
4. Use `data-testid` only as a last resort.
5. Follow the happy path first, then add critical error paths.
6. Run `pnpm test:e2e` after completing each spec — fix failures before moving on.
   Consult `.agents/skills/test-fix/SKILL.md` before retrying a failing test more than once.

### 11. Run full verification

```bash
pnpm check
```

This runs `typecheck → lint → test → test:e2e` in sequence. All checks must pass before committing.

If any check fails:
- For test failures: consult `.agents/skills/test-fix/SKILL.md`.
- For type errors: trace the error to its source — never use `as any` or `@ts-ignore` to suppress.
- For lint errors: fix at the source, never disable rules globally.

### 12. Commit the implementation

Propose to the user a commit following Conventional Commits:

```
feat: implement F<N> — <short summary>
```

Include in the commit body a brief itemized list of what was built (domain, persistence, features, routing, tests).

**Do not commit until the user approves.**

### 13. Execute phase-closeout

Delegate to `.agents/skills/phase-closeout/SKILL.md`:

1. Inventory what was built.
2. Evaluate and create new skills if needed.
3. Execute `update-project-docs` to synchronize all documentation.
4. Verify the consistency checklist.
5. Propose the documentation commit: `docs: F<N> phase closeout — update architecture, memory and README`.

## Outputs

- Feature branch with all implementation committed.
- `pnpm check` green (typecheck + lint + unit + E2E tests).
- Phase-closeout documentation commit proposed to the user.
- `decisions.md` entry for the phase closure.
- All project docs updated (`stack-and-architecture.md`, `project-context.md`, `glossary.md`, `README.md`, `.agents/README.md`).

## Constraints

- NEVER write code without a confirmed plan from `phase-planner`.
- NEVER commit without explicit user approval.
- NEVER use `as any`, `@ts-ignore`, or rule disables to silence type or lint errors.
- NEVER expose Dexie internals outside repositories.
- NEVER write user-facing strings in English — all UI text must be in rioplatense Spanish.
- NEVER skip full verification (`pnpm check`) before proposing the implementation commit.
- NEVER skip `phase-closeout` — it is mandatory at the end of every phase.
- NEVER merge directly to `master` — always propose a merge/PR to the user.
