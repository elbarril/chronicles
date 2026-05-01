import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

import { onboardingStorageKey } from "@/features/onboarding/services/onboarding-service";
import { userNamePromptShownKey } from "@/features/settings/services/user-name-service";

beforeEach(() => {
  // Treat onboarding as completed by default so the dialog never shows
  // up in unit tests; specific onboarding tests reset this explicitly.
  window.localStorage.setItem(onboardingStorageKey, "true");
  // The welcome name prompt is gated by the same "first run" idea — pre-mark
  // it as already shown so it never interferes with unrelated tests.
  window.localStorage.setItem(userNamePromptShownKey, "true");
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
