# Prompt de Planning - Fase F1: CRUD de Campos

## Contexto del Proyecto

Chronicle es una aplicación web local-first para capturar observaciones de grupos en instituciones y generar crónicas narrativas.

**Estado actual**:

- F0 completada (scaffolding funcional)
- Stack base operativo: Vite + React + TypeScript, Tailwind + shadcn/ui, React Router, Dexie, PWA, Vitest + Playwright
- Fuente de verdad técnica: `docs/stack-and-architecture.md`

**Eje funcional de F1**:

- El Practicante debe poder **crear, editar y archivar Campos** que luego se usarán para componer Formularios de Observación.
- Deben soportarse todos los tipos definidos en arquitectura v1.

**Tipos de Campo soportados en v1** (sección 4 del documento canónico):

- `text`, `longText`, `number`, `boolean`, `singleChoice`, `multiChoice`, `date`, `time`, `datetime`, `image`, `video`, `audio`, `file`, `rating`, `location`

## Objetivo de la Fase F1

Planificar la implementación completa del módulo de **CRUD de Campos** para cumplir el criterio de salida de F1:

- Crear Campos con validación por tipo
- Editar Campos existentes sin romper datos previos
- Archivar Campos (soft delete) en lugar de borrado destructivo
- Listar y filtrar Campos con estados claros (activos/archivados)
- Cubrir flujo con tests unitarios, integración y E2E mínimo

## Tareas a Planificar

Planificá la implementación de los siguientes bloques en el orden que maximice entrega incremental con bajo riesgo:

1. **Alineación de dominio (`src/domain/field.ts`)**
   - Revisar/ajustar tipos y schema Zod de `Field`
   - Definir discriminación por `type` y `config` tipado por variante
   - Asegurar contratos para `required`, `helpText`, `options`, `min/max`, `accept`, `multiple`

2. **Persistencia y repositorio de Campos (`src/infra/db/repositories/`)**
   - Implementar operaciones CRUD orientadas a `fields`
   - Aplicar archivado por `archivedAt` (sin hard delete)
   - Definir índices/consultas necesarios para listado eficiente

3. **Casos de uso en feature `field-definitions`**
   - Crear estructura de módulo (componentes, hooks, servicios)
   - Definir funciones de caso de uso: create, update, archive, list
   - Separar lógica de dominio de la capa UI

4. **UI de listado de Campos**
   - Pantalla principal con tabla/lista accesible
   - Estados vacíos, loading, error
   - Acciones claras: crear, editar, archivar, ver archivados

5. **UI de alta/edición de Campo**
   - Formulario con React Hook Form + Zod
   - Render condicional de configuración según tipo de campo
   - Validaciones de negocio (ej. opciones obligatorias en choice, min/max consistentes)

6. **Navegación y routing**
   - Integrar rutas F1 en `src/app/router.tsx`
   - Definir rutas mínimas: listado, nuevo, edición
   - Garantizar navegación de retorno y feedback de acciones

7. **Accesibilidad y UX operativa**
   - Navegación por teclado en todo el flujo
   - Mensajes de error accionables
   - Confirmación explícita para archivar
   - Targets táctiles y semántica correcta (`button`, `label`, `fieldset` si aplica)

8. **Testing por capas**
   - Unit: schemas y reglas de mapeo por tipo
   - Integración: repositorio Dexie (`fake-indexeddb`)
   - E2E: crear campo, editar campo, archivar campo

9. **Criterios de cierre técnico**
   - `pnpm lint`, `pnpm test`, `pnpm test:e2e` en verde para alcance F1
   - Verificación manual de UX crítica

## Restricciones y Consideraciones

- **No cambiar el stack base** definido en `docs/stack-and-architecture.md` salvo justificación explícita
- **No introducir backend/BaaS/state manager global**
- **Mantener arquitectura en capas**: UI → Features → Dominio ← Infra
- **Aplicar local-first real**: operaciones funcionando sin red
- **Archivar en lugar de borrar** para preservar trazabilidad
- **Evitar complejidad innecesaria**: resolver F1 sin anticipar F2/F3 más de lo imprescindible
- **Idioma**: código/tests/docs técnicos en inglés; textos funcionales de UI en español rioplatense

## Entregable Esperado

Un plan detallado que incluya:

1. **Secuencia de implementación** por etapas con justificación
2. **Archivos concretos a crear/modificar** por etapa
3. **Contratos de datos** (tipos/interfaces/schemas) a tocar
4. **Comandos exactos** para instalar/verificar/ejecutar
5. **Checkpoints de validación** funcional y técnica
6. **Riesgos y mitigaciones** (consistencia de datos, migraciones futuras, UX)
7. **Estimación de esfuerzo** por bloque

## Criterio de Éxito del Plan

El plan debe ser:

- **Ejecutable**: sin ambigüedades para implementación
- **Completo**: cubre create, edit, archive y list
- **Testeable**: define cómo validar cada bloque
- **Consistente** con arquitectura y decisiones vigentes
- **Incremental**: permite entregar valor temprano

## Contexto Adicional

- Documento técnico canónico: `docs/stack-and-architecture.md`
- Estado del proyecto: `.agents/memory/project-context.md`
- Registro de decisiones: `.agents/memory/decisions.md`
- Principios globales y protocolo: `AGENTS.md`

---

**Instrucción**: Generá el plan de implementación de Fase F1 (CRUD de Campos) siguiendo este encuadre, priorizando simplicidad, UX y validabilidad.
