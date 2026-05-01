import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import { useChronicleActions } from "@/features/chronicles/hooks/use-chronicle-actions";
import { getChronicleForEncounter } from "@/features/chronicles/services/chronicle-service";
import { DemoEncounterButton } from "@/features/defaults/components/DemoEncounterButton";
import { EncounterListTable } from "@/features/encounters/components/EncounterListTable";
import { useEncounterActions } from "@/features/encounters/hooks/use-encounter-actions";
import { useEncounters } from "@/features/encounters/hooks/use-encounters";
import { type EncounterListFilter } from "@/features/encounters/services/encounter-service";

function parseStatus(value: string | null): EncounterListFilter {
  if (value === "finished" || value === "archived") {
    return value;
  }

  return "inProgress";
}

export function EncounterListPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = parseStatus(searchParams.get("status"));
  const { encounters, isLoading } = useEncounters(status);
  const encounterActions = useEncounterActions();
  const chronicleActions = useChronicleActions();

  const [generatingId, setGeneratingId] = useState<string | undefined>();

  async function handleGenerateChronicle(encounterId: string): Promise<void> {
    setGeneratingId(encounterId);

    try {
      const existing = await getChronicleForEncounter(encounterId);

      if (existing) {
        navigate(`/chronicles/${existing.id}`);
        return;
      }

      const chronicle = await chronicleActions.generate(encounterId);
      navigate(`/chronicles/${chronicle.id}`);
    } finally {
      setGeneratingId(undefined);
    }
  }

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

        <div className="flex flex-wrap items-center gap-2">
          <DemoEncounterButton removeOnly />
          <Button asChild data-tour="encounters.new-button">
            <Link to="/encounters/new">Nuevo encuentro</Link>
          </Button>
        </div>
      </header>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filtros de estado de encuentros"
        data-tour="encounters.filter-bar"
      >
        <Button
          type="button"
          variant={status === "inProgress" ? "tab-active" : "outline"}
          onClick={() => setSearchParams({ status: "inProgress" })}
        >
          En curso
        </Button>
        <Button
          type="button"
          variant={status === "finished" ? "tab-active" : "outline"}
          onClick={() => setSearchParams({ status: "finished" })}
        >
          Finalizados
        </Button>
        <Button
          type="button"
          variant={status === "archived" ? "tab-active" : "outline"}
          onClick={() => setSearchParams({ status: "archived" })}
        >
          Archivados
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando encuentros...</p>
      ) : (
        <EncounterListTable
          encounters={encounters}
          status={status}
          onGenerateChronicle={handleGenerateChronicle}
          onArchive={async (id) => {
            await encounterActions.archive(id);
          }}
          onRestore={async (id) => {
            await encounterActions.restore(id);
          }}
          isGeneratingChronicleId={generatingId}
        />
      )}
    </section>
  );
}
