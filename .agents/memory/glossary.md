# Domain Glossary

Canonical terminology of the Chronicle project. Every agent must use these terms consistently.

| Spanish Term | Canonical Identifier | Definition (English) |
|---|---|---|
| Actividad | Activity | The task or exercise that the group performs during a session. (Domain-level concept; since F9 there is no `activity` field on encounters — the encounter `name` plays that role.) |
| Campo | Field | Typed definition of a data point to capture during an observation (text, number, date, image, video, audio, etc.). |
| Crónica | Chronicle | Structured narrative report generated from the observations of an encounter. Generation is gated to `/encounters/:id/chronicle` (the only entry point in the UI). |
| Encuentro | Encounter | Post-event record of a session that already happened, scoped to a Project. Holds `name`, `startsAt`, `endsAt`, `participantIds[]` (subset of the project participants), and `archivedAt?`. There is no "in progress / finished" lifecycle: encounters are archive/restore only. |
| Exportación | Export | User-triggered action that serializes the entire local Chronicle database (all entities + media + brand color + author name) into a portable ZIP package using the `chronicle-full-v2` manifest schema. Available from the Settings page regardless of whether the database has any encounters or chronicles. |
| Formulario de Observación | Form | Ordered and versioned set of Fields. Each Observation snapshots the form (`formId`/`formVersion`/`fieldIds[]`) it was created with, so a single Encounter can mix observations from different forms. |
| Proyecto | Project | Set of Participants that take part in a sequence of Encounters. Replaces the F0–F8 `Group` concept: a project owns its participants and groups the encounters that happen with them. |
| Participante | Participant | Individual member of a project being observed (`projectId`). |
| Practicante | Practitioner | The person (or agent) registering observations after each encounter. |
| Importación | Import | User-confirmed action that parses a Chronicle `chronicle-full-v2` ZIP package and upserts records by id into local storage. Legacy v1 / encounter-v1 ZIPs are rejected. |
| Institución | Institution | The organizational context where the activity takes place. |
| Observación | Observation | Instance of values captured for a specific Form within an Encounter, optionally attributed to a Participant. Each observation carries its own form snapshot (`formId`/`formVersion`/`fieldIds[]`). |
| Archivar / Archivado | Archive / Archived | Soft-hide state for an entity (projects, fields, forms, encounters) that keeps the record in storage but excludes it from active lists. Tracked via `archivedAt` (empty string when active, ISO datetime when archived). |
| Restaurar | Restore | Reverse of Archive: clears `archivedAt` so the entity returns to active lists. |
| Encuentro de prueba | Demo Encounter | Pre-populated example seeded by the `defaults` feature on demand (`Cargar encuentro de prueba`): a demo project with two participants, one encounter, and two observations using two different forms (one covering every field type, one with longText + audio). Can be removed and re-created from the Support page. |
| Bienvenida / Onboarding | Onboarding | First-run welcome dialog presented to new users, gated by the `chronicle.onboardingCompleted` flag in `localStorage`. Walks through Campos → Formularios → Proyectos → Encuentro → Observación → Crónica del encuentro → Configuración → Crónicas globales → Compartir. |
| Tema | Theme | Light/dark visual mode handled by `ThemeProvider`, persisted in `localStorage` (`chronicle-theme`) with `prefers-color-scheme` fallback. |
| Configuración / Ajustes | Settings | User preferences page at `/settings`. Holds the brand color picker, the user name form, the global "Exportar todo" button, the import drop-zone, and the Gemini API key form for BYOK AI generation. |
| Clave de API / BYOK | BYOK (Bring Your Own Key) | User-provided Google Gemini API key stored in `localStorage` under `chronicle.geminiApiKey`. The key is never sent to any server; Chronicle has no backend. |
| Generada con IA | AI-generated | Chronicle whose `generatedWith` field equals `"gemini"`, indicated by a visible badge in `ChronicleViewer`. |
| Tu nombre | User Name | Local-only identity string stored in `localStorage` under `chronicle.userName`. Defaults to a value detected from `navigator.userAgent` (e.g. `Chrome en Linux`). Used as the author of full exports and as a slug in the default file name. |
| Compartir | Share | Native sharing of a chronicle (title + body) from the chronicle detail page or the encounter chronicle page, using `navigator.share` when available and falling back to copying the text to the clipboard. |
| Soporte | Support | Helper page at `/support` that hosts the demo encounter toggle, the data-status summary, and the quick-check action. The home page (`/`) is a pure nav hub and links here. |
| Estado de clave (IA) | AI Key Status | Visual chip (`AiKeyStatusBadge`) placed next to the "Generar crónica" button on `/encounters/:id/chronicle`. Reads `chronicle.geminiApiKey` from `localStorage` and renders `Sin clave configurada` (deterministic generation will run) or `Clave configurada` (Gemini will be attempted). |
