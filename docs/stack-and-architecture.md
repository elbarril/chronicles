# Technology Stack and Architecture

This document is the **source of truth** for structural technical decisions of Chronicle.
It defines the stack, layered architecture, main modules, and development conventions.

Last updated: 2026-05-04 (Documentation refinement based on Oracle's contrast analysis: Updated technology stack details (Tailwind CSS v4 with native Vite plugin, ESLint 9 Flat Config, TypeScript strict mode options, React Router v7 without loaders/actions), added messaging strategy documentation, added Gemini AI model specifics (gemini-2.5-flash), added GitHub Actions lockfile integrity workflow details, added TypeScript configuration section, added three comprehensive appendices: Local Development Guide, Code Patterns and Conventions, and Testing Guide.)

---

## 1. Scope of Initial Version (v1)

- **Delivery format:** **Local-first** web app, 100% client-side. No custom backend, no accounts, no mandatory network.
- **Persistence:** All data is saved in the user's browser.
- **Core flow (post-event since F9; field management embedded in forms since F11):**
  1. The Practitioner **builds reusable Observation Forms**, defining the fields to capture inline (text, number, choice, boolean, date, image, video, audio, file). The same field can appear more than once in a form — each occurrence is a `FormFieldInstance` with its own optional `labelOverride`. There is no separate `/fields` route since F11; the `Editar campos` dialog inside the form-builder hosts every field operation.
  2. (Removed in F11; folded into step 1.)
  3. The Practitioner creates a **Project** with its participants.
  4. After an encounter happens, the Practitioner registers it inside the project (name, start/end time, who attended) and loads observations for it. Each observation picks the form that best fits what was seen (forms can be mixed within an encounter).
  5. From `/encounters/:id/chronicle` the Practitioner generates a chronicle — deterministic by default, with Gemini AI prose if the user provides a BYOK key.

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
| Routing | **React Router v7** | Standard SPA navigation. v1 does not use loaders/actions (local-first model). |
| Styling | **Tailwind CSS v4** | Utility-first, mobile-first responsive. Uses native Vite plugin (`@tailwindcss/vite`) — no `tailwind.config.ts` file. |
| UI Components | **shadcn/ui + Radix UI** | Accessible primitives (proper ARIA) without tying to a monolithic library. |
| Icons | **lucide-react** | Lightweight, tree-shakeable. |
| Toast Notifications | **sonner** | Lightweight, accessible toast system for user-facing feedback messages. |
| Forms | **React Hook Form + Zod** | Performance, reusable declarative validation between runtime and types. |
| Local Persistence | **IndexedDB via Dexie.js** | Handles native `Blob`/`File` (image, video, audio), transactions, indices. |
| Media Capture | **MediaRecorder API + `<input type=file capture>`** | Browser APIs, no external services. |
| PWA / Offline | **vite-plugin-pwa (Workbox)** | Installable app functional without connection. |
| Unit Testing | **Vitest + React Testing Library** | Native integration with Vite. |
| E2E Testing | **Playwright** | Covers critical flows with a real browser. |
| ZIP Handling | **JSZip** | Browser-compatible ZIP read/write for self-contained global export/import with media blobs (`chronicle-full-v3` since F11). Legacy `chronicle-full-v1`, `chronicle-full-v2` and `chronicle-encounter-v1` are no longer importable (the underlying record shapes changed across F9 and F11). |
| Lint/Format | **ESLint 9 (Flat Config) + Prettier** | ESLint 9 uses flat config (`eslint.config.js`), not legacy `.eslintrc`. Prettier for formatting. |
| Package Manager | **pnpm** | Fast, deterministic, disk-efficient. |
| Node | **Current LTS (>= 20)** | Compatibility with modern toolchain. |

### TypeScript Configuration

The project uses TypeScript strict mode with additional strict options enabled in `tsconfig.json`:

- `strict: true` — All strict type-checking options enabled
- `noUncheckedIndexedAccess: true` — Enforces checking for undefined when accessing array/object indices
- `noImplicitOverride: true` — Requires explicit `override` keyword when overriding base class methods
- `moduleDetection: "force"` — Forces TypeScript to treat all files as modules (prevents CommonJS/ESM ambiguity)
- `moduleResolution: "bundler"` — Modern resolution strategy for bundler-based projects
- `target: "ES2022"` — Modern JavaScript features
- `jsx: "react-jsx"` — New JSX transform (no need to import React)

These options provide maximum type safety and catch potential bugs at compile time.

### Messaging Strategy

Chronicle follows a bilingual messaging strategy that separates user-facing text from internal error codes:

- **User-facing messages (Spanish):** All text shown to end users in the UI is in rioplatense Spanish. Each feature has a `messages.ts` file (e.g., `src/features/settings/lib/messages.ts`) that exports a const object with all user-facing strings for that feature. This includes:
  - Page titles and descriptions
  - Button labels
  - Form labels and placeholders
  - Empty states and confirmation dialogs
  - Toast notifications that surface to the user

- **Internal error codes (English):** All `AppError` instances thrown in domain, infra, and feature layers use English error codes (e.g., `AI_KEY_INVALID`, `AI_RATE_LIMITED`, `IMPORT_SCHEMA_MISMATCH`). These codes are:
  - Used for programmatic error handling
  - Never shown directly to end users
  - Mapped to user-facing Spanish messages in toast/error handlers

This separation ensures that:
- The codebase remains internally consistent with English identifiers
- Users receive natural, culturally appropriate Spanish text
- Error handling remains type-safe and programmatic

### F7: Optional External AI Integration (Google Gemini)

F7 introduces an **opt-in** AI layer over the deterministic chronicle generator. Key design invariants:

- **Model:** Uses Google Gemini `gemini-2.5-flash` model specifically. Configured in `src/infra/ai/gemini-client.ts`.

- **BYOK (Bring Your Own Key):** the user provides their own Google Gemini API key, stored in `localStorage` under `chronicle.geminiApiKey`. The key is never sent to any Chronicle server because there is no Chronicle server.
- **No mandatory network dependency:** the app remains fully functional offline; AI generation only activates when the user has configured a key and a network connection is available.
- **No fallback after a Gemini error.** When no key is set the service runs deterministic generation (identical to pre-F7 behavior). When a key is configured and the Gemini call fails the service does **not** silently produce a deterministic chronicle: it surfaces a category-specific warning toast (`aiFallbackWarning` / `aiRateLimitWarning` for HTTP 429 / `aiKeyInvalidWarning` for HTTP 400/403) and either returns the previously saved chronicle untouched or, if none exists, throws so the encounter page can show `chronicleMessages.createError`. This makes upstream problems visible.
- **Input-hash cache.** AI chronicles store a SHA-256 fingerprint over a canonical projection of the encounter, group name, participants, fields and observations (`infra/ai/chronicle-input-hash.ts`, persisted as `Chronicle.inputHash`). On subsequent generations the service compares the current hash against the saved one and short-circuits the Gemini API call when nothing has changed, returning the cached chronicle. Deterministic chronicles never store the hash.
- **AI key status badge.** `AiKeyStatusBadge` reads the live state of `chronicle.geminiApiKey` from `localStorage` and renders a `Sin clave` / `Clave configurada` chip next to every "Generar crónica" entry point so the user always knows which generator will run before clicking.
- **New infra layer:** `src/infra/ai/` contains `gemini-client.ts` (raw fetch to `generativelanguage.googleapis.com`, maps HTTP 429 to `AI_RATE_LIMITED`), `gemini-chronicle-generator.ts` (prompt builder in rioplatense Spanish, skips media fields) and `chronicle-input-hash.ts`.
- **New settings feature:** `src/features/settings/` exposes a `/settings` route with API key form (masked input, show/hide, save, clear).
- **AI badge:** `ChronicleViewer` displays a "Generada con IA" badge when `chronicle.generatedWith === "gemini"`.

### F8: Always-available Global Export, User Identity, Native Share

F8 reshapes how data leaves Chronicle so a backup is one click away regardless of how empty the database is. Key design invariants:

- **One export path, in Settings.** `/settings` exposes "Exportar todo": a single button that produces a `chronicle-full-v1` ZIP *(schema bumped to `chronicle-full-v2` in F9)* with every Dexie table, every media blob, and the user's brand color and author name. The previous per-encounter export button on `/encounters/:id` was removed; the only way to back up data is now the global export.
- **Backward-compatible importer.** `src/features/import/services/import-service.ts` reads `manifest.json`, dispatches between `chronicle-full-v1` (new) and `chronicle-encounter-v1` (legacy) and routes to the right parser. Pre-F8 ZIPs in the wild still import cleanly. Legacy `parseEncounterZip(file)` and `importEncounterData(data)` are kept as backward-compatible exports. *(Superseded by F9: both legacy schemas are rejected with `IMPORT_SCHEMA_MISMATCH`; `encounter-importer.ts` was deleted; only `chronicle-full-v2` is importable.)*
- **User identity is local-only.** New `src/features/settings/services/user-name-service.ts` persists the name under `chronicle.userName`. Default is detected from `navigator.userAgent` (e.g. `Chrome en Linux`). After the tour finishes, `WelcomeNamePrompt` (mounted in `RootLayout`) prompts the user once; a `chronicle.userNamePromptShown` flag prevents re-asking. The Settings page exposes `UserNameForm` to edit later. Exported file names follow `chronicle-{slug(name)}-{YYYY-MM-DD}.zip` and the manifest carries `exportedBy`.
- **Native share for chronicles.** `useShareChronicle` calls `navigator.share({ title, text })` with a clipboard fallback (`navigator.clipboard.writeText`); the chronicle detail header surfaces a "Compartir" button. AbortError (user cancellation) is silently ignored.
- **Tour rewired.** The encounter-detail "Exportar el encuentro" stop is gone. The Settings hub-stop now visits `settings.export` and `import.dropzone`. A new `chronicle.detail.share` stop highlights the share button. The outro mentions that the user will be asked for their name next.

### Post-F8 Polish: Home as Nav Hub, Help Page Consolidation, AI Polish

Released alongside F8 to consolidate the information architecture and tighten the AI integration:

- **Home is a pure nav hub.** `src/features/home/HomePage.tsx` was rewritten as an icon grid of every top-level section (`Campos`, `Formularios`, `Grupos`, `Encuentros`, `Crónicas`, `Configuración`, `Cómo funciona`, `Ayuda`, `Soporte`) *(F9 replaced `Grupos`/`Encuentros` tiles with `Proyectos`; F10 added `EncountersSection` above the hub grid; F11 dropped the `Cómo funciona` tile after consolidating the help routes into a single tabbed `/help` page)*. Each tile carries a `data-tour` attribute used by the onboarding tour to point to the correct hub stop. The data-aware welcome card, demo encounter toggle, "quick check" card, and the data-status summary moved to a new `/support` page (`SupportPage`).
- **`/import` removed from the router.** Importing happens inside `/settings` via `ImportSection`. The legacy `ImportPage` route was dropped from `src/app/router.tsx` and the `Importar` entry was removed from `src/app/nav-items.ts`.
- **AI integration polish.** See the F7 section above for the input-hash cache, the no-fallback-on-Gemini-error policy, and the `AiKeyStatusBadge`. These three additions happened after F8 was already in place but logically extend F7's AI layer rather than F8's export work.

### Explicitly Discarded Dependencies in v1

- **No custom backend** (Node/Express/Nest/etc.): adds no value in local-first v1.
- **No BaaS** (Supabase, Firebase): violates minimal external dependencies principle.
- **No global state manager** (Redux, Zustand): Dexie live queries + React local state suffice.
- **No heavy UI kit** (MUI, Chakra): shadcn + Tailwind offer total control with less weight.
- **No ORM**: Dexie is already the typed layer over IndexedDB.
- **No Gemini SDK library**: the AI client uses `fetch` directly against the REST endpoint to avoid adding a package dependency for a single HTTP call.

### Criteria for Introducing New Dependencies

Any new dependency must be recorded as a decision in `.agents/memory/decisions.md` and justify:

1. What concrete problem it solves that cannot be resolved with existing stack.
2. Impact on bundle size and offline flow.
3. Native alternative considered and why it falls short.

---

## 4. Domain Model (Conceptual)

Core entities (canonical names, see `.agents/memory/glossary.md`):

- **Institution**: organizational context.
- **Project**: set of Participants that take part in a sequence of Encounters. Replaces the F0–F8 `Group` concept since F9.
- **Participant**: observed individual (`projectId`).
- **Field**: definition of data to capture. Type + metadata + validations. Since F11 there is no dedicated route — Fields are managed from inside the form-builder.
- **FormFieldInstance** *(new in F11)*: a single occurrence of a Field inside a Form, carrying a stable `instanceId`, the referenced `fieldId`, and an optional `labelOverride`. Multiple instances of the same Field are allowed inside a single Form.
- **Form (Observation Form)**: ordered list of `FormFieldInstance`s. Each Observation snapshots the form (`formId`/`formVersion`/`fields: FormFieldInstance[]`) it was created with, so a single Encounter can mix observations from different forms.
- **Encounter**: post-event record of a session that already happened, scoped to a Project (`name`, `startsAt`, `endsAt`, `participantIds[]`, `archivedAt?`). No "in progress / finished" lifecycle: archive/restore only.
- **Observation**: instance of captured values for a specific Form within an Encounter. `values` is keyed by `instanceId`, not `fieldId`, so duplicate instances of the same field hold independent values.
- **Chronicle**: narrative derived from the Observations of an Encounter, generated only at `/encounters/:id/chronicle`.

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
│  │  ├─ layout.tsx                     # 3-zone header + skip-link + onboarding mount
│  │  ├─ providers.tsx                  # ThemeProvider + db.open + seedDefaults
│  │  ├─ theme.tsx                      # ThemeProvider + useTheme (light/dark)
│  │  ├─ MobileNavDrawer.tsx            # responsive nav drawer (Sheet)
│  │  └─ nav-items.ts                   # canonical navigation list
│  ├─ features/
│  │  ├─ field-definitions/             # Field domain assets (FieldForm, FieldListTable, hooks, repo) — reused by ManageFieldsDialog inside forms/. No dedicated route since F11.
│  │  ├─ home/                          # icon-grid hub + /support helper page + 404
│  │  ├─ forms/                         # Observation Form assembly with embedded ManageFieldsDialog (since F11)
│  │  ├─ projects/                      # Project + Participant management (since F9)
│  │  ├─ encounters/                    # post-event encounter form + detail
│  │  ├─ observations/                  # data capture with per-observation form selector
│  │  ├─ import/                        # ZIP import flow with preview/confirm
│  │  ├─ chronicles/                    # /chronicles list/detail + /encounters/:id/chronicle (single generate entry)
│  │  ├─ defaults/                      # first-run seed + demo encounter management
│  │  ├─ onboarding/                    # first-run welcome dialog (3 steps: what/storage/AI)
│  │  ├─ settings/                      # /settings: brand color, user name, export/import, Gemini API key (BYOK)
│  │  └─ help/                          # /help with 3 tabs (Funcionamientos / Datos / IA), HowItWorksGuide + DataStorageGuide + AiSetupGuide components
│  ├─ domain/
│  │  ├─ field.ts                       # types + Zod schema
│  │  ├─ form.ts
│  │  ├─ project.ts                     # set of participants (since F9, replaces group.ts)
│  │  ├─ participant.ts                 # participant tied to a project
│  │  ├─ encounter.ts                   # post-event record inside a project
│  │  ├─ observation.ts                 # carries its own formId + formVersion + fields: FormFieldInstance[] snapshot (since F11)
│  │  └─ chronicle.ts
│  ├─ infra/
│  │  ├─ ai/
│  │  │  ├─ gemini-client.ts            # raw fetch to Gemini REST API (HTTP 429 → AI_RATE_LIMITED)
│  │  │  ├─ gemini-chronicle-generator.ts # prompt builder + generator (skips media)
│  │  │  └─ chronicle-input-hash.ts     # SHA-256 fingerprint over the AI prompt input (cache key)
│  │  ├─ db/
│  │  │  ├─ schema.ts                   # Dexie tables + versioning
│  │  │  ├─ client.ts                   # singleton instance + migrations up to v8 (F11 hard reset of forms/observations/chronicles/media)
│  │  │  └─ repositories/               # one file per entity
│  │  ├─ media/
│  │  │  ├─ store.ts                    # store/read Blobs
│  │  │  ├─ recorder.ts                 # MediaRecorder / useAudioRecorder hook
│  │  │  └─ use-media-object-url.ts     # mediaId → managed object URL hook
│  │  ├─ export/
│  │  │  ├─ manifest.ts                 # `chronicle-full-v3` schema + `assertSupportedManifestSchema` (rejects v1/v2/encounter-v1 with `IMPORT_SCHEMA_MISMATCH`)
│  │  │  ├─ full-exporter.ts            # Global ZIP generation + download (every table + media + brand/name)
│  │  │  └─ full-importer.ts            # Global ZIP parse + transactional upsert
│  │  └─ pwa/
│  ├─ components/
│  │  ├─ ui/                            # shadcn primitives
│  │  └─ media/                         # MediaItem + MediaPreview (image/video/audio/file)
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
| `projects` | `id`, `institutionId`, `name`, `archivedAt`, `createdAt` | replaces the legacy `groups` store since F9; the `groups` store is dropped via `groups: null` in the v7 upgrade |
| `participants` | `id`, `projectId`, `displayName`, `archivedAt`, `createdAt` | indexed by `projectId` |
| `fields` | `id`, `key`, `label`, `type`, `config`, `createdAt`, `updatedAt`, `archivedAt` | `config` is typed JSON; `archivedAt` uses empty string for active |
| `forms` | `id`, `name`, `fields: FormFieldInstance[]`, `version`, `createdAt`, `updatedAt`, `archivedAt` | `fields` preserves order; the same `fieldId` may appear more than once with different `instanceId`s and `labelOverride`s; version auto-increments on update. *(Renamed from `fieldIds[]` in F11.)* |
| `encounters` | `id`, `projectId`, `name`, `startsAt`, `endsAt`, `participantIds[]`, `archivedAt?`, `createdAt`, `updatedAt` | post-event record. `participantIds` is the subset of project participants that attended; `archivedAt` uses empty string for active |
| `observations` | `id`, `encounterId`, `formId`, `formVersion`, `fields: FormFieldInstance[]`, `participantId?`, `title?`, `values`, `createdAt` | each observation snapshots its own form (including instances and label overrides); `values` is keyed by `instanceId` (not `fieldId`) so duplicate instances of the same field hold independent values; `title` is optional, trimmed, non-empty. *(Renamed from `fieldIds[]` and re-keyed from `fieldId` in F11.)* |
| `media` | `id`, `mime`, `blob`, `size`, `createdAt` | separate table for binaries |
| `chronicles` | `id`, `encounterId`, `title`, `body`, `generatedAt`, `createdAt`, `generatedWith?`, `inputHash?` | one chronicle per encounter (upsert by `encounterId`); `generatedWith?: "deterministic" \| "gemini"` and `inputHash?` (SHA-256 fingerprint, only set when `generatedWith === "gemini"`) |

**Schema versioning:** each change increments the Dexie version and registers migration. Also recorded in `decisions.md`. Current version is **v8** (F11), with a hard-reset upgrade that wipes `forms`, `observations`, `chronicles` and `media` (their record shapes changed when forms moved from `fieldIds: string[]` to `fields: FormFieldInstance[]` and observation values were re-keyed by `instanceId`). Field, project, participant, encounter and Settings preferences (theme, brand color, user name, Gemini key) are preserved. The legacy `groups` store remains dropped (since v7).

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
- **E2E (Playwright):** critical flows — define fields, assemble form, create encounter, capture observation with media, export, import, and round-trip validation.

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
| **F2** | **Observation Form Editor** | **Completed 2026-04-18 (baseline): create/edit/archive/restore/list, routes `/forms*`, ordered field composition with accessible reorder, auto version bump, unit/E2E tests** |
| **F3** | **Encounters and Observation Capture (includes media)** | **Completed 2026-04-18 (baseline): Groups/Participants CRUD, encounter create/finish, observation capture with dynamic fields + media (file picker + in-app audio), Dexie schema v4, unit/E2E tests** |
| **F4** | **Export/Import (Encounter ZIP + media)** | **Completed 2026-04-18 (baseline): encounter-level self-contained ZIP export, `/import` preview+confirm flow, upsert-by-ID import, JSZip-based infra, unit/E2E tests. Superseded by F8 / post-F8 polish — the `/import` route is gone and the encounter-level export was removed; Superseded again by F9 — `encounter-importer.ts` was deleted and `chronicle-encounter-v1` ZIPs are rejected with `IMPORT_SCHEMA_MISMATCH`.** |
| **F5** | **Chronicle Generation (first prototype)** | **Completed 2026-04-18 (baseline): deterministic chronicle generation from encounter observations, `/chronicles` list + detail routes, generation action from encounter detail, Dexie schema v5 (`chronicles` table), unit/E2E tests** |
| **F6** | **Post-F5 UX iteration: archive/restore + onboarding + defaults + responsive shell** | **Completed 2026-05-01: encounter archive/restore (Dexie v6, `archivedAt`), observation `title`, unified list tables, mobile nav drawer + theme provider, first-run onboarding dialog, default form + demo encounter seeding, inline media previews, data-aware home dashboard, `/help` and `/how-it-works` guides** |
| **F7** | **Optional Gemini AI chronicle generation (BYOK)** | **Completed 2026-05-01: opt-in `gemini-2.5-flash` generation with BYOK (`localStorage`); `generatedWith` field on `Chronicle`; `/settings` route with masked API key form; `AiSetupGuide` shared component; onboarding 3rd step; "Generada con IA" badge; `infra/ai/` layer; input-hash cache (`Chronicle.inputHash`) added post-F8; no deterministic fallback on Gemini error (category-specific toast instead); `AiKeyStatusBadge` next to every "Generar crónica" entry point; unit + E2E tests green** |
| **F8** | **Always-available global export + user identity + chronicle share** | **Completed 2026-05-01: `chronicle-full-v1` ZIP export from `/settings` (covers every table, media, brand color and author name) *(schema bumped to `chronicle-full-v2` in F9; legacy dispatch removed)*; per-encounter "Exportar" button removed; importer dispatches between full and legacy `chronicle-encounter-v1` ZIPs *(both rejected in F9)*; `chronicle.userName` + post-tour `WelcomeNamePrompt` (default detected from `navigator.userAgent`); `useShareChronicle` with `navigator.share` + clipboard fallback wired to a "Compartir" button on chronicle detail; new tour stops `settings.export` and `chronicle.detail.share`; new unit and E2E tests** |
| **Post-F8 polish** | **Home as nav hub, support page consolidation, AI cache and AI key status** | **Completed 2026-05-01: `HomePage` rewritten as a pure icon-grid nav hub; new `/support` route hosts the demo encounter toggle, the data-aware status panel, and the quick-check helper; `/import` route removed (Settings is the canonical importer); `Chronicle.inputHash` SHA-256 cache short-circuits redundant Gemini calls; `AiKeyStatusBadge` always visible next to "Generar crónica"; tests updated to match the new layout** |
| **F9** | **Projects refactor + post-event chronicles + per-observation form snapshot + Dexie v7 hard reset** | **Completed 2026-05-02: `Project` replaces `Group`; encounters are post-event records inside a project (`name`, `startsAt`, `endsAt`, `participantIds[]`); each observation snapshots its own `formId`/`formVersion`/`fieldIds[]`; chronicle generation gated to `/encounters/:id/chronicle`; hub swap (Proyectos in/Grupos+Encuentros out); Dexie v7 hard-reset migration; `chronicle-full-v2` export schema (legacy v1 / encounter-v1 no longer importable); demo encounter rebuilt with two observations using two different forms; onboarding tour rewritten end-to-end. All unit tests green; E2E suite adapted.** |
| **F10** | **Home encounters section + project-selector modal** | **Completed 2026-05-03: `EncountersSection` component above the hub nav grid (newest-first, max 4 per page, Previous/Next paginator); `listAllActiveEncounters()` added to encounter-repository (all active encounters across every project sorted by `startsAt` descending); `encounters-home-service` + `useAllEncounters` hook (useLiveQuery) for reactive updates; project-selector Dialog on "Nuevo encuentro" CTA navigates to `/projects/:id/encounters/new`; empty state with inline CTA when no encounters exist; two new onboarding tour stops before the hub; unit tests updated.** |
| **F11 (help)** | **Help page consolidation: 3 tabs (Funcionamientos / Datos / IA) + Settings cleanup** | **Completed 2026-05-03: `/help` rewritten as a single tabbed page (Funcionamientos / Datos / IA) following the same `?tab=` filter-tab pattern used in `/projects`; `HowItWorksPage` and the `/how-it-works` route deleted (its content lives in the Funcionamientos tab); `Cómo funciona` tile removed from `HomePage` and `nav-items.ts`; `AiSetupGuide` removed from `SettingsPage` (its content lives in the IA tab) — the Settings AI section now only shows the section title, a link to `/help?tab=ia`, and the API key form; `helpPage` messages added; `howItWorksPage` messages dropped; `how-it-works.test.tsx` removed; `help.test.tsx` rewritten to cover all three tabs; `settings-api-key.spec.ts` updated to match the slimmer Settings AI section.** |
| **F11 (forms+fields)** | **Forms + Fields merge: `FormFieldInstance` model, embedded `Editar campos` dialog, Dexie v8, manifest v3** | **Completed 2026-05-03: `/fields*` routes deleted (`FieldListPage` and `FieldFormPage` files removed); `Campos` removed from hub tile, mobile drawer and nav-items; `FormFieldInstance = { instanceId, fieldId, labelOverride? }` introduced in `domain/form.ts`; `ObservationForm.fields: FormFieldInstance[]` (was `fieldIds[]`); `Observation.fields` mirrors the change and `Observation.values` is keyed by `instanceId`; `FormBuilder` rewritten with a duplicate-instance button and per-instance `labelOverride` input; new `ManageFieldsDialog` opens from inside the form-builder, hosting tabs Activos/Archivados and an inline `FieldForm` for create/edit (reuses `useFields`, `FieldListTable`, `FieldForm`); Dexie schema bumped to v8 with hard reset of `forms`/`observations`/`chronicles`/`media`; export manifest bumped to `chronicle-full-v3` with `assertSupportedManifestSchema(schema)` rejecting v1/v2/encounter-v1; demo seed updated to use instance ids; onboarding tour drops the Campos block and adds two new steps (`forms.builder.manage-fields`, `forms.builder.duplicate-instance`); chronicle and AI prompts now read `instance.labelOverride ?? field.label`; full unit + E2E test suites updated.** |
| **F12** | **Encounter editing + stable participant identity** | **Completed 2026-05-03: new `EncounterEditPage` at `/encounters/:id/edit` (mirrors the post-event create flow, drops stale ids before submit); "Editar encuentro" button on `EncounterHeader` (hidden when archived) and "Editar" link in every active row of `ProjectEncounterListTable`; `EncounterHeader` now lists the actual attendees as a chip list (replacing the meaningless "X de los del proyecto" copy); `projectInputSchema` switched from `participantNames: string[]` to `participants: { id?, displayName }[]` with `projectInputParticipantSchema`; `updateProjectWithParticipants` rewritten to diff by id (update by stable id, create only for new rows, hard-delete removed rows) instead of dropping and recreating every participant — this is what was breaking `encounter.participantIds` after every project edit and silently emptying the encounter attendee list; `encounter-edit.spec.ts` covers both the edit flow and the project-edit identity-preservation case; `pnpm check` green end-to-end.** |

The roadmap above is historical. Future work no longer follows the `F<N>` phase model: changes are planned and implemented through the generic-update skills (`change-planner`, `change-implementer`, `change-closeout`) under `.agents/skills/`. Past phases were closed by the legacy `phase-closeout` skill, which has been replaced by `change-closeout`.

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
- All files under `.agents/`, `.windsurf/`
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

## 8. CI/CD and Deployment

### GitHub Actions: Lockfile Integrity

The project uses a GitHub Actions workflow (`.github/workflows/lockfile-integrity.yml`) to validate lockfile integrity on every push and pull request to the `master` branch. This ensures that:

- `pnpm-lock.yaml` remains synchronized with `package.json`
- Dependency changes are intentional and committed together
- The CI environment can reproduce the exact same dependency tree

The workflow:
1. Checks out the code
2. Sets up pnpm (version 9.15.3)
3. Sets up Node.js (version 20)
4. Runs `pnpm install --frozen-lockfile`

If the lockfile is out of sync, the workflow fails, preventing merges that would introduce dependency drift.

### Deployment (Vercel)

Chronicle is deployed as a static client-side build to Vercel. The build output is the `dist/` directory from `pnpm build`.

**Pre-deploy checklist (mandatory):**

```bash
pnpm install --frozen-lockfile
pnpm check
```

- If frozen lockfile fails, run `pnpm install` and commit dependency metadata changes
- Keep `package.json` and `pnpm-lock.yaml` synchronized and committed together when dependencies change
- In Vercel logs, verify the deployed commit hash matches the latest `master` commit

The lockfile integrity workflow provides a guardrail before deployment by catching dependency drift early in the PR process.

---

## 9. Maintenance Protocol for this Document

For detailed local development setup, code patterns, and testing conventions, see the appendices below:
- [Appendix A: Local Development Guide](#appendix-a-local-development-guide) — Complete local development setup and workflow
- [Appendix B: Code Patterns and Conventions](#appendix-b-code-patterns-and-conventions) — Project-specific code patterns and conventions
- [Appendix C: Testing Guide](#appendix-c-testing-guide) — Testing strategy, coverage, and best practices

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

---

## Appendix A: Local Development Guide

This appendix provides detailed instructions for setting up and working with Chronicle in a local development environment.

### Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 20 or higher (Current LTS recommended)
  - Check with: `node --version`
  - Download from: https://nodejs.org/
- **pnpm**: Version 9.15.3 or higher
  - Check with: `pnpm --version`
  - Install with: `npm install -g pnpm`
- **Git**: For version control
  - Check with: `git --version`

### Initial Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd chronicle
```

#### 2. Install Dependencies

```bash
pnpm install
```

This installs all dependencies listed in `package.json` and generates the `pnpm-lock.yaml` file.

#### 3. Verify Installation

```bash
pnpm check
```

This runs type checking, linting, unit tests, and E2E tests to ensure everything is set up correctly.

### Development Workflow

#### Starting the Development Server

```bash
pnpm dev
```

The Vite dev server starts at `http://localhost:5173` with:
- Hot Module Replacement (HMR) enabled
- React Fast Refresh for component changes
- Tailwind CSS v4 with native Vite plugin (no config file needed)

#### Type Checking

```bash
pnpm typecheck
```

Runs TypeScript compiler in check mode (no emit) for both:
- Main project: `tsconfig.json`
- Node config: `tsconfig.node.json`

#### Linting

```bash
# Check lint errors
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix
```

Uses ESLint 9 with flat config (`eslint.config.js`). The linter checks:
- TypeScript code with `typescript-eslint`
- React best practices with `eslint-plugin-react` and `eslint-plugin-react-hooks`
- Accessibility with `eslint-plugin-jsx-a11y`
- Import ordering with `eslint-plugin-import`
- Prettier integration with `eslint-plugin-prettier`

#### Formatting

```bash
# Check formatting
pnpm format:check

# Format code
pnpm format
```

Uses Prettier with the `prettier-plugin-tailwindcss` plugin for Tailwind class sorting.

#### Running Tests

**Unit Tests:**

```bash
# Run unit tests once
pnpm test

# Run in watch mode
pnpm test:watch
```

Unit tests use Vitest with React Testing Library. They cover:
- Domain models and Zod schemas
- Repository logic
- Service layer functions
- Utility functions

Test files are located in `tests/unit/` and follow the pattern `*.test.ts` or `*.test.tsx`.

**E2E Tests:**

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests in CI mode (builds first)
pnpm test:e2e:ci
```

E2E tests use Playwright and cover critical user flows:
- Field creation and management
- Form composition
- Project and encounter creation
- Observation capture with media
- Chronicle generation (deterministic and AI)
- Export and import
- Navigation and responsive behavior

Test files are located in `tests/e2e/` and follow the pattern `*.spec.ts`.

#### Building for Production

```bash
pnpm build
```

This:
1. Runs TypeScript compiler check (`tsc -b`)
2. Runs Vite build to generate optimized assets in `dist/`
3. Generates PWA manifest and service worker

#### Preview Production Build

```bash
pnpm preview
```

Starts a local server to preview the production build from `dist/`.

### Configuration Files Reference

**`tsconfig.json`** - Main TypeScript configuration:
- Strict mode enabled with additional strict options
- `noUncheckedIndexedAccess: true` - Forces checking for undefined on array/object access
- `noImplicitOverride: true` - Requires explicit `override` keyword
- `moduleDetection: "force"` - Treats all files as modules
- `moduleResolution: "bundler"` - Modern bundler resolution
- Path alias: `@/*` maps to `./src/*`

**`eslint.config.js`** - ESLint 9 flat config:
- Uses `typescript-eslint` for TypeScript support
- React plugins for JSX and hooks
- Accessibility checks with jsx-a11y
- Import ordering rules
- Prettier integration
- Ignores: `dist/`, `node_modules/`, `src/components/ui/`, config files

**`vite.config.ts`** - Vite build configuration:
- React plugin (`@vitejs/plugin-react`)
- Tailwind CSS v4 plugin (`@tailwindcss/vite`)
- PWA plugin (`vite-plugin-pwa`) with Workbox
- Path alias: `@/` → `src/`

**`playwright.config.ts`** - E2E test configuration:
- Browser targets: Chromium, Firefox, WebKit
- Test directory: `tests/e2e/`
- Base URL for tests: `http://localhost:5173`

### Development Tips

#### Working with Dexie (IndexedDB)

The database lives in the browser. When developing:
- Use the browser's DevTools → Application → IndexedDB to inspect data
- To reset the database, use the "Borrar datos" button in `/support` or clear browser data for localhost
- Schema changes require a migration in `src/infra/db/client.ts`

#### Working with PWA

- PWA features only work in HTTPS or localhost
- To test PWA installation, use Chrome DevTools → Application → PWA
- Service worker caching may require a hard refresh (Ctrl+Shift+R) during development

#### Working with Gemini AI

- The AI integration is optional (BYOK)
- To test AI features, configure a Gemini API key in `/settings`
- The key is stored in `localStorage` as `chronicle.geminiApiKey`
- AI calls are cached by input hash to avoid redundant API calls

#### Debugging

- Use browser DevTools for React component debugging (React DevTools extension recommended)
- Console logs are available in the browser console
- For E2E test debugging, use `pnpm test:e2e --debug` or `--headed`

### Common Issues

**"Module not found" errors:**
- Run `pnpm install` to ensure dependencies are installed
- Check that the file path is correct and matches the `@/` alias

**TypeScript errors after schema changes:**
- Run `pnpm typecheck` to see all errors
- Ensure domain types are updated when Dexie schema changes
- Check that Zod schemas match TypeScript types

**ESLint errors:**
- Run `pnpm lint:fix` to auto-fix formatting issues
- Check `eslint.config.js` for rule configuration

**PWA not updating:**
- Clear service worker cache in DevTools
- Use `pnpm build && pnpm preview` to test production build locally

### Git Workflow

#### Branch Strategy

- `main` (or `master`) - Production branch
- Feature branches - Short-lived branches from `main`
- Use descriptive branch names: `feature/add-ai-chronicle`, `fix/encounter-edit-bug`

#### Commit Convention

Follow Conventional Commits (English):

```
feat: add encounter editing functionality
fix: resolve participant identity preservation issue
docs: update local development guide
refactor: simplify form builder logic
test: add e2e test for chronicle generation
```

#### Pre-commit Checks

The GitHub Actions workflow validates lockfile integrity on every push to `master`. Before pushing:

```bash
pnpm install --frozen-lockfile
pnpm check
```

If `frozen-lockfile` fails, run `pnpm install` and commit the updated `pnpm-lock.yaml`.

---

## Appendix B: Code Patterns and Conventions

This appendix documents the specific code patterns, conventions, and idioms used throughout the Chronicle codebase.

### File and Directory Naming

- **Files:** kebab-case for all files except TypeScript types which use PascalCase
  - Examples: `field-repository.ts`, `EncounterDetailPage.tsx`, `use-observations.ts`
- **Directories:** kebab-case
  - Examples: `field-definitions/`, `chronicles/`, `infra/ai/`
- **Components:** PascalCase for component files
  - Examples: `FieldForm.tsx`, `ManageFieldsDialog.tsx`
- **Test files:** Same name as source file with `.test.ts` or `.test.tsx` suffix
  - Examples: `field-schema.test.ts`, `EncounterDetailPage.test.tsx`

### Component Structure

#### Functional Components with Hooks

All components are functional components using React hooks:

```typescript
import { useState } from "react";

interface MyComponentProps {
  title: string;
  onSave: (value: string) => void;
}

export function MyComponent({ title, onSave }: MyComponentProps) {
  const [value, setValue] = useState("");

  const handleSave = () => {
    onSave(value);
  };

  return (
    <div>
      <h2>{title}</h2>
      {/* JSX content */}
    </div>
  );
}
```

#### Custom Hooks

Custom hooks are prefixed with `use` and placed in `src/hooks/` or co-located with the feature:

```typescript
export function useMyHook() {
  const [state, setState] = useState(initialState);

  // Hook logic

  return { state, setState };
}
```

### Domain Types and Zod Schemas

Domain types are defined in `src/domain/` with corresponding Zod schemas:

```typescript
// src/domain/field.ts
import { z } from "zod";

export const fieldTypeSchema = z.enum([
  "text",
  "longText",
  "number",
  "boolean",
  "singleChoice",
  "multiChoice",
  "date",
  "time",
  "datetime",
  "image",
  "video",
  "audio",
  "file",
  "rating",
  "location",
]);

export type FieldType = z.infer<typeof fieldTypeSchema>;

export const fieldSchema = z.object({
  id: z.string().uuid(),
  key: z.string().min(1).max(100),
  label: z.string().min(1).max(200),
  type: fieldTypeSchema,
  required: z.boolean(),
  helpText: z.string().max(500).optional(),
  config: z.record(z.unknown()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  archivedAt: z.string().datetime().optional(),
});

export type Field = z.infer<typeof fieldSchema>;
```

### Repository Pattern

Repositories in `src/infra/db/repositories/` encapsulate Dexie operations:

```typescript
// src/infra/db/repositories/field-repository.ts
import { db } from "../client";
import type { Field } from "@/domain/field";

export class FieldRepository {
  async findAll(): Promise<Field[]> {
    return await db.fields.toArray();
  }

  async findById(id: string): Promise<Field | undefined> {
    return await db.fields.get(id);
  }

  async create(field: Omit<Field, "id" | "createdAt" | "updatedAt">): Promise<Field> {
    const now = new Date().toISOString();
    const newField: Field = {
      ...field,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await db.fields.add(newField);
    return newField;
  }

  async update(id: string, updates: Partial<Field>): Promise<void> {
    await db.fields.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async archive(id: string): Promise<void> {
    await db.fields.update(id, { archivedAt: new Date().toISOString() });
  }

  async restore(id: string): Promise<void> {
    await db.fields.update(id, { archivedAt: "" });
  }
}

export const fieldRepository = new FieldRepository();
```

### Error Handling with AppError

Use the `AppError` class for all domain and infrastructure errors:

```typescript
import { AppError } from "@/lib/error";

// In domain/infra code
if (!isValid) {
  throw new AppError("FIELD_INVALID", "Field configuration is invalid");
}

// In feature code, map to user-facing messages
try {
  await someOperation();
} catch (error) {
  if (error instanceof AppError) {
    if (error.code === "FIELD_INVALID") {
      toast.error(fieldMessages.invalidConfig);
    }
  } else {
    toast.error(fieldMessages.unknownError);
  }
}
```

### Messaging Pattern

Each feature has a `messages.ts` file with all user-facing strings:

```typescript
// src/features/settings/lib/messages.ts
export const settingsMessages = {
  pageTitle: "Configuración",
  pageDescription: "Ajustá las opciones de Chronicle según tus necesidades.",
  saveButton: "Guardar",
  saveSuccess: "Guardado correctamente.",
  saveError: "No se pudo guardar.",
} as const;

type SettingsMessages = typeof settingsMessages;
```

### Form Validation with React Hook Form + Zod

Dynamic forms use React Hook Form with Zod validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Guardar</button>
    </form>
  );
}
```

### Live Queries with Dexie

Use `useLiveQuery` from `dexie-react-hooks` for reactive database queries:

```typescript
import { useLiveQuery } from "dexie-react-hooks";
import { fieldRepository } from "@/infra/db/repositories/field-repository";

export function FieldList() {
  const fields = useLiveQuery(() => fieldRepository.findAll(), []);

  if (!fields) return <div>Loading...</div>;

  return (
    <ul>
      {fields.map((field) => (
        <li key={field.id}>{field.label}</li>
      ))}
    </ul>
  );
}
```

### Import Organization

Imports are organized in this order:

```typescript
// 1. React and external libraries
import { useState, useEffect } from "react";
import { z } from "zod";

// 2. Internal imports (using @/ alias)
import { Field } from "@/domain/field";
import { fieldRepository } from "@/infra/db/repositories/field-repository";
import { MyComponent } from "@/components/MyComponent";

// 3. Relative imports (if needed)
import { helperFunction } from "../utils";
```

The ESLint import/order rule enforces this automatically.

### TypeScript Patterns

#### Discriminated Unions

Use discriminated unions for type-safe variant handling:

```typescript
type FieldConfig =
  | { type: "text"; maxLength?: number }
  | { type: "number"; min?: number; max?: number }
  | { type: "singleChoice"; options: string[] };

function getFieldLabel(config: FieldConfig): string {
  switch (config.type) {
    case "text":
      return "Texto";
    case "number":
      return "Número";
    case "singleChoice":
      return "Selección";
  }
}
```

#### Type Guards

Use type guards for runtime type checking:

```typescript
function isField(value: unknown): value is Field {
  return fieldSchema.safeParse(value).success;
}
```

#### const Assertions

Use `as const` for immutable objects:

```typescript
const messages = {
  title: "My Title",
  description: "My Description",
} as const;

type Messages = typeof messages; // Infers literal types
```

### CSS and Styling

#### Tailwind CSS v4

Tailwind CSS v4 uses the native Vite plugin—no `tailwind.config.ts` file. Styles are applied directly as utility classes:

```typescript
<div className="flex items-center gap-4 p-4 rounded-lg bg-white shadow">
  <h2 className="text-xl font-semibold">Title</h2>
</div>
```

#### Custom CSS

For custom CSS that can't be expressed with Tailwind, use CSS variables and BEM naming in `src/styles/globals.css`:

```css
:root {
  --color-primary: #0f172a;
}

.my-component {
  display: flex;
}

.my-component__header {
  font-size: 1.5rem;
}

.my-component--disabled {
  opacity: 0.5;
}
```

### Testing Patterns

#### Unit Tests

Unit tests use Vitest and React Testing Library:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FieldForm } from "../FieldForm";

describe("FieldForm", () => {
  it("renders form fields", () => {
    render(<FieldForm onSave={vi.fn()} />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
  });

  it("calls onSave with valid data", async () => {
    const onSave = vi.fn();
    render(<FieldForm onSave={onSave} />);

    const input = screen.getByLabelText(/nombre/i);
    await userEvent.type(input, "Test Field");

    const button = screen.getByRole("button", { name: /guardar/i });
    await userEvent.click(button);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Test Field" })
    );
  });
});
```

#### E2E Tests

E2E tests use Playwright:

```typescript
import { test, expect } from "@playwright/test";

test("can create a field", async ({ page }) => {
  await page.goto("/forms/new");

  await page.click('button:has-text("Agregar campo")');
  await page.fill('input[name="label"]', "Test Field");
  await page.click('button:has-text("Guardar")');

  await expect(page.locator('text=Test Field')).toBeVisible();
});
```

### Accessibility Patterns

#### Semantic HTML

Always use semantic HTML elements:

```typescript
// Good
<button onClick={handleClick}>Click me</button>
<a href="/details">View details</a>

// Bad
<div onClick={handleClick}>Click me</div>
<div onClick={() => navigate("/details")}>View details</div>
```

#### ARIA Attributes

Use ARIA attributes when semantic HTML is insufficient:

```typescript
<button
  aria-label="Cerrar diálogo"
  aria-describedby="dialog-description"
  onClick={onClose}
>
  <XIcon aria-hidden="true" />
</button>
<div id="dialog-description">Esta acción cerrará el diálogo.</div>
```

#### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```typescript
<input
  type="text"
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }}
/>
```

---

## Appendix C: Testing Guide

This appendix covers the testing strategy, coverage goals, and best practices for the Chronicle project.

### Testing Philosophy

Chronicle follows a testing pyramid approach:

1. **Unit Tests** (base) - Fast, isolated tests of pure functions and small components
2. **Integration Tests** - Tests that verify interactions between modules (repositories, services)
3. **E2E Tests** (top) - Critical user flows tested in a real browser

The goal is to have fast feedback for most changes (unit tests) while ensuring critical paths work end-to-end (E2E tests).

### Unit Testing (Vitest)

#### When to Write Unit Tests

Write unit tests for:
- Domain models and Zod schemas
- Repository methods (using `fake-indexeddb`)
- Service layer functions
- Utility functions
- Pure business logic

#### Unit Test Structure

Unit tests are located in `tests/unit/` and follow the naming pattern `*.test.ts` or `*.test.tsx`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { fieldSchema, type Field } from "@/domain/field";

describe("fieldSchema", () => {
  it("validates a valid field", () => {
    const validField: Field = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      key: "test-field",
      label: "Test Field",
      type: "text",
      required: true,
      config: {},
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };

    const result = fieldSchema.safeParse(validField);
    expect(result.success).toBe(true);
  });

  it("rejects fields with invalid type", () => {
    const invalidField = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      key: "test-field",
      label: "Test Field",
      type: "invalid-type",
      required: true,
      config: {},
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };

    const result = fieldSchema.safeParse(invalidField);
    expect(result.success).toBe(false);
  });
});
```

#### Testing with fake-indexeddb

For repository tests, use `fake-indexeddb` to avoid affecting the real browser database:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/infra/db/client";
import { fieldRepository } from "@/infra/db/repositories/field-repository";
import "fake-indexeddb/auto";

describe("FieldRepository", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("creates and retrieves a field", async () => {
    const field = await fieldRepository.create({
      key: "test",
      label: "Test",
      type: "text",
      required: false,
      config: {},
    });

    const retrieved = await fieldRepository.findById(field.id);
    expect(retrieved).toEqual(field);
  });
});
```

### Component Testing (React Testing Library)

Component tests are also in `tests/unit/` but use React Testing Library:

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FieldForm } from "@/features/field-definitions/FieldForm";

describe("FieldForm", () => {
  it("renders form fields", () => {
    render(<FieldForm onSave={vi.fn()} />);

    expect(screen.getByLabelText(/clave/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/etiqueta/i)).toBeInTheDocument();
  });

  it("calls onSave with form data", async () => {
    const onSave = vi.fn();
    render(<FieldForm onSave={onSave} />);

    await userEvent.type(screen.getByLabelText(/clave/i), "test-field");
    await userEvent.type(screen.getByLabelText(/etiqueta/i), "Test Field");
    await userEvent.click(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "test-field",
          label: "Test Field",
        })
      );
    });
  });
});
```

### E2E Testing (Playwright)

#### When to Write E2E Tests

Write E2E tests for:
- Critical user flows (happy paths)
- Cross-feature interactions
- PWA functionality
- Media capture and handling
- Export/import workflows

#### E2E Test Structure

E2E tests are located in `tests/e2e/` and follow the naming pattern `*.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Field Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("can create a text field", async ({ page }) => {
    await page.click('text=Formularios');
    await page.click('text=Nuevo formulario');

    await page.click('button:has-text("Agregar campo")');
    await page.fill('input[name="key"]', "test-field");
    await page.fill('input[name="label"]', "Test Field");
    await page.selectOption('select[name="type"]', "text");

    await page.click('button:has-text("Guardar formulario")');

    await expect(page.locator('text=Test Field')).toBeVisible();
  });
});
```

#### Page Object Pattern

For complex flows, use page objects to encapsulate selectors and actions:

```typescript
// tests/e2e/pages/FormBuilderPage.ts
export class FormBuilderPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/forms/new");
  }

  async addField() {
    await this.page.click('button:has-text("Agregar campo")');
  }

  async fillFieldKey(key: string) {
    await this.page.fill('input[name="key"]', key);
  }

  async saveForm() {
    await this.page.click('button:has-text("Guardar formulario")');
  }
}

// Usage in test
test("creates a form with fields", async ({ page }) => {
  const builder = new FormBuilderPage(page);
  await builder.goto();
  await builder.addField();
  await builder.fillFieldKey("test");
  await builder.saveForm();
});
```

### Test Coverage Goals

Target coverage levels (measured by Vitest):

- **Domain layer**: 90%+ (critical business logic)
- **Infrastructure layer**: 80%+ (repositories, services)
- **Feature components**: 70%+ (UI components)
- **Overall project**: 75%+

To run coverage report:

```bash
pnpm test --coverage
```

### Running Tests

#### Unit Tests

```bash
# Run all unit tests once
pnpm test

# Run in watch mode (development)
pnpm test:watch

# Run specific test file
pnpm test field-schema.test.ts

# Run tests matching pattern
pnpm test -- field
```

#### E2E Tests

```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Run E2E tests in headed mode (show browser)
pnpm test:e2e --headed

# Run specific E2E test
pnpm test:e2e field-crud.spec.ts

# Debug E2E test
pnpm test:e2e --debug

# Run E2E in CI mode (builds first)
pnpm test:e2e:ci
```

### Testing Best Practices

#### Unit Tests

1. **Test behavior, not implementation**: Focus on what the code does, not how it does it
2. **Arrange-Act-Assert**: Structure tests clearly with these three phases
3. **Use descriptive test names**: Test names should describe the scenario and expected outcome
4. **Mock external dependencies**: Use vi.mock() for external services
5. **Avoid test interdependence**: Each test should be independent

#### Component Tests

1. **Query by role, not text**: Use `getByRole` when possible for accessibility
2. **Test user interactions**: Use `userEvent` for realistic user behavior
3. **Avoid testing implementation details**: Test what the user sees and does
4. **Wait for async operations**: Use `waitFor` for async state changes

#### E2E Tests

1. **Test critical paths only**: E2E tests are slow, focus on happy paths
2. **Use data-testid sparingly**: Prefer accessible selectors
3. **Handle async operations**: Use `waitFor` for network requests and animations
4. **Clean up test data**: Each test should leave the system in a clean state

### CI/CD Integration

Tests run in CI via GitHub Actions:

1. **On push/PR to master**: Lockfile integrity check
2. **Manual CI**: Full test suite with `pnpm check`

The CI environment uses:
- Node.js 20
- pnpm 9.15.3
- Chromium for E2E tests

### Common Testing Issues

#### Flaky E2E Tests

If E2E tests are flaky:
- Add explicit waits with `waitFor`
- Check for race conditions in async operations
- Ensure test data is isolated between tests
- Use `test.step()` to group related operations

#### Slow Unit Tests

If unit tests are slow:
- Check for unnecessary database operations
- Mock external dependencies
- Avoid expensive computations in test setup
- Use `vi.clearAllMocks()` in beforeEach

#### Test Environment Issues

If tests fail locally but pass in CI (or vice versa):
- Ensure Node.js version matches (>= 20)
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Check for environment-specific configuration
- Verify browser versions for E2E tests

