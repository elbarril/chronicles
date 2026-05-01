# Project Context

## Identity

| Attribute | Value |
| --------- | ------- |
| Name | Chronicle |
| Type | Web application |
| Domain | Institutional observation and chronicle generation |
| Repository | `/home/emiliano/www/emisrepos/chronicle` |
| State | F6 Post-F5 UX iteration completed (2026-05-01) — encounter archive/restore (Dexie v6), observation `title`, unified list tables, mobile nav drawer + theme provider, first-run onboarding dialog, default form + demo encounter seeding (`features/defaults`), inline media previews, data-aware home dashboard, `/help` and `/how-it-works` guides, unit/E2E tests green |

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
- **F4 (implemented):** `import` module and export/import infra with routes `/import` and encounter-level export action from `/encounters/:id`.
- **F5 (implemented):** `chronicles` module with routes `/chronicles`, `/chronicles/:id` and chronicle generation action from `/encounters/:id`.
- **F6 (implemented):** post-F5 UX iteration — `defaults`, `onboarding`, and `help` features; refreshed app shell with `MobileNavDrawer`, `ThemeProvider`, three-zone header; encounter archive/restore + observation `title` in domain/UI; inline media previews via `components/media` + `infra/media/use-media-object-url`; data-aware home dashboard; new routes `/help` and `/how-it-works`.
- **Fields:** create, edit, archive/restore, list active/archived.
- **Forms:** compose ordered field sets, accessible reorder (up/down), auto-version on update, create/edit/archive/restore/list.
- **Groups:** create, edit, archive/restore, manage participants inline.
- **Encounters:** create from group + form (snapshot frozen at creation), capture observations, finish encounter, archive/restore, generate-chronicle from list and detail.
- **Observations:** dynamic form per encounter snapshot, capture scalar values + media (file picker + in-app audio recording), optional `title` rendered as primary heading.
- **Export/Import:** per-encounter ZIP export (`manifest + entities + media`), parse with full preview, transactional upsert-by-ID import.
- **Chronicles:** deterministic generation template from encounter data (group/activity/timestamps + observation title + details), unified list-table view, regenerate/delete actions, inline media gallery in detail.
- **Defaults / Demo:** first-run seed creates a default form (8 standard fields) and a demo encounter exercising every field type (with synthetic media), idempotent across re-runs; UI button to load/restore or remove the demo encounter.
- **Onboarding:** first-run welcome dialog gated by `chronicle.onboardingCompleted` in `localStorage`.
- **Help:** static guides at `/help` (data storage) and `/how-it-works` (end-to-end flow).
- **App shell:** responsive header with current-page status pill, mobile nav drawer (Sheet), persisted light/dark theme, accessibility skip-link.
- **Domain:** `Field` (discriminated union by `type`); `ObservationForm`; `Group`; `Participant`; `Encounter` (with `formVersion`+`fieldIds` snapshot and optional `archivedAt`); `Observation` (with typed scalar and media values, optional `title`); `Chronicle`.
- **Persistence:** Dexie schema v6 (encounters indexed by `archivedAt`, forward-migrated from v5) with dedicated repositories for all entities.
- **Current testing:** previous baseline plus `format-observation-value`, `observation-media-list`, `use-media-object-url`, `defaults-service`, `seed-demo-encounter`, `remove-demo-encounter`, `onboarding-service`, `onboarding-dialog`, `help`, `how-it-works`, refreshed `home`, and `tests/e2e/responsive-nav.spec.ts`, `tests/e2e/defaults-restore.spec.ts`, `tests/e2e/demo-encounter-media.spec.ts`.

## Audience

Practitioners and institutions that need to document and analyze group dynamics in activity.
