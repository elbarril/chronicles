import { useCallback, useState } from "react";

import {
  clearGeminiApiKey,
  getGeminiApiKey,
  hasGeminiApiKey,
  setGeminiApiKey,
} from "@/features/settings/services/settings-service";

export function useSettings() {
  const [hasKey, setHasKey] = useState<boolean>(() => hasGeminiApiKey());

  const saveKey = useCallback((key: string) => {
    setGeminiApiKey(key);
    setHasKey(hasGeminiApiKey());
  }, []);

  const clearKey = useCallback(() => {
    clearGeminiApiKey();
    setHasKey(false);
  }, []);

  const getKey = useCallback((): string | null => {
    return getGeminiApiKey();
  }, []);

  return { hasKey, saveKey, clearKey, getKey };
}
