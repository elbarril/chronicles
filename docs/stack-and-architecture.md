# Stack Tecnológico y Arquitectura

Este documento es la **fuente de verdad** para decisiones técnicas estructurales de Chronicle.
Define el stack, la arquitectura de capas, los módulos principales y las convenciones de desarrollo.

Última actualización: 2026-04-18 (F1 implementada)

---

## 1. Alcance de la versión inicial (v1)

- **Forma de entrega:** Web app **local-first**, 100% cliente. Sin backend propio, sin cuentas, sin red obligatoria.
- **Persistencia:** Todos los datos se guardan en el navegador del usuario.
- **Flujo central:**
  1. El Practicante **define los campos** a observar (texto, número, selección, booleano, fecha, imagen, video, audio, archivo).
  2. Con esos campos se arma un **Formulario de Observación** reutilizable.
  3. Ese formulario se usa para cargar **Encuentros** (sesiones concretas de observación).
  4. A partir de los datos recolectados se podrán generar crónicas (fuera del alcance de v1 técnica, pero el modelo de datos lo contempla).

---

## 2. Principios que guían el stack

Heredan de `AGENTS.md`:

1. UX primero: accesibilidad, bajo fricción, interacciones predecibles.
2. Simplicidad antes que complejidad.
3. Rendimiento y eficiencia.
4. Mínimas dependencias externas, preferir soluciones autocontenidas y portables.

Traducido a tecnología:

- **Sin backend en v1**: reduce fricción operativa y dependencia de servicios externos.
- **Local-first real** con persistencia binaria nativa del navegador (IndexedDB) para soportar imagen/video/audio sin hacks.
- **Tipado fuerte** para minimizar bugs en un dominio con formularios dinámicos.
- **Stack mainstream** para maximizar mantenibilidad y disponibilidad de documentación actualizada.

---

## 3. Stack Tecnológico

| Capa | Elección | Justificación |
| ------ | ---------- | --------------- |
| Lenguaje | **TypeScript (strict)** | Contratos claros para formularios dinámicos y modelos de datos. |
| Build/Dev | **Vite** | Arranque rápido, zero-config, HMR, build moderno. |
| UI framework | **React 18+** | Ecosistema maduro, ideal para formularios dinámicos. |
| Routing | **React Router (data APIs)** | Navegación SPA estándar, loaders/actions se alinean con el modelo local. |
| Estilos | **Tailwind CSS** | Utility-first, responsive mobile-first, consistente con principios del usuario. |
| Componentes UI | **shadcn/ui + Radix UI** | Primitivas accesibles (ARIA correcto) sin atarnos a una librería monolítica. |
| Iconos | **lucide-react** | Liviano, tree-shakeable. |
| Formularios | **React Hook Form + Zod** | Performance, validación declarativa reutilizable entre runtime y tipos. |
| Persistencia local | **IndexedDB vía Dexie.js** | Maneja `Blob`/`File` nativo (imagen, video, audio), transacciones, índices. |
| Media captura | **MediaRecorder API + `<input type=file capture>`** | APIs del navegador, sin servicios externos. |
| PWA / offline | **vite-plugin-pwa (Workbox)** | App instalable y funcional sin conexión. |
| Testing unit | **Vitest + React Testing Library** | Integración nativa con Vite. |
| Testing E2E | **Playwright** | Cobre flujos críticos con navegador real. |
| Lint/format | **ESLint + Prettier** | Estándar, bajo mantenimiento. |
| Gestor de paquetes | **pnpm** | Rápido, determinístico, disk-efficient. |
| Node | **LTS actual (>= 20)** | Compatibilidad con toolchain moderna. |

### Dependencias explícitamente descartadas en v1

- **Ningún backend propio** (Node/Express/Nest/etc.): no aporta en v1 local-first.
- **Ningún BaaS** (Supabase, Firebase): viola el principio de mínimas dependencias externas.
- **Ningún state manager global** (Redux, Zustand): Dexie live queries + estado local de React alcanzan.
- **Ninguna UI kit pesada** (MUI, Chakra): shadcn + Tailwind ofrecen control total con menos peso.
- **Ningún ORM**: Dexie ya es la capa tipada sobre IndexedDB.

### Criterios para introducir nuevas dependencias

Cualquier dependencia nueva debe registrarse como decisión en `.agents/memory/decisions.md` y justificar:

1. Qué problema concreto resuelve que no podemos resolver con lo existente.
2. Impacto en tamaño de bundle y en el flujo offline.
3. Alternativa nativa considerada y por qué no alcanza.

---

## 4. Modelo de Dominio (conceptual)

Entidades núcleo (nombres canónicos, ver `.agents/memory/glossary.md`):

- **Institución**: contexto organizacional.
- **Grupo**: conjunto de Participantes.
- **Participante**: individuo observado.
- **Actividad**: tarea/ejercicio realizado por el Grupo.
- **Campo** *(nuevo)*: definición de un dato a capturar. Tipo + metadatos + validaciones.
- **Formulario de Observación** *(nuevo)*: conjunto ordenado de Campos que se instancia en cada Encuentro.
- **Encuentro**: ventana temporal concreta donde se aplica un Formulario a un Grupo.
- **Observación**: instancia de valores capturados para un Formulario dentro de un Encuentro (puede ser por Participante o grupal).
- **Crónica**: narrativa derivada de un conjunto de Observaciones.

### Tipos de Campo soportados en v1

`text` (corto) · `longText` · `number` · `boolean` · `singleChoice` · `multiChoice` · `date` · `time` · `datetime` · `image` · `video` · `audio` · `file` · `rating` · `location`

Cada Campo define base común: `id`, `key`, `label`, `type`, `required`, `helpText?`, `createdAt`, `updatedAt`, `archivedAt`.

Además define `config` tipado por variante (`discriminated union`) según `type`:

- choice (`singleChoice` / `multiChoice`): `options` (+ `minSelect?`, `maxSelect?` para multi)
- number/rating: restricciones de rango
- media (`image`/`video`/`audio`/`file`): `accept?`, `multiple?`
- date/time/datetime: límites opcionales
- text/longText: `maxLength?`

Los binarios (imagen/video/audio/archivo) se almacenan como `Blob` en una tabla dedicada y se referencian por `mediaId` desde la Observación, para no inflar los registros principales.

---

## 5. Arquitectura de la Aplicación

### 5.1 Vista en capas

```text
┌──────────────────────────────────────────────────────┐
│ UI (React + Tailwind + shadcn/ui)                    │
│  - Pantallas, componentes, routing                   │
├──────────────────────────────────────────────────────┤
│ Features (casos de uso por dominio)                  │
│  - field-definitions / forms / encounters /          │
│    observations / chronicles                         │
├──────────────────────────────────────────────────────┤
│ Dominio (tipos + schemas Zod)                        │
│  - Contratos puros, sin dependencia de UI ni DB      │
├──────────────────────────────────────────────────────┤
│ Infraestructura                                      │
│  - db/ (Dexie)  ·  media/ (Blob helpers)  ·          │
│    export/ (JSON/ZIP)  ·  pwa/                       │
└──────────────────────────────────────────────────────┘
```

Reglas de dependencia: UI → Features → Dominio ← Infraestructura. El Dominio no importa nada de UI ni de infraestructura.

### 5.2 Estructura de carpetas propuesta

```text
chronicle/
├─ docs/
│  └─ stack-and-architecture.md        # este documento
├─ public/
├─ src/
│  ├─ app/                              # shell, providers, router
│  │  ├─ router.tsx
│  │  ├─ layout.tsx
│  │  └─ providers.tsx
│  ├─ features/
│  │  ├─ field-definitions/             # CRUD de Campos
│  │  ├─ forms/                         # armado de Formularios de Observación
│  │  ├─ encounters/                    # sesiones concretas
│  │  ├─ observations/                  # captura de datos
│  │  └─ chronicles/                    # (stub en v1)
│  ├─ domain/
│  │  ├─ field.ts                       # tipos + schema Zod
│  │  ├─ form.ts
│  │  ├─ encounter.ts
│  │  └─ observation.ts
│  ├─ infra/
│  │  ├─ db/
│  │  │  ├─ schema.ts                   # tablas Dexie + versioning
│  │  │  ├─ client.ts                   # instancia única
│  │  │  └─ repositories/               # un archivo por entidad
│  │  ├─ media/
│  │  │  ├─ store.ts                    # guardar/leer Blobs
│  │  │  └─ record.ts                   # MediaRecorder helpers
│  │  ├─ export/
│  │  │  └─ zip.ts                      # export/import JSON + media
│  │  └─ pwa/
│  ├─ components/
│  │  └─ ui/                            # primitivas shadcn
│  ├─ hooks/
│  ├─ lib/                              # utilidades genéricas
│  ├─ styles/
│  │  └─ globals.css
│  └─ main.tsx
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ index.html
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
├─ vite.config.ts
├─ tailwind.config.ts
├─ playwright.config.ts
└─ .eslintrc / .prettierrc
```

### 5.3 Persistencia (Dexie / IndexedDB)

Tablas sugeridas (todas con `id` UUID v4 generado en cliente):

| Tabla | Campos principales | Notas |
| ------- | ------------------- | ------- |
| `institutions` | `id`, `name`, `createdAt` | |
| `groups` | `id`, `institutionId`, `name` | índice por `institutionId` |
| `participants` | `id`, `groupId`, `displayName` | índice por `groupId` |
| `fields` | `id`, `key`, `label`, `type`, `config`, `createdAt`, `updatedAt`, `archivedAt` | `config` es JSON tipado por tipo de campo; `archivedAt` usa string vacío para activos |
| `forms` | `id`, `name`, `fieldIds[]`, `version`, `archivedAt?` | `fieldIds` preserva orden |
| `encounters` | `id`, `groupId`, `formId`, `activity`, `startedAt`, `endedAt?` | |
| `observations` | `id`, `encounterId`, `participantId?`, `values`, `createdAt` | `values` mapea `fieldId → valor` o `fieldId → mediaId` |
| `media` | `id`, `mime`, `blob`, `size`, `createdAt` | tabla aparte para binarios |

**Versionado del schema:** cada cambio incrementa la versión en Dexie y registra migración. Se registra también en `decisions.md`.

**Live queries:** usar `dexie-react-hooks` (`useLiveQuery`) para reactividad sin state manager global.

### 5.4 Manejo de media

- Captura: `<input type="file" accept="image/*|video/*|audio/*" capture>` para flujo móvil rápido; `MediaRecorder` para grabación en línea.
- Almacenamiento: siempre como `Blob` en tabla `media`.
- Lectura: `URL.createObjectURL(blob)` con ciclo de vida controlado (revoke al desmontar).
- Export: ZIP con JSON de entidades + carpeta `media/` de binarios (vía `JSZip` si se agrega, decisión pendiente).

### 5.5 Rendering de formularios dinámicos

- Un **renderer** único mapea `field.type → componente` (tabla de despacho).
- Validación: construcción dinámica de schema Zod a partir de los `fields` del `form`.
- React Hook Form se configura con `zodResolver` dinámico por Encuentro.

### 5.6 PWA / Offline

- `vite-plugin-pwa` con estrategia `NetworkFirst` para navegación y `CacheFirst` para assets.
- Manifest instalable con íconos y nombre "Chronicle".
- Al ser local-first, offline es el caso normal, no la excepción.

### 5.7 Accesibilidad

- Componentes shadcn/Radix con ARIA correcto por defecto.
- Navegación completa por teclado obligatoria.
- Contraste AA mínimo; modo oscuro como variante desde el inicio.
- Targets táctiles ≥ 44px.

### 5.8 Testing

- **Unit (Vitest):** dominio puro (schemas Zod, reducers, helpers de media).
- **Integración:** repositorios Dexie contra `fake-indexeddb`.
- **E2E (Playwright):** flujos críticos — definir campos, armar formulario, crear encuentro, capturar observación con media, exportar.

### 5.9 Seguridad y privacidad

- Datos siempre en el dispositivo del usuario. Nada sale del navegador salvo export explícito.
- Export/Import como responsabilidad del usuario. Documentar en UI.
- Sin analytics de terceros en v1.

---

## 6. Roadmap técnico por fases

| Fase | Entregable | Criterios de salida |
| ------ | ----------- | --------------------- |
| **F0** | **Scaffolding: Vite + React + TS + Tailwind + shadcn + Dexie + router + PWA** | **Completada 2026-04-17** |
| **F1** | **CRUD de Campos** | **Completada 2026-04-18 (baseline): create/edit/archive/list, rutas `/campos*`, validación por tipo y tests unit/E2E** |
| F2 | Editor de Formularios de Observación | Componer, reordenar, versionar |
| F3 | Encuentros y captura de Observaciones (incluye media) | Flujo completo de una sesión |
| F4 | Export/Import (JSON + media) | Round-trip sin pérdida |
| F5 | Generación de Crónica (primer prototipo) | Plantilla básica a partir de observaciones |

Cada fase cierra ejecutando la skill `.agents/skills/phase-closeout/SKILL.md`, que registra decisiones, crea skills nuevas y actualiza toda la documentación.

---

## 7. Convenciones de desarrollo

- **Idioma:** código, tests y docs en inglés; UI y documentación funcional en español rioplatense.
- **Commits:** Conventional Commits.
- **Branches:** trunk-based; features cortas desde `main`.
- **CSS:** utilidades Tailwind; cuando haga falta CSS propio, BEM y variables CSS; sin `!important`.
- **HTML:** semántico siempre (`<button>`, `<a>`, `<main>`, etc.).
- **Componentes:** un archivo por componente; co-locar tests `*.test.tsx` al lado.
- **Imports:** todos al tope del archivo; alias `@/` hacia `src/`.
- **Errores:** nunca silenciar; superficie al usuario con mensaje accionable.
- **Performance:** lazy-load de rutas; evitar re-render innecesarios con `useLiveQuery` dirigido.

---

## 8. Protocolo de mantenimiento de este documento

Este documento debe mantenerse **actualizado** cuando:

1. Se agregue, reemplace o elimine una dependencia del stack.
2. Cambie la estructura de carpetas a alto nivel.
3. Cambie el modelo de dominio o el schema de persistencia.
4. Cambie la estrategia de offline, media o testing.

Protocolo obligatorio para agentes y humanos:

1. Proponer el cambio en conversación.
2. Registrar la decisión en `.agents/memory/decisions.md` (append-only).
3. Editar este documento reflejando el nuevo estado.
4. Si aparecen conceptos de dominio nuevos, actualizar `.agents/memory/glossary.md`.
5. Si cambia el stack al punto de afectar el bootstrap del agente, actualizar `AGENTS.md` y `.agents/README.md`.

Cambios triviales (typos, reordenamiento) no requieren entrada en `decisions.md`.
