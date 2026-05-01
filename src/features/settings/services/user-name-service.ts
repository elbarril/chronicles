const USER_NAME_STORAGE_KEY = "chronicle.userName";
const USER_NAME_PROMPT_SHOWN_KEY = "chronicle.userNamePromptShown";

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

export function getUserName(): string | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const value = storage.getItem(USER_NAME_STORAGE_KEY);
    return value && value.trim() !== "" ? value : null;
  } catch {
    return null;
  }
}

export function setUserName(name: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(USER_NAME_STORAGE_KEY, name.trim());
  } catch {
    /* storage unavailable */
  }
}

export function clearUserName(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(USER_NAME_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasUserName(): boolean {
  return getUserName() !== null;
}

/** Best-effort detection of "Browser on OS" from the navigator userAgent
 *  string. Used as the default value for the user name when the user has
 *  not set one explicitly. Returns a generic fallback if detection fails. */
export function detectDefaultUserName(): string {
  if (typeof navigator === "undefined") {
    return "Usuario";
  }

  const userAgent = navigator.userAgent ?? "";
  const browser = detectBrowser(userAgent);
  const os = detectOs(userAgent, navigator.platform ?? "");

  if (browser && os) {
    return `${browser} en ${os}`;
  }

  if (browser) {
    return browser;
  }

  if (os) {
    return os;
  }

  return "Usuario";
}

function detectBrowser(userAgent: string): string | null {
  // Order matters: Edge/Opera contain "Chrome" in their UA, so check them first.
  if (/Edg\//.test(userAgent)) return "Edge";
  if (/OPR\//.test(userAgent) || /Opera/.test(userAgent)) return "Opera";
  if (/Firefox\//.test(userAgent)) return "Firefox";
  if (/Chrome\//.test(userAgent)) return "Chrome";
  if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) return "Safari";
  return null;
}

function detectOs(userAgent: string, platform: string): string | null {
  if (/Android/.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";
  if (/Windows/.test(userAgent)) return "Windows";
  if (/Mac OS X|Macintosh/.test(userAgent)) return "macOS";
  if (/Linux/.test(userAgent)) return "Linux";
  if (platform) {
    return platform;
  }
  return null;
}

export function isUserNamePromptShown(): boolean {
  const storage = getStorage();
  if (!storage) {
    return true;
  }

  try {
    return storage.getItem(USER_NAME_PROMPT_SHOWN_KEY) === "true";
  } catch {
    return true;
  }
}

export function markUserNamePromptShown(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(USER_NAME_PROMPT_SHOWN_KEY, "true");
  } catch {
    /* ignore */
  }
}

export function resetUserNamePromptShown(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(USER_NAME_PROMPT_SHOWN_KEY);
  } catch {
    /* ignore */
  }
}

export const userNameStorageKey = USER_NAME_STORAGE_KEY;
export const userNamePromptShownKey = USER_NAME_PROMPT_SHOWN_KEY;
