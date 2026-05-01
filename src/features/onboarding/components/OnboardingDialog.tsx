import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getChronicleForEncounter } from "@/features/chronicles/services/chronicle-service";
import {
  removeDemoEncounter,
  seedDemoEncounter,
} from "@/features/defaults/services/defaults-service";
import { AiSetupGuide } from "@/features/help/components/AiSetupGuide";
import { DataStorageGuide } from "@/features/help/components/DataStorageGuide";
import { HowItWorksGuide } from "@/features/help/components/HowItWorksGuide";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { onboardingMessages, type OnboardingStep } from "@/features/onboarding/messages";
import { cn } from "@/lib/utils";

const INTRO_STEPS = onboardingMessages.introSteps;
const STEPS = onboardingMessages.steps;
const STEP_COUNT = STEPS.length;
const INTRO_COUNT = INTRO_STEPS.length;

type CardPosition = "top" | "bottom";

type TutorialContext = {
  /** Demo encounter id (fixed UUID), set after seeding succeeds. */
  demoEncounterId?: string;
  /** Demo chronicle id, looked up after the demo seed runs. */
  demoChronicleId?: string;
  /**
   * Whether this tutorial run is the one that created the demo data.
   * If false (the demo already existed), we leave it alone on cleanup.
   */
  ownsDemoData: boolean;
};

const initialTutorialContext: TutorialContext = { ownsDemoData: false };

type OnboardingDialogContentProps = {
  onDismiss: () => void;
};

function IntroStepDialog({
  step,
  stepIndex,
  isFirstStep,
  onNext,
  onPrevious,
  onDismiss,
}: {
  step: Extract<OnboardingStep, { kind: "intro" }>;
  stepIndex: number;
  isFirstStep: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onDismiss: () => void;
}): JSX.Element {
  const scrollRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRegionRef.current?.scrollTo?.({ top: 0 });
  }, [stepIndex]);

  function handleOpenChange(open: boolean) {
    if (!open) {
      onDismiss();
    }
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-3xl flex-col gap-4 p-4 sm:p-6">
        <DialogHeader>
          <p
            className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
            aria-live="polite"
          >
            {onboardingMessages.stepCounter(stepIndex + 1, INTRO_COUNT)}
          </p>
          <DialogTitle className="text-2xl">{step.title}</DialogTitle>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>

        <div
          ref={scrollRegionRef}
          className="-mr-2 max-h-[60vh] overflow-y-auto pr-2"
          role="region"
          aria-label={step.title}
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
              onClick={onPrevious}
              disabled={isFirstStep}
            >
              {onboardingMessages.previousButton}
            </Button>
            <Button type="button" size="sm" onClick={onNext}>
              {onboardingMessages.nextButton}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TourStepCard({
  step,
  isLastStep,
  position,
  onNext,
  onPrevious,
  onDismiss,
}: {
  step: Extract<OnboardingStep, { kind: "hub-stop" | "tour" | "outro" }>;
  isLastStep: boolean;
  position: CardPosition;
  onNext: () => void;
  onPrevious: () => void;
  onDismiss: () => void;
}): JSX.Element {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="onboarding-tour-title"
      data-tour-card-position={position}
      className={cn(
        // The tour card must sit above any app-level Radix Dialog
        // (which uses z-50) so it stays visible while a modal —
        // such as the new-observation form — is open.
        "fixed inset-x-0 z-[60] px-3 sm:px-4",
        "pointer-events-none",
        position === "top" ? "top-16 pt-2 sm:top-20 sm:pt-3" : "bottom-0 pb-3 sm:pb-4",
      )}
    >
      <div
        className={cn(
          "bg-card pointer-events-auto mx-auto w-full max-w-3xl rounded-3xl border p-4 shadow-2xl sm:p-5",
          "ring-1 ring-black/5",
        )}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Tutorial
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={onDismiss}>
              {onboardingMessages.skipButton}
            </Button>
          </div>

          <div className="space-y-1.5">
            <h2
              id="onboarding-tour-title"
              className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl"
            >
              {step.title}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">{step.description}</p>
          </div>

          <div className="flex flex-row items-center justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onPrevious}>
              {onboardingMessages.previousButton}
            </Button>
            <Button type="button" size="sm" onClick={onNext}>
              {isLastStep ? onboardingMessages.finishButton : onboardingMessages.nextButton}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function findTourTarget(target: string | undefined): HTMLElement | null {
  if (!target || typeof document === "undefined") {
    return null;
  }

  // The selector is a `data-tour` value (preferred for clarity in JSX).
  const escaped = target.replace(/"/g, '\\"');
  return document.querySelector<HTMLElement>(`[data-tour="${escaped}"]`);
}

/** Decides whether the floating card should sit at the top or the bottom
 *  given the highlighted element's position so the spotlight is never
 *  hidden by the card. */
function pickCardPosition(element: HTMLElement): CardPosition {
  if (typeof window === "undefined") return "bottom";
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement?.clientHeight || 0;
  if (viewportHeight === 0) return "bottom";
  // Estimated card height (compact floating card with title + 2-3 lines):
  const cardSafeHeight = Math.min(280, viewportHeight * 0.4);
  const bottomBandStart = viewportHeight - cardSafeHeight;
  // If the element extends into the bottom band where the card would sit,
  // flip the card to the top instead.
  return rect.bottom > bottomBandStart ? "top" : "bottom";
}

/** Replaces `:demoEncounterId` and `:demoChronicleId` placeholders in
 *  the route template with the actual ids the tutorial obtained when
 *  it seeded the demo data. */
function resolveRoute(template: string, ctx: TutorialContext): string {
  let resolved = template;
  if (ctx.demoEncounterId) {
    resolved = resolved.replace(/:demoEncounterId/g, ctx.demoEncounterId);
  }
  if (ctx.demoChronicleId) {
    resolved = resolved.replace(/:demoChronicleId/g, ctx.demoChronicleId);
  }
  return resolved;
}

function useTourSpotlight(target: string | undefined, route: string): CardPosition {
  const location = useLocation();
  const [position, setPosition] = useState<CardPosition>("bottom");

  useEffect(() => {
    if (!target || location.pathname !== route) {
      return;
    }

    let attempts = 0;
    let activeElement: HTMLElement | null = null;
    let cancelled = false;

    function tryAttach() {
      if (cancelled) return;
      const element = findTourTarget(target);
      if (element) {
        activeElement = element;
        element.setAttribute("data-tour-spotlight", "active");
        // `scrollIntoView` is missing in some test environments (jsdom).
        element.scrollIntoView?.({ behavior: "smooth", block: "center" });
        // Decide card position immediately, then re-check after the smooth
        // scroll has settled so the rect is up-to-date.
        setPosition(pickCardPosition(element));
        if (typeof window !== "undefined") {
          window.setTimeout(() => {
            if (!cancelled && activeElement) {
              setPosition(pickCardPosition(activeElement));
            }
          }, 380);
        }
        return;
      }
      attempts += 1;
      if (attempts < 10) {
        window.setTimeout(tryAttach, 100);
      }
    }

    tryAttach();

    return () => {
      cancelled = true;
      if (activeElement) {
        activeElement.removeAttribute("data-tour-spotlight");
      }
    };
  }, [target, route, location.pathname]);

  return position;
}

/** Manages the demo data that the tutorial uses as a backdrop. Seeds it
 *  once when the user enters the tour and removes it on dismiss/finish
 *  if we were the ones who created it. */
function useTutorialDemoData(stepIndex: number): TutorialContext {
  const [ctx, setCtx] = useState<TutorialContext>(initialTutorialContext);
  const ownsDemoDataRef = useRef(false);
  const seededRef = useRef(false);

  // Seed demo data when we enter the tour (i.e., we're past the intro
  // steps for the first time). Idempotent — the seed function returns
  // `{ created: false }` when the demo already exists.
  useEffect(() => {
    if (stepIndex < INTRO_COUNT) return;
    if (seededRef.current) return;
    seededRef.current = true;

    void (async () => {
      try {
        const outcome = await seedDemoEncounter();
        ownsDemoDataRef.current = outcome.created;

        const chronicle = await getChronicleForEncounter(outcome.encounterId);
        setCtx({
          demoEncounterId: outcome.encounterId,
          demoChronicleId: chronicle?.id,
          ownsDemoData: outcome.created,
        });
      } catch (error) {
        // If seeding fails (e.g., DB unavailable in tests), the tour
        // will fall back to placeholder routes that resolve to "/".
        console.warn("Tutorial seed failed:", error);
      }
    })();
  }, [stepIndex]);

  // Cleanup on unmount: if we created the demo data, remove it.
  useEffect(() => {
    return () => {
      if (ownsDemoDataRef.current) {
        void removeDemoEncounter().catch((error) => {
          console.warn("Tutorial cleanup failed:", error);
        });
      }
    };
  }, []);

  return ctx;
}

function OnboardingDialogContent({ onDismiss }: OnboardingDialogContentProps): JSX.Element | null {
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const tutorialCtx = useTutorialDemoData(stepIndex);

  const currentStep = STEPS[stepIndex];

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEP_COUNT - 1;

  const resolvedRoute =
    currentStep && currentStep.kind !== "intro" ? resolveRoute(currentStep.route, tutorialCtx) : "";

  // Drive navigation for hub-stop, tour and outro steps. We go straight
  // to the resolved route — no detours.
  useEffect(() => {
    if (!currentStep || currentStep.kind === "intro") {
      return;
    }
    if (!resolvedRoute) {
      return;
    }
    if (location.pathname === resolvedRoute) {
      return;
    }
    // Skip navigation if a placeholder still sits in the route — we are
    // waiting for the demo seed to populate the context.
    if (resolvedRoute.includes(":demo")) {
      return;
    }
    navigate(resolvedRoute);
    // We re-run when the step or the resolved route changes (the latter
    // handles the case where seeding completes after a step that needs a
    // dynamic id).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, resolvedRoute]);

  // Apply the spotlight effect on the highlighted element of the current
  // tour step (if any). The hook also reports back the best position for
  // the floating card so we can flip it when the spotlight is at the
  // bottom of the screen.
  const cardPosition = useTourSpotlight(
    currentStep && currentStep.kind !== "intro" ? currentStep.target : undefined,
    resolvedRoute,
  );

  if (!currentStep) {
    return null;
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

  if (currentStep.kind === "intro") {
    return (
      <IntroStepDialog
        step={currentStep}
        stepIndex={stepIndex}
        isFirstStep={isFirstStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onDismiss={onDismiss}
      />
    );
  }

  return (
    <TourStepCard
      step={currentStep}
      isLastStep={isLastStep}
      position={cardPosition}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onDismiss={onDismiss}
    />
  );
}

export function OnboardingDialog(): JSX.Element | null {
  const { isOpen, dismiss } = useOnboarding();

  if (!isOpen) {
    return null;
  }

  return <OnboardingDialogContent onDismiss={dismiss} />;
}
