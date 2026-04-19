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
- F4 completed (baseline): Encounter ZIP export/import with preview+confirm, upsert-by-ID import, route `/import`.
- F5 completed (baseline): Deterministic chronicle generation from encounters, routes `/chronicles`, `/chronicles/:id`, and generation action from encounter detail.

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
- Domain: `src/domain/encounter.ts` (with form snapshot), `src/domain/observation.ts` (typed scalar + media values).
- Persistence: `src/infra/db/repositories/encounter-repository.ts`, `src/infra/db/repositories/observation-repository.ts` (Dexie schema v4).
- Media: `src/infra/media/store.ts` (Blob CRUD), `src/infra/media/recorder.ts` (in-app audio).
- Main tests: `tests/unit/encounter-schema.test.ts`, `tests/unit/observation-schema.test.ts`, `tests/e2e/encounter-capture.spec.ts`.

## F4 Module: Export / Import

- Routes/actions: `/import`, plus export action from `/encounters/:id`.
- Features: `src/features/import/`, `src/features/encounters/hooks/use-export-encounter.ts`.
- Infra: `src/infra/export/manifest.ts`, `src/infra/export/encounter-exporter.ts`, `src/infra/export/encounter-importer.ts`.
- Dependency: `jszip`.
- Main tests: `tests/unit/zip-manifest.test.ts`, `tests/unit/encounter-exporter.test.ts`, `tests/unit/encounter-importer.test.ts`, `tests/e2e/encounter-export-import.spec.ts`.

## F5 Module: Chronicle Generation

- Routes/actions: `/chronicles`, `/chronicles/:id`, plus generation action from `/encounters/:id`.
- Feature: `src/features/chronicles/`.
- Domain: `src/domain/chronicle.ts`.
- Persistence: `src/infra/db/repositories/chronicle-repository.ts` (Dexie schema v5 with `chronicles` table).
- Main tests: `tests/unit/chronicle-schema.test.ts`, `tests/unit/chronicle-service.test.ts`, `tests/e2e/chronicle-generation.spec.ts`.

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
