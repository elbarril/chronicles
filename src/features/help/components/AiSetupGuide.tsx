import { AlertTriangle } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { aiSetupGuide } from "@/features/help/messages";

type AiSetupGuideProps = {
  showCta?: boolean;
};

export function AiSetupGuide({ showCta = true }: AiSetupGuideProps): JSX.Element {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{aiSetupGuide.whatSection.title}</CardTitle>
          <CardDescription>{aiSetupGuide.whatSection.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-foreground list-disc space-y-2 pl-5 text-sm">
            {aiSetupGuide.whatSection.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{aiSetupGuide.privacySection.title}</CardTitle>
          <CardDescription>{aiSetupGuide.privacySection.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-foreground mb-2 text-sm font-medium">Se envía a Google:</p>
            <ul className="text-foreground list-disc space-y-1 pl-5 text-sm">
              {aiSetupGuide.privacySection.sentPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-foreground mb-2 text-sm font-medium">Nunca se envía:</p>
            <ul className="text-foreground list-disc space-y-1 pl-5 text-sm">
              {aiSetupGuide.privacySection.notSentPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2 rounded-md bg-amber-50 p-3 dark:bg-amber-950/30">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {aiSetupGuide.privacySection.warning}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{aiSetupGuide.setupSection.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="text-foreground list-decimal space-y-2 pl-5 text-sm">
            {aiSetupGuide.setupSection.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="text-muted-foreground text-xs">{aiSetupGuide.setupSection.note}</p>
          {showCta && (
            <Button asChild size="sm">
              <Link to={aiSetupGuide.setupSection.ctaTo}>{aiSetupGuide.setupSection.ctaLabel}</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
