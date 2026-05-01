import { beforeEach, describe, expect, it } from "vitest";

import {
  clearGeminiApiKey,
  geminiApiKeyStorageKey,
  getGeminiApiKey,
  hasGeminiApiKey,
  setGeminiApiKey,
} from "@/features/settings/services/settings-service";

describe("settings-service", () => {
  beforeEach(() => {
    window.localStorage.removeItem(geminiApiKeyStorageKey);
  });

  it("reports no key when nothing is stored", () => {
    expect(hasGeminiApiKey()).toBe(false);
    expect(getGeminiApiKey()).toBeNull();
  });

  it("stores and retrieves the API key", () => {
    setGeminiApiKey("AIzaTest1234");

    expect(hasGeminiApiKey()).toBe(true);
    expect(getGeminiApiKey()).toBe("AIzaTest1234");
    expect(window.localStorage.getItem(geminiApiKeyStorageKey)).toBe("AIzaTest1234");
  });

  it("trims the key on save", () => {
    setGeminiApiKey("  AIzaTest1234  ");

    expect(getGeminiApiKey()).toBe("AIzaTest1234");
  });

  it("clears the key", () => {
    setGeminiApiKey("AIzaTest1234");
    expect(hasGeminiApiKey()).toBe(true);

    clearGeminiApiKey();

    expect(hasGeminiApiKey()).toBe(false);
    expect(getGeminiApiKey()).toBeNull();
    expect(window.localStorage.getItem(geminiApiKeyStorageKey)).toBeNull();
  });

  it("reports no key when stored value is empty string", () => {
    window.localStorage.setItem(geminiApiKeyStorageKey, "");

    expect(hasGeminiApiKey()).toBe(false);
  });
});
