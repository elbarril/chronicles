# Phase Planner

## Description

Produces a structured implementation plan for a Chronicle roadmap phase — covering domain, persistence, feature modules, routing, testing, branch name, and potential new skills — before a single line of code is written.

## Trigger Conditions

Use this skill when:

- The user asks to plan the next roadmap phase.
- A phase is about to begin and there is no written plan yet.
- The user asks to scope or break down a feature phase before implementation.
- The `phase-implementer` skill is about to run and no plan document exists.

## Prerequisites

- `AGENTS.md`, `.agents/memory/project-context.md`, and `docs/stack-and-architecture.md` must have been read at session start.
- The previous phase must be closed (all tests green, `decisions.md` entry recorded).

## Steps

### 1. Identify the target phase

Read `docs/stack-and-architecture.md` section 6 (Technical Roadmap) and `.agents/memory/project-context.md`:

- Determine the next incomplete phase (e.g., F4, F5, ...).
- Confirm its stated deliverable and exit criteria.
- If the user specifies a different scope, capture it explicitly and note the deviation.

### 2. Audit prior phase patterns

Read `.agents/memory/decisions.md` entries for completed phases to identify:

- Domain modeling conventions used (Zod discriminated unions, `createdAt`/`updatedAt`/`archivedAt`, etc.).
- Dexie schema versioning convention (`v<N>`, migration in `db.ts`).
- Feature module structure (`src/features/<module>/`: `service.ts`, hooks, pages, components, `messages.ts`).
- Routing convention (kebab-case paths, grouping in `src/app/router.tsx`).
- Testing conventions (unit schemas + service in `tests/unit/`, E2E specs in `tests/e2e/`).
- Branch naming convention: `feat/f<N>-<slug>` (e.g., `feat/f4-export-import`).

### 3. Define domain changes

For each new or modified entity in this phase, specify:

- **Entity name** (canonical English identifier from `.agents/memory/glossary.md`)
- **Fields** with types and constraints
- **Zod schema file** path (`src/domain/<entity>.ts`)
- **Relationship** to existing entities (e.g., belongs to `Encounter`, references `Group`)
- **New error codes** to add to `src/infra/error.ts` (prefix pattern: `<MODULE>_*`)

### 4. Define persistence changes

- **Dexie schema version:** current `v<N>` → `v<N+1>`.
- **Tables affected:** new tables, modified indexes, removed tables.
- **Migration:** describe what the `upgrade` callback must do (seed data, schema transforms, defaults).
- **New repositories:** list file paths and the CRUD operations each must expose.

### 5. Define feature modules

For each feature module to create or extend:

- **Module path:** `src/features/<module>/`
- **service.ts:** list use cases (functions and their signatures)
- **hooks:** list custom hooks and what state they manage
- **pages:** list page components and their routes
- **components:** list UI components and their responsibilities
- **messages.ts / defaults.ts:** any user-facing strings or default values

### 6. Define routing and navigation

- List new route paths following the kebab-case convention.
- Specify which component handles each route.
- Identify if a new main navigation entry is needed (and its label in rioplatense Spanish).

### 7. Define testing scope

**Unit tests** (`tests/unit/`):

- Schema validation tests for each new Zod schema.
- Service logic tests for non-trivial use cases.

**E2E tests** (`tests/e2e/`):

- One spec per major user flow (e.g., `<module>-crud.spec.ts`, `<flow>.spec.ts`).
- Happy path and critical error paths.
- Playwright locator strategy: prefer `getByRole`, `getByLabel`, `data-testid` as last resort.

### 8. Identify potential new skills

For each new pattern or tool introduced in this phase, evaluate:

- Is it a recurring pattern that future phases will reuse?
- Does it introduce a new infrastructure layer (e.g., sync engine, external API, new media type)?
- If yes, flag it as a candidate skill to create during `phase-closeout`.

### 9. Define branch and commit plan

- **Branch name:** `feat/f<N>-<slug>` (e.g., `feat/f4-export-import`).
- **Implementation commit:** `feat: implement F<N> — <short summary>` (follows Conventional Commits).
- **Closeout commit:** `docs: F<N> phase closeout — update architecture, memory and README`.

### 10. Output the plan

Produce a concise, structured plan containing:

- Phase identifier and deliverable.
- Domain changes table (entity → file → fields).
- Persistence changes (schema version, tables, migration description).
- Feature module map (module → service | hooks | pages | components).
- Route table (path → component → navigation label if any).
- Testing scope (unit list, E2E list).
- Branch name and commit messages.
- Candidate skills (if any).

Ask the user to confirm or adjust the plan before handing off to `phase-implementer`.

## Outputs

- Confirmed written plan covering all axes: domain, persistence, features, routing, tests, branch, commits, and candidate skills.
- User-confirmed scope before implementation starts.

## Constraints

- NEVER start implementation — this skill only plans.
- NEVER invent entities or fields not derivable from the roadmap and existing conventions.
- NEVER skip auditing prior phase patterns (step 2) — conventions must be consistent.
- NEVER omit the testing scope — unit and E2E targets must be explicit before coding starts.
- NEVER propose skipping `phase-closeout` in the commit plan.
- NEVER proceed past step 10 without explicit user confirmation of the plan.
