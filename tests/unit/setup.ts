import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

import { onboardingStorageKey } from "@/features/onboarding/services/onboarding-service";

beforeEach(() => {
  // Treat onboarding as completed by default so the dialog never shows
  // up in unit tests; specific onboarding tests reset this explicitly.
  window.localStorage.setItem(onboardingStorageKey, "true");
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
