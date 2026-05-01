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
  }, []);

  const reopen = useCallback(() => {
    resetOnboardingService();
    setIsOpen(true);
  }, []);

  return { isOpen, dismiss, reopen };
}
