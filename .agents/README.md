# Índice Operativo de `.agents/`

Este directorio concentra la infraestructura de trabajo con agentes para Chronicle y funciona como capa tool-agnostic para IDEs, CLIs y trabajo humano.

## Mapa de Archivos

|Ruta|Rol|Cuándo leerlo o editarlo|
|---|---|---|
|`memory/project-context.md`|Contexto vigente del proyecto|Al iniciar cualquier sesión o antes de definir alcance técnico|
|`memory/decisions.md`|Log append-only de decisiones|Antes de implementar y después de decisiones significativas|
|`memory/glossary.md`|Vocabulario canónico de dominio|Al nombrar entidades, campos o documentación funcional|
|`templates/skill.template.md`|Plantilla para nuevas skills|Cuando se crea una skill en `skills/`|
|`templates/workflow.template.md`|Plantilla para nuevos workflows|Cuando se crea un workflow en `workflows/`|
|`templates/memory.template.md`|Plantilla base de memoria|Cuando se crea un archivo nuevo en `memory/`|
|`skills/agent-workspace-manager/SKILL.md`|Skill de gobernanza de `.agents/`|Cuando una tarea crea o modifica skills, workflows o memoria|
|`skills/phase-closeout/SKILL.md`|Cierre de fase: audita lo construido, crea skills y dispara actualización de docs|Al completar una fase del roadmap (F0, F1, ...)|
|`skills/update-project-docs/SKILL.md`|Actualización consistente de toda la documentación del proyecto|Cuando cambia stack, dominio, estructura o se cierra una fase|
|`workflows/create-skill.md`|Runbook para crear skills|Al dar de alta una capacidad nueva|
|`workflows/create-workflow.md`|Runbook para crear workflows|Al convertir una tarea repetible en proceso formal|
|`workflows/update-memory.md`|Runbook para actualizar memoria|Al registrar contexto, decisiones o cambios terminológicos|

## Referencias fuera de `.agents/`

- `../docs/stack-and-architecture.md`: fuente de verdad del stack, arquitectura en capas, modelo de dominio y convenciones de código. Lectura obligatoria cuando la tarea toca stack, persistencia, estructura de carpetas o dominio. Mantenimiento según su sección 8.

## Protocolo de Encuentro

1. Leer `../AGENTS.md` para reglas globales de comportamiento.
2. Restaurar contexto con `memory/project-context.md` y `memory/decisions.md`.
3. Si la tarea toca stack o arquitectura, leer `../docs/stack-and-architecture.md`.
4. Si la tarea afecta `.agents/`, delegar ejecución a `skills/agent-workspace-manager/SKILL.md`.

## Interoperabilidad

- **Windsurf/Cascade:** usa `AGENTS.md`, `/.windsurf/rules/` y slash workflows en `/.windsurf/workflows/`.
- **Cursor:** usa `AGENTS.md` y `/.cursor/rules/agents.mdc` con aplicación automática.
- **Claude Code:** usa `AGENTS.md` por convención sin archivo puente adicional.
- **Codex CLI / Aider / Jules:** usan `AGENTS.md` como instrucción raíz cuando respetan la convención.
- **Contribuidores humanos:** usar este índice como mapa operativo y `decisions.md` como registro histórico.
