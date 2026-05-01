import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  clearUserName,
  detectDefaultUserName,
  getUserName,
  hasUserName,
  isUserNamePromptShown,
  markUserNamePromptShown,
  resetUserNamePromptShown,
  setUserName,
  userNamePromptShownKey,
  userNameStorageKey,
} from "@/features/settings/services/user-name-service";

describe("user-name service", () => {
  beforeEach(() => {
    window.localStorage.removeItem(userNameStorageKey);
    window.localStorage.removeItem(userNamePromptShownKey);
  });

  afterEach(() => {
    window.localStorage.removeItem(userNameStorageKey);
    window.localStorage.removeItem(userNamePromptShownKey);
  });

  it("returns null when no name is stored", () => {
    expect(getUserName()).toBeNull();
    expect(hasUserName()).toBe(false);
  });

  it("trims and persists a name", () => {
    setUserName("  Emiliano  ");
    expect(window.localStorage.getItem(userNameStorageKey)).toBe("Emiliano");
    expect(getUserName()).toBe("Emiliano");
    expect(hasUserName()).toBe(true);
  });

  it("can be cleared", () => {
    setUserName("Emiliano");
    clearUserName();
    expect(getUserName()).toBeNull();
    expect(hasUserName()).toBe(false);
  });

  it("treats empty stored values as null", () => {
    window.localStorage.setItem(userNameStorageKey, "   ");
    expect(getUserName()).toBeNull();
    expect(hasUserName()).toBe(false);
  });

  it("tracks the prompt-shown flag independently from the name", () => {
    expect(isUserNamePromptShown()).toBe(false);
    markUserNamePromptShown();
    expect(isUserNamePromptShown()).toBe(true);
    resetUserNamePromptShown();
    expect(isUserNamePromptShown()).toBe(false);
  });
});

describe("detectDefaultUserName", () => {
  function withUserAgent(userAgent: string, run: () => void) {
    const originalDescriptor = Object.getOwnPropertyDescriptor(navigator, "userAgent");
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      get: () => userAgent,
    });
    try {
      run();
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(navigator, "userAgent", originalDescriptor);
      }
    }
  }

  it("returns 'Chrome en Linux' for a desktop Chrome on Linux UA", () => {
    withUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      () => {
        expect(detectDefaultUserName()).toBe("Chrome en Linux");
      },
    );
  });

  it("returns 'Firefox en Windows' for a desktop Firefox on Windows UA", () => {
    withUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
      () => {
        expect(detectDefaultUserName()).toBe("Firefox en Windows");
      },
    );
  });

  it("recognises Edge before Chrome (Edg/ is a superset)", () => {
    withUserAgent(
      "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/120 Safari/537.36 Edg/120.0",
      () => {
        expect(detectDefaultUserName()).toBe("Edge en Windows");
      },
    );
  });

  it("recognises Safari only when Chrome is not in the UA", () => {
    withUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 Version/17 Safari/605.1.15",
      () => {
        expect(detectDefaultUserName()).toBe("Safari en macOS");
      },
    );
  });

  it("falls back to a generic value when nothing matches", () => {
    withUserAgent("totally-unknown-bot/1.0", () => {
      const result = detectDefaultUserName();
      // Either a partial match or the generic fallback is acceptable;
      // what matters is that we never return an empty string.
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
