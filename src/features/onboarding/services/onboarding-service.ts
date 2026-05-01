const ONBOARDING_STORAGE_KEY = "chronicle.onboardingCompleted";

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function isOnboardingCompleted(): boolean {
  const storage = getStorage();
  if (!storage) {
    return true;
  }

  try {
    return storage.getItem(ONBOARDING_STORAGE_KEY) === "true";
  } catch {
    return true;
  }
}

export function markOnboardingCompleted(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(ONBOARDING_STORAGE_KEY, "true");
  } catch {
    /* storage unavailable; treat as completed for this session */
  }
}

export function resetOnboarding(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export const onboardingStorageKey = ONBOARDING_STORAGE_KEY;
