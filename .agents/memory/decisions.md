# Architectural Decisions

Registro de decisiones técnicas y de producto. Solo se agregan entradas, nunca se editan las existentes.

---

## [2026-04-17] Adopción de estructura de workspace de agentes

**Contexto:** El proyecto requiere trabajo coordinado entre agentes AI mixtos (Windsurf, Cursor, Claude, CLI) y contribuidores humanos.

**Decisión:** Se creó el directorio `.agents/` con tres subsistemas: `skills/`, `memory/`, `workflows/`.

**Justificación:** El enfoque en Markdown plano es tool-agnostic, autodocumentado y funciona en cualquier entorno de agente sin depender de APIs propietarias.

**Consecuencias:**

- Todo agente debe leer `memory/project-context.md` al iniciar sesión.
- Las decisiones significativas deben registrarse aquí antes de implementarse.
- La skill `agent-workspace-manager` es la autoridad para crear o modificar herramientas de agente.

---

## [2026-04-17] Refactor de infraestructura de vibe coding

**Contexto:** El sistema original duplicaba protocolo en `AGENTS.md`, `.agents/README.md` y `SKILL.md`; no exponía bridges explícitos para Cursor; y los templates estaban acoplados al skill `agent-workspace-manager`.

**Decisión:** `AGENTS.md` pasó a ser la fuente única de verdad minimalista. El índice operativo vive en `.agents/README.md`. Los templates se movieron a `.agents/templates/`. Se agregaron bridges nativos en `.windsurf/rules/` y `.cursor/rules/`, y stubs de slash commands en `.windsurf/workflows/` para delegar en workflows canónicos.

**Justificación:** Esta estructura elimina divergencia por duplicación, mejora interoperabilidad entre IDEs/CLIs de agentes y mantiene una capa operativa tool-agnostic en Markdown plano.

**Consecuencias:**

- `AGENTS.md` concentra principios globales y bootstrap inicial.
- `.agents/README.md` queda como índice operativo único de `.agents/`.
- Los workflows canónicos viven en `.agents/workflows/`; los archivos en `.windsurf/workflows/` delegan y no duplican lógica.
- Cualquier herramienta que soporte `AGENTS.md` puede operar en el repo sin configuración adicional.

---

## [2026-04-17] Stack tecnológico y arquitectura v1 (local-first web app)

**Contexto:** La v1 de Chronicle debe permitir al Practicante definir los campos a observar, componer un formulario de observación y cargar encuentros, soportando desde texto hasta imagen, video y audio. Los principios del proyecto exigen UX primero, simplicidad, rendimiento y mínimas dependencias externas.

**Decisión:** Se adopta un stack **local-first sin backend** para v1: Vite + React + TypeScript, Tailwind + shadcn/ui (Radix), React Router, React Hook Form + Zod, Dexie.js sobre IndexedDB (incluye Blobs para media), vite-plugin-pwa, Vitest + Playwright, pnpm. El modelo de dominio incorpora dos conceptos nuevos: `Campo` (definición tipada de dato a capturar) y `Formulario de Observación` (composición ordenada de Campos). El documento `docs/stack-and-architecture.md` queda como fuente de verdad técnica y debe mantenerse sincronizado según su sección 8.

**Justificación:**

- No introducir backend ni BaaS respeta el principio de mínimas dependencias externas y hace al sistema portable y privado por defecto.
- IndexedDB vía Dexie es la única opción del navegador que almacena `Blob` de manera robusta — condición necesaria para imagen/video/audio.
- React Hook Form + Zod permite construir formularios dinámicos con validación declarativa reutilizable en runtime y tipos.
- shadcn/ui sobre Radix da accesibilidad (ARIA) sin atar al proyecto a una UI kit monolítica.
- PWA cubre la expectativa de uso offline en contextos institucionales.

**Consecuencias:**

- `docs/stack-and-architecture.md` es lectura obligatoria junto al bootstrap de `AGENTS.md` cuando la tarea toca arquitectura, stack o dominio.
- Cualquier dependencia nueva o cambio de stack requiere una entrada en este log y edición del documento.
- Se agregan al glosario los términos `Campo` y `Formulario de Observación`.
- Versionado de schema de IndexedDB se documenta también aquí cuando cambie.
- Descartadas explícitamente en v1: backend propio, BaaS (Supabase/Firebase), state managers globales, UI kits pesadas, ORMs.

---

## [2026-04-17] Creación de skills phase-closeout y update-project-docs

**Contexto:** Al completar la fase F0 de scaffolding se evidenció que no existía un proceso formal para cerrar una fase de implementación y actualizar toda la documentación del proyecto de forma consistente. Sin un proceso definido, la documentación técnica y de agentes diverge del estado real del código.

**Decisión:** Se crean dos skills complementarias:

1. **`phase-closeout`**: orquesta el cierre de cada fase — inventaría lo construido, evalúa y crea skills nuevas, y dispara la actualización de documentación.
2. **`update-project-docs`**: skill reutilizable que actualiza de forma consistente todos los artefactos de documentación (`docs/stack-and-architecture.md`, `project-context.md`, `decisions.md`, `glossary.md`, `README.md`, `.agents/README.md`).

Toda skill futura debe incluir una referencia a `update-project-docs` para garantizar que la documentación se mantiene sincronizada.

**Justificación:**

- Formaliza el proceso post-implementación que de otro modo depende de la memoria del agente o del humano.
- Centraliza la lógica de actualización de documentación en una skill reutilizable (DRY).
- Define una Responsibility Matrix que evita duplicación entre documentos.
- Garantiza que cada fase deja el proyecto en estado documentado y auditable.

**Consecuencias:**

- Todo cierre de fase debe ejecutar `phase-closeout`.
- Toda skill nueva debe referenciar `update-project-docs` en sus constraints o steps.
- `.agents/README.md` fue actualizado con las dos skills nuevas.
- Las skills existentes no se modifican retroactivamente, pero las futuras deben seguir esta convención.

---

## [2026-04-17] Cierre de Fase F0 — Scaffolding

**Contexto:** Se completó la fase F0 del roadmap técnico, que abarca el scaffolding completo del proyecto.

**Decisión:** Se da por cerrada la fase F0 con el siguiente alcance implementado:

- **Build/Dev:** Vite 5 + React 18 + TypeScript 5 (strict) + pnpm.
- **Estilos/UI:** Tailwind CSS v4 (CSS-first) + shadcn/ui primitivas (button, input, label, card, dialog, form, sonner).
- **Routing:** React Router v7 (library mode, `createBrowserRouter`).
- **Formularios:** React Hook Form + Zod v4 + `buildResolver` helper.
- **Persistencia:** Dexie.js v4 con schema v1 (institutions, groups, participants, fields, forms, encounters, observations, media).
- **PWA:** vite-plugin-pwa con autoUpdate, manifest, workbox runtime caching, placeholder icons.
- **Testing:** Vitest + React Testing Library (unit), Playwright (E2E). Smoke tests en verde.
- **Lint/Format:** ESLint 9 flat config + Prettier + prettier-plugin-tailwindcss.
- **Estructura:** carpetas según `docs/stack-and-architecture.md` sección 5.2.
- **App shell:** providers (theme + toast), layout (header/main/footer), router con home y 404.

**Justificación:** Todos los criterios de salida de F0 se cumplen: `pnpm dev` levanta, build produce dist, lint/format/typecheck/test/test:e2e pasan en verde.

**Consecuencias:**

- `project-context.md` actualizado a estado "F0 completo".
- `docs/stack-and-architecture.md` roadmap marca F0 como completada.
- El proyecto está listo para comenzar F1 (CRUD de Campos).

---

## [2026-04-18] Implementación F1 — CRUD de Campos

**Contexto:** El roadmap técnico define F1 como la primera fase funcional post-scaffolding, centrada en permitir la definición operativa de Campos (crear, editar, archivar y listar) sin backend y respetando arquitectura en capas.

**Decisión:** Se implementa un baseline completo de F1 con alcance end-to-end:

- **Dominio:** `Field` pasa a un modelo discriminado por `type` con `config` tipado por variante en `src/domain/field.ts`, incorporando además `createdAt`, `updatedAt`, `archivedAt`.
- **Persistencia:** schema Dexie actualizado a versión 2 (`src/infra/db/schema.ts`) y creación de repositorio dedicado (`src/infra/db/repositories/field-repository.ts`) con operaciones `create/update/archive/restore/list/get/uniqueKey`.
- **Feature layer:** módulo `field-definitions` con servicios de caso de uso, hooks reactivos y metadatos/defaults por tipo.
- **UI y routing:** rutas `/campos`, `/campos/nuevo`, `/campos/:id/editar` integradas en `src/app/router.tsx`, navegación en `src/app/layout.tsx`, pantalla de listado con activos/archivados y formulario de alta/edición.
- **Testing:** cobertura agregada para dominio (`tests/unit/field-schema.test.ts`), utilidades (`tests/unit/slugify.test.ts`) y flujo E2E (`tests/e2e/field-crud.spec.ts`).

**Justificación:**

- El modelo discriminado reduce ambigüedad y mejora la validación por tipo de campo.
- El repositorio dedicado consolida reglas de negocio de persistencia (archivado soft-delete y unicidad de key) en un punto auditable.
- El flujo UI permite operación real del Practicante sin depender de fases posteriores.
- La cobertura de tests mantiene verificable la evolución de F1.

**Consecuencias:**

- F1 queda implementada en estado baseline funcional y validada por `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`.
- El documento canónico `docs/stack-and-architecture.md` debe reflejar este nuevo estado de roadmap y contratos de `Field`/persistencia.
- El estado del proyecto en `project-context.md` pasa de "F0 completo" a "F1 implementada".
