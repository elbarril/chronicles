---
description: Run the full test suite efficiently during implementation — no blocking processes, no unnecessary builds.
---

# Verify

## Steps

1. Run unit tests first — they are fast (~2 s) and confirm domain logic before exercising the UI:

   ```bash
   pnpm test
   ```

   If this fails, stop. Consult `.agents/skills/test-fix/SKILL.md` to diagnose and fix before continuing.

2. Run E2E tests. The Playwright dev server starts automatically — no build required:

   ```bash
   pnpm test:e2e
   ```

   Output uses `list` reporter: it prints each result to stdout and exits cleanly (no HTTP server left running).

   If this fails, read the full output. Match the failure to a class in `.agents/skills/test-fix/SKILL.md` and apply the fix.

3. To run all checks in one command before committing or closing a phase:

   ```bash
   pnpm check
   ```

   This runs `typecheck → lint → test → test:e2e` in sequence. Fails fast on the first error.

## Notes

- **Do not use `pnpm test:e2e:ci`** during implementation. It rebuilds the app on every run (~1.5 s overhead) and is intended only for CI pipelines.
- **Do not use `pnpm test:watch`** as a Blocking command inside an agent step. Watch mode is a long-running process that never exits; use it only in a dedicated terminal.
- **`reuseExistingServer`** is enabled for local runs. If a Vite dev server (`pnpm dev`) is already running on port 4173, Playwright reuses it — tests start instantly.
- **`pnpm test:e2e:ci`** runs `pnpm build && E2E_PREVIEW=1 playwright test` and uses the HTML reporter. Use this only in CI or when you specifically need to verify the production build.
- If E2E tests fail intermittently due to locator issues, the most common cause is hardcoded data labels. Read the note on data isolation in `.agents/skills/test-fix/SKILL.md`.
