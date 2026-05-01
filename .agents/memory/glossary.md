# Domain Glossary

Canonical terminology of the Chronicle project. Every agent must use these terms consistently.

| Spanish Term | Canonical Identifier | Definition (English) |
|---|---|---|
| Actividad | Activity | The task or exercise that the group performs during a session. |
| Campo | Field | Typed definition of a data point to capture during an observation (text, number, date, image, video, audio, etc.). |
| Crónica | Chronicle | Structured narrative report generated from a set of observations. |
| Encuentro | Encounter | Bounded time window during which a group performs an activity. |
| Exportación | Export | User-triggered action that serializes the entire local Chronicle database (all entities + media + brand color + author name) into a portable ZIP package using the `chronicle-full-v1` manifest schema. Available from the Settings page regardless of whether the database has any encounters or chronicles. |
| Formulario de Observación | Form | Ordered and versioned set of Fields instantiated in each Encounter to capture Observations. |
| Grupo | Group | Set of participants observed together in a session. |
| Importación | Import | User-confirmed action that parses a Chronicle ZIP package and upserts records by id into local storage. |
| Institución | Institution | The organizational context where the activity takes place. |
| Observación | Observation | Instance of values captured for a Form within an Encounter, optionally attributed to a Participant. |
| Participante | Participant | Individual member of a group being observed. |
| Practicante | Practitioner | The person (or agent) capturing observations in real-time. |
| Archivar / Archivado | Archive / Archived | Soft-hide state for an entity (groups, fields, forms, encounters) that keeps the record in storage but excludes it from active lists. Tracked via `archivedAt` (empty string when active, ISO datetime when archived). |
| Restaurar | Restore | Reverse of Archive: clears `archivedAt` so the entity returns to active lists. |
| Encuentro de prueba | Demo Encounter | Pre-populated example encounter seeded by the `defaults` feature on first run, exercising every field type with synthetic media; can be removed and restored from the UI. |
| Bienvenida / Onboarding | Onboarding | First-run welcome dialog presented to new users, gated by the `chronicle.onboardingCompleted` flag in `localStorage`. |
| Tema | Theme | Light/dark visual mode handled by `ThemeProvider`, persisted in `localStorage` (`chronicle-theme`) with `prefers-color-scheme` fallback. |
| Configuración / Ajustes | Settings | User preferences page at `/settings`. Holds the brand color picker, the user name form, the global "Exportar todo" button, the import drop-zone, and the Gemini API key form for BYOK AI generation. |
| Clave de API / BYOK | BYOK (Bring Your Own Key) | User-provided Google Gemini API key stored in `localStorage` under `chronicle.geminiApiKey`. The key is never sent to any server; Chronicle has no backend. |
| Generada con IA | AI-generated | Chronicle whose `generatedWith` field equals `"gemini"`, indicated by a visible badge in `ChronicleViewer`. |
| Tu nombre | User Name | Local-only identity string stored in `localStorage` under `chronicle.userName`. Defaults to a value detected from `navigator.userAgent` (e.g. `Chrome en Linux`). Used as the author of full exports and as a slug in the default file name. |
| Compartir | Share | Native sharing of a chronicle (title + body) from the chronicle detail page, using `navigator.share` when available and falling back to copying the text to the clipboard. |
| Soporte | Support | Helper page at `/support` that hosts the demo encounter toggle ("Cargar encuentro de prueba" / "Eliminar contenido de prueba"), the data-status summary, and the quick check action. The home page (`/`) is now a pure nav hub and links here. |
| Estado de clave (IA) | AI Key Status | Visual chip (`AiKeyStatusBadge`) placed next to every "Generar crónica" button. Reads `chronicle.geminiApiKey` from `localStorage` and renders `Sin clave configurada` (deterministic generation will run) or `Clave configurada` (Gemini will be attempted). |
