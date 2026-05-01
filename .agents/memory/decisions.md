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
