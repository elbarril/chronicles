# Project Context

## Identidad

| Atributo | Valor |
|---------|-------|
| Nombre | Chronicle |
| Tipo | Aplicación web |
| Dominio | Observación institucional y generación de crónicas |
| Repositorio | `/home/emiliano/www/emisrepos/chronicle` |
| Estado | Inicializado — sin código de aplicación todavía (2026-04-17) |

## Propósito

Chronicle captura observaciones de grupos que realizan actividades dentro de una institución
y las transforma en reportes narrativos estructurados (crónicas).

## Flujos Principales

1. El Practicante registra observaciones en tiempo real durante una sesión grupal.
2. El sistema organiza las observaciones por participante, actividad y momento.
3. Un agente o usuario genera una narrativa de crónica a partir de las observaciones estructuradas.

## Principios de Diseño (de AGENTS.md)

- **UX primero**: claridad, bajo fricción, accesibilidad.
- **Simplicidad**: soluciones simples antes que complejas.
- **Sin dependencias externas innecesarias**: implementaciones autocontenidas y portables.

## Stack Técnico

Web app **local-first** sin backend para v1. Stack: Vite + React + TypeScript, Tailwind + shadcn/ui, React Router, React Hook Form + Zod, Dexie.js (IndexedDB, incluye Blobs para imagen/video/audio), vite-plugin-pwa, Vitest + Playwright, pnpm.

Documento canónico: `docs/stack-and-architecture.md` (incluye arquitectura, modelo de dominio y convenciones). Decisión registrada en `.agents/memory/decisions.md` el 2026-04-17.

## Audiencia

Practicantees e instituciones que necesitan documentar y analizar la dinámica de grupos en actividad.
