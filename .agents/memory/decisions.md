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
