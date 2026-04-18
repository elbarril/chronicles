import { Link, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import { EncounterListTable } from "@/features/encounters/components/EncounterListTable";
import { useEncounters } from "@/features/encounters/hooks/use-encounters";

export function EncounterListPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") === "finished" ? "finished" : "inProgress";
  const { encounters, isLoading } = useEncounters(status);

  return (
    <section className="space-y-6" aria-labelledby="encounter-list-title">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="encounter-list-title" className="text-3xl font-bold tracking-tight">
            Encuentros
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Iniciá y seguí sesiones de observación en tiempo real.
          </p>
        </div>

        <Button asChild>
          <Link to="/encounters/new">Nuevo encuentro</Link>
        </Button>
      </header>

      <div className="flex gap-2" role="tablist" aria-label="Filtros de estado de encuentros">
        <Button
          type="button"
          variant={status === "inProgress" ? "default" : "outline"}
          onClick={() => setSearchParams({ status: "inProgress" })}
        >
          En curso
        </Button>
        <Button
          type="button"
          variant={status === "finished" ? "default" : "outline"}
          onClick={() => setSearchParams({ status: "finished" })}
        >
          Finalizados
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando encuentros...</p>
      ) : (
        <EncounterListTable encounters={encounters} status={status} />
      )}
    </section>
  );
}
