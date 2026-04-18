# Technology Stack and Architecture

This document is the **source of truth** for structural technical decisions of Chronicle.
It defines the stack, layered architecture, main modules, and development conventions.

Last updated: 2026-04-18 (F1 implemented, language policy refactored)

---

## 1. Scope of Initial Version (v1)

- **Delivery format:** **Local-first** web app, 100% client-side. No custom backend, no accounts, no mandatory network.
- **Persistence:** All data is saved in the user's browser.
- **Core flow:**
  1. The Practitioner **defines fields** to observe (text, number, choice, boolean, date, image, video, audio, file).
  2. With these fields, a reusable **Observation Form** is composed.
  3. That form is used to record **Encounters** (concrete observation sessions).
  4. From the collected data, chronicles can be generated (out of scope for v1 tech, but supported by the data model).

---

## 2. Principles Guiding the Stack

Inherited from `AGENTS.md`:

1. UX first: accessibility, low friction, predictable interactions.
2. Simplicity over complexity.
3. Performance and efficiency.
4. Minimal external dependencies, preferring self-contained and portable solutions.

Translated to technology:

- **No backend in v1**: reduces operational friction and reliance on external services.
- **True local-first** with native browser binary persistence (IndexedDB) to support image/video/audio without hacks.
- **Strong typing** to minimize bugs in a domain with dynamic forms.
- **Mainstream stack** to maximize maintainability and availability of updated documentation.

---

## 3. Technology Stack

| Layer | Choice | Justification |
| ------ | ---------- | --------------- |
| Language | **TypeScript (strict)** | Clear contracts for dynamic forms and data models. |
| Build/Dev | **Vite** | Fast startup, zero-config, HMR, modern build. |
| UI Framework | **React 18+** | Mature ecosystem, ideal for dynamic forms. |
| Routing | **React Router (data APIs)** | Standard SPA navigation, loaders/actions align with local model. |
| Styling | **Tailwind CSS** | Utility-first, mobile-first responsive, consistent with user principles. |
| UI Components | **shadcn/ui + Radix UI** | Accessible primitives (proper ARIA) without tying to a monolithic library. |
| Icons | **lucide-react** | Lightweight, tree-shakeable. |
| Toast Notifications | **sonner** | Lightweight, accessible toast system for user-facing feedback messages. |
| Forms | **React Hook Form + Zod** | Performance, reusable declarative validation between runtime and types. |
| Local Persistence| **IndexedDB via Dexie.js** | Handles native `Blob`/`File` (image, video, audio), transactions, indices. |
| Media Capture | **MediaRecorder API + `<input type=file capture>`** | Browser APIs, no external services. |
| PWA / Offline | **vite-plugin-pwa (Workbox)** | Installable app functional without connection. |
| Unit Testing | **Vitest + React Testing Library** | Native integration with Vite. |
| E2E Testing | **Playwright** | Covers critical flows with a real browser. |
| Lint/Format | **ESLint + Prettier** | Standard, low maintenance. |
| Package Manager| **pnpm** | Fast, deterministic, disk-efficient. |
| Node | **Current LTS (>= 20)** | Compatibility with modern toolchain. |

### Explicitly Discarded Dependencies in v1

- **No custom backend** (Node/Express/Nest/etc.): adds no value in local-first v1.
- **No BaaS** (Supabase, Firebase): violates minimal external dependencies principle.
- **No global state manager** (Redux, Zustand): Dexie live queries + React local state suffice.
- **No heavy UI kit** (MUI, Chakra): shadcn + Tailwind offer total control with less weight.
- **No ORM**: Dexie is already the typed layer over IndexedDB.

### Criteria for Introducing New Dependencies

Any new dependency must be recorded as a decision in `.agents/memory/decisions.md` and justify:

1. What concrete problem it solves that cannot be resolved with existing stack.
2. Impact on bundle size and offline flow.
3. Native alternative considered and why it falls short.

---

## 4. Domain Model (Conceptual)

Core entities (canonical names, see `.agents/memory/glossary.md`):

- **Institution**: organizational context.
- **Group**: set of Participants.
- **Participant**: observed individual.
- **Activity**: task/exercise performed by the Group.
- **Field**: definition of data to capture. Type + metadata + validations.
- **Form (Observation Form)**: ordered set of Fields instantiated in each Encounter.
- **Encounter**: concrete time window where a Form is applied to a Group.
- **Observation**: instance of captured values for a Form within an Encounter.
- **Chronicle**: narrative derived from a set of Observations.

### Field Types Supported in v1

`text` (short) · `longText` · `number` · `boolean` · `singleChoice` · `multiChoice` · `date` · `time` · `datetime` · `image` · `video` · `audio` · `file` · `rating` · `location`

Each Field defines a common base: `id`, `key`, `label`, `type`, `required`, `helpText?`, `createdAt`, `updatedAt`, `archivedAt`.

`fieldFormSchema` (input variant without `id`/timestamps) is the form input schema used for create/edit forms; the derived type is `FieldFormInput`. `buildFieldValueSchema(field: Field)` dynamically constructs a Zod schema to validate captured observation values per field type — it is the core of the dynamic form renderer in F2+.

It also defines a typed `config` per variant (`discriminated union`) according to `type`:

- choice (`singleChoice` / `multiChoice`): `options` (+ `minSelect?`, `maxSelect?` for multi)
- number/rating: range restrictions
- media (`image`/`video`/`audio`/`file`): `accept?`, `multiple?`
- date/time/datetime: optional limits
- text/longText: `maxLength?`

Binaries (image/video/audio/file) are stored as `Blob`s in a dedicated table and referenced by `mediaId` from the Observation to keep main records lightweight.

---

## 5. Application Architecture

### 5.1 Layered View

```text
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

Dependency rules: UI → Features → Domain ← Infrastructure. Domain imports nothing from UI or Infra.

### 5.2 Proposed Folder Structure

```text
chronicle/
├─ docs/
│  └─ stack-and-architecture.md        # this document
├─ public/
├─ src/
│  ├─ app/                              # shell, providers, router
│  │  ├─ router.tsx
│  │  ├─ layout.tsx
│  │  └─ providers.tsx
│  ├─ features/
│  │  ├─ field-definitions/             # Field CRUD
│  │  ├─ home/                          # Home and 404 pages
│  │  ├─ forms/                         # Observation Form assembly
│  │  ├─ encounters/                    # concrete sessions
│  │  ├─ observations/                  # data capture
│  │  └─ chronicles/                    # (stub in v1)
│  ├─ domain/
│  │  ├─ field.ts                       # types + Zod schema
│  │  ├─ form.ts
│  │  ├─ encounter.ts
│  │  └─ observation.ts
│  ├─ infra/
│  │  ├─ db/
│  │  │  ├─ schema.ts                   # Dexie tables + versioning
│  │  │  ├─ client.ts                   # singleton instance
│  │  │  └─ repositories/               # one file per entity
│  │  ├─ media/
│  │  │  ├─ store.ts                    # store/read Blobs
│  │  │  └─ record.ts                   # MediaRecorder helpers
│  │  ├─ export/
│  │  │  └─ zip.ts                      # export/import JSON + media
│  │  └─ pwa/
│  ├─ components/
│  │  └─ ui/                            # shadcn primitives
│  ├─ hooks/
│  ├─ lib/                              # generic utilities
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

### 5.3 Persistence (Dexie / IndexedDB)

Suggested tables (all with v4 UUID `id` generated in client):

| Table | Main Fields | Notes |
| ------- | ------------------- | ------- |
| `institutions` | `id`, `name`, `createdAt` | |
| `groups` | `id`, `institutionId`, `name` | index by `institutionId` |
| `participants` | `id`, `groupId`, `displayName` | index by `groupId` |
| `fields` | `id`, `key`, `label`, `type`, `config`, `createdAt`, `updatedAt`, `archivedAt` | `config` is typed JSON; `archivedAt` uses empty string for active |
| `forms` | `id`, `name`, `fieldIds[]`, `version`, `archivedAt?` | `fieldIds` preserves order |
| `encounters` | `id`, `groupId`, `formId`, `activity`, `startedAt`, `endedAt?` | |
| `observations` | `id`, `encounterId`, `participantId?`, `values`, `createdAt` | `values` maps `fieldId → value` or `fieldId → mediaId` |
| `media` | `id`, `mime`, `blob`, `size`, `createdAt` | separate table for binaries |

**Schema versioning:** each change increments the Dexie version and registers migration. Also recorded in `decisions.md`.

**Live queries:** use `dexie-react-hooks` (`useLiveQuery`) for reactivity without a global state manager.

### 5.4 Media Handling

- Capture: `<input type="file" accept="image/*|video/*|audio/*" capture>` for quick mobile flow; `MediaRecorder` for online recording.
- Storage: always as `Blob` in `media` table.
- Read: `URL.createObjectURL(blob)` with managed lifecycle (revoke on unmount).
- Export: ZIP with JSON entities + `media/` folder of binaries.

### 5.5 Dynamic Form Rendering

- A single **renderer** maps `field.type → component` (dispatch table).
- Validation: dynamic construction of Zod schema from the `fields` of the `form`.
- React Hook Form configured with dynamic `zodResolver` per Encounter.

### 5.6 PWA / Offline

- `vite-plugin-pwa` with `NetworkFirst` strategy for navigation and `CacheFirst` for assets.
- Installable manifest with icons and name "Chronicle".
- Being local-first, offline is the normal case, not the exception.

### 5.7 Accessibility

- shadcn/Radix components with proper ARIA by default.
- Full keyboard navigation mandatory.
- Minimum AA contrast; dark mode supported from the start.
- Touch targets ≥ 44px.

### 5.8 Testing

- **Unit (Vitest):** pure domain (Zod schemas, reducers, media helpers).
- **Integration:** Dexie repositories against `fake-indexeddb`.
- **E2E (Playwright):** critical flows — define fields, assemble form, create encounter, capture observation with media, export.

### 5.9 Security and Privacy

- Data always on the user's device. Nothing leaves the browser except explicit export.
- Export/Import is the user's responsibility. Documented in UI.
- No third-party analytics in v1.

---

## 6. Technical Roadmap by Phases

| Phase | Deliverable | Exit Criteria |
| ------ | ----------- | --------------------- |
| **F0** | **Scaffolding: Vite + React + TS + Tailwind + shadcn + Dexie + router + PWA** | **Completed 2026-04-17** |
| **F1** | **Field CRUD** | **Completed 2026-04-18 (baseline): create/edit/archive/list, routes `/fields*`, validation by type and unit/E2E tests** |
| F2 | Observation Form Editor | Compose, reorder, version |
| F3 | Encounters and Observation Capture (includes media) | Complete flow of a session |
| F4 | Export/Import (JSON + media) | Round-trip without loss |
| F5 | Chronicle Generation (first prototype) | Basic template from observations |

Each phase closes by executing the `.agents/skills/phase-closeout/SKILL.md` skill, which records decisions, creates new skills, and updates all documentation.

---

## 7. Development Conventions

- **Commits:** Conventional Commits (English).
- **Branches:** trunk-based; short-lived features from `main`.
- **CSS:** Tailwind utilities; when custom CSS is needed, use BEM and CSS variables; no `!important`.
- **HTML:** semantic always (`<button>`, `<a>`, `<main>`, etc.).
- **Components:** one file per component; co-locate tests `*.test.tsx` alongside.
- **Imports:** all at the top of the file; alias `@/` to `src/`.
- **Errors:** never silence; surface to the user with actionable messages via `AppError`.
- **Performance:** lazy-load routes; avoid unnecessary re-renders with targeted `useLiveQuery`.

### 7.1 Language Policy

This repository follows a strict bilingual split: internal artifacts are in English, while user-facing content remains in rioplatense Spanish.

**English (Internal Artifacts):**
- Code identifiers, types, functions, variables, constants, enums
- File and directory names
- Code comments, JSDoc/TSDoc
- All thrown `Error` and `AppError` messages in `src/domain`, `src/infra`, `src/features/**`, `src/lib/**`, `src/app/**`
- Unit, integration, and E2E test names, descriptions, and assertion messages (except when asserting on specific Spanish UI strings)
- All files under `.agents/`, `.windsurf/`, `.cursor/`
- `AGENTS.md`, `README.md`, `docs/**`
- Git commit messages and branch names
- Route paths and URL query parameter names/values
- Package metadata
- Glossary term definitions (column 3 in `glossary.md`)

**Rioplatense Spanish (User-Facing Content):**
- Text inside JSX/HTML that the user reads: headings, labels, placeholders, button text, empty states, confirmation dialogs, captions, legends
- `toast.*()` copy that surfaces to the user
- `aria-label`, `aria-description`, `aria-live` content (for screen readers)
- `<title>` and meta tags
- `lang="es-AR"` on `<html>`
- `toLocaleString("es-AR", ...)` and equivalent locale formatting
- Agent conversation with the user: use natural rioplatense Spanish

See `.agents/rules/language-policy.md` for the full canonical rule.

---

## 8. Maintenance Protocol for this Document

This document must be **updated** when:

1. A dependency of the stack is added, replaced, or removed.
2. The high-level folder structure changes.
3. The domain model or persistence schema changes.
4. The strategy for offline, media, or testing changes.

Mandatory protocol for agents and humans:

1. Propose the change in conversation.
2. Record the decision in `.agents/memory/decisions.md` (append-only).
3. Edit this document reflecting the new state.
4. If new domain concepts appear, update `.agents/memory/glossary.md`.
5. If the stack changes to the point of affecting agent bootstrap, update `AGENTS.md` and `.agents/README.md`.

Trivial changes (typos, reordering) do not require a `decisions.md` entry.
