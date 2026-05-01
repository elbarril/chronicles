import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { howItWorksGuide } from "@/features/help/messages";

type HowItWorksGuideProps = {
  showQuickLinks?: boolean;
  showNextStep?: boolean;
};

export function HowItWorksGuide({
  showQuickLinks = true,
  showNextStep = true,
}: HowItWorksGuideProps): JSX.Element {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{howItWorksGuide.intro.title}</CardTitle>
          <CardDescription>{howItWorksGuide.intro.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-foreground list-disc space-y-2 pl-5 text-sm">
            {howItWorksGuide.intro.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{howItWorksGuide.workflow.title}</CardTitle>
          <CardDescription>{howItWorksGuide.workflow.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {howItWorksGuide.workflow.steps.map((step) => (
              <li key={step.title} className="border-border border-l-2 pl-4">
                <p className="text-foreground text-sm font-semibold">{step.title}</p>
                <p className="text-muted-foreground mt-1 text-sm">{step.description}</p>
                {showQuickLinks && step.cta ? (
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link to={step.cta.to}>{step.cta.label}</Link>
                  </Button>
                ) : null}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{howItWorksGuide.share.title}</CardTitle>
          <CardDescription>{howItWorksGuide.share.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-foreground list-disc space-y-2 pl-5 text-sm">
            {howItWorksGuide.share.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {showQuickLinks ? (
            <Button asChild variant="outline" size="sm">
              <Link to={howItWorksGuide.share.importLink.to}>
                {howItWorksGuide.share.importLink.label}
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{howItWorksGuide.offline.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-sm">{howItWorksGuide.offline.description}</p>
        </CardContent>
      </Card>

      {showNextStep ? (
        <Card>
          <CardHeader>
            <CardTitle>{howItWorksGuide.nextStep.title}</CardTitle>
            <CardDescription>{howItWorksGuide.nextStep.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link to={howItWorksGuide.nextStep.cta.to}>{howItWorksGuide.nextStep.cta.label}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
