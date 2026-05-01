# Domain Glossary

Canonical terminology of the Chronicle project. Every agent must use these terms consistently.

| Spanish Term | Canonical Identifier | Definition (English) |
|---|---|---|
| Actividad | Activity | The task or exercise that the group performs during a session. |
| Campo | Field | Typed definition of a data point to capture during an observation (text, number, date, image, video, audio, etc.). |
| Crónica | Chronicle | Structured narrative report generated from a set of observations. |
| Encuentro | Encounter | Bounded time window during which a group performs an activity. |
| Exportación | Export | User-triggered action that serializes an encounter and all referenced data/media into a portable ZIP package. |
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
