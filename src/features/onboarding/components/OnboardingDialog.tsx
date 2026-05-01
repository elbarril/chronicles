import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AiSetupGuide } from "@/features/help/components/AiSetupGuide";
import { DataStorageGuide } from "@/features/help/components/DataStorageGuide";
import { HowItWorksGuide } from "@/features/help/components/HowItWorksGuide";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { onboardingMessages } from "@/features/onboarding/messages";

const STEP_COUNT = onboardingMessages.steps.length;

type OnboardingDialogContentProps = {
  onDismiss: () => void;
};

function OnboardingDialogContent({ onDismiss }: OnboardingDialogContentProps): JSX.Element | null {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = onboardingMessages.steps[stepIndex];

  if (!currentStep) {
    return null;
  }

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEP_COUNT - 1;

  function handleOpenChange(open: boolean) {
    if (!open) {
      onDismiss();
    }
  }

  function handleNext() {
    if (isLastStep) {
      onDismiss();
      return;
    }
    setStepIndex((value) => Math.min(value + 1, STEP_COUNT - 1));
  }

  function handlePrevious() {
    setStepIndex((value) => Math.max(value - 1, 0));
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-3xl flex-col gap-4 p-4 sm:p-6">
        <DialogHeader>
          <p
            className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
            aria-live="polite"
          >
            {onboardingMessages.stepCounter(stepIndex + 1, STEP_COUNT)}
          </p>
          <DialogTitle className="text-2xl">{currentStep.title}</DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>

        <div
          className="-mr-2 max-h-[60vh] overflow-y-auto pr-2"
          role="region"
          aria-label={currentStep.title}
        >
          {stepIndex === 0 ? (
            <HowItWorksGuide showQuickLinks={false} showNextStep={false} />
          ) : stepIndex === 1 ? (
            <DataStorageGuide showQuickLinks={false} />
          ) : (
            <AiSetupGuide showCta={true} />
          )}
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-2 sm:justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={onDismiss}>
            {onboardingMessages.skipButton}
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={isFirstStep}
            >
              {onboardingMessages.previousButton}
            </Button>
            <Button type="button" size="sm" onClick={handleNext}>
              {isLastStep ? onboardingMessages.finishButton : onboardingMessages.nextButton}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OnboardingDialog(): JSX.Element | null {
  const { isOpen, dismiss } = useOnboarding();

  if (!isOpen) {
    return null;
  }

  return <OnboardingDialogContent onDismiss={dismiss} />;
}
