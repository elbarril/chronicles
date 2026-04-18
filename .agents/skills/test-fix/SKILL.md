# Test Fix

## Description

Diagnoses and resolves test failures in the Chronicle test suite (Vitest unit tests and Playwright E2E tests).

## Trigger Conditions

Use this skill when:

- `pnpm test` exits with code 1 and a unit test failure is reported.
- `pnpm test:e2e` exits with code 1 and a Playwright E2E failure is reported.
- A test passes locally but fails in CI.
- A test is intermittently flaky across multiple runs.

## Prerequisites

- Read the complete failure output before acting. The error message, file path, and line number are always present.
- Run `pnpm test` before `pnpm test:e2e` — unit failures are faster to fix and must be green first.

## Steps

### 1. Identify the failure class

Match the error output to one of the classes in the lookup table below. If no class matches, read the failing test file before making changes.

### 2. Apply the fix procedure for that class

Follow the procedure in the lookup table exactly. Do not guess — if the class is unclear, add a `console.log` or a temporary `test.only` to isolate.

### 3. Verify the fix

- For unit failures: `pnpm test`
- For E2E failures: `pnpm test:e2e`
- Both must exit with code 0 before proceeding.

---

## Failure Lookup Table

### Unit — `vi.mock` hoisting TDZ (`ReferenceError: Cannot access '...' before initialization`)

**Symptom:**

```
Error: [vitest] There was an error when mocking a module.
Caused by: ReferenceError: Cannot access 'myMock' before initialization
```

**Root cause:** `vi.mock()` calls are hoisted to the top of the file by Vitest at compile time.
Any variable declared with `const`/`let` after the `vi.mock()` call is not yet initialized when the factory runs.

**Fix:**

Option A — inline `vi.fn()` inside the factory (preferred for simple mocks):

```typescript
vi.mock("@/infra/db/repositories/form-repository", () => ({
  createForm: vi.fn(),
  updateForm: vi.fn(),
}));

const createFormMock = vi.mocked(
  (await import("@/infra/db/repositories/form-repository")).createForm,
);
```

Option B — use `vi.hoisted()` to declare the variables before hoisting:

```typescript
const { createFormMock } = vi.hoisted(() => ({
  createFormMock: vi.fn(),
}));

vi.mock("@/infra/db/repositories/form-repository", () => ({
  createForm: createFormMock,
}));
```

---

### Unit — module cannot be resolved (`Cannot find module '@/...'`)

**Symptom:**

```
Error: Cannot find module '@/features/...'
```

**Root cause:** Missing path alias, wrong import path, or the file does not exist yet.

**Fix:**

1. Confirm the file exists at the expected path.
2. Confirm `vitest.config.ts` has `resolve.alias` pointing `@` to `./src`.
3. Check for typos in the import path (case-sensitive on Linux).

---

### Unit — `expect` shape mismatch (`received` does not match `expected`)

**Symptom:**

```
AssertionError: expected { code: 'FORM_NOT_FOUND' } to deeply equal { name: 'AppError', code: 'FORM_NOT_FOUND' }
```

**Root cause:** The mock returns a plain object that is missing fields the assertion requires.

**Fix:** Update the mock return value to include all fields the assertion checks. Use `toMatchObject` instead of `toEqual` when asserting a subset of properties.

---

### E2E — locator timeout (`Test timeout of 30000ms exceeded`)

**Symptom:**

```
Test timeout of 30000ms exceeded.
Error: locator.click: waiting for locator('li').filter({ hasText: 'Ánimo' })...
```

**Root cause (most likely):** The test uses a hardcoded label (`'Ánimo'`) that depends on data
created in a *previous* test run still being present. In a fresh IndexedDB the element does not exist.

**Fix:** Generate unique names per test run using a timestamp suffix:

```typescript
const fieldName = `Ánimo ${Date.now()}`;
// create the field via the UI first, then use fieldName in subsequent locators
```

**Root cause (alternative):** The locator is too broad and the matching element is not in the
expected panel. Scope the locator to the container:

```typescript
const availablePanel = page.locator("div").filter({ hasText: "Campos disponibles" }).first();
await availablePanel.locator("li", { hasText: fieldName }).getByRole("button", { name: "Agregar" }).click();
```

---

### E2E — strict mode violation (`resolved to N elements`)

**Symptom:**

```
Error: strict mode violation: getByRole('cell', { name: '1' }) resolved to 3 elements
```

**Root cause:** The locator matches more than one element. Playwright requires a unique match in strict mode.

**Fix options:**

- Add `{ exact: true }` to the locator: `getByRole("cell", { name: "1", exact: true })`
- Scope the locator to the row: `page.getByRole("row", { name: formName }).getByRole("cell", { name: "1", exact: true })`
- Use `.nth(0)` only as a last resort when exact matching is impossible.

---

### E2E — console blocks after failure (`Serving HTML report at http://localhost:9323`)

**Symptom:** After a failure, Playwright outputs:
```
Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.
```
The process does not exit.

**Root cause:** `reporter: "html"` starts a local HTTP server to view the report.

**Fix:** This should no longer happen after the tooling fix — `pnpm test:e2e` uses `reporter: "list"` by default. If it reappears, verify `playwright.config.ts` sets `reporter: isCI ? "html" : "list"` and that `CI` is not set in your environment.

If you need to investigate a failure visually, run:
```bash
pnpm exec playwright show-report
```
This starts the report server on demand and you can kill it when done.

---

### E2E — element not visible after navigation

**Symptom:**

```
Error: expect(locator).toBeVisible() failed
Locator: getByRole('heading', { name: 'Formularios' })
```

**Root cause:** The page has not finished rendering after navigation.

**Fix:** Add an explicit wait or use the `toBeVisible` assertion with a reasonable timeout.
Playwright's default timeout (5 s for assertions) is usually enough if the app is working correctly.
If the heading never appears, the route or component itself is broken — check the browser console via `page.on('console', ...)` in the test.

---

## Constraints

- NEVER modify a test to bypass the assertion — fix the implementation or the test data instead.
- NEVER use `.first()` to silence a strict mode violation without understanding why there are multiple matches.
- NEVER run `pnpm test:e2e:ci` during an implementation session — it rebuilds every time, adding unnecessary latency. Use `pnpm test:e2e`.
- NEVER run `pnpm test:watch` as a blocking background command. If watch mode is needed, open a separate terminal.
- NEVER rely on data from a previous test run. Every test must create its own data or clean up after itself.
