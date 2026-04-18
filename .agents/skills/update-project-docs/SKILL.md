# Update Project Docs

## Description

Actualiza toda la documentación del proyecto de forma consistente y sin duplicación, cubriendo tanto la capa técnica como la de agentes y la de usuarios.

## Trigger Conditions

Usar esta skill cuando:

- Se completa una fase de implementación (invocada desde `phase-closeout`).
- Se introduce una dependencia nueva, un cambio de arquitectura o un concepto de dominio nuevo.
- Se modifica la estructura de carpetas del proyecto a alto nivel.
- Cualquier otra skill indica que la documentación debe actualizarse.
- El usuario pide explícitamente actualizar o sincronizar la documentación.

## Prerequisites

- El agente debe haber leído `AGENTS.md`, `.agents/memory/project-context.md` y `docs/stack-and-architecture.md`.
- Los cambios de código que motivan la actualización deben estar implementados.

## Steps

### 1. Recopilar cambios

Identificar qué cambió desde la última actualización de documentación:

- Dependencias nuevas o eliminadas en `package.json`.
- Archivos/carpetas creados o reorganizados.
- Entidades o conceptos de dominio nuevos o renombrados.
- Patrones técnicos nuevos (routing, persistencia, testing, etc.).
- Configuraciones o scripts nuevos.

### 2. Actualizar `docs/stack-and-architecture.md`

Seguir el protocolo de la sección 8 del documento:

1. **Sección 3 (Stack):** agregar filas si hay dependencias nuevas; actualizar si cambió alguna versión.
2. **Sección 4 (Dominio):** agregar entidades o tipos nuevos; actualizar esquemas.
3. **Sección 5.2 (Estructura de carpetas):** reflejar carpetas nuevas o reorganizadas.
4. **Sección 5.3 (Persistencia):** actualizar tablas si cambió el schema Dexie.
5. **Sección 6 (Roadmap):** marcar la fase actual como completada si corresponde.
6. **Sección 7 (Convenciones):** agregar convenciones nuevas si se establecieron.
7. Actualizar la fecha de "Última actualización" al inicio del documento.

### 3. Actualizar `.agents/memory/project-context.md`

Usando el workflow `.agents/workflows/update-memory.md`:

- Actualizar la fila **Estado** con la fase recién completada y la fecha.
- Actualizar **Stack Técnico** si cambió.
- Mantener conciso — este archivo es el contexto que los agentes leen en cada sesión.

### 4. Registrar en `.agents/memory/decisions.md`

Usando el workflow `.agents/workflows/update-memory.md`:

- Agregar una entrada append-only con el formato estándar.
- Incluir: qué fase se completó, qué se construyó, qué decisiones técnicas se tomaron.
- Si hubo desvíos del plan original, documentarlos explícitamente.

### 5. Actualizar `.agents/memory/glossary.md`

Usando el workflow `.agents/workflows/update-memory.md`:

- Agregar términos nuevos en orden alfabético.
- Si se redefinió un término existente, registrar el cambio primero en `decisions.md`.

### 6. Actualizar `README.md`

Si la fase agregó:

- Comandos nuevos → actualizar la sección "Comandos".
- Requisitos nuevos → actualizar la sección "Requisitos".
- Flujos de uso nuevos → agregar sección o expandir la descripción.

### 7. Actualizar `.agents/README.md`

Si se crearon skills o workflows nuevos:

- Agregar filas en la tabla "Mapa de Archivos".
- Mantener el formato existente.

### 8. Verificar consistencia cruzada

Checklist:

- [ ] Las fechas de `project-context.md` y `stack-and-architecture.md` coinciden.
- [ ] Los términos del glosario se usan de forma consistente en todos los documentos.
- [ ] No hay información contradictoria entre `project-context.md` y `stack-and-architecture.md`.
- [ ] `decisions.md` tiene registro de todos los cambios significativos.
- [ ] No se duplicó información entre documentos — cada uno tiene su responsabilidad.

### 9. Resumen para el usuario

Producir un resumen breve de todos los documentos actualizados y los cambios realizados en cada uno.

## Responsibility Matrix

Cada documento tiene un rol claro. No duplicar información entre ellos:

| Documento | Responsabilidad | Audiencia |
|-----------|----------------|-----------|
| `docs/stack-and-architecture.md` | Fuente de verdad técnica: stack, arquitectura, dominio, convenciones | Agentes y humanos desarrolladores |
| `.agents/memory/project-context.md` | Estado actual conciso del proyecto | Agentes al iniciar sesión |
| `.agents/memory/decisions.md` | Log histórico de decisiones | Agentes y humanos para traceabilidad |
| `.agents/memory/glossary.md` | Vocabulario canónico de dominio | Agentes y humanos para consistencia |
| `README.md` | Guía de inicio rápido y comandos | Usuarios y contribuidores humanos |
| `.agents/README.md` | Índice operativo del workspace de agentes | Agentes |
| `AGENTS.md` | Principios globales y bootstrap | Todos |

## Outputs

- Documentos actualizados.
- Entrada en `decisions.md`.
- Resumen de cambios para el usuario.

## Constraints

- NEVER editar entradas previas de `decisions.md`.
- NEVER duplicar información entre documentos — respetar la Responsibility Matrix.
- NEVER actualizar `docs/stack-and-architecture.md` sin seguir su protocolo de sección 8.
- NEVER omitir el checklist de consistencia cruzada.
- NEVER hacer commits automáticos — proponer al usuario.

## AGENTS.md Compliance

- Garantiza que `docs/stack-and-architecture.md` se mantiene sincronizado (sección 8 del propio documento).
- Respeta `decisions.md` como log append-only.
- Mantiene `project-context.md` conciso para bootstrap de sesión.
- Usa los workflows canónicos de `.agents/workflows/` para cada tipo de actualización.
