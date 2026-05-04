# Project Context

## Identity

| Attribute | Value |
| --------- | ------- |
| Name | Chronicle |
| Type | Web application |
| Domain | Institutional observation and chronicle generation |
| Repository | `/home/emiliano/www/emisrepos/chronicle` |
| State | F9 Projects refactor + post-event chronicles complete (2026-05-02). Dexie v7 hard reset; `Group` replaced by `Project`; encounters are now post-event records inside a project; observations carry their own form snapshot; chronicle generation is gated to `/encounters/:id/chronicle`. All unit tests green; E2E suite adapted. |

## Purpose

Chronicle helps practitioners document encounters that already happened — date, time, who attended, and what was observed — and turns those observations into structured narrative reports (chronicles).

## Main Flows

1. The Practitioner defines reusable Fields and Forms.
2. The Practitioner creates a Project, listing the participants who take part in it.
3. After an encounter has happened, the Practitioner registers it inside the project (name, start/end time, who attended).
4. The Practitioner loads observations for the encounter, picking which form to use for each one (forms can be mixed within a single encounter).
5. From the encounter chronicle page (`/encounters/:id/chronicle`), the Practitioner generates the chronicle (deterministic by default; with Gemini if BYOK key is set).

## Technical Stack

**Local-first** web app (Vite + React + TypeScript, Dexie.js/IndexedDB, PWA). Full stack and architecture: `docs/stack-and-architecture.md`.

## Current Functional State

- **F0:** scaffolding complete.
- **F1 (implemented):** `field-definitions` module with routes `/fields`, `/fields/new`, `/fields/:id/edit`.
- **F2 (implemented):** `forms` module with routes `/forms`, `/forms/new`, `/forms/:id/edit`.
- **F3..F8 (implemented):** see roadmap in `docs/stack-and-architecture.md`. Superseded by F9 below for the encounter / observation / project model.
- **F9 (implemented, current):** projects refactor + post-event chronicles. The `Project` entity replaces `Group`; encounters belong to a project, are post-event (`name`, `startsAt`, `endsAt`, `participantIds[]`), and no longer carry a form snapshot or `endedAt`. Each observation snapshots its own `formId`/`formVersion`/`fieldIds[]` so a single encounter can mix forms across observations. Chronicle generation lives only at `/encounters/:id/chronicle`; the encounter detail surfaces a "Ver crónica" link. Hub swaps `Grupos`/`Encuentros` for `Proyectos`. Dexie schema bumped to v7 with a hard-reset migration that wipes `participants`, `encounters`, `observations` and `chronicles` and drops the legacy `groups` table. Export/import schema bumped to `chronicle-full-v2` with `projects[]`; legacy `chronicle-full-v1` and `chronicle-encounter-v1` are no longer importable.
- **Fields:** create, edit, archive/restore, list active/archived.
- **Forms:** compose ordered field sets, accessible reorder (up/down), auto-version on update, create/edit/archive/restore/list.
- **Projects:** create with name + participants, edit, archive/restore, list active/archived. Detail shows project info + encounters list with active/archived filters and "Crear encuentro" entry.
- **Encounters:** post-event records living inside a project. `name`, `startsAt`, `endsAt`, `participantIds[]` (subset of project participants). Archive/restore is the only state change (no "finished" flow).
- **Observations:** dynamic form per observation snapshot (form selector when creating). Capture scalar values + media (file picker + in-app audio recording). Optional `title` rendered as primary heading.
- **Chronicles:** stable URL `/encounters/:id/chronicle` (single entry point for generate/regenerate); deterministic template includes project name, encounter name, timestamps, observations grouped by their per-observation form snapshot. Optional AI generation via Gemini API (BYOK); badge shown when `generatedWith === "gemini"`. Global list at `/chronicles` and detail at `/chronicles/:id` with native share.
- **Export/Import:** global ZIP export from `/settings` (`chronicle-full-v2` — every table including `projects`, plus media + brand color + author name). Default file name `chronicle-{slug(name)}-{YYYY-MM-DD}.zip`. Importer accepts only `chronicle-full-v2` (legacy v1 / encounter-v1 are rejected as schema mismatch).
- **Defaults / Demo:** first-run seed creates default form fields + form. Demo encounter ships a demo project with two participants, one encounter (one hour long, both participants present), and **two** observations exercising both the demo form (every field type, with synthetic media) and the default form (longText + audio). Idempotent across re-runs.
- **Onboarding:** first-run welcome dialog (3 intro steps + guided tour through Campos → Formularios → Proyectos → ProjectDetail → Encounter → Observation form selector → Encounter Chronicle → Settings → Chronicles global → Compartir). After the tour finishes, `WelcomeNamePrompt` asks for the user name and persists it under `chronicle.userName`.
- **Settings:** `/settings` route with brand color, user name, "Exportar todo" button, "Importar datos" drop-zone, and Gemini API key management. Storage keys unchanged.
- **Help:** `/help` is a single tabbed page with three tabs (`Funcionamientos`, `Datos`, `IA`) selected via `?tab=` (same filter-tab pattern as `/projects`). The tabs render `HowItWorksGuide`, `DataStorageGuide`, and `AiSetupGuide` respectively. `AiSetupGuide` is also reused inside the onboarding dialog.
- **App shell:** responsive header with current-page status pill, mobile nav drawer (Sheet), persisted light/dark theme, accessibility skip-link.
- **Domain:** `Field`; `ObservationForm`; `Project`; `Participant` (with `projectId`); `Encounter` (with `projectId`/`name`/`startsAt`/`endsAt`/`participantIds[]`/`archivedAt?`); `Observation` (with per-observation `formId`/`formVersion`/`fieldIds[]` snapshot, optional `title`); `Chronicle` (with optional `generatedWith` and `inputHash`).
- **Persistence:** Dexie schema v7 with hard-reset migration. Tables: `institutions`, `projects`, `participants`, `fields`, `forms`, `encounters`, `observations`, `media`, `chronicles`. The legacy `groups` store is dropped via `groups: null`.

## Audience

Practitioners and institutions that need to document and analyze group dynamics in activity, post-event.
