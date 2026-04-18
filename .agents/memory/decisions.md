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
