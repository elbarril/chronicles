# Technology Stack and Architecture

This document is the **source of truth** for structural technical decisions of Chronicle.
It defines the stack, layered architecture, main modules, and development conventions.

Last updated: 2026-05-02 (F9: Projects refactor + post-event chronicles + per-observation form snapshot + Dexie v7 hard reset)

---

## 1. Scope of Initial Version (v1)

- **Delivery format:** **Local-first** web app, 100% client-side. No custom backend, no accounts, no mandatory network.
- **Persistence:** All data is saved in the user's browser.
- **Core flow (post-event since F9):**
  1. The Practitioner **defines fields** to observe (text, number, choice, boolean, date, image, video, audio, file).
  2. With these fields, one or more reusable **Observation Forms** are composed.
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
| ZIP Handling | **JSZip** | Browser-compatible ZIP read/write for self-contained global export/import with media blobs (`chronicle-full-v2`). Legacy `chronicle-full-v1` and `chronicle-encounter-v1` are no longer importable since F9 (the underlying record shapes changed). |
| Lint/Format | **ESLint + Prettier** | Standard, low maintenance. |
| Package Manager| **pnpm** | Fast, deterministic, disk-efficient. |
| Node | **Current LTS (>= 20)** | Compatibility with modern toolchain. |

### F7: Optional External AI Integration (Google Gemini)

F7 introduces an **opt-in** AI layer over the deterministic chronicle generator. Key design invariants:

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

- **One export path, in Settings.** `/settings` exposes "Exportar todo": a single button that produces a `chronicle-full-v1` ZIP with every Dexie table, every media blob, and the user's brand color and author name. The previous per-encounter export button on `/encounters/:id` was removed; the only way to back up data is now the global export.
- **Backward-compatible importer.** `src/features/import/services/import-service.ts` reads `manifest.json`, dispatches between `chronicle-full-v1` (new) and `chronicle-encounter-v1` (legacy) and routes to the right parser. Pre-F8 ZIPs in the wild still import cleanly. Legacy `parseEncounterZip(file)` and `importEncounterData(data)` are kept as backward-compatible exports.
- **User identity is local-only.** New `src/features/settings/services/user-name-service.ts` persists the name under `chronicle.userName`. Default is detected from `navigator.userAgent` (e.g. `Chrome en Linux`). After the tour finishes, `WelcomeNamePrompt` (mounted in `RootLayout`) prompts the user once; a `chronicle.userNamePromptShown` flag prevents re-asking. The Settings page exposes `UserNameForm` to edit later. Exported file names follow `chronicle-{slug(name)}-{YYYY-MM-DD}.zip` and the manifest carries `exportedBy`.
- **Native share for chronicles.** `useShareChronicle` calls `navigator.share({ title, text })` with a clipboard fallback (`navigator.clipboard.writeText`); the chronicle detail header surfaces a "Compartir" button. AbortError (user cancellation) is silently ignored.
- **Tour rewired.** The encounter-detail "Exportar el encuentro" stop is gone. The Settings hub-stop now visits `settings.export` and `import.dropzone`. A new `chronicle.detail.share` stop highlights the share button. The outro mentions that the user will be asked for their name next.

### Post-F8 Polish: Home as Nav Hub, Help Page Consolidation, AI Polish

Released alongside F8 to consolidate the information architecture and tighten the AI integration:

- **Home is a pure nav hub.** `src/features/home/HomePage.tsx` was rewritten as an icon grid of every top-level section (`Campos`, `Formularios`, `Grupos`, `Encuentros`, `Crónicas`, `Configuración`, `Cómo funciona`, `Ayuda`, `Soporte`). Each tile carries a `data-tour` attribute used by the onboarding tour to point to the correct hub stop. The data-aware welcome card, demo encounter toggle, "quick check" card, and the data-status summary moved to a new `/support` page (`SupportPage`).
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
- **Field**: definition of data to capture. Type + metadata + validations.
- **Form (Observation Form)**: ordered set of Fields. Each Observation snapshots the form (`formId`/`formVersion`/`fieldIds[]`) it was created with, so a single Encounter can mix observations from different forms.
- **Encounter**: post-event record of a session that already happened, scoped to a Project (`name`, `startsAt`, `endsAt`, `participantIds[]`, `archivedAt?`). No "in progress / finished" lifecycle: archive/restore only.
- **Observation**: instance of captured values for a specific Form within an Encounter.
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
│  │  ├─ field-definitions/             # Field CRUD
│  │  ├─ home/                          # icon-grid hub + /support helper page + 404
│  │  ├─ forms/                         # Observation Form assembly
│  │  ├─ projects/                      # Project + Participant management (since F9)
│  │  ├─ encounters/                    # post-event encounter form + detail
│  │  ├─ observations/                  # data capture with per-observation form selector
│  │  ├─ import/                        # ZIP import flow with preview/confirm
│  │  ├─ chronicles/                    # /chronicles list/detail + /encounters/:id/chronicle (single generate entry)
│  │  ├─ defaults/                      # first-run seed + demo encounter management
│  │  ├─ onboarding/                    # first-run welcome dialog (3 steps: what/storage/AI)
│  │  ├─ settings/                      # /settings: brand color, user name, export/import, Gemini API key (BYOK)
│  │  └─ help/                          # /help, /how-it-works, AiSetupGuide component
│  ├─ domain/
│  │  ├─ field.ts                       # types + Zod schema
│  │  ├─ form.ts
│  │  ├─ project.ts                     # set of participants (since F9, replaces group.ts)
│  │  ├─ participant.ts                 # participant tied to a project
│  │  ├─ encounter.ts                   # post-event record inside a project
│  │  ├─ observation.ts                 # carries its own formId + formVersion + fieldIds[] snapshot
│  │  └─ chronicle.ts
│  ├─ infra/
│  │  ├─ ai/
│  │  │  ├─ gemini-client.ts            # raw fetch to Gemini REST API (HTTP 429 → AI_RATE_LIMITED)
│  │  │  ├─ gemini-chronicle-generator.ts # prompt builder + generator (skips media)
│  │  │  └─ chronicle-input-hash.ts     # SHA-256 fingerprint over the AI prompt input (cache key)
│  │  ├─ db/
│  │  │  ├─ schema.ts                   # Dexie tables + versioning
│  │  │  ├─ client.ts                   # singleton instance + migrations up to v6
│  │  │  └─ repositories/               # one file per entity
│  │  ├─ media/
│  │  │  ├─ store.ts                    # store/read Blobs
│  │  │  ├─ recorder.ts                 # MediaRecorder / useAudioRecorder hook
│  │  │  └─ use-media-object-url.ts     # mediaId → managed object URL hook
│  │  ├─ export/
│  │  │  ├─ manifest.ts                 # `chronicle-full-v2` schema + discriminator (legacy v1 / encounter-v1 are no longer importable)
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
| `forms` | `id`, `name`, `fieldIds[]`, `version`, `createdAt`, `updatedAt`, `archivedAt` | `fieldIds` preserves order and uniqueness; version auto-increments on update |
| `encounters` | `id`, `projectId`, `name`, `startsAt`, `endsAt`, `participantIds[]`, `archivedAt?`, `createdAt`, `updatedAt` | post-event record. `participantIds` is the subset of project participants that attended; `archivedAt` uses empty string for active |
| `observations` | `id`, `encounterId`, `formId`, `formVersion`, `fieldIds[]`, `participantId?`, `title?`, `values`, `createdAt` | each observation snapshots its own form; `values` maps `fieldId → value` or `fieldId → mediaId`; `title` is optional, trimmed, non-empty |
| `media` | `id`, `mime`, `blob`, `size`, `createdAt` | separate table for binaries |
| `chronicles` | `id`, `encounterId`, `title`, `body`, `generatedAt`, `createdAt`, `generatedWith?`, `inputHash?` | one chronicle per encounter (upsert by `encounterId`); `generatedWith?: "deterministic" \| "gemini"` and `inputHash?` (SHA-256 fingerprint, only set when `generatedWith === "gemini"`) |

**Schema versioning:** each change increments the Dexie version and registers migration. Also recorded in `decisions.md`. Current version is **v7** (F9), with a hard-reset upgrade that wipes `participants`, `encounters`, `observations` and `chronicles` and drops the legacy `groups` store. Field, form, media and Settings preferences (theme, brand color, user name, Gemini key) are preserved.

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
| **F4** | **Export/Import (Encounter ZIP + media)** | **Completed 2026-04-18 (baseline): encounter-level self-contained ZIP export, `/import` preview+confirm flow, upsert-by-ID import, JSZip-based infra, unit/E2E tests. Superseded by F8 / post-F8 polish — the `/import` route is gone and the encounter-level export was removed; the legacy `chronicle-encounter-v1` parser is kept for read-only backward compatibility.** |
| **F5** | **Chronicle Generation (first prototype)** | **Completed 2026-04-18 (baseline): deterministic chronicle generation from encounter observations, `/chronicles` list + detail routes, generation action from encounter detail, Dexie schema v5 (`chronicles` table), unit/E2E tests** |
| **F6** | **Post-F5 UX iteration: archive/restore + onboarding + defaults + responsive shell** | **Completed 2026-05-01: encounter archive/restore (Dexie v6, `archivedAt`), observation `title`, unified list tables, mobile nav drawer + theme provider, first-run onboarding dialog, default form + demo encounter seeding, inline media previews, data-aware home dashboard, `/help` and `/how-it-works` guides** |
| **F7** | **Optional Gemini AI chronicle generation (BYOK)** | **Completed 2026-05-01: opt-in `gemini-2.5-flash` generation with BYOK (`localStorage`); `generatedWith` field on `Chronicle`; `/settings` route with masked API key form; `AiSetupGuide` shared component; onboarding 3rd step; "Generada con IA" badge; `infra/ai/` layer; input-hash cache (`Chronicle.inputHash`) added post-F8; no deterministic fallback on Gemini error (category-specific toast instead); `AiKeyStatusBadge` next to every "Generar crónica" entry point; unit + E2E tests green** |
| **F8** | **Always-available global export + user identity + chronicle share** | **Completed 2026-05-01: `chronicle-full-v1` ZIP export from `/settings` (covers every table, media, brand color and author name); per-encounter "Exportar" button removed; importer dispatches between full and legacy `chronicle-encounter-v1` ZIPs; `chronicle.userName` + post-tour `WelcomeNamePrompt` (default detected from `navigator.userAgent`); `useShareChronicle` with `navigator.share` + clipboard fallback wired to a "Compartir" button on chronicle detail; new tour stops `settings.export` and `chronicle.detail.share`; new unit and E2E tests** |
| **Post-F8 polish** | **Home as nav hub, support page consolidation, AI cache and AI key status** | **Completed 2026-05-01: `HomePage` rewritten as a pure icon-grid nav hub; new `/support` route hosts the demo encounter toggle, the data-aware status panel, and the quick-check helper; `/import` route removed (Settings is the canonical importer); `Chronicle.inputHash` SHA-256 cache short-circuits redundant Gemini calls; `AiKeyStatusBadge` always visible next to "Generar crónica"; tests updated to match the new layout** |
| **F9** | **Projects refactor + post-event chronicles + per-observation form snapshot + Dexie v7 hard reset** | **Completed 2026-05-02: `Project` replaces `Group`; encounters are post-event records inside a project (`name`, `startsAt`, `endsAt`, `participantIds[]`); each observation snapshots its own `formId`/`formVersion`/`fieldIds[]`; chronicle generation gated to `/encounters/:id/chronicle`; hub swap (Proyectos in/Grupos+Encuentros out); Dexie v7 hard-reset migration; `chronicle-full-v2` export schema (legacy v1 / encounter-v1 no longer importable); demo encounter rebuilt with two observations using two different forms; onboarding tour rewritten end-to-end. All unit tests green; E2E suite adapted.** |

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
