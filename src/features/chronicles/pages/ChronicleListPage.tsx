import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { ChronicleCard } from "@/features/chronicles/components/ChronicleCard";
import { useChronicles } from "@/features/chronicles/hooks/use-chronicles";
import { chronicleMessages } from "@/features/chronicles/lib/messages";

export function ChronicleListPage(): JSX.Element {
  const { chronicles, isLoading } = useChronicles();

  return (
    <section className="space-y-6" aria-labelledby="chronicles-list-title">
      <header className="space-y-2">
        <h1 id="chronicles-list-title" className="text-3xl font-bold tracking-tight">
          {chronicleMessages.listTitle}
        </h1>
        <p className="text-muted-foreground text-sm">{chronicleMessages.listDescription}</p>
      </header>

      {isLoading ? <p className="text-muted-foreground text-sm">Cargando crónicas...</p> : null}

      {!isLoading && chronicles.length === 0 ? (
        <section
          className="border-border bg-card rounded-md border p-6 text-center"
          aria-live="polite"
        >
          <h2 className="text-lg font-semibold">{chronicleMessages.emptyTitle}</h2>
          <p className="text-muted-foreground mt-2 text-sm">{chronicleMessages.emptyDescription}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/encounters">{chronicleMessages.goToEncounters}</Link>
          </Button>
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {chronicles.map((item) => (
          <ChronicleCard key={item.chronicle.id} item={item} />
        ))}
      </div>
    </section>
  );
}
