import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoEncounterButton } from "@/features/defaults/components/DemoEncounterButton";
import { useDemoEncounterStatus } from "@/features/defaults/hooks/use-demo-encounter-status";
import { useDataStatus } from "@/features/home/hooks/use-data-status";
import { homeMessages, supportMessages } from "@/features/home/messages";

export function SupportPage(): JSX.Element {
  const { status, isLoading } = useDataStatus();
  const navigate = useNavigate();
  const demoStatus = useDemoEncounterStatus();

  function handleQuickCheck() {
    toast.success(homeMessages.setupOkToast);
  }

  return (
    <section className="space-y-6" aria-labelledby="support-title">
      <header className="space-y-2">
        <h1 id="support-title" className="text-3xl font-bold tracking-tight">
          {supportMessages.title}
        </h1>
        <p className="text-muted-foreground text-base">{supportMessages.subtitle}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{homeMessages.quickCheck.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={handleQuickCheck}>
            {homeMessages.quickCheck.button}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {demoStatus.isLoaded
              ? homeMessages.demoEncounter.titleLoaded
              : homeMessages.demoEncounter.titleEmpty}
          </CardTitle>
          <CardDescription>
            {demoStatus.isLoaded
              ? homeMessages.demoEncounter.descriptionLoaded
              : homeMessages.demoEncounter.descriptionEmpty}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DemoEncounterButton
            onLoaded={(encounterId) => {
              navigate(`/encounters/${encounterId}`);
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{homeMessages.dataStatus.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !status ? (
            <p className="text-muted-foreground text-sm" aria-live="polite">
              {homeMessages.dataStatus.loading}
            </p>
          ) : status.hasData ? (
            <div className="space-y-1" aria-live="polite">
              <p className="text-base">{homeMessages.dataStatus.populated}</p>
              <p className="text-muted-foreground text-sm">
                {homeMessages.dataStatus.summary(status.counts)}
              </p>
            </div>
          ) : (
            <p className="text-base" aria-live="polite">
              {homeMessages.dataStatus.empty}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
