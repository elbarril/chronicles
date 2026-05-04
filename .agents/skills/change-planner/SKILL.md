# Change Planner

## Description

Produces a concise, scope-aware plan for a generic update — feature, refactor,
bug fix, infra tweak, or docs-only change — before any code is written. The
plan stays high-level and references existing project documentation instead of
duplicating it.

## Trigger Conditions

Use this skill when:

- The change touches more than one file or module.
- The change introduces a new pattern, dependency, route, persistence change, or domain concept.
- The user asks to scope or break down work before implementation.
- The user explicitly asks for a plan.

Skip this skill when the change is a single-file edit clearly covered by an
existing test or convention (typos, copy tweaks, isolated bug fixes).

## Prerequisites

- The bootstrap reads from `AGENTS.md` are complete (`AGENTS.md`,
  `.agents/rules/language-policy.md`, `.agents/memory/project-context.md`).
- If the change touches stack, persistence, or domain, also read
  `docs/stack-and-architecture.md` and respect its conventions instead of
  re-deriving them in the plan.

## Steps

### 1. Frame the change

State, in two or three sentences:

- What user-visible or developer-visible problem the change solves.
- Why now (request, bug report, follow-up, hardening, etc.).
- Out-of-scope items that are deliberately deferred.

### 2. Classify the scope

Tag the change with one or more of these scopes — they drive what the plan
must cover:

| Scope tag | Plan must include |
|---|---|
| `domain` | Affected entities, fields, schemas, error codes; reference `docs/stack-and-architecture.md` § Domain. |
| `persistence` | Dexie schema version bump and migration intent (no code, just intent). |
| `feature` | Affected feature module(s) under `src/features/<module>/`, services/hooks/pages/components touched. |
| `routing` | Routes added, removed, or renamed; navigation impact. |
| `infra` | Cross-cutting infra (`src/infra/`, build, PWA, AI client, etc.). |
| `docs` | Documents to update on closeout. |
| `tests` | Unit and E2E coverage to add or adjust. |

### 3. Reuse existing conventions

Before designing anything new, scan the codebase for the closest existing
pattern (a sibling feature module, an existing repository, an existing test
spec) and reuse it. Note the reference path in the plan. The goal is
consistency, not novelty.

### 4. Outline the work

Produce a compact list — not a code dump — covering only what the scope tags
demand. Suggested shape:

- **Files to add:** path → one-line purpose.
- **Files to edit:** path → one-line nature of change.
- **Schema changes (if `persistence`):** version bump, migration intent.
- **Tests to add or adjust:** `tests/unit/...`, `tests/e2e/...`.
- **Risks / open questions:** anything that should be resolved before coding.

### 5. Define branch and commit plan

- **Branch name:** `<type>/<short-slug>` using Conventional Commit types
  (`feat`, `fix`, `refactor`, `chore`, `docs`, `perf`, `test`).
  Example: `feat/encounter-bulk-archive`, `fix/chronicle-share-fallback`,
  `docs/agents-restructure`.
- **Implementation commit:** Conventional Commits — `<type>(<optional-scope>): <summary>`.
- **Closeout commit (only if needed):** `docs: update agents docs and architecture for <change>`.

### 6. Flag candidate skills or rules

If the change introduces a recurring pattern that future work will reuse,
flag it as a candidate skill or rule to create during closeout. Do not create
it now.

### 7. Confirm with the user

Output the plan and ask the user to confirm or adjust before handing off to
`change-implementer`. Keep the plan readable on a single screen when
possible.

## Outputs

- A confirmed, compact plan covering frame, scope tags, file map, schema/test impact, branch, commits, and candidate skills (if any).
- User confirmation before implementation starts.

## Constraints

- NEVER start implementation in this skill.
- NEVER duplicate content already in `docs/stack-and-architecture.md` — reference the relevant section instead.
- NEVER expand the plan with project-internal naming or directory rules already covered by existing skills or docs.
- NEVER skip user confirmation before handing off to `change-implementer`.
