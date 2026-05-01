import { useCallback, useState } from "react";

import {
  isOnboardingCompleted,
  markOnboardingCompleted,
  resetOnboarding as resetOnboardingService,
} from "@/features/onboarding/services/onboarding-service";

export type UseOnboardingResult = {
  isOpen: boolean;
  dismiss: () => void;
  reopen: () => void;
};

export function useOnboarding(): UseOnboardingResult {
  const [isOpen, setIsOpen] = useState<boolean>(() => !isOnboardingCompleted());

  const dismiss = useCallback(() => {
    markOnboardingCompleted();
    setIsOpen(false);
    if (typeof window !== "undefined") {
      // Notify the rest of the app (e.g. WelcomeNamePrompt) that the
      // tour just finished without waiting for a reload or storage tick.
      window.dispatchEvent(new CustomEvent("chronicle:tour-finished"));
    }
  }, []);

  const reopen = useCallback(() => {
    resetOnboardingService();
    setIsOpen(true);
  }, []);

  return { isOpen, dismiss, reopen };
}
