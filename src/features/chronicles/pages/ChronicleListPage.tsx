import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { ChronicleListTable } from "@/features/chronicles/components/ChronicleListTable";
import { useChronicles } from "@/features/chronicles/hooks/use-chronicles";
import { chronicleMessages } from "@/features/chronicles/lib/messages";
import { DemoEncounterButton } from "@/features/defaults/components/DemoEncounterButton";

export function ChronicleListPage(): JSX.Element {
  const { chronicles, isLoading } = useChronicles();

  return (
    <section className="space-y-6" aria-labelledby="chronicles-list-title">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 id="chronicles-list-title" className="text-3xl font-bold tracking-tight">
            {chronicleMessages.listTitle}
          </h1>
          <p className="text-muted-foreground text-sm">{chronicleMessages.listDescription}</p>
        </div>

        <DemoEncounterButton removeOnly />
      </header>

      <div data-tour="chronicles.list-region">
        {isLoading ? <p className="text-muted-foreground text-sm">Cargando crónicas...</p> : null}

        {!isLoading && chronicles.length === 0 ? (
          <section className="bg-muted/40 rounded-3xl p-6 text-center" aria-live="polite">
            <h2 className="text-lg font-semibold">{chronicleMessages.emptyTitle}</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {chronicleMessages.emptyDescription}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/encounters">{chronicleMessages.goToEncounters}</Link>
            </Button>
          </section>
        ) : null}

        {!isLoading && chronicles.length > 0 ? (
          <ChronicleListTable chronicles={chronicles} />
        ) : null}
      </div>
    </section>
  );
}
