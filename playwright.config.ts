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
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    storageState: {
      cookies: [],
      origins: [
        {
          origin: "http://localhost:4173",
          localStorage: [{ name: "chronicle.onboardingCompleted", value: "true" }],
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
