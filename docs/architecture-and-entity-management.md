# Arquitectura y Gestión de Entidades en Chronicles

**Fecha:** 2025-01-XX  
**Propósito:** Documentación completa de la arquitectura del sistema Chronicle para el mapeo de fichas de Excel MAE

---

## 1. Resumen Ejecutivo

Chronicle es una aplicación web local-first que permite a practicantes documentar encuentros que ya ocurrieron (fecha, hora, quiénes asistieron, qué se observó) y convertir esas observaciones en reportes narrativos estructurados (crónicas). El sistema utiliza IndexedDB a través de Dexie.js para la persistencia local de datos, con una arquitectura en capas que separa claramente el dominio, la infraestructura y las características del usuario.

---

## 2. Stack Tecnológico

### 2.1 Tecnologías Principales

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Lenguaje | TypeScript (strict) | Contratos claros para formularios dinámicos y modelos de datos |
| Build/Dev | Vite | Inicio rápido, zero-config, HMR |
| UI Framework | React 18+ | Ecosistema maduro, ideal para formularios dinámicos |
| Routing | React Router v7 | Navegación SPA estándar |
| Styling | Tailwind CSS v4 | Utility-first, mobile-first responsive |
| UI Components | shadcn/ui + Radix UI | Primitivos accesibles sin atarse a una librería monolítica |
| Persistencia Local | IndexedDB via Dexie.js | Maneja nativamente `Blob`/`File` (imagen, video, audio) |
| PWA / Offline | vite-plugin-pwa (Workbox) | App instalable funcional sin conexión |
| Testing | Vitest + React Testing Library + Playwright | Cobertura unitaria y E2E |
| ZIP Handling | JSZip | ZIP compatible con navegador para export/import con media |
| Package Manager | pnpm | Rápido, determinista, eficiente en disco |

### 2.2 Configuración de TypeScript

- `strict: true` — Todas las opciones de type-checking estrictas habilitadas
- `noUncheckedIndexedAccess: true` — Fuerza verificar undefined al acceder a arrays/objetos
- `noImplicitOverride: true` — Requiere `override` explícito al sobrescribir métodos
- `moduleDetection: "force"` — Fuerza TypeScript a tratar todos los archivos como módulos
- `moduleResolution: "bundler"` — Estrategia de resolución moderna
- `target: "ES2022"` — Features de JavaScript modernos
- `jsx: "react-jsx"` — Nuevo transform JSX (no necesita importar React)

---

## 3. Arquitectura en Capas

```
┌──────────────────────────────────────────────────────┐
│ UI (React + Tailwind + shadcn/ui)                    │
│  - Pages, components, routing                        │
├──────────────────────────────────────────────────────┤
│ Features (use cases by domain)                       │
│  - field-definitions / forms / encounters /          │
│    observations / chronicles                         │
├──────────────────────────────────────────────────────┤
│ Domain (types + Zod schemas)                         │
│  - Pure contracts, independent of UI or DB           │
├──────────────────────────────────────────────────────┤
│ Infrastructure                                       │
│  - db/ (Dexie)  ·  media/ (Blob helpers)  ·          │
│    export/ (JSON/ZIP)  ·  pwa/                       │
└──────────────────────────────────────────────────────┘
```

**Reglas de dependencia:** UI → Features → Domain ← Infrastructure. Domain no importa nada de UI o Infra.

---

## 4. Modelo de Dominio

### 4.1 Entidades Principales

| Entidad | Descripción | Archivo de Dominio |
|---------|-------------|-------------------|
| **Institution** | Contexto organizacional | - |
| **Project** | Conjunto de Participantes que participan en una secuencia de Encuentros. Reemplaza el concepto `Group` desde F9. | `src/domain/project.ts` |
| **Participant** | Individuo observado (perteneciente a un Project) | `src/domain/participant.ts` |
| **Field** | Definición de datos a capturar. Tipo + metadata + validaciones. Desde F11 no hay ruta dedicada — Fields se gestionan dentro del form-builder. | `src/domain/field.ts` |
| **FormFieldInstance** | Ocurrencia única de un Field dentro de un Form, con `instanceId` estable, `fieldId` referenciado, y `labelOverride` opcional. Múltiples instancias del mismo Field permitidas. | `src/domain/form.ts` |
| **Form (Observation Form)** | Lista ordenada de `FormFieldInstance`s. Cada Observation snapshot el form (`formId`/`formVersion`/`fields: FormFieldInstance[]`). | `src/domain/form.ts` |
| **Encounter** | Registro post-evento de una sesión que ya ocurrió, dentro de un Project (`name`, `startsAt`, `endsAt`, `participantIds[]`, `archivedAt?`). | `src/domain/encounter.ts` |
| **Observation** | Instancia de valores capturados para un Form específico dentro de un Encounter. `values` está keyeado por `instanceId`. | `src/domain/observation.ts` |
| **Chronicle** | Narrativa derivada de las Observaciones de un Encounter. Generada solo en `/encounters/:id/chronicle`. | `src/domain/chronicle.ts` |

### 4.2 Tipos de Campos Soportados

```
text · longText · number · boolean · singleChoice · multiChoice · 
date · time · datetime · image · video · audio · file · rating · location
```

### 4.3 Estructura de Field

**Campos base comunes:**
- `id`: UUID v4
- `key`: Identificador único (snake_case)
- `label`: Etiqueta visible
- `type`: Tipo de campo
- `required`: Booleano
- `helpText?`: Texto de ayuda opcional
- `createdAt`: ISO datetime
- `updatedAt`: ISO datetime
- `archivedAt`: "" (activo) o ISO datetime (archivado)

**Configuración por tipo (discriminated union):**

| Tipo | Config |
|------|--------|
| `text` / `longText` | `maxLength?` |
| `number` | `min?`, `max?` |
| `rating` | `min`, `max`, `step?` |
| `singleChoice` | `options: string[]` |
| `multiChoice` | `options: string[]`, `minSelect?`, `maxSelect?` |
| `date` / `time` / `datetime` | `min?`, `max?` |
| `image` / `video` / `audio` / `file` | `accept?`, `multiple?`, `transcriptionEnabled?`, `transcriptionTargetFieldId?` |
| `boolean` | `{}` (vacío) |
| `location` | `{}` (vacío) |

### 4.4 Estructura de FormFieldInstance

```typescript
{
  instanceId: string;        // UUID v4 estable
  fieldId: string;           // Referencia al Field
  labelOverride?: string;    // Etiqueta personalizada opcional
}
```

**Características clave:**
- El mismo `fieldId` puede aparecer múltiples veces en un Form
- Cada aparición tiene su propio `instanceId` único
- `labelOverride` reemplaza `Field.label` cuando está presente
- Las observaciones keyean valores por `instanceId`, no por `fieldId`

### 4.5 Estructura de ObservationForm

```typescript
{
  id: string;                          // UUID v4
  name: string;                       // Nombre del formulario
  fields: FormFieldInstance[];         // Lista ordenada de instancias
  version: number;                     // Auto-incrementa en updates
  createdAt: string;                  // ISO datetime
  updatedAt: string;                  // ISO datetime
  archivedAt?: "" | string;           // "" = activo
}
```

### 4.6 Estructura de Observation

```typescript
{
  id: string;                          // UUID v4
  encounterId: string;                // Referencia al Encounter
  formId: string;                      // Form usado
  formVersion: number;                 // Versión del form al crear
  fields: FormFieldInstance[];         // Snapshot del form
  participantId?: string;             // Participante opcional
  title?: string;                      // Título opcional
  values: Record<string, ObservationValue>;  // Keyeado por instanceId
  createdAt: string;                  // ISO datetime
}
```

**Tipos de ObservationValue:**
- `string` (text, longText, date, time, datetime, location)
- `number` (number, rating)
- `boolean` (boolean)
- `string[]` (multiChoice)
- `{ mediaId: string }` (media single)
- `{ mediaIds: string[] }` (media multiple)

### 4.7 Estructura de Encounter

```typescript
{
  id: string;                          // UUID v4
  projectId: string;                  // Referencia al Project
  name: string;                        // Nombre del encuentro
  startsAt: string;                    // ISO datetime
  endsAt: string;                      // ISO datetime
  participantIds: string[];            // Subset de project participants
  archivedAt?: "" | string;           // "" = activo
  createdAt: string;                  // ISO datetime
  updatedAt: string;                  // ISO datetime
}
```

**Validaciones:**
- `endsAt >= startsAt`
- `participantIds` debe tener al menos 1 elemento
- `participantIds` deben ser únicos

### 4.8 Estructura de Project

```typescript
{
  id: string;                          // UUID v4
  institutionId: string;               // Institución (default fijo)
  name: string;                        // Nombre del proyecto
  createdAt: string;                  // ISO datetime
  updatedAt: string;                  // ISO datetime
  archivedAt?: "" | string;           // "" = activo
}
```

### 4.9 Estructura de Participant

```typescript
{
  id: string;                          // UUID v4
  projectId: string;                   // Referencia al Project
  displayName: string;                 // Nombre visible
  createdAt: string;                  // ISO datetime
  updatedAt: string;                  // ISO datetime
  archivedAt?: "" | string;           // "" = activo
}
```

### 4.10 Estructura de Chronicle

```typescript
{
  id: string;                          // UUID v4
  encounterId: string;                 // Referencia al Encounter
  title: string;                       // Título de la crónica
  body: string;                        // Cuerpo narrativo
  generatedAt: string;                // ISO datetime
  createdAt: string;                  // ISO datetime
  updatedAt: string;                  // ISO datetime
  generatedWith?: "deterministic" | "gemini";  // Método de generación
  inputHash?: string;                  // SHA-256 fingerprint (solo Gemini)
}
```

---

## 5. Persistencia (Dexie / IndexedDB)

### 5.1 Schema de Base de Datos (Versión 8)

| Tabla | Índices | Descripción |
|-------|---------|-------------|
| `institutions` | `id, name, createdAt` | Contexto organizacional |
| `projects` | `id, institutionId, name, archivedAt, createdAt` | Proyectos |
| `participants` | `id, projectId, displayName, archivedAt, createdAt` | Participantes |
| `fields` | `id, key, type, archivedAt, createdAt` | Definiciones de campos |
| `forms` | `id, name, version, archivedAt, createdAt` | Formularios de observación |
| `encounters` | `id, projectId, startsAt, archivedAt, createdAt` | Encuentros |
| `observations` | `id, encounterId, formId, participantId, createdAt` | Observaciones |
| `media` | `id, mime, createdAt` | Archivos binarios (Blob) |
| `chronicles` | `id, encounterId, generatedAt, createdAt` | Crónicas |

### 5.2 Historia de Migraciones

- **v2-v6:** Versiones históricas con modelo `Group` (reemplazado por `Project` en v7)
- **v7 (F9):** Hard reset de participants, encounters, observations, chronicles. Drop de tabla `groups`. Introducción de `Project`.
- **v8 (F11):** Hard reset de forms, observations, chronicles, media. Cambio de `fieldIds: string[]` a `fields: FormFieldInstance[]` en forms. Re-key de `values` por `instanceId` en observations.

### 5.3 Live Queries

El sistema usa `dexie-react-hooks` (`useLiveQuery`) para reactividad sin un state manager global.

---

## 6. Repositorios y Servicios

### 6.1 Field Repository (`src/infra/db/repositories/field-repository.ts`)

**Operaciones:**
- `createField(data: FieldFormInput): Promise<Field>`
- `updateField(id, data): Promise<Field | null>`
- `archiveField(id): Promise<boolean>`
- `restoreField(id): Promise<boolean>`
- `getFieldById(id): Promise<Field | undefined>`
- `listFieldsByIds(fieldIds[]): Promise<Field[]>`
- `listActiveFields(): Promise<Field[]>`
- `listArchivedFields(): Promise<Field[]>`
- `isFieldKeyUnique(key, excludeId?): Promise<boolean>`
- `deleteField(id): Promise<boolean>` (solo si está archivado)

### 6.2 Form Repository (`src/infra/db/repositories/form-repository.ts`)

**Operaciones:**
- `createForm(data: ObservationFormInput): Promise<ObservationForm>`
- `updateForm(id, data): Promise<ObservationForm | null>`
- `archiveForm(id): Promise<boolean>`
- `restoreForm(id): Promise<boolean>`
- `getFormById(id): Promise<ObservationForm | undefined>`
- `listActiveForms(): Promise<ObservationForm[]>`
- `listArchivedForms(): Promise<ObservationForm[]>`
- `isFormNameUnique(name, excludeId?): Promise<boolean>`
- `deleteFormCascade(id): Promise<boolean>` (borra form + observations + media)

**Función clave: `resolveInstances`**
```typescript
function resolveInstances(inputFields: ObservationFormInput["fields"]): FormFieldInstance[] {
  return inputFields.map((entry) => ({
    instanceId: entry.instanceId ?? crypto.randomUUID(),
    fieldId: entry.fieldId,
    ...(entry.labelOverride !== undefined ? { labelOverride: entry.labelOverride } : {}),
  }));
}
```

### 6.3 Observation Repository (`src/infra/db/repositories/observation-repository.ts`)

**Operaciones:**
- `createObservation(data): Promise<Observation>`
- `updateObservation(id, data): Promise<Observation | null>`
- `deleteObservation(id): Promise<boolean>`
- `getObservationById(id): Promise<Observation | undefined>`
- `listObservationsByEncounter(encounterId): Promise<Observation[]>`

### 6.4 Project Repository (`src/infra/db/repositories/project-repository.ts`)

**Operaciones:**
- `createProjectWithParticipants(input): Promise<{project, participants}>`
- `updateProjectWithParticipants(projectId, input): Promise<{project, participants} | null>`
- `archiveProject(projectId): Promise<boolean>`
- `restoreProject(projectId): Promise<boolean>`
- `getProjectById(projectId): Promise<Project | undefined>`
- `listParticipantsByProject(projectId): Promise<Participant[]>`
- `listActiveProjects(): Promise<Project[]>`
- `listArchivedProjects(): Promise<Project[]>`
- `isProjectNameUnique(name, excludeId?): Promise<boolean>`
- `deleteProjectCascade(projectId): Promise<boolean>` (borra en cascada)

**Función clave: Diff-based update**
```typescript
// Preserva IDs estables de participantes existentes
// Crea nuevos IDs para filas nuevas
// Hard-delete filas removidas
// Esto mantiene encounter.participantIds válido across edits
```

### 6.5 Encounter Repository (`src/infra/db/repositories/encounter-repository.ts`)

**Operaciones:**
- `createEncounter(data): Promise<Encounter>`
- `updateEncounter(id, data): Promise<Encounter | null>`
- `getEncounterById(id): Promise<Encounter | undefined>`
- `listActiveEncountersByProject(projectId): Promise<Encounter[]>`
- `listArchivedEncountersByProject(projectId): Promise<Encounter[]>`
- `archiveEncounter(id): Promise<Encounter | null>`
- `restoreEncounter(id): Promise<Encounter | null>`
- `listEncountersByProject(projectId): Promise<Encounter[]>`
- `listAllActiveEncounters(): Promise<Encounter[]>`
- `deleteEncounterCascade(encounterId): Promise<boolean>` (borra en cascada)

### 6.6 Defaults Service (`src/features/defaults/services/defaults-service.ts`)

**Operaciones:**
- `restoreDefaultFields(): Promise<RestoreOutcome>` — Restaura campos por defecto (audio + longText)
- `restoreDefaultForm(): Promise<RestoreOutcome & {fields}>` — Restaura formulario por defecto
- `seedDemoEncounter(): Promise<DemoEncounterOutcome>` — Crea encuentro de prueba completo
- `removeDemoEncounter(): Promise<DemoEncounterRemovalOutcome>` — Elimina encuentro de prueba
- `seedDefaultsIfMissing(): Promise<void>` — Seed inicial al boot

**IDs Estables:**
- `DEFAULT_AUDIO_FIELD_ID`: "00000000-0000-4000-8000-00000000d001"
- `DEFAULT_LONG_TEXT_FIELD_ID`: "00000000-0000-4000-8000-00000000d002"
- `DEFAULT_FORM_ID`: "00000000-0000-4000-8000-00000000d101"

---

## 7. Validación con Zod

### 7.1 Schemas de Dominio

Cada entidad tiene:
1. **Schema completo** (con timestamps, IDs) para validación de datos persistidos
2. **Schema de input** (sin timestamps, IDs generados por el servicio) para formularios de creación/edición

### 7.2 Validación Dinámica de Valores

`buildFieldValueSchema(field: Field)` construye dinámicamente un schema Zod para validar valores de observación según el tipo de campo:

```typescript
switch (field.type) {
  case "text":
    return maybeOptional(z.string().max(field.config.maxLength));
  case "number":
    return maybeOptional(z.number().min(field.config.min).max(field.config.max));
  case "singleChoice":
    return maybeOptional(z.string().refine(value => field.config.options.includes(value)));
  // ... etc para cada tipo
}
```

---

## 8. Flujo de Datos Principal

### 8.1 Creación de Formularios

1. Practitioner crea Fields (desde el form-builder)
2. Practitioner compone Form con FormFieldInstances
3. Cada instancia tiene `instanceId` único y opcional `labelOverride`
4. Form version auto-incrementa en cada update
5. Form se archiva/restaura según necesidad

### 8.2 Creación de Proyectos

1. Practitioner crea Project con nombre
2. Practitioner agrega Participants (displayName)
3. Cada Participant tiene ID estable
4. Edición de proyecto usa diff-based update para preservar IDs

### 8.3 Registro de Encuentros

1. Practitioner crea Encounter post-evento
2. Especifica: nombre, start/end time, participantIds (subset del proyecto)
3. Encounter se puede archivar/restaurar (no hay estado "in progress")

### 8.4 Captura de Observaciones

1. Practitioner selecciona Form para la observación
2. Observation snapshot: `formId`, `formVersion`, `fields: FormFieldInstance[]`
3. Valores capturados keyeados por `instanceId` (no `fieldId`)
4. Media se almacena como Blob en tabla `media`, referenciado por `mediaId`
5. Observación opcionalmente asociada a un Participant

### 8.5 Generación de Crónicas

1. Practitioner navega a `/encounters/:id/chronicle`
2. Servicio genera narrativa desde observations del encounter
3. Por defecto: generación determinista
4. Opcional: generación con Gemini AI (BYOK)
5. Chronicle se upserta por `encounterId` (una crónica por encuentro)

---

## 9. Manejo de Media

### 9.1 Captura

- `<input type="file" accept="image/*|video/*|audio/*" capture>` para flujo móvil rápido
- `MediaRecorder` API para grabación en línea

### 9.2 Almacenamiento

- Siempre como `Blob` en tabla `media`
- Schema: `{id, mime, blob, size, createdAt}`
- Referenciado desde `Observation.values` como `{mediaId}` o `{mediaIds}`

### 9.3 Ciclo de Vida

- Media se crea cuando se carga en observation
- Media se elimina en cascada cuando se borra observation/form/encounter/project
- Export/Export incluye media en ZIP como carpeta `media/`

---

## 10. Export/Import

### 10.1 Export (Global)

- Ruta: `/settings`
- Schema: `chronicle-full-v3`
- Contenido: todas las tablas + media blobs + brand color + author name
- Nombre default: `chronicle-{slug(name)}-{YYYY-MM-DD}.zip`

### 10.2 Import (Global)

- Ruta: `/settings`
- Acepta solo `chronicle-full-v3`
- Legacy schemas (v1, v2, encounter-v1) rechazados con `IMPORT_SCHEMA_MISMATCH`
- Upsert por ID de todas las entidades

---

## 11. Convenciones de Desarrollo

### 11.1 Idioma

- **Internal (código, commits, docs):** Inglés
- **User-facing (UI, toasts, conversación):** Español rioplatense

### 11.2 Commits

- Conventional Commits (Inglés)
- Ejemplo: `feat(forms): add field instance duplication`

### 11.3 Branches

- Trunk-based
- Features de corta duración desde `main`

### 11.4 Componentes

- Un archivo por componente
- Tests co-ubicados: `*.test.tsx` junto al componente

### 11.5 Imports

- Todos al tope del archivo
- Alias `@/` a `src/`

### 11.6 Errores

- Nunca silenciar errores
- Superficial al usuario con `AppError` (código en inglés) + mensajes en español

---

## 12. Testing

### 12.1 Unit (Vitest)

- Dominio puro: schemas Zod, reducers, helpers de media

### 12.2 Integration

- Repositorios Dexie contra `fake-indexeddb`

### 12.3 E2E (Playwright)

- Flows críticos: definir campos, armar form, crear encounter, capturar observation con media, export, import

---

## 13. PWA / Offline

- `vite-plugin-pwa` con estrategia `NetworkFirst` para navegación
- `CacheFirst` para assets
- Manifest instalable con nombre "Chronicle"
- Local-first: offline es el caso normal, no la excepción

---

## 14. Accesibilidad

- shadcn/Radix con ARIA por defecto
- Navegación por teclado obligatoria
- Contraste AA mínimo
- Dark mode soportado desde el inicio
- Touch targets ≥ 44px

---

## 15. Consideraciones para Mapeo de Fichas Excel

### 15.1 Campos de Excel a Fields

Los campos de las fichas Excel deberán mapearse a:
- **Field** (definición del tipo de dato)
- **FormFieldInstance** (ocurrencia dentro de un Form)

### 15.2 Estructura de Ficha a Form

Cada ficha Excel (observación/evaluación) se convertirá en:
- **Un Form** con múltiples FormFieldInstances
- Cada sección de la ficha podría ser un grupo lógico (no hay soporte nativo de grupos en Forms, pero se puede simular con `labelOverride`)

### 15.3 Tipos de Datos Soportados

Los tipos de campos de Excel deberán mapearse a los tipos de Field soportados:
- Texto corto → `text`
- Texto largo → `longText`
- Numérico → `number`
- Sí/No → `boolean`
- Selección única → `singleChoice`
- Selección múltiple → `multiChoice`
- Fecha → `date`
- Hora → `time`
- Fecha y hora → `datetime`
- Imagen → `image`
- Video → `video`
- Audio → `audio`
- Archivo → `file`
- Escala/Calificación → `rating`
- Ubicación → `location`

### 15.4 Validaciones

Las validaciones de Excel deberán mapearse a:
- `required` → Campo obligatorio
- `maxLength` → Longitud máxima para text/longText
- `min/max` → Rango para number/rating
- `options` → Lista de opciones para choice
- `minSelect/maxSelect` → Mínimo/máximo selecciones para multiChoice

### 15.5 Relaciones

- Si la ficha tiene campos que dependen de otros, considerar usar `labelOverride` para claridad
- Si hay secciones repetitivas (ej: "Foto antes", "Foto después"), usar múltiples instancias del mismo Field con diferentes `labelOverride`

### 15.6 Seed de Formularios por Defecto

Los formularios basados en las fichas Excel deberán:
- Crearse como parte del seed de defaults (`src/features/defaults/lib/seed-data.ts`)
- Tener IDs estables (UUIDs predefinidos)
- Incluirse en `restoreDefaultForm()` o una función similar
- Ser cargados automáticamente al primer inicio de la app

---

## 16. Próximos Pasos para Integración de Fichas Excel

1. **Analizar estructura de fichas Excel** (requiere acceso a contenido de archivos)
2. **Mapear campos de Excel a Fields** con tipos y configuraciones apropiadas
3. **Crear FormFieldInstances** para cada campo de la ficha
4. **Definir estructura de Forms** (observación vs evaluación)
5. **Implementar seed data** con IDs estables
6. **Actualizar service de defaults** para cargar nuevos forms
7. **Validar mapeo** con tests unitarios y E2E
8. **Documentar mapeo** en glosario y decisions.md

---

## 17. Referencias

- `docs/stack-and-architecture.md` — Documentación completa de stack y arquitectura
- `.agents/memory/glossary.md` — Glosario de términos del dominio
- `src/domain/*.ts` — Definiciones de tipos y schemas Zod
- `src/infra/db/repositories/*.ts` — Implementaciones de repositorios
- `src/features/defaults/lib/seed-data.ts` — Datos de seed por defecto
- `src/features/defaults/services/defaults-service.ts` — Servicio de defaults

---

**Fin del documento**