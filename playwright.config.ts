import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const usePreview = !!process.env.E2E_PREVIEW;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? "html" : "list",
  timeout: 60000, // 60 seconds per test (default is 30s)
  expect: {
    timeout: 10000, // 10 seconds for assertions (default is 5s)
  },
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    actionTimeout: 10000, // 10 seconds for actions (default is 30s, but we want faster feedback)
    storageState: {
      cookies: [],
      origins: [
        {
          origin: "http://localhost:4173",
          localStorage: [
            { name: "chronicle.onboardingCompleted", value: "true" },
            { name: "chronicle.userNamePromptShown", value: "true" },
          ],
        },
      ],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: usePreview ? "pnpm preview --port 4173" : "pnpm dev --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !isCI,
  },
});
