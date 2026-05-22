# Chronicle

Application to document encounters that already happened and turn the observations captured for them into clear narrative chronicles.

## Description

Chronicle helps practitioners register, after the fact, what happened in a session inside a project: when it started and ended, who attended, and what was observed. From those observations the app generates a chronicle — either deterministic by default, or in narrative prose when the user provides a Google Gemini API key (BYOK).

## Principles

- Clear and accessible user experience
- Simplicity and performance
- Minimal external dependencies

## Stack and Architecture

v1 is a **local-first** web app (without backend) based on Vite + React + TypeScript, Tailwind CSS v4 (native Vite plugin), shadcn/ui, Dexie.js over IndexedDB for data and media (image/video/audio), React Hook Form + Zod for dynamic forms, and PWA for offline use.

Complete definition and maintenance protocol: [`docs/stack-and-architecture.md`](docs/stack-and-architecture.md).

The documentation now includes:

- Technology stack with up-to-date details (Tailwind CSS v4, ESLint 9 Flat Config, TypeScript strict mode)
- TypeScript configuration and strict mode options
- Messaging strategy (bilingual: Spanish UI messages, English error codes)
- AI integration details (Gemini gemini-2.5-flash model)
- CI/CD and deployment workflow (GitHub Actions lockfile integrity)
- **Appendix A**: Local Development Guide — complete setup and workflow
- **Appendix B**: Code Patterns and Conventions — project-specific patterns
- **Appendix C**: Testing Guide — testing strategy and best practices

## Current Roadmap State

- F0 completed (base scaffolding).
- F1 completed (baseline; refactored in F11): Field CRUD with create/edit/archive/list and validations by type. The dedicated `/fields*` routes were retired in F11; field management now lives inside the form-builder via the `Editar campos` dialog.
- F2 completed (baseline; updated in F11 to use `FormFieldInstance[]`): Observation Form Editor with compose/reorder/duplicate/version and routes `/forms*`.
- F3..F8 completed (baseline; superseded by F9 for the encounter / observation / project model — see history in `.agents/memory/decisions.md`).
- F9 completed (2026-05-02): **Projects refactor + post-event chronicles + per-observation form snapshot + Dexie v7 hard reset**. The `Project` entity replaces `Group`. Encounters are post-event records inside a project (`name`, `startsAt`, `endsAt`, `participantIds[]`). Each observation snapshots its own form (`formId` + `formVersion` + `fieldIds[]`), so a single encounter can mix forms across observations. Chronicle generation is gated to `/encounters/:id/chronicle` (single entry point); the encounter detail surfaces only "Ver crónica". Hub swaps `Grupos`/`Encuentros` for `Proyectos`. Export schema bumped to `chronicle-full-v2`.
- F10 completed (2026-05-03): **Home encounters section + project-selector modal**.
- F11 completed (2026-05-03): **Forms + Fields merge + per-instance label overrides + Dexie v8 hard reset + manifest v3**. The `/fields*` routes are gone — fields are managed inside the form-builder through the `Editar campos` dialog. Forms now hold `fields: FormFieldInstance[]` (each instance has `instanceId`, `fieldId`, optional `labelOverride`); the same field can appear more than once in a form, each with its own value. Observations carry their own `fields: FormFieldInstance[]` snapshot and key `values` by `instanceId`. Dexie schema bumped to v8 with a hard reset of `forms`, `observations`, `chronicles` and `media`. Export schema bumped to `chronicle-full-v3`; legacy v1/v2/encounter-v1 are rejected.

## F1 Module: Fields

- Routes: none — managed inside the form-builder via `ManageFieldsDialog` (since F11).
- Feature assets: `src/features/field-definitions/` (`FieldForm`, `FieldListTable`, `useFields`, `useFieldActions`, repository, messages, defaults).
- Domain: `src/domain/field.ts` (discriminated model by type).
- Persistence: `src/infra/db/repositories/field-repository.ts`.
- Main tests: `tests/unit/field-schema.test.ts`, plus the form-builder + dialog flows in `tests/e2e/forms-compose.spec.ts` / `tests/e2e/field-crud.spec.ts`.

## F2 Module: Observation Forms (extended in F11)

- Routes: `/forms`, `/forms/new`, `/forms/:id/edit`.
- Feature: `src/features/forms/` — including `FormBuilder` (instance list with reorder/duplicate/labelOverride) and `ManageFieldsDialog` (field create/edit/archive/restore embedded).
- Domain: `src/domain/form.ts` (`FormFieldInstance = { instanceId, fieldId, labelOverride? }`; `ObservationForm.fields: FormFieldInstance[]`).
- Persistence: `src/infra/db/repositories/form-repository.ts`.
- Main tests: `tests/unit/form-schema.test.ts`, `tests/unit/form-service.test.ts`, `tests/e2e/forms-compose.spec.ts`.

## F9 Module: Projects + Encounters + Post-event Chronicles

- Routes: `/projects`, `/projects/new`, `/projects/:id`, `/projects/:id/edit`, `/projects/:projectId/encounters/new`, `/encounters/:id`, `/encounters/:id/observations/new`, `/encounters/:id/chronicle`.
- Features:
  - `src/features/projects/` — list/new/edit/detail with active/archived filters; encounter list inside the project detail.
  - `src/features/encounters/` — post-event encounter form (name, startsAt, endsAt, participants who attended), detail page with archive/restore + "Ver crónica" link.
  - `src/features/observations/` — per-observation form selector backed by the active forms list; the chosen form is snapshotted on the observation.
  - `src/features/chronicles/pages/EncounterChroniclePage.tsx` — single entry point to generate or regenerate a chronicle for an encounter, plus share + delete; global list at `/chronicles` and detail at `/chronicles/:id` are kept.
- Domain: `src/domain/project.ts`, refactored `participant.ts` (with `projectId`), `encounter.ts` (post-event shape), `observation.ts` (with `formId`/`formVersion`/`fieldIds[]` snapshot).
- Persistence: Dexie schema v7 with hard-reset migration (`groups: null` drops the legacy store; `participants`, `encounters`, `observations`, `chronicles` are wiped because their record shapes changed). New `src/infra/db/repositories/project-repository.ts`; `encounter-repository.ts` and `observation-repository.ts` updated to the new shapes.
- Export/Import: `src/infra/export/full-exporter.ts` and `full-importer.ts` round-trip the new schema `chronicle-full-v2` (covers every table including `projects` + media + brand color + author name). Legacy v1 / encounter-v1 are no longer importable.
- Demo data: `seedDemoEncounter` produces a demo project, demo encounter and **two** observations using two different forms; `removeDemoEncounter` cleans the demo project (no longer the legacy demo group).
- Main tests:
  - Unit: `tests/unit/project-schema.test.ts`, refreshed `participant-schema.test.ts`, `encounter-schema.test.ts`, `observation-schema.test.ts`, `chronicle-service.test.ts`, `seed-demo-encounter.test.ts`, `remove-demo-encounter.test.ts`, `full-exporter.test.ts`, `full-importer.test.ts`, `gemini-chronicle-generator.test.ts`, `home.test.tsx`, `help.test.tsx` (covers the three tabs of `/help`), `onboarding-dialog.test.tsx`.
  - E2E: `tests/e2e/projects-crud.spec.ts`, `tests/e2e/encounter-capture.spec.ts`, `tests/e2e/encounter-export-import.spec.ts`, `tests/e2e/chronicle-generation.spec.ts`, `tests/e2e/chronicle-ai-generation.spec.ts`, `tests/e2e/demo-encounter-media.spec.ts`, `tests/e2e/responsive-nav.spec.ts`.

## F4 Module: Export / Import (post-F11 layout)

- Global export and import live at `/settings`. The dedicated `/import` route and the per-encounter "Exportar" action are gone (since post-F8); the legacy per-encounter ZIP is no longer importable (since F9).
- Manifest schema: `chronicle-full-v3` (since F11). `assertSupportedManifestSchema(schema)` in `src/infra/export/manifest.ts` rejects v1 / v2 / encounter-v1 / unknown values with `IMPORT_SCHEMA_MISMATCH`. v2 → v3 was not migrated because v2 stored observation values keyed by `fieldId`, which cannot be aligned with the v3 instance-id model without losing data.

## F5 Module: Chronicle Generation (refresh)

- Generation entry point: `/encounters/:id/chronicle`. Deterministic by default; AI when the user has a Gemini API key configured. The chronicle body now reads `Proyecto: ...` and `Encuentro: ...` instead of group/activity.
- Global list and detail: `/chronicles`, `/chronicles/:id`.

## F6 Module: Onboarding, Defaults, Help, and App Shell (refresh; updated in F11)

- Since F11 the onboarding tour starts directly at Formularios (it includes a stop on the embedded `Editar campos` dialog and a stop showcasing instance duplication), then walks Proyectos → ProjectDetail → Encuentro → Observación con form selector → Crónica del encuentro → Configuración → Crónicas globales → Compartir. The legacy Campos hub-stop and `/fields/new` walkthrough were removed.
- The demo seed (`Cargar encuentro de prueba` on `/support`) seeds a demo project with 13 participants and 8 encounters; the primary encounter holds two observations using two different forms (one covering every field type, one with longText + audio).

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

For detailed local development setup, configuration details, and development tips, see **[Appendix A: Local Development Guide](docs/stack-and-architecture.md#appendix-a-local-development-guide)** in the main documentation.

## Migrating from pre-F11 builds

The F11 release is a hard reset of the form, observation, chronicle and media tables (Dexie v8). Anyone opening Chronicle for the first time on F11 with a pre-F11 IndexedDB will see their `forms`, `observations`, `chronicles` and `media` wiped because their record shapes changed (forms moved from `fieldIds: string[]` to `fields: FormFieldInstance[]`, and observation values are now keyed by `instanceId` instead of `fieldId`). Field definitions, projects, participants, encounters and Settings preferences (theme, brand color, user name, Gemini key) are preserved. The legacy `groups` store remains dropped (since v7).

If you need to keep pre-F11 data around, downgrade temporarily, export the database from `/settings` ("Exportar todo") on the pre-F11 build, and store the resulting `chronicle-full-v2` ZIP somewhere safe — but be aware the F11 importer cannot read those files. They remain as historical artefacts only. (For pre-F9 ZIPs, the same applies retroactively: `chronicle-full-v1` and `chronicle-encounter-v1` were already rejected since F9.)

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
