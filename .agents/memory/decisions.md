# Architectural Decisions

Log of technical and product decisions. Only append entries, never edit existing ones.

---

## [2026-04-17] Adoption of agent workspace structure

**Context:** The project requires coordinated work between mixed AI agents (Windsurf, Cursor, Claude, CLI) and human contributors.

**Decision:** Created the `.agents/` directory with three subsystems: `skills/`, `memory/`, `workflows/`.

**Justification:** The plain Markdown approach is tool-agnostic, self-documenting, and works in any agent environment without depending on proprietary APIs.

**Consequences:**

- Every agent must read `memory/project-context.md` when starting a session.
- Significant decisions must be recorded here before implementation.
- The `agent-workspace-manager` skill is the authority to create or modify agent tools.

---

## [2026-04-17] Vibe coding infrastructure refactor

**Context:** The original system duplicated protocols in `AGENTS.md`, `.agents/README.md` and `SKILL.md`; it didn't expose explicit bridges for Cursor; and templates were coupled to the `agent-workspace-manager` skill.

**Decision:** `AGENTS.md` became the minimalist single source of truth. The operational index lives in `.agents/README.md`. Templates moved to `.agents/templates/`. Added native bridges in `.windsurf/rules/` and `.cursor/rules/`, and slash command stubs in `.windsurf/workflows/` to delegate to canonical workflows.

**Justification:** Eliminates divergence from duplication, improves interoperability across agent IDEs/CLIs, and maintains a tool-agnostic operational layer in plain Markdown.

**Consequences:**

- `AGENTS.md` concentrates global principles and initial bootstrap.
- `.agents/README.md` remains as the unique operational index for `.agents/`.
- Canonical workflows live in `.agents/workflows/`; files in `.windsurf/workflows/` delegate and do not duplicate logic.
- Any tool supporting `AGENTS.md` can operate in the repo without additional configuration.

---

## [2026-04-17] Technology stack and architecture v1 (local-first web app)

**Context:** Chronicle v1 must allow the Practitioner to define observable fields, compose an observation form, and record encounters, supporting text, image, video, and audio. Project principles demand UX first, simplicity, performance, and minimal external dependencies.

**Decision:** Adopt a **local-first backendless stack** for v1: Vite + React + TypeScript, Tailwind + shadcn/ui (Radix), React Router, React Hook Form + Zod, Dexie.js over IndexedDB (includes Blobs for media), vite-plugin-pwa, Vitest + Playwright, pnpm. The domain model incorporates two new concepts: `Field` (typed definition of data to capture) and `Observation Form` (ordered composition of Fields). `docs/stack-and-architecture.md` remains the technical source of truth.

**Justification:**

- Not introducing a backend or BaaS respects the minimal external dependencies principle and makes the system portable and private by default.
- IndexedDB via Dexie is the only browser option that robustly stores `Blob` — a requirement for image/video/audio.
- React Hook Form + Zod allows building dynamic forms with reusable declarative validation.
- shadcn/ui over Radix provides accessibility (ARIA) without tying the project to a monolithic UI kit.
- PWA covers the expectation of offline use in institutional contexts.

**Consequences:**

- `docs/stack-and-architecture.md` is mandatory reading.
- Any new dependency or stack change requires an entry in this log.
- Explicitly discarded for v1: custom backend, BaaS (Supabase/Firebase), global state managers, heavy UI kits, ORMs.

---

## [2026-04-17] Creation of phase-closeout and update-project-docs skills

**Context:** Completing the F0 scaffolding phase revealed there was no formal process to close an implementation phase and consistently update all project documentation.

**Decision:** Created two complementary skills:

1. **`phase-closeout`**: orchestrates phase closure — inventories what was built, evaluates/creates new skills, and triggers documentation updates.
2. **`update-project-docs`**: reusable skill that consistently updates all documentation artifacts (`docs/stack-and-architecture.md`, `project-context.md`, `decisions.md`, `glossary.md`, `README.md`, `.agents/README.md`).

**Justification:**

- Formalizes the post-implementation process.
- Centralizes documentation update logic in a reusable skill (DRY).
- Ensures every phase leaves the project in a documented and auditable state.

**Consequences:**

- Every phase closure must execute `phase-closeout`.
- Every new skill must reference `update-project-docs` in its constraints or steps.

---

## [2026-04-17] Phase Closeout F0 — Scaffolding

**Context:** Completed phase F0 of the technical roadmap, covering full project scaffolding.

**Decision:** Phase F0 is closed with the following implemented scope:

- **Build/Dev:** Vite 5 + React 18 + TypeScript 5 + pnpm.
- **Styles/UI:** Tailwind CSS v4 + shadcn/ui primitives.
- **Routing:** React Router v7.
- **Forms:** React Hook Form + Zod v4.
- **Persistence:** Dexie.js v4 with schema v1.
- **PWA:** vite-plugin-pwa.
- **Testing:** Vitest + React Testing Library (unit), Playwright (E2E).
- **Lint/Format:** ESLint 9 flat config + Prettier.

**Justification:** All F0 exit criteria met.

**Consequences:**

- The project is ready to begin F1 (Field CRUD).

---

## [2026-04-18] Implementation F1 — Field CRUD

**Context:** The technical roadmap defines F1 as the first functional phase post-scaffolding, focused on allowing the operational definition of Fields.

**Decision:** Implemented a complete F1 baseline with end-to-end scope:

- **Domain:** `Field` model discriminated by `type` with typed `config` in `src/domain/field.ts`.
- **Persistence:** Dexie schema updated to v2 and dedicated repository created.
- **Feature layer:** `field-definitions` module with use case services, reactive hooks, and metadata.
- **UI and routing:** routes `/fields`, `/fields/new`, `/fields/:id/edit` integrated in `src/app/router.tsx`.
- **Testing:** coverage added for domain and E2E flow.

**Justification:**

- Discriminated model reduces ambiguity.
- Dedicated repository consolidates persistence business rules.
- UI flow allows real Practitioner operation.

**Consequences:**

- F1 implemented in functional baseline state.
- `project-context.md` state transitions to "F1 implemented".

---

## [2026-04-18] Language Policy Refactor (Bilingual Split)

**Context:** The user requested to translate all files to English, leaving rioplatense Spanish strictly for user-facing UI content and human-agent conversations. Past entries in this decisions log were in Spanish.

**Decision:**

1. A strict bilingual split is adopted: English for all internal project artifacts (code, tests, agent rules, docs, route URLs, dev-facing errors), and rioplatense Spanish exclusively for end-user UI strings (JSX text, toasts, labels, `lang="es-AR"`).
2. The domain glossary adopts a 3-column format: `Spanish term | Canonical English identifier | English definition`.
3. Created `.agents/rules/language-policy.md` to encode this boundary for all agents.
4. As a one-time exception, all historical entries in this `decisions.md` file and other agent memory files were translated to English.

**Justification:**

- Keeps the repository aligned with the mainstream English AI-coding ecosystem.
- Preserves the product requirement that Practitioners consume the app in rioplatense Spanish.
- Translating the historical decisions log (despite being an append-only file) avoids cognitive dissonance for agents reading mixed-language context.

**Consequences:**

- All future entries in `decisions.md` MUST be written in English.
- Developers and agents must map Spanish UI labels to English service errors using the new `src/**/messages.ts` convention.

---

## [2026-04-18] Agent Workspace Audit and Cleanup

**Context:** Deep analysis of the `.agents/` workspace revealed several issues: all three skill files were written in Spanish (violating the language policy), two bridge files (`.windsurf/rules/agents.md`, `.cursor/rules/agents.mdc`) used Spanish text, the bootstrap sequence was duplicated in three places (`AGENTS.md`, `.agents/rules/agents.md`, `.agents/README.md`), `project-context.md` had an explicitly acknowledged duplicate of AGENTS.md principles, and three orphaned files existed that were not indexed or reachable via bootstrap (`memory/f1-closeout.md`, `prompts/f0-scaffolding-planning.md`, `prompts/f1-field-crud-planning.md`).

**Decision:**

1. Translated all skill files to English: `agent-workspace-manager/SKILL.md`, `phase-closeout/SKILL.md`, `update-project-docs/SKILL.md`.
2. Fixed bridge files to English: `.windsurf/rules/agents.md`, `.cursor/rules/agents.mdc`.
3. Removed the "Encounter Protocol" section from `.agents/README.md` (third copy of bootstrap) and replaced "Current Technical State" with a pointer to `project-context.md`.
4. Removed "Design Principles (from AGENTS.md)" section from `project-context.md` and simplified the stack summary to a single pointer line.
5. Added missing `# Update Memory` title to `update-memory.md` and removed permanent historical noise note.
6. Deleted orphaned artifacts: `memory/f1-closeout.md`, `prompts/f0-scaffolding-planning.md`, `prompts/f1-field-crud-planning.md`.
7. Removed the `AGENTS.md Compliance` boilerplate section from `phase-closeout/SKILL.md` and `update-project-docs/SKILL.md`.

**Justification:** Each change addressed either a language policy violation (hallucination risk) or a duplication that creates divergence risk across multi-agent systems. Orphaned files not reachable via bootstrap paths are pure noise.

**Consequences:**

- All `.agents/` files are now fully in English, consistent with language policy.
- Bootstrap is defined in one canonical place (`AGENTS.md`) and referenced by bridges, not duplicated.
- `project-context.md` no longer self-duplicates AGENTS.md content.
- `.agents/memory/` contains only the three canonical memory types: `project-context.md`, `decisions.md`, `glossary.md`.

---

## [2026-04-18] Implementation F2 — Observation Form Editor

**Context:** F2 required enabling practitioners to compose and maintain reusable Observation Forms from existing Fields, preserving order and version history.

**Decision:** Implemented a full F2 baseline with the following scope:

- **Domain:** `ObservationForm` normalized with `createdAt`, `updatedAt`, `archivedAt`, and unique ordered `fieldIds`.
- **Versioning:** form version starts at `1` and auto-increments on every update.
- **Persistence:** Dexie schema upgraded to v3; `forms` table includes `createdAt` index and dedicated repository.
- **Feature module:** new `src/features/forms/` module (services, hooks, pages, components, messages/defaults).
- **UX:** accessible form composer with explicit add/remove and keyboard-friendly reorder (`↑ Subir` / `↓ Bajar`) plus `aria-live` announcements.
- **Routing/UI:** routes `/forms`, `/forms/new`, `/forms/:id/edit` and main navigation entry “Formularios”.
- **Testing:** added `tests/unit/form-schema.test.ts`, `tests/unit/form-service.test.ts`, and `tests/e2e/forms-compose.spec.ts`.

**Justification:**

- Delivers the roadmap milestone for Observation Form editing while preserving local-first constraints.
- Keeps architecture consistent with F1 patterns (feature module + repository + domain schema + reactive hooks).
- Improves accessibility and reduces complexity by avoiding drag-and-drop dependencies.

**Consequences:**

- F2 is completed in baseline state and F3 (Encounters/Observation Capture) can build on top of forms.
- Forms now enforce ordered unique field composition and deterministic version progression.
- Dexie persistence contract changed (v3), requiring documentation synchronization in architecture/context files.

---

## [2026-04-18] Testing infrastructure improvement — non-blocking E2E, dev server, and test-fix skill

**Context:** During F1 and F2 implementation sessions, agents incurred significant friction from three sources: (1) `pnpm test:e2e` required a full production build on every run; (2) Playwright's `html` reporter started an HTTP server after failures (`Serving HTML report at localhost:9323. Press Ctrl+C to quit.`) that blocked the agent console; (3) no documented patterns existed for common failure classes (`vi.mock` TDZ hoisting, E2E strict mode violations, stale test data), causing 6+ repetitive retry cycles per session.

**Decision:**

1. **`playwright.config.ts`**: default reporter changed from `"html"` to `"list"` (exits cleanly after every run). HTML reporter reserved for CI via `process.env.CI`. `webServer.command` changed from `pnpm preview --port 4173` (requires built `dist/`) to `pnpm dev --port 4173` (starts the Vite dev server — no build required).

2. **`package.json`** scripts:
   - `test:e2e`: now just `playwright test` — Playwright manages the dev server lifecycle automatically.
   - `test:e2e:ci`: `pnpm build && E2E_PREVIEW=1 playwright test` — production build + preview server for CI.
   - `check`: `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e` — full fail-fast verification in one command.

3. **`.agents/skills/test-fix/SKILL.md`**: new skill with a lookup table covering the five most common failure classes observed in F1/F2: `vi.mock` hoisting TDZ, unresolvable module aliases, `expect` shape mismatch, locator timeout (stale data / insufficient scoping), E2E strict mode violation.

4. **`.agents/workflows/verify.md`**: new workflow defining the correct verification sequence for implementation sessions (`pnpm test` → `pnpm test:e2e` → `pnpm check` before commit). Also available as `/verify` Cascade slash command via `.windsurf/workflows/verify.md` stub.

**Justification:**

- Removing the build from the default `test:e2e` path eliminates ~1.5 s per iteration and removes the `dist/` dependency.
- Switching to `list` reporter eliminates the blocking HTTP server that made agent sessions unrecoverable without manual intervention.
- Formalizing failure classes and fixes reduces multi-turn diagnosis loops to a single lookup.

**Consequences:**

- `pnpm test:e2e` is now safe to run as a Blocking command — it always exits cleanly.
- `pnpm check` is the canonical pre-commit verification command.
- Agents must consult `test-fix` skill before retrying a failing test more than once.
- The production build path (`pnpm test:e2e:ci`) is preserved for CI and explicit production validation.

---

## [2026-04-18] Phase Closeout F3 — Encounters and Observation Capture

**Context:** F3 required enabling practitioners to run group sessions, capture observations in real-time against a versioned form snapshot, and attach arbitrary media (images, video, audio via in-app recorder).

**Decision:** Implemented a full F3 baseline with the following scope:

**F3.0 — Groups and Participants:**

- Domain: `Group` and `Participant` in `src/domain/group.ts` / `src/domain/participant.ts` with Zod schemas.
- Persistence: `group-repository` (CRUD, archive/restore, participant count), `participant-repository` (bulk sync by groupId).
- Feature module: `src/features/groups/` with service, hooks, pages, and components.
- UX: inline participant editor inside GroupForm; archive/restore with toast feedback.
- Routing: `/groups` (list), `/groups/:id/edit` + main navigation entry "Grupos".

**F3.1 — Encounters:**

- Domain: `Encounter` expanded with `formVersion` and `fieldIds[]` (form snapshot frozen at creation time).
- Persistence: `encounter-repository`; encounter service freezes the form snapshot on `create` and sets `endedAt` on `finish`.
- `resolveEncounterDependencies`: single call that hydrates fields, participants, form, and observations together for the detail page.
- Feature module: `src/features/encounters/` with service, hooks, pages, and components.
- Deep-link: `/encounters/:id/observations/new` auto-opens the observation dialog.
- Routing: `/encounters` (list, with status filter tabs), `/encounters/new`, `/encounters/:id`.

**F3.2 — Observations:**

- Domain: `Observation` expanded with typed scalar and media value union (`fieldId → scalar | mediaId`).
- Persistence: `observation-repository` with media cleanup on update/delete.
- Observation service: normalizes media, validates per-field dynamic schema, `observation-values-schema.ts` builder.
- Feature module: `src/features/observations/` with service, hook, component.
- `ObservationForm`: dynamic field renderer dispatch table (text/number/boolean/choice/media), file picker for all media types, `useAudioRecorder` hook for in-app audio recording.

**Infrastructure:**

- Dexie schema bumped to v4: `groups` (index `institutionId`), `participants` (index `groupId`), `encounters` (index `groupId,formId`), `media` table. Migration adds default Institution row.
- `infra/media/store.ts`: Blob CRUD with object URL lifecycle management.
- `infra/media/recorder.ts`: `useAudioRecorder` hook wrapping the MediaRecorder API.
- `field-repository`: added `listFieldsByIds`.
- `error.ts`: added `GROUP_*`, `ENCOUNTER_*`, `OBSERVATION_*` error codes.

**Testing:**

- Unit: `tests/unit/group-schema.test.ts`, `tests/unit/participant-schema.test.ts`, `tests/unit/encounter-schema.test.ts`, `tests/unit/observation-schema.test.ts`.
- E2E: `tests/e2e/groups-crud.spec.ts` (create/edit/archive/restore), `tests/e2e/encounter-capture.spec.ts` (full flow + media files).
- All 29 unit tests and 5 E2E tests passing (`pnpm check` green).

**Skill evaluation:** No new skill required. F3 patterns (feature module + repository + dynamic form + media infra) are a direct extension of the established F1/F2 pattern. Existing `test-fix` and `phase-closeout` skills remain current.

**Justification:**

- Form snapshot strategy ensures encounter data is immutable regardless of future form edits.
- Media stored as Blobs in dedicated table keeps main observation records lightweight and indexable.
- Deep-link `/encounters/:id/observations/new` supports mobile capture workflows where users tap a shared link to open directly in capture mode.

**Consequences:**

- F3 completed in functional baseline state; F4 (Export/Import) can now build on the complete domain.
- Dexie persistence contract changed to v4 — documented in `stack-and-architecture.md` sections 5.2 and 5.3.
- `project-context.md` state transitions to "F3 implemented".

---

## [2026-04-18] Creation of phase-planner and phase-implementer skills

**Context:** Implementing F1, F2, and F3 revealed a repeatable lifecycle — from scoping and branch creation through domain modeling, persistence, feature modules, routing, unit/E2E testing, and phase closeout — but no formal skills existed to guide agents through each axis consistently. Planning was ad-hoc (deleted prompt files) and implementation steps were implicit knowledge.

**Decision:** Created two complementary skills that cover the full phase lifecycle:

1. **`phase-planner`**: produces a structured plan for a roadmap phase before any code is written, covering domain changes, persistence schema, feature modules, routing, testing scope, branch name, and commit strategy. Requires user confirmation before handing off.
2. **`phase-implementer`**: executes a confirmed plan end-to-end — branch creation, domain models, Dexie schema migration, repositories, services, hooks, pages/components, routes, navigation, unit tests, E2E tests, full `pnpm check` verification, implementation commit, and `phase-closeout` delegation.

Both skills have Windsurf slash command stubs in `.windsurf/workflows/`.

**Justification:**

- Formalizes every implementation axis observed across F1–F3 into a reusable, auditable protocol.
- Eliminates ad-hoc planning and reduces agent session startup cost for future phases.
- The planner/implementer split enforces a confirmation gate — agents cannot start coding without an approved scope.
- Delegation to `phase-closeout` at the end of `phase-implementer` preserves the documentation invariant without duplicating its logic.

**Consequences:**

- Future phases MUST start with `phase-planner` and proceed through `phase-implementer`.
- Both skills are listed in `.agents/README.md`.
- The Windsurf slash commands `/phase-planner` and `/phase-implementer` are now available.

---

## [2026-04-18] Phase Closeout F4 — Encounter Export/Import

**Context:** F4 required portable encounter data exchange in a fully local-first architecture, including binary media support, explicit user confirmation before import, and deterministic idempotent merge behavior.

**Decision:** Implemented and closed F4 with the following scope:

- **Infrastructure (`src/infra/export/`):**
  - `manifest.ts` defines `chronicle-encounter-v1` manifest contract and schema validation.
  - `encounter-exporter.ts` generates self-contained encounter ZIPs (manifest + entities + media) and triggers browser download.
  - `encounter-importer.ts` parses ZIP payloads and runs transactional upsert-by-ID import across Dexie tables.
- **Feature modules/UI:**
  - Added export action in encounter detail (`/encounters/:id`) via `use-export-encounter` and updated header actions.
  - Added dedicated import route `/import` with file drop/upload, full preview, confirm/cancel, and success redirect flow.
  - Added navigation entry `Importar` in root layout.
- **Error model:** added `EXPORT_*` and `IMPORT_*` `AppError` codes in `src/lib/error.ts`.
- **Testing:**
  - Unit: `zip-manifest`, `encounter-exporter`, `encounter-importer`.
  - E2E: `encounter-export-import.spec.ts` covering full round-trip.

**Key technical decisions:**

- **JSZip** selected for browser compatibility and direct Blob handling in local-first flows.
- **Export granularity:** per-encounter ZIP including referenced form, fields, group, participants, observations, and media assets.
- **Import strategy:** upsert-by-ID in a single Dexie read-write transaction for atomicity and idempotent re-import.
- **Import UX:** mandatory preview-before-confirm pattern to avoid blind data writes.

**Skill evaluation:** No new skill required for F4-specific runtime behavior. Existing `phase-closeout`, `update-project-docs`, `verify`, and `test-fix` skills cover planning, implementation verification, and closeout consistency.

**Consequences:**

- F4 is complete in baseline state; roadmap focus can move to F5 (chronicle generation).
- Export/import becomes an explicit operational capability in the product shell and architecture docs.
- The project now has round-trip data portability without backend dependencies.

---

## [2026-04-18] Phase Closeout F5 — Chronicle Generation (First Prototype)

**Context:** F5 required delivering a first functional chronicle-generation flow using the existing local-first encounter dataset, with deterministic output and no external AI service dependency.

**Decision:** Implemented and closed F5 with the following scope:

- **Domain:** added `Chronicle` entity in `src/domain/chronicle.ts` with Zod schema and input schema (`id`, `encounterId`, `title`, `body`, `generatedAt`, `createdAt`, `updatedAt`).
- **Error model:** added `CHRONICLE_NOT_FOUND`, `CHRONICLE_ENCOUNTER_REQUIRED`, and `CHRONICLE_GENERATION_FAILED` codes in `src/lib/error.ts`.
- **Persistence:** Dexie schema upgraded to v5 with new `chronicles` table (`id, encounterId, generatedAt, createdAt`) and table binding in `src/infra/db/client.ts`.
- **Repository:** new `src/infra/db/repositories/chronicle-repository.ts` with create/update/upsert-by-encounter/get/list/delete operations.
- **Feature module (`src/features/chronicles/`):**
  - Service (`chronicle-service.ts`) with deterministic narrative generation from encounter/group/participant/field/observation data.
  - Hooks (`use-chronicles`, `use-chronicle`, `use-chronicle-actions`) for reactive reads and write actions.
  - UI pages/components for `/chronicles` list and `/chronicles/:id` detail (`ChronicleListPage`, `ChronicleDetailPage`, `ChronicleCard`, `ChronicleViewer`).
  - Spanish user-facing copy centralized in `lib/messages.ts`.
- **Encounter integration:** added "Generar crónica" action in encounter detail header; if a chronicle already exists for the encounter, navigation goes directly to the existing chronicle; otherwise it generates and redirects.
- **Routing/navigation:** registered `/chronicles` and `/chronicles/:id` routes and main navigation entry `Crónicas`.
- **Testing:**
  - Unit: `tests/unit/chronicle-schema.test.ts`, `tests/unit/chronicle-service.test.ts`.
  - E2E: `tests/e2e/chronicle-generation.spec.ts` (happy path + empty-observation critical path).
  - Verification: `pnpm check` green (typecheck, lint, unit, E2E), with one pre-existing lint warning in `FieldForm.tsx` unrelated to F5 scope.

**Key technical decisions:**

- **No external generation dependency:** chronicle generation remains deterministic and local, preserving offline and minimal-dependency principles.
- **One chronicle per encounter:** repository uses upsert-by-`encounterId` to keep a stable artifact per encounter while supporting regeneration.
- **Generation entrypoint from encounter detail:** minimizes user friction by placing chronicle creation in the natural post-observation workflow.

**Skill evaluation:** No new skill required. F5 follows established repository/service/hooks/pages/testing patterns and remains covered by existing `phase-planner`, `phase-implementer`, `phase-closeout`, `update-project-docs`, and `verify` skills.

**Consequences:**

- F5 is complete in baseline state and the roadmap now reaches its first chronicle-generation milestone.
- The application now supports the full core chain from observation capture to consumable narrative output in local storage.

---

## [2026-04-18] Verification hardening — lockfile integrity preflight for CI/deploy parity

**Context:** A deployment attempt in Vercel failed with `ERR_PNPM_OUTDATED_LOCKFILE` because `pnpm-lock.yaml` was out of sync with `package.json`. CI environments run installs with frozen lockfile by default, so dependency metadata drift can pass local checks if not explicitly validated.

**Decision:** Updated existing canonical assets (no new skill/workflow created):

- `.agents/workflows/verify.md` now starts with `pnpm install --frozen-lockfile` as a mandatory preflight before `pnpm check`.
- `.agents/skills/phase-implementer/SKILL.md` now requires the same frozen-lockfile preflight in the full verification step.
- `phase-implementer` explicitly states that `package.json` and `pnpm-lock.yaml` must be committed together when dependencies change and forbids proposing commits with metadata drift.

**Justification:**

- Aligns local verification with CI/deploy behavior (Vercel and similar providers).
- Prevents avoidable deployment failures caused by lockfile drift.
- Reuses and strengthens existing workflows/skills, avoiding process duplication.

**Consequences:**

- `pnpm install --frozen-lockfile` becomes part of the standard pre-commit/pre-deploy guardrail.
- Dependency updates now have an explicit process invariant: metadata files remain synchronized.
- Future phase implementations inherit this protection automatically through the canonical `phase-implementer` skill.

---

## [2026-04-18] CI guardrail for lockfile drift and deployment documentation

**Context:** Even after adding local process guardrails (`verify` workflow and `phase-implementer` skill), deployment failures can still happen if a stale commit is deployed or if contributors skip local preflight checks.

**Decision:** Added repository-level enforcement and explicit deployment docs:

- Created `.github/workflows/lockfile-integrity.yml` to run `pnpm install --frozen-lockfile` on `push` and `pull_request` to `master`.
- Updated `README.md` with a dedicated "Deployment (Vercel)" section including mandatory pre-deploy checklist and commit-hash verification guidance.

**Justification:**

- Adds an automated, centralized protection layer independent of local environment discipline.
- Improves deployment operability by documenting the exact validation path and the stale-commit detection check.

**Consequences:**

- Lockfile drift is now blocked by CI before or at integration time.
- Vercel deploy troubleshooting is now first-class documentation in `README.md`.

---

## [2026-05-01] Encounter archive/restore + Observation title

**Context:** Operational feedback after F5: practitioners want to keep finalized encounters around without cluttering the active list, and need a way to label individual observations beyond the participant name. The encounter and observation cards also mixed information and actions in their header, making them harder to scan on small screens.

**Decision:**

1. **Observation gets an optional `title`** (`string`, trimmed, non-empty). It is rendered as the primary heading of the observation card (with `"Sin título"` as fallback) and the participant name (or `"Sin participante"`) becomes the subtitle. The title is also surfaced in the chronicle body.
2. **Encounter gets an optional `archivedAt`** (`"" | ISO datetime`) on top of the existing `endedAt`. Archive is independent from finalize: an encounter can be in progress, finalized, and/or archived. Archived encounters are excluded from the active/finished tabs and listed in a new **Archivados** tab. Both header and list rows expose **Archivar** / **Restaurar** actions, mirroring the rest of the entities (groups, fields, forms).
3. **Encounter list adds a "Generar crónica" row action** alongside "Abrir", with the same upsert-by-encounterId semantics as the detail page button.
4. **Encounter header and observation card layout reordered**: title → information → actions (always at the bottom of the container), instead of inlining buttons next to the heading.

**Where:**

- Domain: `src/domain/observation.ts`, `src/domain/encounter.ts`.
- Persistence: `src/infra/db/schema.ts` (DB v6 with `archivedAt` index on `encounters`), `src/infra/db/client.ts` (forward migration that backfills `archivedAt: ""`), `src/infra/db/repositories/encounter-repository.ts` (`archiveEncounter`, `restoreEncounter`, `listArchivedEncounters`, status filter excludes archived), `src/infra/db/repositories/observation-repository.ts` (title pass-through).
- Services + hooks: `src/features/encounters/services/encounter-service.ts` (`EncounterListFilter` adds `"archived"`, `archive/restoreEncounterDefinition`), `src/features/encounters/hooks/use-encounter-actions.ts`, `src/features/encounters/hooks/use-encounters.ts`, `src/features/observations/services/observation-service.ts`, `src/features/observations/hooks/use-observation-actions.ts`.
- UI: `EncounterHeader.tsx`, `EncounterTimeline.tsx`, `EncounterListTable.tsx`, `EncounterListPage.tsx`, `EncounterDetailPage.tsx`, `ObservationForm.tsx`. Chronicle body in `chronicle-service.ts` includes the observation title when present.
- Defaults seed (`features/defaults/services/defaults-service.ts`) initializes `archivedAt: ""` on the demo encounter so the schema validation passes after the v6 bump.
- Tests: extended `tests/unit/encounter-schema.test.ts` and `tests/unit/observation-schema.test.ts`.

**Justification:**

- Title-as-primary aligns observations with how a practitioner narrates an event ("La pelea por el lápiz") and degrades gracefully when the field is left empty.
- Archive parity with groups/fields/forms keeps the mental model consistent across the app and avoids deleting historical encounters.
- Buttons-at-the-end is a small UX improvement that makes both desktop and mobile cards easier to scan.
- Generating a chronicle straight from the list cuts an unnecessary navigation step for the most common follow-up action after finishing an encounter.

**Consequences:**

- Existing IndexedDB databases auto-migrate from v5 to v6 (no data loss; `archivedAt` is backfilled to empty string).
- Encounter ZIP export/import still round-trips correctly because the new fields are optional in their Zod schemas; pre-v6 ZIPs import cleanly and re-exports include the new fields.
- E2E tests for encounters/observations remain compatible because button labels and existing flows were preserved (only additions and reordering).

---

## [2026-05-01] F6 Post-F5 UX iteration: onboarding, defaults, app shell, help

**Context:** After F5, the app is functionally complete but unfriendly to first-time users: an empty database with no guidance, no responsive shell, opaque media references, and entity lists with inconsistent layouts. We need to make Chronicle usable on phones and self-explanatory the first time it is opened, without adding any external services.

**Decision:**

1. **First-run experience.** Add a `defaults` feature that seeds the IndexedDB on first open with a default form (8 standard field types) and a fully-populated demo encounter (every field type, with synthetic media generated in-process and a pre-generated chronicle). The seed is idempotent: it only creates entities that are missing, so repeat opens and existing databases are safe. A `DemoEncounterButton` lets users load/restore or remove the demo encounter from the UI.
2. **Onboarding dialog.** Show a minimal welcome modal on first run, gated by a single `chronicle.onboardingCompleted` flag in `localStorage`. Tests pre-mark the flag (Vitest setup + Playwright `storageState`) so unrelated specs are not affected.
3. **App shell redesign.** Replace the inline button row with a three-zone header (brand · current page status pill · navigation trigger) and move the navigation behind a `MobileNavDrawer` (Sheet) usable at every breakpoint. Centralize the navigation list in `app/nav-items.ts`. Extract theme handling into a dedicated `ThemeProvider` (`app/theme.tsx`) that owns the persisted preference and the `documentElement.dark` class.
4. **Inline media previews.** Add `components/media/{MediaItem, MediaPreview}` plus `infra/media/use-media-object-url` to render image/video/audio/file content inline in the observation form, observation list, and chronicle detail (`ChronicleMediaPanel`), instead of opaque media-id strings. Centralize value-to-text rendering in `features/observations/lib/format-observation-value.ts` and media-id collection in `features/observations/lib/collect-media-ids.ts`.
5. **Unified list tables.** Refactor groups/fields/forms list tables and the chronicle list view to share the same visual language as the encounter list (sortable columns, archive/restore/edit/open actions in a consistent action bar at the bottom of each row). The previous `ChronicleCard` is replaced by `ChronicleListTable`.
6. **Data-aware home dashboard.** Rewrite `HomePage` around a new `data-status-service` + `useDataStatus` hook so it reflects the actual state of the local database (counts of groups, fields, forms, encounters, chronicles) and offers contextual next steps.
7. **Help section.** Add `/help` (data storage guide) and `/how-it-works` (end-to-end flow guide) inside the main layout so users can discover where their data lives and how the app is meant to be used, without leaving the app.

**Where:**

- New features: `src/features/onboarding/`, `src/features/defaults/`, `src/features/help/`.
- New shell pieces: `src/app/MobileNavDrawer.tsx`, `src/app/nav-items.ts`, `src/app/theme.tsx`; refreshed `src/app/layout.tsx` and `src/app/providers.tsx` (`seedDefaultsIfMissing` after `db.open()`).
- Media UI: `src/components/media/`, `src/infra/media/use-media-object-url.ts`, `src/features/observations/components/ObservationMediaList.tsx`, `src/features/observations/lib/{collect-media-ids,format-observation-value}.ts`, `src/features/chronicles/components/ChronicleMediaPanel.tsx`.
- List/table refresh: `src/features/{chronicles,groups,field-definitions,forms}/components/*ListTable.tsx` and matching list/edit pages.
- Home: `src/features/home/{HomePage.tsx,messages.ts,hooks/use-data-status.ts,services/data-status-service.ts}`.
- Tests: unit tests for each new service/hook/component plus three new E2E specs (`defaults-restore`, `demo-encounter-media`, `responsive-nav`).
- Tooling: `tests/unit/setup.ts` + `playwright.config.ts` pre-mark onboarding completed.

**Justification:**

- A first-time visitor now lands on an app that already has a usable form, a real demo encounter, and a generated chronicle to explore — no instructions required.
- The mobile drawer and three-zone header make every breakpoint usable without rewriting layouts page by page.
- Inline media previews remove a long-standing rough edge: until now, captured images, audios and files were referenced only by id in the UI.
- Unified list tables make the app feel coherent across entities and reduce cognitive load when moving between sections.
- The help section and data-aware home replace static marketing copy with answers to the two most common first questions ("what now?" and "where are my files?").
- Everything stays local-first; no new external dependencies are introduced.

**Consequences:**

- The `defaults` seed runs on every open after `db.open()` but is idempotent — production databases that already have data are not modified.
- Existing E2E specs continue to work thanks to onboarding pre-marking; any future spec that needs to assert the onboarding dialog must reset the `chronicle.onboardingCompleted` flag explicitly.
- `ChronicleCard` is gone; any external caller importing it must move to `ChronicleListTable`.
- The `chronicle-theme` and `chronicle.onboardingCompleted` `localStorage` keys are now part of the app's public surface; renaming them in the future requires a migration.

---

## [2026-05-01] Phase Closeout F7 — Optional Gemini AI Chronicle Generation (BYOK)

**Context:** After F6 the deterministic chronicle generator worked well but produced formulaic output. Users wanted richer, more readable narratives. Adding an AI service mandatorily would violate the minimal-external-dependency principle, so an opt-in BYOK model was chosen.

**Decision:** Implemented and closed F7 with the following scope:

- **AI provider:** Google Gemini (`gemini-2.0-flash`) via direct `fetch` against `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`. No SDK added.
- **BYOK model:** user stores their own Google Gemini API key in `localStorage` under `chronicle.geminiApiKey`. The key never leaves the browser (there is no server). If unset, the app behaves identically to pre-F7.
- **Fallback strategy:** if the API key is set but the Gemini call fails (network error, invalid key, quota, etc.) → display a toast (`aiFallbackToast`) and silently fall back to the deterministic generator. The chronicle is always generated; the user is never left with an empty result.
- **Domain:** `Chronicle` gains an optional `generatedWith?: "deterministic" | "gemini"` field. No Dexie schema migration needed (field is not indexed and was absent in pre-F7 records — correctly read as `undefined`).
- **Error model:** added `"AI_GENERATION_FAILED"` and `"AI_KEY_INVALID"` codes in `src/lib/error.ts`.
- **Infrastructure (`src/infra/ai/`):**
  - `gemini-client.ts` — raw `fetch` wrapper; throws `AppError` with `AI_KEY_INVALID` on 400/403, `AI_GENERATION_FAILED` on other HTTP errors.
  - `gemini-chronicle-generator.ts` — builds a structured rioplatense-Spanish prompt from encounter/observation data, skips media-type field values (not textually representable), calls the client.
- **Settings feature (`src/features/settings/`):**
  - `settings-service.ts` — `localStorage` CRUD for the API key.
  - `use-settings.ts` — reactive hook over the service.
  - `ApiKeyForm.tsx` — masked `<input type="password">` with show/hide toggle, save, and clear actions.
  - `SettingsPage.tsx` — page at `/settings` composing `AiSetupGuide` + `ApiKeyForm`.
- **Shared component (`src/features/help/components/AiSetupGuide.tsx`):** explains BYOK, links to Google AI Studio, and renders the inline `ApiKeyForm`. Reused in both `SettingsPage` and the onboarding step 3.
- **Onboarding update:** added a 3rd step "Generación con IA (opcional)" rendering `AiSetupGuide`; the dialog now shows "Paso N de 3"; "Empezar a usar Chronicle" button moved to step 3.
- **ChronicleViewer badge:** "Generada con IA" badge shown when `chronicle.generatedWith === "gemini"`.
- **Routing/navigation:** `/settings` route added to router + `nav-items.ts` with label "Configuración".
- **Testing:**
  - Unit: `tests/unit/settings-service.test.ts` (5 tests), `tests/unit/gemini-chronicle-generator.test.ts` (3 tests), updated `tests/unit/chronicle-service.test.ts` (6 tests), updated `tests/unit/onboarding-dialog.test.tsx` (4 tests, reflects 3-step flow).
  - E2E: `tests/e2e/settings-api-key.spec.ts`, `tests/e2e/chronicle-ai-generation.spec.ts` (Playwright `route()` intercept for Gemini API).
  - All 104 unit tests green; typecheck and lint clean.

**Key technical decisions:**

- **No Gemini SDK**: avoided to prevent adding a package dependency for a single HTTP call. The REST endpoint is stable and the raw-fetch approach is simpler to test and audit.
- **`localStorage` for key storage**: consistent with the "no server" principle; the user controls their own credential, with explicit UI for clearing it.
- **Graceful fallback, not hard failure**: ensuring every generation call produces a result (even if deterministic) prevents the AI layer from ever blocking the user's workflow.
- **`AiSetupGuide` as a shared component**: used in both the settings page and onboarding step 3 to avoid duplicating the setup instructions.

**Skill evaluation:** No new project-specific skill required. F7 patterns (BYOK localStorage service + infra client + feature module + shared guide component) are a natural extension of the established conventions already covered by `phase-planner`, `phase-implementer`, `phase-closeout`, and `update-project-docs`.

**Consequences:**

- `chronicle.geminiApiKey` is a new `localStorage` key in the app's public surface; renaming it in the future requires a migration strategy.
- The `chronicle-service.ts` return type changed to include `{ usedAi, aiFailed }` metadata; callers that destructure the return value must be aware of these new fields.
- The onboarding dialog now has 3 steps; any spec that asserts step count or button visibility must match "Paso N de 3".
- Existing pre-F7 chronicles in local databases are unaffected (`generatedWith` will be `undefined`, which the badge handles correctly by not showing).
- No breaking changes to existing persistence schema (Dexie v6 unchanged).

---

## [2026-05-01] F8 — Always-available global export, user identity, and native chronicle share

**Context:** F4–F7 only allowed exporting one encounter at a time, gated behind the encounter detail page. There was no way to back up the database before any encounter existed, and exported files were anonymous (filename was `chronicle-{activity}-{date}.zip` regardless of who or which device produced them). Users also asked for a way to share a generated chronicle with others using the native OS share sheet.

**Decision:**

1. **Global export is now the only export.** Introduced `chronicle-full-v1` manifest schema in `src/infra/export/manifest.ts` and a new `src/infra/export/full-exporter.ts` that dumps every Dexie table (`fields`, `forms`, `groups`, `participants`, `encounters`, `observations`, `chronicles`, `media`) plus the user's brand color and author name into a single ZIP. The `/encounters/:id` "Exportar encuentro" button and `useExportEncounter` hook are gone; `infra/export/encounter-exporter.ts` and its test are deleted. The Gemini API key is intentionally NOT included in the export.
2. **Importer dispatches on schema.** `features/import/services/import-service.ts` reads `manifest.json`, recognises both `chronicle-full-v1` (new) and `chronicle-encounter-v1` (legacy) and routes to the appropriate parser (`parseFullZip` / `parseEncounterZipFromJsZip`). `ImportPreview` renders different summaries for each kind; the success card no longer assumes there is a single encounter to link to.
3. **User identity is now first-class.** New `src/features/settings/services/user-name-service.ts` persists the user name under `chronicle.userName`, with a default detected from `navigator.userAgent` (e.g. `Chrome en Linux`). After the tour finishes, `WelcomeNamePrompt` (mounted in `RootLayout`) auto-opens once and prompts the user; a `chronicle.userNamePromptShown` flag prevents re-asking. The Settings page exposes a `UserNameForm` for later edits. Exported file names follow `chronicle-{slug(name)}-{YYYY-MM-DD}.zip` and the manifest carries `exportedBy` so the import preview can show the author.
4. **Tour rewired around the new model.** The encounter-detail "Exportar el encuentro" stop is gone; the Settings hub-stop now visits two stops: `settings.export` (the new export button) and `import.dropzone`. A new `chronicle.detail.share` stop highlights the share button.
5. **Native share for chronicles.** New `useShareChronicle` hook calls `navigator.share({ title, text })` with a clipboard fallback (`navigator.clipboard.writeText`); a "Compartir" button on `ChronicleDetailPage` is wired to it. AbortError (user cancellation) is silently ignored — no fallback toast.

**Where:**

- New: `src/infra/export/full-exporter.ts`, `src/infra/export/full-importer.ts`, `src/features/settings/components/{ExportSection,UserNameForm}.tsx`, `src/features/settings/hooks/{use-export-all,use-user-name}.ts`, `src/features/settings/services/user-name-service.ts`, `src/features/onboarding/components/WelcomeNamePrompt.tsx`, `src/features/chronicles/hooks/use-share-chronicle.ts`.
- Updated: `src/infra/export/manifest.ts` (adds `FULL_MANIFEST_SCHEMA`, `fullZipManifestSchema`, `anyManifestSchema`), `src/infra/export/encounter-importer.ts` (splits `parseEncounterZip` from `parseEncounterZipFromJsZip`), `src/features/import/services/import-service.ts` (dispatches by schema), `src/features/import/hooks/use-import-encounter.ts`, `src/features/import/components/ImportPreview.tsx`, `src/features/import/components/ImportSection.tsx`, `src/features/import/lib/messages.ts`, `src/features/encounters/components/EncounterHeader.tsx`, `src/features/encounters/pages/EncounterDetailPage.tsx`, `src/features/encounters/lib/messages.ts`, `src/features/onboarding/messages.ts`, `src/features/onboarding/hooks/use-onboarding.ts` (dispatches `chronicle:tour-finished`), `src/features/settings/pages/SettingsPage.tsx`, `src/features/settings/lib/messages.ts`, `src/features/chronicles/pages/ChronicleDetailPage.tsx`, `src/features/chronicles/lib/messages.ts`, `src/app/layout.tsx`, `src/lib/error.ts` (drops `EXPORT_ENCOUNTER_NOT_FOUND`), `playwright.config.ts` and `tests/unit/setup.ts` (pre-mark `chronicle.userNamePromptShown`).
- Deleted: `src/features/encounters/hooks/use-export-encounter.ts`, `src/infra/export/encounter-exporter.ts`, `tests/unit/encounter-exporter.test.ts`.
- Tests added: `tests/unit/full-exporter.test.ts`, `tests/unit/full-importer.test.ts`, `tests/unit/user-name-service.test.ts`, `tests/unit/use-share-chronicle.test.tsx`, `tests/unit/welcome-name-prompt.test.tsx`. `tests/unit/onboarding-dialog.test.tsx` and `tests/e2e/encounter-export-import.spec.ts` updated to match the new tour and Settings layout.

**Justification:**

- Exporting "everything always" matches user expectations for a backup-style action and removes the discoverability problem of a button buried in a per-encounter detail view.
- Reusing the existing `chronicle-encounter-v1` parser keeps backward compatibility — pre-F8 ZIPs in the wild still import cleanly.
- Putting the name prompt at the end of the tour (instead of inside it) avoids fragmenting the guided storytelling and gives the user a chance to opt-out without losing context.
- `localStorage` for the name and prompt-shown flag is consistent with how the rest of the app's preferences are persisted (theme, brand color, Gemini key, onboarding flag); no new persistence layer is needed.
- Native share + clipboard fallback respects the local-first principle and adds zero external dependencies.

**Consequences:**

- New `localStorage` keys form part of the public surface: `chronicle.userName`, `chronicle.userNamePromptShown`. Renaming them in the future requires a migration.
- `Chronicle` and Dexie schema are unchanged; the export is purely an additive "all the existing tables in one ZIP" file format. No DB migration was needed.
- Existing per-encounter ZIPs remain importable indefinitely, but no new per-encounter exports are produced.
- The encounter detail page now has fewer actions in its header (no "Exportar"). E2E specs that depended on `data-tour="encounter.detail.export"` have been removed/updated.
- The full export contains binary media inside `media/<id>` files compressed with DEFLATE level 6. Larger databases produce larger ZIPs — same trade-off as before, just over more entities.
- `WelcomeNamePrompt` requires the `chronicle:tour-finished` custom event (or a `storage` event on the same key) to react inside the same render tree. Tests pre-mark `chronicle.userNamePromptShown` so unrelated specs are not affected.

---

## [2026-05-01] Post-F8 polish — home as nav hub, AI input-hash cache, hard fail on first AI error, AI key status badge

**Context:** After F8 the data-aware home dashboard (counts, helper cards, demo encounter button) duplicated information that already lived in `/settings`, `/support`, and the new home grid. The chronicle generation flow also wasted Gemini API quota on regenerations whose underlying observation set had not changed, and silently fell back to a deterministic chronicle when the API errored — masking misconfigured keys, exhausted quota, and transient outages from the user. Finally, the "Generar crónica" button had no signal that explained why output sometimes used AI and sometimes did not.

**Decision:**

1. **Home is now a pure nav hub.** `HomePage` was rewritten as an icon grid of every top-level section (`Campos`, `Formularios`, `Grupos`, `Encuentros`, `Crónicas`, `Configuración`, `Cómo funciona`, `Ayuda`, `Soporte`). The data-aware welcome card, demo encounter toggle, "quick check" card, and the data-status summary moved to a new `/support` page (`SupportPage`). The `/import` route was removed — importing is part of `/settings` (`ImportSection`) which is the authoritative entry point post-F8.
2. **`Chronicle.generatedWith === "gemini"` records a stable `inputHash`.** The hash is a SHA-256 over a canonical projection of the encounter, group name, participants by id, fields by id, and observations (`infra/ai/chronicle-input-hash.ts`). On subsequent generations or regenerations, the service compares the current hash against the saved one and short-circuits the Gemini call when they match, returning the cached chronicle untouched. Deterministic chronicles never store the hash.
3. **No deterministic fallback after a Gemini error.** When the user has a configured API key, an error from the Gemini API used to silently regenerate a deterministic chronicle. We now keep the last saved chronicle (if any) and surface a category-specific warning toast (`aiFallbackWarning`, `aiRateLimitWarning` for `AI_RATE_LIMITED`, `aiKeyInvalidWarning` for `AI_KEY_INVALID`). If no chronicle exists yet, we throw — the encounter page stays put and shows `chronicleMessages.createError`. This makes upstream problems visible instead of papering over them.
4. **`AiKeyStatusBadge` next to every "Generar crónica" entry point.** The badge reads the live state of the Gemini key from `localStorage` and renders one of three visuals: `Sin clave`, `Clave configurada`, or a "ver configuración" link. It is mounted inside `EncounterHeader` (encounter detail) and reused on encounter list rows so the user always knows which generator will run before clicking.
5. **Encounter detail always asks the service to generate.** `handleGenerateChronicle` no longer special-cases "chronicle already exists, jump to it" — it always calls `chronicleActions.generate`, which internally honours the input-hash cache for AI chronicles and re-runs deterministic generation otherwise. This collapses two code paths into one and gives the cache a single, predictable owner.

**Where:**

- `src/features/home/HomePage.tsx` (rewrite), `src/features/home/SupportPage.tsx` (new), `src/features/home/messages.ts` (`supportMessages` block), `src/app/router.tsx` (`/support` added, `/import` removed), `src/app/nav-items.ts` (`Importar` entry removed), `src/features/import/pages/ImportPage.tsx` (deleted).
- `src/domain/chronicle.ts` (adds `inputHash?: string` on `Chronicle` and `ChronicleInput`), `src/infra/db/repositories/chronicle-repository.ts` (round-trips `inputHash`), `src/infra/ai/chronicle-input-hash.ts` (new SHA-256 helper), `src/features/chronicles/services/chronicle-service.ts` (cache + no-fallback logic), `src/features/chronicles/hooks/use-chronicle-actions.ts` (toast classification by `aiFailCode`), `src/features/chronicles/lib/messages.ts` (`aiRateLimitWarning`, `aiKeyInvalidWarning`, `aiFallbackWarning`).
- `src/lib/error.ts` (adds `AI_RATE_LIMITED`), `src/infra/ai/gemini-client.ts` (maps HTTP 429 → `AI_RATE_LIMITED`).
- `src/features/settings/components/AiKeyStatusBadge.tsx` (new), `src/features/encounters/components/EncounterHeader.tsx` and `src/features/encounters/pages/EncounterDetailPage.tsx` (mount the badge), `src/features/encounters/pages/EncounterListPage.tsx` (mount the badge per row).
- `src/features/encounters/pages/EncounterDetailPage.tsx` simplifies `handleGenerateChronicle` to always call `generate`.
- E2E updates for the new layout: `tests/e2e/demo-encounter-media.spec.ts` drives the demo from `/support`, `tests/e2e/responsive-nav.spec.ts` desktop case asserts the home nav hub + always-visible hamburger, `tests/e2e/chronicle-ai-generation.spec.ts` "no fallback" case asserts the user stays on the encounter page with `createError`.

**Justification:**

- A single information architecture for the home page — nav-only — eliminates the divergence between the welcome dashboard, the support page, and the global navigation drawer. Helper content (demo encounter, status, quick check) is still one click away under `/support` and discoverable via the home grid.
- The input-hash cache is cheap (SHA-256 over a ~few-KB JSON projection) and saves the user's Gemini quota in the most common pattern: opening the encounter, generating a chronicle, then later opening the same encounter and regenerating without changing anything.
- Surfacing AI errors instead of silently swallowing them aligns with the agent role of "make decisions focused on quality and delivery" — false positives (silent deterministic fallback) hide real configuration bugs.
- The status badge addresses the ambiguity that "Generar crónica" gave no hint about whether AI would run.
- Always asking the service to generate keeps the cache as the single source of truth instead of duplicating the "is there one already?" check at every call site.

**Consequences:**

- The `Chronicle.inputHash` field is additive: existing pre-cache chronicles still work and will get a hash filled in on the next AI generation. No Dexie schema migration was required (the field is not indexed).
- The `/import` route is gone. Anyone landing on `/import` from a stale link gets the 404 page; importing happens at `/settings`. The nav drawer no longer lists `Importar`.
- The AI generation flow is now error-visible: misconfigured keys, exhausted quotas, and transient API errors surface to the user instead of being masked.
- The `Cargar encuentro de prueba` button has moved from the home dashboard to `/support`. The `removeOnly` twin in list pages is unchanged.
- `AiKeyStatusBadge` reads `localStorage` directly and re-evaluates on `storage` events; tests that toggle the key inside the same window must dispatch a `storage` event or remount the component.

---

## [2026-05-02] F9 — Projects refactor + post-event chronicles + per-observation form snapshot + Dexie v7 hard reset

**Context:** The product moved from "real-time observation capture during a session" to "post-event documentation of encounters that already happened". Practitioners need to register what already occurred, choose who attended out of the project's participants, and load observations afterwards — not while the session is happening. The flat `Group` concept conflated two responsibilities (people vs. timeline) and forced a rigid one-form-per-encounter model that did not match real institutional workflows where the same encounter sometimes captures different kinds of evidence.

**Decision:**

1. **Project replaces Group.** New `domain/project.ts` with `Project { id, institutionId, name, archivedAt?, createdAt, updatedAt }` and the same `participantNames[]` input shape that groups had. The `Group` entity is deleted entirely (no read-only legacy view).
2. **Encounter becomes post-event and lives inside a project.** `Encounter` shape is now `{ id, projectId, name, startsAt, endsAt, participantIds: string[], archivedAt?, createdAt, updatedAt }`. Removed: `groupId`, `formId`, `formVersion`, `fieldIds`, `activity`, `endedAt`. There is no "in progress / finished" lifecycle anymore; the only mutable status is archive/restore.
3. **Observations carry their own form snapshot.** `Observation` adds `formId`, `formVersion`, `fieldIds: string[]`. The form is selected at observation creation time, the snapshot is frozen, and a single encounter can mix observations from different forms — including different versions of the same form. `ObservationForm` builder shows a `<select>` listing all active forms; in edit mode the form selector is disabled (the original snapshot is preserved).
4. **Chronicle generation gates to `/encounters/:id/chronicle`.** New stable URL renders the chronicle if it exists, otherwise an empty state with a "Generar crónica" button. The `EncounterDetailPage` "Generar crónica" + "Finalizar encuentro" buttons are gone; in their place a "Ver crónica" link goes to the new page. The `ChronicleDetailPage` (global `/chronicles/:id`) keeps share/delete and links back to the encounter chronicle page for regeneration. `AiKeyStatusBadge` lives only on the encounter chronicle page now.
5. **Hub swap.** Home grid and `nav-items` lose `Grupos` and `Encuentros`, gain `Proyectos`. The previous `/groups`, `/groups/new`, `/groups/:id/edit`, `/encounters`, `/encounters/new` routes are removed. New routes: `/projects`, `/projects/new`, `/projects/:id`, `/projects/:id/edit`, `/projects/:projectId/encounters/new`, `/encounters/:id/chronicle`.
6. **Dexie v7 hard reset.** Schema bumped to v7. The migration drops the legacy `groups` store (`groups: null`) and clears `participants`, `encounters`, `observations` and `chronicles`, since their record shapes changed and the Zod schemas now require fields the old rows do not have. Anyone who was using Chronicle pre-F9 loses their previous data on first open after the upgrade — coherent with the user-confirmed "reset duro" decision.
7. **Export schema bumped to `chronicle-full-v2`.** New manifest carries `projects` instead of `groups` in counts/files. The legacy `chronicle-full-v1` and `chronicle-encounter-v1` schemas are no longer importable; the importer rejects them with `IMPORT_SCHEMA_MISMATCH`. Backward-compat is intentionally dropped because the underlying data shapes are incompatible.
8. **Demo data refresh.** `seedDemoEncounter` now seeds a demo project with two participants, an encounter (one hour long, both participants attending) and **two** pre-populated observations: one with the demo form (every field type, with synthetic media) and one with the default form (longText + audio left empty), to showcase the multi-form-per-encounter capability. `removeDemoEncounter` cleans up `projects` instead of `groups`.
9. **Onboarding tour rewritten.** New tour stops cover the projects flow end-to-end: hub → Campos → Formularios → Proyectos → ProjectDetail → Encounter (post-event) → Observation (with form selector) → Encounter Chronicle → Settings → Chronicles globales → Compartir. Tour route templates support a new `:demoProjectId` placeholder alongside `:demoEncounterId` and `:demoChronicleId`.
10. **Help / How-it-works / messages refresh.** Spanish copy across home, help guides, settings, import, and onboarding moves from "real-time" / "grupo" / "actividad" / "finalizar" to "post-evento" / "proyecto" / "encuentro" / "archivar". The `chronicleMessages` add `emptyEncounterChronicleTitle/Description`, `generateButton`, `generatingButton`, `goToProjects`, `backToEncounter`. The `homeMessages.dataStatus.summary` swaps `groups` for `projects`.

**Where:**

- New: `src/domain/project.ts`; `src/infra/db/repositories/project-repository.ts`; `src/features/projects/` (services, hooks, lib, components, pages); `src/features/chronicles/pages/EncounterChroniclePage.tsx`; `src/features/chronicles/hooks/use-chronicle-by-encounter.ts`; `tests/unit/project-schema.test.ts`; `tests/e2e/projects-crud.spec.ts`.
- Updated: `src/domain/{participant,encounter,observation}.ts`; `src/lib/error.ts`; `src/infra/db/{client,schema}.ts`; `src/infra/db/repositories/{encounter,observation}-repository.ts`; `src/infra/ai/{chronicle-input-hash,gemini-chronicle-generator}.ts`; `src/infra/export/{full-exporter,full-importer,manifest}.ts`; `src/features/chronicles/{services/chronicle-service,components/ChronicleListTable,pages/{ChronicleListPage,ChronicleDetailPage},lib/messages}.ts(x)`; `src/features/encounters/{components,hooks,pages,lib,services}/*`; `src/features/observations/{services/observation-service,hooks/use-observation-actions,components/ObservationForm,lib/messages}.ts(x)`; `src/features/import/{components/{ImportPreview,ImportSection},hooks/use-import-encounter,lib/messages,services/import-service}.ts(x)`; `src/features/defaults/{lib/seed-data,services/defaults-service}.ts`; `src/features/onboarding/{messages,components/OnboardingDialog}.tsx`; `src/features/help/messages.ts`; `src/features/home/{HomePage,messages,services/data-status-service}.ts(x)`; `src/app/{router,nav-items}.ts(x)`; tests across `tests/unit/*` and `tests/e2e/*`.
- Deleted: `src/domain/group.ts`; `src/infra/db/repositories/group-repository.ts`; `src/features/groups/` (entire feature module); `src/features/encounters/{pages/EncounterListPage,components/EncounterListTable,hooks/use-encounters}.ts(x)`; `src/infra/export/encounter-importer.ts`; `tests/unit/{group-schema,encounter-importer,zip-manifest}.test.ts`; `tests/e2e/groups-crud.spec.ts`.

**Justification:**

- The post-event flow matches the actual institutional workflow: practitioners rarely have time to capture observations during a session, but they almost always need to document what happened afterwards.
- Allowing multiple forms per encounter (via the per-observation snapshot) gives practitioners flexibility — a single encounter can capture an attendance check with one form and a free narrative with another, without forcing them into a single template.
- Reset duro is the simpler, honest path: the data shapes changed enough that translating legacy `Group → Project` plus inferring `participantIds` from `Encounter.groupId` would have required heuristics that are easy to get wrong. Users were warned via the F8 export ("Exportar todo" was always one click away) and the migration is one-time.
- Locating chronicle generation only at `/encounters/:id/chronicle` collapses two flows (generate from encounter / regenerate from chronicle detail) into one stable URL that's safe to share, predictable, and discoverable from any encounter.

**Consequences:**

- Any database opened with a pre-F9 build will lose its `participants`, `encounters`, `observations` and `chronicles` content the next time the app loads. Documentation in `docs/stack-and-architecture.md` and the `/help` page were updated accordingly.
- Pre-F9 ZIPs (`chronicle-full-v1`, `chronicle-encounter-v1`) are rejected. Anyone holding a backup must keep the old build to re-export it under v2 — this is documented in the README.
- The encounter detail page is leaner now: no "Finalizar", no "Generar crónica", no AI key badge.
- The Dexie schema for `groups` is dropped via Dexie's `null` syntax. Future versions must keep this drop in their version chain to avoid resurrecting the legacy table on partial upgrades.
- The AI input hash now keys off the post-event encounter shape (`name`, `startsAt`, `endsAt`, `participantIds`, `projectName`, observation form snapshots). Pre-F9 cached hashes naturally invalidate on first regeneration, which is fine because the underlying data was wiped anyway.

---

## [2026-05-03] F11 — Help page consolidation: 3 tabs (Funcionamientos / Datos / IA) + Settings AI cleanup

**Context:** After F6 the help feature shipped two separate routes — `/help` (data storage guide) and `/how-it-works` (post-event flow guide) — and the `/settings` page duplicated the AI explainer card right above the API key form (`AiSetupGuide showCta={false}`). That meant the same content lived in two places, the home hub had two distinct tiles for help-like content (`Cómo funciona` and `Ayuda`), and Settings mixed long-form documentation with a small configuration form. The user asked to consolidate everything inside a single tabbed `/help` route, mirroring the same `?tab=` filter-tab pattern already used on `/projects`.

**Decision:**

1. **`/help` becomes a single tabbed page with three tabs.** Tabs are `Funcionamientos` (default), `Datos` and `IA`, selected via a `?tab=` URL search param. Tab triggers are rendered with `Button variant="tab-active" | "outline"` inside a `role="tablist"` — exactly the same pattern as the active/archived filter on `/projects` so the visual language stays consistent.
2. **Each tab reuses the existing guide components.** `Funcionamientos` renders `HowItWorksGuide` (with `showNextStep={false}`, since the "Antes de arrancar" card pointed to `/help` and is now redundant), `Datos` renders `DataStorageGuide`, and `IA` renders `AiSetupGuide` with its CTA pointing to `/settings` (where the API key form lives).
3. **`/how-it-works` and `HowItWorksPage` are deleted.** The route is gone from `src/app/router.tsx`, the `Cómo funciona` entry is gone from `src/app/nav-items.ts`, and the `Cómo funciona` tile is gone from `HomePage`. Anyone landing on `/how-it-works` from a stale link gets the 404 page; the same content now lives at `/help` (Funcionamientos tab).
4. **Settings AI section is now a thin wrapper around the API key form.** `AiSetupGuide` was removed from `SettingsPage`. The section keeps its `Generación de crónicas con IA` heading, gains a one-line description that links to `/help?tab=ia`, and renders only the `ApiKeyForm`. The full explainer (what AI does, what is sent to Google, how to obtain a free key) lives only at `/help` (IA tab) and inside the onboarding intro step 3.
5. **Messages housekeeping.** The `dataStoragePage` and `howItWorksPage` blocks in `src/features/help/messages.ts` were replaced by a single `helpPage` block (page title, description, tab labels, tablist aria-label). The `howItWorksGuide.nextStep.cta.to` link was retargeted from `/help` to `/help?tab=datos` for completeness even though `showNextStep={false}` hides it on the new layout (it is still consumed by the onboarding dialog through `HowItWorksGuide showQuickLinks={false} showNextStep={false}`, which means the change is benign there). New `settingsMessages.aiSectionDescription` and `settingsMessages.aiSectionGuideLink` strings drive the in-page link to the IA tab.

**Where:**

- New: `src/features/help/HelpPage.tsx` (rewritten as a tabbed page).
- Deleted: `src/features/help/HowItWorksPage.tsx`; `tests/unit/how-it-works.test.tsx`.
- Updated: `src/features/help/messages.ts` (drops `dataStoragePage` and `howItWorksPage`, adds `helpPage`), `src/app/router.tsx` (drops `/how-it-works` and the `HowItWorksPage` import), `src/app/nav-items.ts` (drops the `Cómo funciona` entry), `src/features/home/HomePage.tsx` (drops the `Lightbulb`/`Cómo funciona` tile and import), `src/features/settings/pages/SettingsPage.tsx` (drops `AiSetupGuide`, adds the link to `/help?tab=ia`), `src/features/settings/lib/messages.ts` (adds `aiSectionDescription` and `aiSectionGuideLink`).
- Tests updated: `tests/unit/help.test.tsx` (rewritten to cover the three tabs, default tab, tab switching, and link targets), `tests/e2e/settings-api-key.spec.ts` (drops AI guide assertions; asserts the new help link target instead).
- Docs/memory: `docs/stack-and-architecture.md` (F11 row added; folder map updated; Post-F8 Polish bullet annotated for the F11 change), `.agents/memory/project-context.md` (Help bullet rewritten), `README.md` (test list updated).

**Justification:**

- A single tabbed page is a stronger information architecture than two separate routes that share a footer link to each other. The user always lands on `/help` and discovers all three sections from the same tablist.
- Reusing the project-list filter-tab pattern (`Button variant="tab-active" | "outline"` + `role="tablist"` + `?tab=` query param) means the help page feels consistent with the rest of the app and adds zero new UI primitives.
- Splitting documentation (in `/help`) from configuration (in `/settings`) keeps each surface focused on a single job. Settings becomes a fast control panel; `/help` becomes the place to learn.
- Deep-linking via `?tab=ia`, `?tab=datos`, etc., keeps URLs shareable and lets the Settings AI section, the onboarding dialog, and any future toast or empty state point to the exact tab they need.

**Consequences:**

- Anyone bookmarking `/how-it-works` will hit the 404 page. The content lives at `/help?tab=funcionamientos` (or just `/help`).
- The Settings page no longer educates users about how AI works; users who want context must follow the in-page link to `/help?tab=ia`. The onboarding intro step 3 still shows `AiSetupGuide` so first-time users still get the full explainer in-flow.
- The `dataStoragePage` and `howItWorksPage` exports from `src/features/help/messages.ts` are gone. Anyone importing them must move to the new `helpPage` block.
- `HelpPage` now depends on `useSearchParams`. Tests rendering it must use a router (the existing tests already do; the rewritten `help.test.tsx` follows the same pattern).
- The `Cómo funciona` entry no longer appears in the home hub or in the mobile nav drawer. The total number of nav entries goes from 9 to 8.

---

## [2026-05-03] F11 — Forms + Fields merge: instances with label overrides, Dexie v8, manifest v3

**Context:** F1 introduced a dedicated `Campos` route to manage Field definitions (`/fields`, `/fields/new`, `/fields/:id/edit`), and F2 wired Forms as ordered lists of `fieldIds` referencing those Fields. After F9 and F10, two recurring pain points became clear:

1. The Practitioner had to context-switch between `/fields` and `/forms` to compose a form. Discovery of where to define a new field — and how to come back — was unintuitive, especially during onboarding.
2. A field could only appear once per form. Real workflows often need the same field multiple times in a single observation (e.g. "Foto antes" / "Foto después", or two free-text observations with different prompts).

**Decision:** Merge Field management into the form-builder and replace the per-form `fieldIds: string[]` with `fields: FormFieldInstance[]`, where each instance carries a stable `instanceId`, a referenced `fieldId`, and an optional `labelOverride`. Hard-reset Dexie to v8 and bump the export manifest to `chronicle-full-v3`.

Specifically:

1. **Domain.** `src/domain/form.ts` introduces `FormFieldInstance = { instanceId, fieldId, labelOverride? }` (plus a parallel `FormFieldInstanceInput` for form input). `ObservationFormSchema` now has `fields: FormFieldInstance[]`. `src/domain/observation.ts` mirrors the change: `Observation.fields: FormFieldInstance[]`, and `Observation.values: Record<instanceId, ObservationValue>` (was keyed by `fieldId`).
2. **Persistence.** `src/infra/db/schema.ts` bumped to `DB_VERSION = 8`. The v8 upgrade in `src/infra/db/client.ts` is a hard reset — it clears `forms`, `observations`, `chronicles` and `media` because their stored shapes can no longer be migrated forward. `field-repository.ts` gains a `deleteForm()` helper used during the cleanup paths.
3. **Form-builder.** `src/features/forms/components/FormBuilder.tsx` was rewritten around an `instances` list. New affordances: a **Duplicar** button per instance (creates a new instance pointing to the same `fieldId` with the same `labelOverride`), a per-instance `labelOverride` text input rendered as a small inline field, and the existing accessible reorder (↑/↓) and remove buttons. The `data-tour` attributes `forms.builder.manage-fields` (on the dialog trigger) and `forms.builder.duplicate-instance` (on the first row's Duplicar button) drive the new tour stops.
4. **Field management embedded.** New `src/features/forms/components/ManageFieldsDialog.tsx` opens from a `Editar campos` button inside the form-builder. It hosts tabs `Activos` / `Archivados`, a `+ Nuevo campo` button, and a list backed by `useFields("active")` / `useFields("archived")` live queries. Selecting a field switches the dialog into an inline `FieldForm` (same component used by the legacy `/fields/new` page) for create/edit. `FieldListTable` was generalised so callers can pass an optional `onEdit` (renders a button instead of a link to `/fields/:id/edit`) and an optional `onDelete`. The `useFields` hook + `FieldListTable` + `FieldForm` are now reused inside the dialog rather than rendered on a dedicated route.
5. **Routing & navigation.** `src/app/router.tsx` no longer registers `/fields`, `/fields/new` or `/fields/:id/edit`. The `Campos` entry was removed from `src/app/nav-items.ts` and the `Campos` tile (with its `Tag` icon and `hub.fields` `data-tour`) was removed from `src/features/home/HomePage.tsx`. The unused `FieldListPage.tsx` and `FieldFormPage.tsx` files were deleted.
6. **Render path.** `ObservationForm.tsx` was rewritten to iterate `instances` and key by `instance.instanceId` (resolving the underlying `Field` via a `Map<fieldId, Field>` once); `EncounterTimeline`, `chronicle-service` and `gemini-chronicle-generator` iterate `observation.fields` and read `values[instance.instanceId]`, falling back through `instance.labelOverride ?? field.label`. `chronicle-input-hash.ts` was updated so the SHA-256 fingerprint is stable across the new shape (and incompatible with v2 hashes — but observations were wiped by the v8 reset anyway).
7. **Export / Import.** `src/infra/export/manifest.ts` bumps `FULL_MANIFEST_SCHEMA` to `"chronicle-full-v3"` and exports a new `assertSupportedManifestSchema(schema)` helper that throws `AppError("IMPORT_SCHEMA_MISMATCH", …)` for any v1 / v2 / encounter-v1 / unknown manifest. Both `full-importer.ts` and `import-service.ts` call it before parsing. v2 → v3 migration was explicitly **rejected**: v2 stored values keyed by `fieldId`, and reconstructing `instanceId`s would require fabricating UUIDs without preserving any stable reference, which would silently misalign data.
8. **Demo & defaults.** `src/features/defaults/lib/seed-data.ts` introduces `DEFAULT_FORM_INSTANCE_AUDIO_ID`, `DEFAULT_FORM_INSTANCE_LONGTEXT_ID` and `DEMO_FORM_INSTANCE_IDS`, and `DEFAULT_FORM_SEED` / `DEMO_FORM_SEED` use `fields: FormFieldInstance[]`. `defaults-service.ts` produces demo observation values keyed by instance id.
9. **Onboarding tour.** `src/features/onboarding/messages.ts` drops the entire Campos block (hub-stop + 5 tour steps walking the practitioner through `/fields/new`) and adds two new steps inside the Formularios block: `forms.builder.manage-fields` (introduces the embedded `Editar campos` dialog) and `forms.builder.duplicate-instance` (showcases the new "use the same field twice" feature). The outro copy was updated to reflect the new flow ("formularios → proyectos → encuentros → observaciones → crónica"). The corresponding unit test (`tests/unit/onboarding-dialog.test.tsx`) was rewritten to remove the obsolete Campos route stubs and to assert the new "Arrancamos por Formularios" hub-stop.
10. **Tests.** `tests/unit/home.test.tsx` no longer expects the `Campos` link in the hub and explicitly asserts its absence. `tests/unit/observation-media-list.test.tsx` was rewritten to use `instances` + `fieldsById`. The full E2E suite was retargeted off `/fields*`: `forms-compose.spec.ts` exercises the embedded `Editar campos` dialog, `field-crud.spec.ts` was rewritten to drive that dialog, and the chronicle / encounter / responsive-nav specs use the seeded default fields and form rather than creating fresh ones.

**Justification:**

- **Single workspace for form composition.** The Practitioner now creates, picks, reorders, duplicates and labels fields without leaving the form-builder. Onboarding is shorter (two fewer hub-stops) and discovery friction drops.
- **Multiple instances of a field per form** is the simplest possible domain change that unlocks the "before/after" / "first/second observation" patterns observed in real workflows. Each instance is independently versioned with the form, has its own value bucket on every observation, and its own label override — so the chronicle prose can read "Foto antes: …" and "Foto después: …" instead of two ambiguous "Foto" headings.
- **Hard reset over migration.** v2 stored `Observation.values` keyed by `fieldId`. The v3 model keys them by `instanceId`. Any deterministic migration would need to invent `instanceId`s, which would silently break the `Chronicle.inputHash` cache and the chronicle prose. The v8 reset is the same kind of trade-off F9 took for `groups`: documented up-front, surfaced via the `/support` "Importar" path before users on older builds upgrade.
- **No third-party dependencies added.** `crypto.randomUUID()` (already a project convention) generates `instanceId`s on the fly. Zod, Dexie, and React Hook Form continue as before.

**Consequences:**

- Anyone bookmarking `/fields`, `/fields/new` or `/fields/:id/edit` will hit the 404 page. Field management is reachable only from inside `/forms/new` or `/forms/:id/edit` via the `Editar campos` dialog.
- Pre-F11 IndexedDB databases will be reset on first open: forms, observations, chronicles and media are wiped (v8 hard reset). Field, project, participant, encounter and Settings preferences (theme, brand color, user name, Gemini key) are preserved.
- Pre-F11 `chronicle-full-v2` exports cannot be imported on F11. The importer now rejects v1, v2 and encounter-v1 with `IMPORT_SCHEMA_MISMATCH`. Users who need to keep pre-F11 data should keep the v2 ZIPs as historical artefacts; they will not round-trip on F11.
- The total number of nav entries drops from 8 to 7 (F11 removes `Campos`).
- Future field-related UX (search, drag-and-drop reorder of instances, bulk duplicate) can extend the `FormBuilder` and `ManageFieldsDialog` without touching the router.
- Any future feature that needs to refer to a specific field within a specific form must use `instanceId` (not `fieldId`) as the stable key — including chronicle prose, AI prompts, and any custom analytics.

---

## [2026-05-03] Post-F11 audit fixes — close stale `/fields` links and align language policy

**Context:** F11 was implemented across two commits (the in-tree mega-commit `e611e96` and the uncommitted continuation that removes the `/fields*` routes, ships the 13/8 demo seed and bumps the manifest to `chronicle-full-v3`). An end-to-end audit surfaced several inconsistencies that survived the merge: dead `/fields` links in the help guide and the field empty-state, a tour spotlight pointing to a button that did not exist on a brand-new form, a `throw new Error` in `field-repository`, and Spanish copy thrown from `assertSupportedManifestSchema` (which violated the language policy).

**Decision:**

1. **Help guide.** `workflowSteps[0]` no longer links to `/fields`. The first step now describes how to start a form (with the embedded `Editar campos` dialog) and the second step covers form versioning. The `/help` route is the only remaining surface that referenced `/fields`, so this closes the last 404.
2. **`FieldListTable.onCreate`.** The empty-state CTA (`Crear primer campo`) now accepts an `onCreate?` callback. `ManageFieldsDialog` passes one that switches the dialog to its inline `mode: "create"` view; the legacy `Link to="/fields/new"` is kept only as a no-op fallback that no live consumer hits anymore.
3. **`forms.builder.duplicate-instance` tour stop.** The step is rerouted to `/forms/:demoFormId/edit` (the seeded demo form, which has fifteen instances) so the spotlight always finds its target. `OnboardingDialog` gains a `:demoFormId` placeholder resolver and the tutorial seed now exposes `demoFormId` as part of the `TutorialContext`.
4. **`deleteFormCascade`.** Replaces the previous `deleteForm` call from `form-service`. It deletes every observation that snapshots the form and the media blobs they reference, in a single transaction; chronicles are intentionally preserved because they may describe other forms in the same encounter and regenerate via the input-hash mechanism. The `Form` confirm-dialog copy now mirrors `Project` / `Encounter` and explains the cascade.
5. **`field-repository.deleteField`.** Throws `AppError("FIELD_DELETE_NOT_ARCHIVED", "...")` instead of a native `Error`, so the UI can map the code to the existing `fieldMessages.deleteNotArchived` toast.
6. **`assertSupportedManifestSchema`.** Its messages return to English, per `.agents/rules/language-policy.md`. The UI keeps using `IMPORT_SCHEMA_MISMATCH` to map to `importMessages.schemaError`. `LEGACY_SCHEMAS` now includes `chronicle-encounter-v1` so that legacy schema gets the same descriptive branch instead of the generic "unknown manifest" one.

**Where:**

- `src/features/help/messages.ts` and `tests/unit/help.test.tsx`
- `src/features/field-definitions/components/FieldListTable.tsx` and `src/features/forms/components/ManageFieldsDialog.tsx`
- `src/features/onboarding/messages.ts`, `src/features/onboarding/components/OnboardingDialog.tsx` and `tests/unit/onboarding-dialog.test.tsx`
- `src/infra/db/repositories/form-repository.ts` and `src/features/forms/services/form-service.ts`
- `src/features/forms/lib/messages.ts` and `src/features/field-definitions/lib/messages.ts`
- `src/infra/db/repositories/field-repository.ts`
- `src/infra/export/manifest.ts`
- `docs/stack-and-architecture.md` (stale `fieldIds[] snapshot` comment) and `src/features/defaults/lib/seed-data.ts` (stale `d2xx groups` namespace comment)

**Justification:**

- Every `404` reachable from in-product navigation is a regression in user trust; the audit found three of them surviving F11 and the fix-up closes them all.
- Honouring the language policy at the service boundary keeps `messages.ts` as the single source of user-facing copy and lets future UIs (or a re-import preview) reuse the same code without inheriting a hardcoded Spanish string.
- A cascading `deleteFormCascade` brings forms in line with the cascading semantics already in place for projects and encounters; without it, a destructive action on a form left observations dangling against a missing form id.

**Consequences:**

- The demo seed must always succeed before the tour reaches the duplicate-instance stop. If the seed fails (typically only in tests with a stubbed db), the placeholder route still resolves to `/` and the spotlight gracefully gives up — same fallback as the other `:demo*` placeholders.
- Users who previously bookmarked `/help?tab=funcionamientos` and clicked through the legacy "Ir a campos" CTA will land on `/forms` instead of a 404. Anyone bookmarking `/fields*` directly still hits the 404 page; that is the intentional F11 outcome and is not changed by this fix-up.
- `deleteFormCascade` is irreversible. The confirmation dialog now describes the cascade, so the destructive action remains explicit.

---

## [2026-05-03] Drop the Cursor IDE bridge

**Context:** The repository historically shipped two compatibility layers — `.windsurf/rules/` for Windsurf and `.cursor/rules/` for Cursor — both pointing at the canonical `.agents/rules/`. The author of this project does not use Cursor, so the second bridge added maintenance cost (every new rule had to be copied into `.cursor/rules/<name>.mdc`) without any concrete benefit.

**Decision:** Remove the Cursor bridge entirely. Concretely:

- Delete `.cursor/rules/agents.mdc` and `.cursor/rules/language-policy.mdc` (and the `.cursor/rules/` directory itself).
- Drop the `.cursor/**` entry from the ESLint ignore list in `eslint.config.js`.
- Remove the Cursor mentions from `AGENTS.md` (Tool Interoperability), `.agents/README.md` (Tool Bridges), `.agents/rules/agents.md` (Architecture), `.agents/workflows/create-rule.md` (step 6) and `docs/stack-and-architecture.md` (Language Policy section).
- Earlier append-only entries that historically mentioned `.cursor/rules/` are kept untouched: rewriting them would violate the append-only invariant and tell a misleading story about what the project did at the time.

**Justification:**

- The append-only `decisions.md` reflects history, not current state — newer agents must read the current entry plus `project-context.md` / `AGENTS.md` to know what is actually wired today.
- One bridge is enough for portability: `AGENTS.md` already covers Claude Code, Codex CLI, Aider and any future tool that loads root-level conventions; Windsurf provides the only IDE-specific surface still in use.

**Consequences:**

- Cursor users who clone the repo will no longer get an automatic bridge. They can either rely on `AGENTS.md` directly or recreate `.cursor/rules/agents.mdc` locally without committing it.
- Future rule creation runs through the slimmer `.agents/workflows/create-rule.md` (Windsurf bridge only).

---

## [2026-05-03] F12 — Encounter editing + stable participant identity

**Context:** Two related issues surfaced together. (1) Encounters had no edit affordance — once created, the only way to fix a typo in the name, adjust the start/end, or correct the attendee list was to delete the encounter (losing observations and the chronicle). (2) The encounter detail header showed only a count of attendees, and that count was almost always wrong: editing the project regenerated every participant uuid, leaving every encounter's `participantIds` pointing to deleted records — `resolveEncounterDependencies` then filtered all of them out, so the header read "0 de los del proyecto" and the timeline labelled every observation as "Participante desconocido". The same fragility silently truncated the participants block in deterministic chronicles and the AI prompt input.

**Decision:**

1. **Stable participant identity across project edits.** `projectInputSchema` was switched from `participantNames: string[]` to `participants: { id?, displayName }[]` (with a dedicated `projectInputParticipantSchema`). `ProjectForm` now keeps the row id around per row, `ProjectFormPage.toFormInput` propagates ids when loading an existing project, and `getDefaultProjectInput` returns `[{ displayName: "" }]`. The repository's `updateProjectWithParticipants` was rewritten as a diff: rows that match by id get an in-place `displayName` update (no-op when unchanged), rows without an id get a fresh uuid via `crypto.randomUUID()`, and rows whose previous id is missing from the input are hard-deleted. `createProjectWithParticipants` ignores any incoming id (every row is brand new on create). The result is the same UX (`Quitar` removes a participant, the input editor keeps working) but `encounter.participantIds` survives every project edit.
2. **Encounter editing as a dedicated route.** New `EncounterEditPage` at `/encounters/:id/edit` mirrors `EncounterNewPage`: it loads the encounter + project in parallel, drops `participantIds` whose participant no longer exists (defensive cleanup for legacy data), and reuses `EncounterForm` with `submitLabel="Guardar cambios"`. Wired through `useEncounterActions().update` (already present, previously unused). `EncounterHeader` exposes "Editar encuentro" (hidden when the encounter is archived) right before "Archivar"; `ProjectEncounterListTable` shows "Editar" in every active row between "Abrir" and "Archivar".
3. **Encounter header lists the actual attendees.** The "X de los del proyecto · Y observaciones" copy was replaced by an explicit attendees section (chip list, mirrors the chip list on `ProjectDetailPage`) under the start/end metadata. The observation count moved into its own definition list cell.
4. **Tests.** Added `tests/e2e/encounter-edit.spec.ts` with two scenarios — full edit flow (rename + retime + add an attendee) and project-edit identity preservation (rename project, encounter still shows the same attendee chip). Extended `tests/e2e/encounter-capture.spec.ts` with an attendee-chip assertion. Updated `tests/unit/project-schema.test.ts` for the new shape (id is optional UUID, empty displayName rejected, non-uuid id rejected).
5. **Removed participants are intentionally hard-deleted.** When a user removes a participant row from the project edit form we delete the participant record. Their id may still appear in `encounter.participantIds` for older encounters; both `resolveEncounterDependencies` and `chronicle-service.ts` already filter unknown ids out, so this only manifests as the participant disappearing from the attendee chip list — same outcome as before this change but now bounded to "the user actually removed that person from the project". Soft-archiving removed participants to preserve historical attribution is a possible future iteration.

**Justification:**

- The visible bug (empty/incorrect attendee list and "Participante desconocido" everywhere) was a downstream symptom of the participant uuid churn. Fixing the root cause was strictly cheaper than papering over each consumer (`resolveEncounterDependencies`, `chronicle-service`, AI prompt builder), and it removes a class of silent data-integrity drift.
- Adding edit as a dedicated page is the consistent choice — projects and forms already edit on a dedicated route, so users have a predictable pattern. Reusing `EncounterForm` keeps the UX identical to creation.
- Showing the attendees as chips matches the equivalent block on `ProjectDetailPage`, removes the awkward "X de los del proyecto" copy, and lets the user verify attendance at a glance without opening the edit page.

**Consequences:**

- `ProjectInput` consumers must use `participants: { id?, displayName }[]` instead of `participantNames: string[]`. The defaults service was unaffected (it seeds `participants` directly with their own uuids, never goes through the input shape).
- Older databases that already accumulated stale `encounter.participantIds` (from edits made before this change) keep working: the unknown ids are simply filtered out. Re-editing the encounter gives the user a clean slate to reselect attendees from the current project participants.
- Export/import is unaffected: `chronicle-full-v3` already serialises the full `participants` table with their stable ids, so the import path round-trips correctly without changes.
- The onboarding tour was not extended for this iteration; "Editar encuentro" is discoverable from the encounter header and the project's encounter list, and adding a tour stop is a follow-up if needed.

---

## [2026-05-03] Agent docs: switch from roadmap-phase model to generic-update model

**Context:** The agent workspace was structured around the roadmap phases (`phase-planner`, `phase-implementer`, `phase-closeout`) with hard-coded `F<N>` branch names, mandatory Dexie schema bumps, and roadmap-closure entries. The roadmap phases F0–F11 are already complete and future work is post-roadmap (refactors, fixes, follow-ups, infra), so the phase-centric skills no longer fit. In addition, every session was forced to read the entire `decisions.md` file (~86 KB), which caused noticeable context overload, and `AGENTS.md` did not formally recognize Devin CLI alongside Windsurf and Cursor.

**Decision:** Restructure the agent workspace around generic updates and minimize the bootstrap.

- Replace the `phase-planner`, `phase-implementer`, and `phase-closeout` skills with `change-planner`, `change-implementer`, and `change-closeout`. The new skills are scope-aware (tags `domain`, `persistence`, `feature`, `routing`, `infra`, `docs`, `tests`) and reference `docs/stack-and-architecture.md` instead of duplicating its conventions. Branch names follow Conventional Commits (`<type>/<short-slug>`) instead of `feat/f<N>-<slug>`.
- Make `change-closeout` opt-in: trigger it only when the change introduced new patterns, dependencies, domain concepts, schema changes, routes, modules, or skills. Trivial edits skip it.
- Trim the mandatory bootstrap in `AGENTS.md` and `.agents/rules/agents.md` to three short reads (`AGENTS.md`, `language-policy.md`, `project-context.md`). Demote `decisions.md`, `glossary.md`, and `docs/stack-and-architecture.md` to on-demand reads.
- Recognize Devin CLI explicitly in `AGENTS.md` and `.agents/README.md` (auto-discovers skills under `.agents/skills/`; session config in `.devin/`). Cursor is covered by bridges in `.cursor/rules/`. Windsurf bridges remain in `.windsurf/rules/` and `.windsurf/workflows/`.
- Replace `.windsurf/workflows/phase-*.md` with `.windsurf/workflows/change-*.md` delegating stubs, plus matching `.agents/workflows/change-*.md` files.
- Slim the skill template (drop the unused `## AGENTS.md Compliance` section) so future skills match what is actually written.
- Update `update-project-docs` and `agent-workspace-manager` to remove phase-only language and emphasize "edit only documents the change actually affects".

**Justification:** The phase model created two separate problems. First, it was internally inconsistent with the project's current reality: there is no next `F<N>` to plan, and forcing every change into a phase shape created friction (artificial scope, inflated commits, wrong branch names). Second, it duplicated content already documented in `docs/stack-and-architecture.md`, which is brittle — when the architecture evolves, the phase skills silently rot. The new generic model keeps the same ceremony for non-trivial work but adapts to the actual scope, references the architecture doc instead of mirroring it, and lets trivial changes skip the closeout step. Trimming the bootstrap reads addresses the most concrete cause of context overload (the 86 KB `decisions.md` loaded on every session) without losing traceability — the file remains append-only and is read on demand. Adding Devin CLI to the interoperability list aligns the docs with how the repo is actually used today.

**Consequences:**

- New skill set under `.agents/skills/`: `change-planner`, `change-implementer`, `change-closeout`. Old `phase-*` skills deleted.
- New canonical workflows: `.agents/workflows/change-planner.md`, `.agents/workflows/change-implementer.md`, `.agents/workflows/change-closeout.md`. Old `.agents/workflows/phase-closeout.md` deleted.
- New Cascade slash-command stubs: `.windsurf/workflows/change-planner.md`, `.windsurf/workflows/change-implementer.md`, `.windsurf/workflows/change-closeout.md`. Old `.windsurf/workflows/phase-*.md` deleted. Existing `phase-implementer` / `phase-closeout` skills still listed by Cascade auto-discovery will stop appearing once the agent reloads its skill registry; sessions should be restarted to pick up the new names.
- `AGENTS.md`, `.agents/rules/agents.md`, `.agents/README.md`, `.agents/skills/agent-workspace-manager/SKILL.md`, `.agents/skills/update-project-docs/SKILL.md`, and `.agents/templates/skill.template.md` rewritten to reflect the new model.
- `docs/stack-and-architecture.md` and `.agents/memory/project-context.md` were not edited as part of this change — they still describe the F0–F11 history accurately, which is now read on demand only.
- Future work uses Conventional-Commit branch names (e.g., `feat/<slug>`, `fix/<slug>`) and skips closeout when nothing in `docs/`, memory, or skills is affected.
