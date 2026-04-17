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
