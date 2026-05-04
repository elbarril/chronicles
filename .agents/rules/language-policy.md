# Language Policy (Canonical Rule)

This repository follows a strict bilingual split: internal artifacts are in English, while user-facing content remains in rioplatense Spanish. 

## 1. English (Internal Artifacts)

Agents MUST use English for:
- Code identifiers, types, functions, variables, constants, enums
- File and directory names
- Code comments, JSDoc/TSDoc
- All thrown `Error` and `AppError` messages in `src/domain`, `src/infra`, `src/features/**/services/**`, `src/features/**/hooks/**`, `src/lib/**`, `src/app/**`
- Unit, integration, and E2E test names, descriptions, and assertion messages (except when asserting on specific Spanish UI strings)
- All files under `.agents/`, `.windsurf/`
- `AGENTS.md`, `README.md`, `docs/**`
- Git commit messages and branch names
- Route paths and URL query parameter names/values
- Package metadata
- Glossary term definitions (column 3 in `glossary.md`)

## 2. Rioplatense Spanish (User-Facing Content)

Agents MUST use Spanish for:
- Text inside JSX/HTML that the user reads: headings, labels, placeholders, button text, empty states, confirmation dialogs, captions, legends
- `toast.*()` copy that surfaces to the user
- `aria-label`, `aria-description`, `aria-live` content (for screen readers)
- `<title>` and meta tags
- `lang="es-AR"` on `<html>`
- `toLocaleString("es-AR", ...)` and equivalent locale formatting
- Agent conversation with the user: use natural rioplatense Spanish

## 3. Boundary Rule: Developer Errors vs User Messages

Never throw a Spanish string from a service layer.

Instead, throw an `AppError` with a stable English code:
```typescript
throw new AppError("FIELD_KEY_TAKEN", "A field with the same key already exists.");
```

At the UI/hook boundary, catch the `AppError` and map its code to Spanish copy using a per-feature `messages.ts` catalog:
```typescript
const message = error instanceof AppError && error.code === "FIELD_KEY_TAKEN"
  ? fieldMessages.keyAlreadyTaken
  : fieldMessages.createError;
toast.error(message);
```
