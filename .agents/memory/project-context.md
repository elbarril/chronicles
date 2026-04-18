# Project Context

## Identity

| Attribute | Value |
| --------- | ------- |
| Name | Chronicle |
| Type | Web application |
| Domain | Institutional observation and chronicle generation |
| Repository | `/home/emiliano/www/emisrepos/chronicle` |
| State | F2 Observation Form Editor implemented (functional baseline) — forms compose/reorder/version + create/edit/archive/restore/list + unit/E2E tests green (2026-04-18) |

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
- **Fields:** create, edit, archive/restore, list active/archived.
- **Forms:** compose ordered field sets, accessible reorder (up/down), auto-version on update, create/edit/archive/restore/list.
- **Domain:** `Field` discriminated union by `type`; `ObservationForm` with `createdAt/updatedAt/archivedAt` and unique ordered `fieldIds`.
- **Persistence:** Dexie schema v3 (`forms` indexed by `createdAt`) with dedicated repositories for fields/forms.
- **Current testing:** `tests/unit/home.test.tsx`, `tests/unit/field-schema.test.ts`, `tests/unit/form-schema.test.ts`, `tests/unit/form-service.test.ts`, `tests/unit/slugify.test.ts`, `tests/e2e/smoke.spec.ts`, `tests/e2e/field-crud.spec.ts`, `tests/e2e/forms-compose.spec.ts`.

## Audience

Practitioners and institutions that need to document and analyze group dynamics in activity.
