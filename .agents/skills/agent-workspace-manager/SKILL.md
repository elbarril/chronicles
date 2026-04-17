# Agent Workspace Manager

## Description

Coordina cambios en `.agents/` delegando la ejecución a workflows canónicos y validando conformidad con `AGENTS.md`.

## Trigger Conditions

Usar esta skill cuando:

- Se va a crear una nueva skill en `.agents/skills/`
- Se va a crear o modificar un workflow en `.agents/workflows/`
- Se va a crear o actualizar un archivo de memoria en `.agents/memory/`
- Se necesita revisar consistencia general del workspace de agentes

## Reglas Invariables

- Mantener `AGENTS.md` como fuente de verdad para principios globales.
- Evitar duplicación entre `AGENTS.md`, `.agents/README.md`, skills y workflows.
- Usar Markdown plano y contenido tool-agnostic dentro de `.agents/`.
- Registrar decisiones significativas en `.agents/memory/decisions.md`.

## Delegación por Tipo de Tarea

| Tarea | Workflow canónico |
|------|-------------------|
| Crear una skill | `.agents/workflows/create-skill.md` |
| Crear un workflow | `.agents/workflows/create-workflow.md` |
| Actualizar memoria | `.agents/workflows/update-memory.md` |

## Checklist de Calidad

Antes de dar por finalizado cualquier cambio en el workspace, verificar:

- [ ] El archivo usa Markdown plano sin sintaxis exclusiva de una herramienta
- [ ] El archivo es autocontenido y sus referencias internas son válidas
- [ ] El nombre sigue la convención kebab-case cuando aplica
- [ ] `decisions.md` fue actualizado si hubo un cambio significativo
- [ ] No hay duplicación con skills, memoria o workflows existentes
- [ ] Ningún principio de `AGENTS.md` fue violado
- [ ] Las secciones obligatorias del template están completas

## Constraints

- NEVER duplicar pasos detallados que ya estén en workflows canónicos.
- NEVER editar entradas previas de `.agents/memory/decisions.md`.
- NEVER introducir dependencias externas sin documentar y justificar.
