import { beforeEach, describe, expect, it } from "vitest";

import {
  isOnboardingCompleted,
  markOnboardingCompleted,
  onboardingStorageKey,
  resetOnboarding,
} from "@/features/onboarding/services/onboarding-service";

describe("onboarding-service", () => {
  beforeEach(() => {
    window.localStorage.removeItem(onboardingStorageKey);
  });

  it("reports onboarding as not completed when nothing is stored", () => {
    expect(isOnboardingCompleted()).toBe(false);
  });

  it("marks onboarding as completed and persists the flag", () => {
    markOnboardingCompleted();

    expect(isOnboardingCompleted()).toBe(true);
    expect(window.localStorage.getItem(onboardingStorageKey)).toBe("true");
  });

  it("resets onboarding so it shows again on next visit", () => {
    markOnboardingCompleted();
    expect(isOnboardingCompleted()).toBe(true);

    resetOnboarding();

    expect(isOnboardingCompleted()).toBe(false);
    expect(window.localStorage.getItem(onboardingStorageKey)).toBeNull();
  });
});
