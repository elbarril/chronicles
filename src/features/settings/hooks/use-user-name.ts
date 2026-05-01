import { useCallback, useState } from "react";

import {
  clearUserName,
  detectDefaultUserName,
  getUserName,
  setUserName as persistUserName,
} from "@/features/settings/services/user-name-service";

export function useUserName() {
  const [userName, setUserNameState] = useState<string | null>(() => getUserName());

  const saveName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed === "") {
      return;
    }
    persistUserName(trimmed);
    setUserNameState(trimmed);
  }, []);

  const clearName = useCallback(() => {
    clearUserName();
    setUserNameState(null);
  }, []);

  const refresh = useCallback(() => {
    setUserNameState(getUserName());
  }, []);

  return {
    userName,
    saveName,
    clearName,
    refresh,
    detectDefault: detectDefaultUserName,
  };
}
