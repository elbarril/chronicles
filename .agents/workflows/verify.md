---
description: Run project verification efficiently with a single command and optional troubleshooting fallbacks.
---

# Verify

## Steps

1. Validate lockfile integrity before commit/deploy:

   ```bash
   pnpm install --frozen-lockfile
   ```

   - If this fails with lockfile drift, run `pnpm install` to regenerate `pnpm-lock.yaml`.
   - Commit both `package.json` and `pnpm-lock.yaml` together when dependency metadata changes.

2. Run full verification in a single command before committing or running closeout:

   ```bash
   pnpm check
   ```

   This runs `typecheck → lint → test → test:e2e` in sequence and fails fast on the first error.

3. If `pnpm check` fails and you need focused troubleshooting, run individual commands:

   ```bash
   pnpm test
   pnpm test:e2e
   ```

   - Use `pnpm test` first for fast domain-level feedback.
   - Use `pnpm test:e2e` to diagnose Playwright/UI flows.
   - Match failures to `.agents/skills/test-fix/SKILL.md` and apply the corresponding fix pattern.

## Notes

- **Do not use `pnpm test:e2e:ci`** during implementation. It rebuilds the app on every run (~1.5 s overhead) and is intended only for CI pipelines.
- **Do not use `pnpm test:watch`** as a Blocking command inside an agent step. Watch mode is a long-running process that never exits; use it only in a dedicated terminal.
- **`reuseExistingServer`** is enabled for local runs. If a Vite dev server (`pnpm dev`) is already running on port 4173, Playwright reuses it — tests start instantly.
- **`pnpm test:e2e:ci`** runs `pnpm build && E2E_PREVIEW=1 playwright test` and uses the HTML reporter. Use this only in CI or when you specifically need to verify the production build.
- **Vercel and most CI environments install with frozen lockfile by default.** A local pass of `pnpm install --frozen-lockfile` is the canonical preflight guard.
- If E2E tests fail intermittently due to locator issues, the most common cause is hardcoded data labels. Read the note on data isolation in `.agents/skills/test-fix/SKILL.md`.
