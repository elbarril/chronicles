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
- Documentation state transitions to F5 and Dexie schema v5 as current baseline.
