# Project Context

## Identity

| Attribute | Value |
| --------- | ------- |
| Name | Chronicle |
| Type | Web application |
| Domain | Institutional observation and chronicle generation |
| Repository | `/home/emiliano/www/emisrepos/chronicle` |
| State | F12 Encounter editing + stable participant identity (2026-05-03). New `/encounters/:id/edit` route (mirror of the post-event create flow); "Editar encuentro" surfaced on the encounter header and the project's encounter list. `EncounterHeader` now lists the actual attendees as a chip list. `projectInputSchema` carries `participants: { id?, displayName }[]` (was `participantNames: string[]`); `updateProjectWithParticipants` was rewritten to diff by id, which preserves `encounter.participantIds` across project edits — the previous behavior was silently breaking the encounter attendee list. Forms+Fields F11 baseline still applies: forms hold `FormFieldInstance[]`; observations key `values` by `instanceId`; Dexie v8; export manifest `chronicle-full-v3`. |

## Purpose

Chronicle helps practitioners document encounters that already happened — date, time, who attended, and what was observed — and turns those observations into structured narrative reports (chronicles).

## Main Flows

1. The Practitioner builds reusable Forms (since F11, fields are managed inside the form-builder via the `Editar campos` dialog — there is no separate Campos route). A form is a list of field instances; the same field can appear more than once with its own per-instance label override.
2. The Practitioner creates a Project, listing the participants who take part in it.
3. After an encounter has happened, the Practitioner registers it inside the project (name, start/end time, who attended).
4. The Practitioner loads observations for the encounter, picking which form to use for each one (forms can be mixed within a single encounter).
5. From the encounter chronicle page (`/encounters/:id/chronicle`), the Practitioner generates the chronicle (deterministic by default; with Gemini if BYOK key is set).

## Technical Stack

**Local-first** web app (Vite + React + TypeScript, Dexie.js/IndexedDB, PWA). Full stack and architecture: `docs/stack-and-architecture.md`.

## Current Functional State

- **F0:** scaffolding complete.
- **F1 (implemented, refactored in F11):** `field-definitions` module — domain + repository + reusable `FieldForm` / `FieldListTable` components remain. The dedicated `/fields*` routes were removed; field management lives inside the form-builder via the `ManageFieldsDialog`.
- **F2 (implemented):** `forms` module with routes `/forms`, `/forms/new`, `/forms/:id/edit`.
- **F3..F8 (implemented):** see roadmap in `docs/stack-and-architecture.md`. Superseded by F9 below for the encounter / observation / project model.
- **F9 (implemented):** projects refactor + post-event chronicles. The `Project` entity replaces `Group`; encounters belong to a project, are post-event (`name`, `startsAt`, `endsAt`, `participantIds[]`), and no longer carry a form snapshot or `endedAt`. Chronicle generation lives only at `/encounters/:id/chronicle`. Dexie schema bumped to v7 with a hard-reset migration that wipes `participants`, `encounters`, `observations` and `chronicles` and drops the legacy `groups` table.
- **F10 (implemented):** home encounters section + project-selector modal (`EncountersSection` above the hub nav grid; `listAllActiveEncounters()`; reactive `useAllEncounters` hook).
- **F12 (implemented, current):** encounter editing + stable participant identity. New `EncounterEditPage` at `/encounters/:id/edit` (loads encounter + project, drops stale `participantIds` before submit, reuses `EncounterForm`); "Editar encuentro" button on `EncounterHeader` (hidden when archived) and "Editar" link in every active row of `ProjectEncounterListTable`. `EncounterHeader` lists the actual attendees as a chip list under the start/end/observations metadata. Participant identity is now preserved across project edits: `projectInputSchema` was switched from `participantNames: string[]` to `participants: { id?, displayName }[]` (with `projectInputParticipantSchema`), and `updateProjectWithParticipants` was rewritten to diff by id (update existing rows, add new ones with fresh uuids, hard-delete removed rows). Tests: `tests/e2e/encounter-edit.spec.ts` covers both the edit flow and the project-edit identity-preservation case; `tests/e2e/encounter-capture.spec.ts` now asserts the attendee chip; `tests/unit/project-schema.test.ts` updated for the new shape.
- **F11 (implemented):** forms + fields merge. The `/fields*` routes and the `Campos` hub tile / nav entry are gone. Field management lives inside the form-builder via `ManageFieldsDialog` (tabs Activos/Archivados, inline `FieldForm` for create/edit). Forms hold `fields: FormFieldInstance[]` (each instance has `instanceId`, `fieldId`, optional `labelOverride`); the same field can appear more than once. Observations carry their own `fields: FormFieldInstance[]` snapshot and a `values` map keyed by `instanceId`. Dexie schema bumped to v8 with a hard reset (forms, observations, chronicles, media). Export/import bumped to `chronicle-full-v3`; legacy v1/v2/encounter-v1 are rejected. Demo seed and onboarding tour rewritten.
- **Fields:** create, edit, archive/restore, list active/archived — all from the `Editar campos` dialog inside the form-builder.
- **Forms:** compose ordered instance list (`fields: FormFieldInstance[]`), accessible reorder (up/down), duplicate instance, per-instance label override, auto-version on update, create/edit/archive/restore/list. Field management embedded.
- **Projects:** create with name + participants, edit, archive/restore, list active/archived. Detail shows project info + encounters list with active/archived filters and "Crear encuentro" entry. Editing a project preserves the stable id of every participant whose row stays in the form (since F12), keeping `encounter.participantIds` valid across edits.
- **Encounters:** post-event records living inside a project. `name`, `startsAt`, `endsAt`, `participantIds[]` (subset of project participants). Archive/restore plus full edit (since F12) at `/encounters/:id/edit`. The detail header lists the actual attendees as a chip list, and the per-project encounter list counts only attendees that still exist as project participants — both views filter stale ids the same way as `resolveEncounterDependencies`.
- **Observations:** dynamic form per observation snapshot (form selector when creating). Capture scalar values + media (file picker + in-app audio recording) keyed by `instanceId` so duplicate instances of the same field hold independent values. Optional `title` rendered as primary heading.
- **Chronicles:** stable URL `/encounters/:id/chronicle` (single entry point for generate/regenerate); deterministic template includes project name, encounter name, timestamps, observations grouped by their per-observation form snapshot, with per-instance labels (override > field label). Optional AI generation via Gemini API (BYOK); badge shown when `generatedWith === "gemini"`. Global list at `/chronicles` and detail at `/chronicles/:id` with native share.
- **Export/Import:** global ZIP export from `/settings` (`chronicle-full-v3` — every table including `projects`, plus media + brand color + author name). Default file name `chronicle-{slug(name)}-{YYYY-MM-DD}.zip`. Importer accepts only `chronicle-full-v3` (legacy v1 / v2 / encounter-v1 are rejected as schema mismatch via `assertSupportedManifestSchema`).
- **Defaults / Demo:** first-run seed creates default form fields + form. Demo seed ships a demo project with thirteen participants and a series of encounters; the primary encounter carries two observations exercising both the demo form (every field type, with synthetic media, keyed by instance ids) and the default form (longText + audio). Idempotent across re-runs.
- **Onboarding:** first-run welcome dialog (3 intro steps + guided tour through Formularios with embedded `Editar campos` dialog and instance-duplication step → Proyectos → ProjectDetail → Encounter → Observation form selector → Encounter Chronicle → Settings → Chronicles global → Compartir). The legacy Campos hub-stop and field-creation steps are gone. After the tour finishes, `WelcomeNamePrompt` asks for the user name and persists it under `chronicle.userName`.
- **Settings:** `/settings` route with brand color, user name, "Exportar todo" button, "Importar datos" drop-zone, and Gemini API key management. Storage keys unchanged.
- **Help:** `/help` is a single tabbed page with three tabs (`Funcionamientos`, `Datos`, `IA`) selected via `?tab=` (same filter-tab pattern as `/projects`). The tabs render `HowItWorksGuide`, `DataStorageGuide`, and `AiSetupGuide` respectively. `AiSetupGuide` is also reused inside the onboarding dialog.
- **App shell:** responsive header with current-page status pill, mobile nav drawer (Sheet), persisted light/dark theme, accessibility skip-link. The `Campos` nav item was removed in F11.
- **Domain:** `Field`; `ObservationForm` (with `fields: FormFieldInstance[]`); `FormFieldInstance` (`instanceId`, `fieldId`, `labelOverride?`); `Project`; `Participant` (with `projectId`); `Encounter` (with `projectId`/`name`/`startsAt`/`endsAt`/`participantIds[]`/`archivedAt?`); `Observation` (with per-observation `formId`/`formVersion`/`fields: FormFieldInstance[]` snapshot, `values: Record<instanceId, ObservationValue>`, optional `title`); `Chronicle` (with optional `generatedWith` and `inputHash`).
- **Persistence:** Dexie schema v8 with hard-reset migration. Tables: `institutions`, `projects`, `participants`, `fields`, `forms`, `encounters`, `observations`, `media`, `chronicles`. The legacy `groups` store remains dropped (from v7).

## Audience

Practitioners and institutions that need to document and analyze group dynamics in activity, post-event.
