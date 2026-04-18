# Project Context

## Identity

| Attribute | Value |
| --------- | ------- |
| Name | Chronicle |
| Type | Web application |
| Domain | Institutional observation and chronicle generation |
| Repository | `/home/emiliano/www/emisrepos/chronicle` |
| State | F1 Field CRUD implemented (functional baseline) — create/edit/archive/list in UI + domain validation + unit/E2E tests green (2026-04-18) |

## Purpose

Chronicle captures observations of groups performing activities within an institution and transforms them into structured narrative reports (chronicles).

## Main Flows

1. The Practitioner records observations in real-time during a group session.
2. The system organizes observations by participant, activity, and time.
3. An agent or user generates a chronicle narrative from the structured observations.

## Design Principles (from AGENTS.md)

- **UX first**: clarity, low friction, accessibility.
- **Simplicity**: simple solutions over complex ones.
- **Minimal external dependencies**: self-contained and portable implementations.

## Technical Stack

**Local-first** web app without backend for v1. Stack: Vite + React + TypeScript, Tailwind + shadcn/ui, React Router, React Hook Form + Zod, Dexie.js (IndexedDB, includes Blobs for image/video/audio), vite-plugin-pwa, Vitest + Playwright, pnpm.

Canonical document: `docs/stack-and-architecture.md` (includes architecture, domain model, and conventions). Decision registered in `.agents/memory/decisions.md` on 2026-04-17.

## Current Functional State

- **F0:** scaffolding complete.
- **F1 (implemented):** `field-definitions` module with routes `/fields`, `/fields/new`, `/fields/:id/edit`.
- **Fields:** create, edit, archive/restore, list active/archived.
- **Domain `Field`:** discriminated union by `type` + typed `config` per variant, `createdAt/updatedAt/archivedAt`.
- **Persistence:** Dexie schema v2 for `fields` with `createdAt` index and dedicated repository.
- **Current testing:** `tests/unit/home.test.tsx`, `tests/unit/field-schema.test.ts`, `tests/unit/slugify.test.ts`, `tests/e2e/smoke.spec.ts`, `tests/e2e/field-crud.spec.ts`.

## Audience

Practitioners and institutions that need to document and analyze group dynamics in activity.
