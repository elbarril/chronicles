# Phase Closeout

## Description

Orquesta el cierre de una fase de implementación: audita lo construido, crea o actualiza skills relevantes, y dispara la actualización de toda la documentación del proyecto.

## Trigger Conditions

Usar esta skill cuando:

- Se completa una fase del roadmap técnico (F0, F1, F2, ...).
- Se termina un bloque significativo de implementación que introduce conceptos, patrones o herramientas nuevas.
- El usuario pide explícitamente cerrar o documentar una fase.

## Prerequisites

- La fase debe estar funcionalmente terminada (build, lint, tests en verde).
- El agente debe haber leído `AGENTS.md`, `.agents/memory/project-context.md` y `docs/stack-and-architecture.md` al inicio de sesión.

## Steps

### 1. Inventariar lo construido

Listar todos los cambios de la fase:

- Archivos creados o modificados (usar `git diff --name-status` contra la rama o el último commit de cierre).
- Dependencias nuevas agregadas a `package.json`.
- Conceptos de dominio nuevos o modificados.
- Patrones técnicos nuevos (ej: nueva capa de infraestructura, nuevo tipo de componente, nueva convención).

### 2. Evaluar necesidad de skills nuevas o actualizadas

Para cada patrón, herramienta o flujo recurrente introducido, evaluar:

- **Existe una skill que lo cubre?** Si existe, determinar si necesita actualización.
- **Es un patrón que se va a repetir en fases futuras?** Si sí, crear una skill nueva.

Ejemplos de skills que pueden surgir:

| Fase de ejemplo | Skill potencial |
|-----------------|----------------|
| F0 (scaffolding) | `update-project-docs` (actualización de documentación post-fase) |
| F1 (CRUD campos) | `domain-entity-crud` (patrón para crear CRUD de entidades de dominio) |
| F2 (formularios) | `dynamic-form-builder` (patrón para formularios dinámicos con Zod) |
| F3 (media) | `media-capture-pattern` (patrón de captura y almacenamiento de media) |

### 3. Crear skills identificadas

Para cada skill nueva, delegar al workflow `.agents/workflows/create-skill.md`:

1. Crear directorio en `.agents/skills/<skill-name>/`.
2. Completar `SKILL.md` con todas las secciones obligatorias.
3. Incluir scripts de soporte si aplican.
4. **IMPORTANTE:** Toda skill nueva debe incluir en su sección Constraints o Steps una referencia a `update-project-docs` para garantizar que la documentación se mantiene actualizada cuando se use la skill.

### 4. Actualizar skills existentes

Si una skill existente necesita cambios por lo construido en la fase:

1. Editar el `SKILL.md` correspondiente.
2. Registrar el cambio en `.agents/memory/decisions.md`.

### 5. Ejecutar skill `update-project-docs`

Delegar a la skill `.agents/skills/update-project-docs/SKILL.md` para actualizar toda la documentación del proyecto. Esta skill cubre:

- `docs/stack-and-architecture.md` (stack, estructura, dominio, roadmap).
- `.agents/memory/project-context.md` (estado actual del proyecto).
- `.agents/memory/decisions.md` (registro de la fase completada).
- `.agents/memory/glossary.md` (términos nuevos).
- `README.md` (si hay cambios en comandos o requisitos).
- `.agents/README.md` (si se crearon skills o workflows nuevos).

### 6. Verificar consistencia

Checklist final:

- [ ] Toda skill nueva tiene `SKILL.md` completo con todas las secciones obligatorias.
- [ ] Toda skill nueva o actualizada menciona `update-project-docs` en su flujo.
- [ ] `decisions.md` tiene una entrada para el cierre de la fase.
- [ ] `project-context.md` refleja el estado actualizado del proyecto.
- [ ] `glossary.md` incluye todos los términos nuevos.
- [ ] `docs/stack-and-architecture.md` refleja cualquier cambio de stack, dominio o estructura.
- [ ] `.agents/README.md` lista las skills nuevas si son de uso general.
- [ ] No hay duplicación entre documentos.

### 7. Proponer commit

Sugerir al usuario un commit con los cambios de documentación y skills, separado del commit de código de la fase.

## Outputs

- Skills nuevas en `.agents/skills/`.
- Documentación completa y actualizada.
- Entrada en `decisions.md` registrando el cierre de fase.
- Resumen de cambios realizados para el usuario.

## Constraints

- NEVER crear skills que dupliquen lógica de skills existentes — referenciar en su lugar.
- NEVER editar entradas previas de `decisions.md`.
- NEVER hacer commits automáticos — siempre proponer al usuario.
- NEVER omitir la ejecución de `update-project-docs` — es obligatoria en todo cierre de fase.
- NEVER crear una skill sin la referencia a actualización de documentación.

## AGENTS.md Compliance

- Respeta el principio de documentación sincronizada (`docs/stack-and-architecture.md` sección 8).
- Mantiene `AGENTS.md` como fuente de verdad global.
- Usa Markdown plano y contenido tool-agnostic.
- Registra decisiones significativas antes de implementar.
