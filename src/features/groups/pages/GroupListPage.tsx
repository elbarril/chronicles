import { Link, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import { DemoEncounterButton } from "@/features/defaults/components/DemoEncounterButton";
import { GroupListTable } from "@/features/groups/components/GroupListTable";
import { useGroupActions } from "@/features/groups/hooks/use-group-actions";
import { useGroups } from "@/features/groups/hooks/use-groups";

export function GroupListPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") === "archived" ? "archived" : "active";
  const { groups, isLoading } = useGroups(status);
  const actions = useGroupActions();

  return (
    <section className="space-y-6" aria-labelledby="group-list-title">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="group-list-title" className="text-3xl font-bold tracking-tight">
            Grupos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestioná grupos y participantes para usar en encuentros.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DemoEncounterButton removeOnly />
          <Button asChild data-tour="groups.new-button">
            <Link to="/groups/new">Nuevo grupo</Link>
          </Button>
        </div>
      </header>

      <div
        className="flex gap-2"
        role="tablist"
        aria-label="Filtros de estado de grupos"
        data-tour="groups.list-region"
      >
        <Button
          type="button"
          variant={status === "active" ? "tab-active" : "outline"}
          onClick={() => setSearchParams({ status: "active" })}
        >
          Activos
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
        <p className="text-muted-foreground text-sm">Cargando grupos...</p>
      ) : (
        <GroupListTable
          groups={groups}
          status={status}
          onArchive={actions.archive}
          onRestore={actions.restore}
        />
      )}
    </section>
  );
}
