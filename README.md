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
- Target next phase: F3 (Encounters and Observation Capture).

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
