# Project Context

## Identity

| Attribute | Value |
| --------- | ------- |
| Name | Chronicle |
| Type | Web application |
| Domain | Institutional observation and chronicle generation |
| Repository | `/home/emiliano/www/emisrepos/chronicle` |
| State | F4 Export/Import implemented (functional baseline) — encounter-level self-contained ZIP export, dedicated `/import` page with preview+confirm, upsert-by-ID import, JSZip infra, and unit/E2E tests green (2026-04-18) |

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
- **Fields:** create, edit, archive/restore, list active/archived.
- **Forms:** compose ordered field sets, accessible reorder (up/down), auto-version on update, create/edit/archive/restore/list.
- **Groups:** create, edit, archive/restore, manage participants inline.
- **Encounters:** create from group + form (snapshot frozen at creation), capture observations, finish encounter.
- **Observations:** dynamic form per encounter snapshot, capture scalar values + media (file picker + in-app audio recording).
- **Export/Import:** per-encounter ZIP export (`manifest + entities + media`), parse with full preview, transactional upsert-by-ID import.
- **Domain:** `Field` (discriminated union by `type`); `ObservationForm`; `Group`; `Participant`; `Encounter` (with `formVersion`+`fieldIds` snapshot); `Observation` (with typed scalar and media values).
- **Persistence:** Dexie schema v4 (`groups`/`participants`/`encounters` tables + indexes, `media` table for Blobs) with dedicated repositories for all entities.
- **Current testing:** previous baseline plus `tests/unit/zip-manifest.test.ts`, `tests/unit/encounter-exporter.test.ts`, `tests/unit/encounter-importer.test.ts`, and `tests/e2e/encounter-export-import.spec.ts`.

## Audience

Practitioners and institutions that need to document and analyze group dynamics in activity.
