const GEMINI_API_KEY_STORAGE_KEY = "chronicle.geminiApiKey";

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

export function getGeminiApiKey(): string | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(GEMINI_API_KEY_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

export function setGeminiApiKey(key: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(GEMINI_API_KEY_STORAGE_KEY, key.trim());
  } catch {
    /* storage unavailable */
  }
}

export function clearGeminiApiKey(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasGeminiApiKey(): boolean {
  const key = getGeminiApiKey();
  return key !== null && key.trim() !== "";
}

export const geminiApiKeyStorageKey = GEMINI_API_KEY_STORAGE_KEY;
