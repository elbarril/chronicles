# Chronicle

Application to create chronicles from observations of groups performing activities within institutions.

## Description

This project allows capturing observations prioritizing real-time usage and generating clear narrative chronicles with intuitive workflows, designed for real operational contexts within institutions.

## Principles

- Clear and accessible user experience
- Simplicity and performance
- Minimal external dependencies

## Stack and Architecture

v1 is a **local-first** web app (without backend) based on Vite + React + TypeScript, Tailwind + shadcn/ui, Dexie.js over IndexedDB for data and media (image/video/audio), React Hook Form + Zod for dynamic forms, and PWA for offline use.

Complete definition and maintenance protocol: [`docs/stack-and-architecture.md`](docs/stack-and-architecture.md).

## Current Roadmap State

- F0 completed (base scaffolding).
- F1 completed (baseline): Field CRUD with create/edit/archive/list and validations by type.
- F2 completed (baseline): Observation Form Editor with compose/reorder/version and routes `/forms*`.
- F3 completed (baseline): Groups/Participants CRUD, Encounter create/finish with form snapshot, Observation capture with dynamic fields and media.
- F4 completed (baseline): Encounter ZIP export/import with preview+confirm, upsert-by-ID import. Superseded by F8 / post-F8 polish — the dedicated `/import` route and the per-encounter export are gone; importing now happens at `/settings`, and the legacy `chronicle-encounter-v1` parser is kept for read-only backward compatibility.
- F5 completed (baseline): Deterministic chronicle generation from encounters, routes `/chronicles`, `/chronicles/:id`, and generation action from encounter detail.
- F6 completed (2026-05-01): Post-F5 UX iteration — encounter archive/restore (Dexie v6), observation `title`, unified list tables, responsive header + mobile nav drawer + theme provider, first-run onboarding dialog, defaults seeding (default form + demo encounter with media), inline media previews, data-aware home dashboard, and a help section (`/help`, `/how-it-works`).
- F7 completed (2026-05-01): Optional Gemini AI chronicle generation (BYOK) — user-provided API key stored in `localStorage`; `generatedWith` field on chronicles; `/settings` route; 3-step onboarding; "Generada con IA" badge; `infra/ai/` layer. Post-F8 AI polish: `Chronicle.inputHash` SHA-256 cache short-circuits redundant Gemini calls when observations have not changed; on Gemini error the service no longer silently falls back to deterministic — it surfaces a category-specific toast and either keeps the previously saved chronicle or throws so the encounter page can show `chronicleMessages.createError`; `AiKeyStatusBadge` is mounted next to every "Generar crónica" entry point.
- F8 completed (2026-05-01): Always-available global ZIP export from `/settings` (`chronicle-full-v1`, covers every Dexie table + media + brand color + author name); per-encounter "Exportar" button removed; importer dispatches between the new full schema and the legacy `chronicle-encounter-v1`; `chronicle.userName` + post-tour `WelcomeNamePrompt` (default detected from `navigator.userAgent`); `useShareChronicle` with `navigator.share` + clipboard fallback wired to a "Compartir" button on chronicle detail.
- Post-F8 polish (2026-05-01): `HomePage` rewritten as a pure icon-grid nav hub; new `/support` route hosts the demo encounter toggle, the data-aware status panel, and the quick-check helper; `/import` route removed (Settings is the canonical importer); `AiKeyStatusBadge` always visible next to "Generar crónica". 142 unit tests + 26 E2E tests green.

## F1 Module: Fields

- Routes: `/fields`, `/fields/new`, `/fields/:id/edit`.
- Feature: `src/features/field-definitions/`.
- Domain: `src/domain/field.ts` (discriminated model by type).
- Persistence: `src/infra/db/repositories/field-repository.ts`.
- Main tests: `tests/unit/field-schema.test.ts`, `tests/e2e/field-crud.spec.ts`.

## F2 Module: Observation Forms

- Routes: `/forms`, `/forms/new`, `/forms/:id/edit`.
- Feature: `src/features/forms/`.
- Domain: `src/domain/form.ts`.
- Persistence: `src/infra/db/repositories/form-repository.ts` (Dexie schema v3).
- Main tests: `tests/unit/form-schema.test.ts`, `tests/unit/form-service.test.ts`, `tests/e2e/forms-compose.spec.ts`.

## F3 Module: Groups

- Routes: `/groups`, `/groups/:id/edit`.
- Feature: `src/features/groups/`.
- Domain: `src/domain/group.ts`, `src/domain/participant.ts`.
- Persistence: `src/infra/db/repositories/group-repository.ts`, `src/infra/db/repositories/participant-repository.ts`.
- Main tests: `tests/unit/group-schema.test.ts`, `tests/unit/participant-schema.test.ts`, `tests/e2e/groups-crud.spec.ts`.

## F3 Module: Encounters and Observations

- Routes: `/encounters`, `/encounters/new`, `/encounters/:id`, `/encounters/:id/observations/new`.
- Feature: `src/features/encounters/`, `src/features/observations/`.
- Domain: `src/domain/encounter.ts` (with form snapshot and optional `archivedAt`), `src/domain/observation.ts` (typed scalar + media values, optional `title`).
- Persistence: `src/infra/db/repositories/encounter-repository.ts` (with `archiveEncounter`/`restoreEncounter`/`listArchivedEncounters`), `src/infra/db/repositories/observation-repository.ts` (Dexie schema v6).
- Media: `src/infra/media/store.ts` (Blob CRUD), `src/infra/media/recorder.ts` (in-app audio), `src/infra/media/use-media-object-url.ts` (managed object URLs); preview components in `src/components/media/`.
- Main tests: `tests/unit/encounter-schema.test.ts`, `tests/unit/observation-schema.test.ts`, `tests/e2e/encounter-capture.spec.ts`.

## F4 Module: Export / Import (post-F8 layout)

- Routes/actions: global export and import live at `/settings`. The dedicated `/import` route and the per-encounter "Exportar" action are gone.
- Features: `src/features/settings/components/{ExportSection,UserNameForm,BrandColorPicker,ApiKeyForm,AiKeyStatusBadge}.tsx`, `src/features/settings/hooks/{use-export-all,use-user-name,use-settings}.ts`, `src/features/import/` (component + service kept; renders inside `/settings`).
- Infra:
  - `src/infra/export/manifest.ts` — both `chronicle-full-v1` (current) and `chronicle-encounter-v1` (legacy) schemas + a discriminator.
  - `src/infra/export/full-exporter.ts` — global ZIP generation (every table + media + brand color + author name).
  - `src/infra/export/full-importer.ts` — global ZIP parse + transactional upsert.
  - `src/infra/export/encounter-importer.ts` — legacy per-encounter ZIP parse + upsert (read-only backward compatibility).
- Dependency: `jszip`.
- Main tests: `tests/unit/zip-manifest.test.ts`, `tests/unit/full-exporter.test.ts`, `tests/unit/full-importer.test.ts`, `tests/unit/encounter-importer.test.ts`, `tests/unit/user-name-service.test.ts`, `tests/e2e/encounter-export-import.spec.ts`.

## F5 Module: Chronicle Generation

- Routes/actions: `/chronicles`, `/chronicles/:id`, plus generation action from `/encounters/:id` and from each row of `/encounters`.
- Feature: `src/features/chronicles/`.
- Domain: `src/domain/chronicle.ts`.
- Persistence: `src/infra/db/repositories/chronicle-repository.ts` (Dexie schema v5 with `chronicles` table).
- Main tests: `tests/unit/chronicle-schema.test.ts`, `tests/unit/chronicle-service.test.ts`, `tests/e2e/chronicle-generation.spec.ts`.

## F6 Module: Onboarding, Defaults, Help, and App Shell

- Routes: `/help`, `/how-it-works`, `/support` (post-F8 helper page).
- Features:
  - `src/features/onboarding/` — first-run welcome dialog (3 intro steps + guided tour) gated by `chronicle.onboardingCompleted`. After the tour finishes, `WelcomeNamePrompt` (mounted in `RootLayout`) opens once and persists the user name under `chronicle.userName`.
  - `src/features/defaults/` — idempotent first-run seed (default form fields + form, demo group + participants, demo encounter with media + chronicle); exposes a `DemoEncounterButton` to load/restore or remove the demo encounter.
  - `src/features/help/` — data storage and how-it-works guides for end users.
- App shell: `src/app/MobileNavDrawer.tsx`, `src/app/nav-items.ts`, `src/app/theme.tsx` (light/dark + brand color with persisted preferences), `src/app/layout.tsx` and `src/app/providers.tsx` (triggers `seedDefaultsIfMissing` after `db.open()`).
- Home: `src/features/home/HomePage.tsx` is a pure icon-grid nav hub; the previous data-aware dashboard moved to `src/features/home/SupportPage.tsx`, backed by `src/features/home/services/data-status-service.ts` and `use-data-status` hook.
- Persistence: Dexie schema v6 — adds `archivedAt` index on `encounters` and forward migration that backfills existing rows.
- Main tests: `tests/unit/onboarding-service.test.ts`, `tests/unit/onboarding-dialog.test.tsx`, `tests/unit/welcome-name-prompt.test.tsx`, `tests/unit/defaults-service.test.ts`, `tests/unit/seed-demo-encounter.test.ts`, `tests/unit/remove-demo-encounter.test.ts`, `tests/unit/help.test.tsx`, `tests/unit/how-it-works.test.tsx`, `tests/unit/observation-media-list.test.tsx`, `tests/unit/use-media-object-url.test.tsx`, `tests/unit/format-observation-value.test.ts`, `tests/unit/home.test.tsx`, `tests/e2e/responsive-nav.spec.ts`, `tests/e2e/defaults-restore.spec.ts`, `tests/e2e/demo-encounter-media.spec.ts`.

## F7 Module: AI Chronicle Generation (BYOK)

- Routes: `/settings`.
- Features: `src/features/settings/` (API key CRUD, `AiKeyStatusBadge`, brand color, user name, export/import sections), `src/features/help/components/AiSetupGuide.tsx` (shared setup guide).
- Infra: `src/infra/ai/gemini-client.ts` (HTTP 429 → `AI_RATE_LIMITED`), `src/infra/ai/gemini-chronicle-generator.ts`, `src/infra/ai/chronicle-input-hash.ts` (SHA-256 cache key over the AI prompt input).
- Domain: `src/domain/chronicle.ts` — optional `generatedWith?: "deterministic" | "gemini"` and `inputHash?: string` (no Dexie migration).
- Behavior: AI generation runs whenever the key is configured. The `inputHash` cache short-circuits redundant Gemini calls when nothing has changed. On API error there is **no** silent fallback to deterministic — a category-specific toast surfaces and the previously saved chronicle is kept (or the call throws if none exists yet, leaving the user on the encounter page).
- AI provider: Google Gemini `gemini-2.5-flash` via REST (no SDK). Key in `localStorage["chronicle.geminiApiKey"]`.
- Main tests: `tests/unit/settings-service.test.ts`, `tests/unit/gemini-chronicle-generator.test.ts`, `tests/unit/chronicle-service.test.ts`, `tests/e2e/settings-api-key.spec.ts`, `tests/e2e/chronicle-ai-generation.spec.ts`.

## F8 Module: Global Export, User Identity, and Native Share

- Settings page (`/settings`) gained `ExportSection`, `UserNameForm`, `BrandColorPicker` and `ImportSection` alongside the existing API key form.
- Infra: `src/infra/export/full-exporter.ts` and `src/infra/export/full-importer.ts` implement the `chronicle-full-v1` ZIP schema (every Dexie table + media + brand color + author name); `src/infra/export/manifest.ts` exposes both schemas plus a discriminator; `src/features/import/services/import-service.ts` dispatches between full and legacy parsers.
- Identity: `src/features/settings/services/user-name-service.ts` (storage keys `chronicle.userName` and `chronicle.userNamePromptShown`). `src/features/onboarding/components/WelcomeNamePrompt.tsx` opens once after the tour finishes.
- Share: `src/features/chronicles/hooks/use-share-chronicle.ts` wraps `navigator.share` with a clipboard fallback; the chronicle detail header surfaces a "Compartir" button.
- Main tests: `tests/unit/full-exporter.test.ts`, `tests/unit/full-importer.test.ts`, `tests/unit/user-name-service.test.ts`, `tests/unit/welcome-name-prompt.test.tsx`, `tests/unit/use-share-chronicle.test.tsx`, `tests/e2e/encounter-export-import.spec.ts`.

## Working with Agents

This repository follows the `AGENTS.md` convention. Entry point: [`AGENTS.md`](AGENTS.md). Tool-agnostic operational layer in [`.agents/`](.agents/README.md).

## Local Development

### Requirements

- Node.js `>= 20`
- pnpm `>= 9`

### Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm preview
```

## Deployment (Vercel)

This app is a static client-side build (`pnpm build` output in `dist`), so it can be deployed directly to Vercel.

Pre-deploy checklist (mandatory):

```bash
pnpm install --frozen-lockfile
pnpm check
```

- If frozen lockfile fails, run `pnpm install` and commit dependency metadata changes.
- Keep `package.json` and `pnpm-lock.yaml` synchronized and committed together when dependencies change.
- In Vercel logs, verify the deployed commit hash matches the latest `master` commit.

Repository guardrail:

- GitHub Action `.github/workflows/lockfile-integrity.yml` validates `pnpm install --frozen-lockfile` on `push` and `pull_request` to `master`.
