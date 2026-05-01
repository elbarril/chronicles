import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onboardingMessages } from "@/features/onboarding/messages";
import { isOnboardingCompleted } from "@/features/onboarding/services/onboarding-service";
import {
  detectDefaultUserName,
  getUserName,
  isUserNamePromptShown,
  markUserNamePromptShown,
  setUserName,
} from "@/features/settings/services/user-name-service";

function shouldShowOnMount(): boolean {
  // We only auto-prompt when:
  //   - the tour was already finished (otherwise the OnboardingDialog is in
  //     charge of the screen and we don't want to overlap),
  //   - the user has no stored name,
  //   - we have not asked them already in a previous session.
  return isOnboardingCompleted() && !getUserName() && !isUserNamePromptShown();
}

export function WelcomeNamePrompt(): JSX.Element | null {
  const [isOpen, setIsOpen] = useState<boolean>(() => shouldShowOnMount());
  const [value, setValue] = useState<string>(() => detectDefaultUserName());

  // Re-check on storage changes / explicit "tour finished" event so the
  // prompt can pop up the same render tree as the tour without waiting
  // for a reload.
  useEffect(() => {
    function handleStorage() {
      if (shouldShowOnMount()) {
        setIsOpen(true);
        setValue((current) => (current.trim() === "" ? detectDefaultUserName() : current));
      }
    }
    window.addEventListener("storage", handleStorage);
    window.addEventListener("chronicle:tour-finished", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("chronicle:tour-finished", handleStorage);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  function handleSave() {
    const trimmed = value.trim();
    if (!trimmed) {
      toast.error(onboardingMessages.namePromptValidationError);
      return;
    }
    setUserName(trimmed);
    markUserNamePromptShown();
    toast.success(onboardingMessages.namePromptSaveSuccess);
    setIsOpen(false);
  }

  function handleSkip() {
    markUserNamePromptShown();
    setIsOpen(false);
  }

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleSkip();
        }
      }}
    >
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle>{onboardingMessages.namePromptTitle}</DialogTitle>
          <DialogDescription>{onboardingMessages.namePromptDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="welcome-user-name">{onboardingMessages.namePromptInputLabel}</Label>
          <Input
            id="welcome-user-name"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={onboardingMessages.namePromptInputPlaceholder}
            autoComplete="off"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSave();
              }
            }}
          />
          <p className="text-muted-foreground text-xs">{onboardingMessages.namePromptHint}</p>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-2 sm:justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={handleSkip}>
            {onboardingMessages.namePromptSkipButton}
          </Button>
          <Button type="button" onClick={handleSave} disabled={!value.trim()}>
            {onboardingMessages.namePromptSaveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
