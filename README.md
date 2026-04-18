# Chronicle

Aplicación para crear crónicas a partir de observaciones de grupos que realizan actividades dentro de instituciones.

## Descripción

Este proyecto permite capturar observaciones de forma prioritaria y generar narrativas/chronicles claras con flujos de trabajo intuitivos, diseñado para contextos operativos reales dentro de instituciones.

## Principios

- Experiencia de usuario clara y accesible
- Simplicidad y rendimiento
- Mínimas dependencias externas

## Stack y arquitectura

La v1 es una web app **local-first** (sin backend) basada en Vite + React + TypeScript, Tailwind + shadcn/ui, Dexie.js sobre IndexedDB para datos y media (imagen/video/audio), React Hook Form + Zod para formularios dinámicos, y PWA para uso offline.

Definición completa y protocolo de mantenimiento: [`docs/stack-and-architecture.md`](docs/stack-and-architecture.md).

## Estado actual del roadmap

- F0 completada (scaffolding base).
- F1 completada (baseline): CRUD de Campos con create/edit/archive/list y validaciones por tipo.
- Próxima fase objetivo: F2 (Editor de Formularios de Observación).

## Módulo F1: Campos

- Rutas: `/campos`, `/campos/nuevo`, `/campos/:id/editar`.
- Feature: `src/features/field-definitions/`.
- Dominio: `src/domain/field.ts` (modelo discriminado por tipo).
- Persistencia: `src/infra/db/repositories/field-repository.ts`.
- Tests principales: `tests/unit/field-schema.test.ts`, `tests/e2e/field-crud.spec.ts`.

## Trabajo con agentes

Este repositorio sigue la convención `AGENTS.md`. Punto de entrada: [`AGENTS.md`](AGENTS.md). Capa operativa tool-agnostic en [`.agents/`](.agents/README.md).

## Desarrollo local

### Requisitos

- Node.js `>= 20`
- pnpm `>= 9`

### Comandos

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
