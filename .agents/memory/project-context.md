# Project Context

## Identity

| Attribute | Value |
| --------- | ------- |
| Name | Chronicle |
| Type | Web application |
| Domain | Institutional observation and chronicle generation |
| Repository | `/home/emiliano/www/emisrepos/chronicle` |
| State | F8 Always-available export + identity + share completed (2026-05-01) plus post-F8 polish (home rewritten as a nav hub at `/`, helper content moved to `/support`, `/import` route removed, AI input-hash cache, hard fail on first Gemini error, `AiKeyStatusBadge`). All 142 unit tests + 26 E2E tests green. |

## Purpose

Chronicle captures observations of groups performing activities within an institution and transforms them into structured narrative reports (chronicles).

## Main Flows

1. The Practitioner records observations in real-time during a group session.
2. The system organizes observations by participant, activity, and time.
3. An agent or user generates a chronicle narrative from the structured observations.

## Technical Stack

**Local-first** web app (Vite + React + TypeScript, Dexie.js/IndexedDB, PWA). Full stack and architecture: `docs/stack-and-architecture.md`.

## Current Functional State

- **F0:** scaffolding complete.
- **F1 (implemented):** `field-definitions` module with routes `/fields`, `/fields/new`, `/fields/:id/edit`.
- **F2 (implemented):** `forms` module with routes `/forms`, `/forms/new`, `/forms/:id/edit`.
- **F3 (implemented):** `groups`, `encounters`, `observations` modules with routes `/groups`, `/groups/:id/edit`, `/encounters`, `/encounters/new`, `/encounters/:id`, `/encounters/:id/observations/new`.
- **F4 (implemented):** `import` module and export/import infra (originally with route `/import` and encounter-level export action — both superseded by F8 / post-F8 polish).
- **F5 (implemented):** `chronicles` module with routes `/chronicles`, `/chronicles/:id` and chronicle generation action from `/encounters/:id`.
- **F6 (implemented):** post-F5 UX iteration — `defaults`, `onboarding`, and `help` features; refreshed app shell with `MobileNavDrawer`, `ThemeProvider`, three-zone header; encounter archive/restore + observation `title` in domain/UI; inline media previews via `components/media` + `infra/media/use-media-object-url`; data-aware home dashboard; new routes `/help` and `/how-it-works`.
- **F7 (implemented):** optional Gemini AI chronicle generation with BYOK — `infra/ai/` layer (`gemini-client`, `gemini-chronicle-generator`); `features/settings/` module with `/settings` route; `AiSetupGuide` shared component in `features/help`; 3rd onboarding step; `Chronicle.generatedWith` optional field; "Generada con IA" badge in `ChronicleViewer`. Post-F8 polish: input-hash cache (`Chronicle.inputHash`, `infra/ai/chronicle-input-hash`) skips redundant Gemini calls when observations have not changed; on Gemini error the service no longer falls back to a deterministic chronicle (it surfaces a category-specific toast — `aiFallbackWarning`/`aiRateLimitWarning`/`aiKeyInvalidWarning` — and keeps the last saved chronicle, or throws when none exists yet).
- **F8 (implemented):** always-available global export + user identity + native share — `infra/export/full-exporter.ts` and `full-importer.ts` add the `chronicle-full-v1` schema (all entities + brand color + author name), `manifest.ts` exposes both legacy and full schemas plus a discriminator, `features/import/services/import-service.ts` dispatches between the two, `features/settings` gains `ExportSection`, `UserNameForm`, `BrandColorPicker`, `use-export-all`, `use-user-name`, `user-name-service` (`chronicle.userName` + `chronicle.userNamePromptShown`); per-encounter "Exportar encuentro" button removed from `EncounterDetailPage`/`EncounterHeader`; tour rewired so the export and import stops live in Settings; `WelcomeNamePrompt` opens after the tour completes (defaults to detected `Browser en SO`); `useShareChronicle` adds Web Share API + clipboard fallback wired to a `Compartir` button on the chronicle detail.
- **Post-F8 polish (implemented):** home page rewritten as a pure icon-grid nav hub (`Campos`, `Formularios`, `Grupos`, `Encuentros`, `Crónicas`, `Configuración`, `Cómo funciona`, `Ayuda`, `Soporte`); the previous data-aware dashboard moved to a new `/support` page (`SupportPage`) which now hosts the demo encounter toggle and the data-status summary; the `/import` route is gone (importing happens at `/settings` via `ImportSection`); `AiKeyStatusBadge` shows the live Gemini key state next to every "Generar crónica" entry point.
- **Fields:** create, edit, archive/restore, list active/archived.
- **Forms:** compose ordered field sets, accessible reorder (up/down), auto-version on update, create/edit/archive/restore/list.
- **Groups:** create, edit, archive/restore, manage participants inline.
- **Encounters:** create from group + form (snapshot frozen at creation), capture observations, finish encounter, archive/restore, generate-chronicle from list and detail.
- **Observations:** dynamic form per encounter snapshot, capture scalar values + media (file picker + in-app audio recording), optional `title` rendered as primary heading.
- **Export/Import:** global ZIP export from `/settings` (`chronicle-full-v1` — every table + brand color + author name, default file name `chronicle-{slug(name)}-{YYYY-MM-DD}.zip`), works with or without encounters/chronicles. Importer dispatches on manifest schema and still accepts legacy per-encounter `chronicle-encounter-v1` ZIPs (backward compatible) with a transactional upsert-by-ID into Dexie.
- **Chronicles:** deterministic generation template from encounter data (group/activity/timestamps + observation title + details), unified list-table view, regenerate/share/delete actions (share uses `navigator.share` with clipboard fallback), inline media gallery in detail. Optional AI generation via Gemini API (BYOK); badge shown when `generatedWith === "gemini"`.
- **Defaults / Demo:** first-run seed creates a default form (8 standard fields) and a demo encounter exercising every field type (with synthetic media), idempotent across re-runs; UI button to load/restore or remove the demo encounter.
- **Onboarding:** first-run welcome dialog (3 intro steps + guided tour ending at the Settings export/import + chronicle share stops) gated by `chronicle.onboardingCompleted`. Right after the tour finishes, `WelcomeNamePrompt` asks for the user name (default detected from `navigator.userAgent`, e.g. `Chrome en Linux`) and persists it under `chronicle.userName`; the prompt is gated by `chronicle.userNamePromptShown` so it never shows twice.
- **Settings:** `/settings` route with brand color, user name, "Exportar todo" button, "Importar datos" drop-zone, and Gemini API key management. Storage keys: `chronicle.userName`, `chronicle.userNamePromptShown`, `chronicle.geminiApiKey`, `chronicle.onboardingCompleted`, `chronicle-theme`, `chronicle-brand`.
- **Help:** static guides at `/help` (data storage) and `/how-it-works` (end-to-end flow); `AiSetupGuide` shared component also used in onboarding step 3.
- **App shell:** responsive header with current-page status pill, mobile nav drawer (Sheet), persisted light/dark theme, accessibility skip-link.
- **Domain:** `Field` (discriminated union by `type`); `ObservationForm`; `Group`; `Participant`; `Encounter` (with `formVersion`+`fieldIds` snapshot and optional `archivedAt`); `Observation` (with typed scalar and media values, optional `title`); `Chronicle` (with optional `generatedWith` and `inputHash` for the AI cache).
- **Persistence:** Dexie schema v6 (encounters indexed by `archivedAt`, forward-migrated from v5) with dedicated repositories for all entities.
- **Current testing:** 142 unit tests + E2E tests across all phases. F8 adds `tests/unit/full-exporter.test.ts`, `tests/unit/full-importer.test.ts`, `tests/unit/user-name-service.test.ts`, `tests/unit/use-share-chronicle.test.tsx`, `tests/unit/welcome-name-prompt.test.tsx`; rewires `tests/e2e/encounter-export-import.spec.ts` to drive the global export from `/settings`. The legacy `tests/unit/encounter-exporter.test.ts` was removed alongside the unused `infra/export/encounter-exporter.ts`.

## Audience

Practitioners and institutions that need to document and analyze group dynamics in activity.
