import { Link, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import { DemoEncounterButton } from "@/features/defaults/components/DemoEncounterButton";
import { ProjectListTable } from "@/features/projects/components/ProjectListTable";
import { useProjectActions } from "@/features/projects/hooks/use-project-actions";
import { useProjects } from "@/features/projects/hooks/use-projects";

export function ProjectListPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") === "archived" ? "archived" : "active";
  const { projects, isLoading } = useProjects(status);
  const actions = useProjectActions();

  return (
    <section className="space-y-6" aria-labelledby="project-list-title">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="project-list-title" className="text-3xl font-bold tracking-tight">
            Proyectos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Cada proyecto agrupa a sus participantes y a los encuentros que tuvieron.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DemoEncounterButton removeOnly />
          <Button asChild data-tour="projects.new-button">
            <Link to="/projects/new">Nuevo proyecto</Link>
          </Button>
        </div>
      </header>

      <div
        className="flex gap-2"
        role="tablist"
        aria-label="Filtros de estado de proyectos"
        data-tour="projects.list-region"
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
        <p className="text-muted-foreground text-sm">Cargando proyectos...</p>
      ) : (
        <ProjectListTable
          projects={projects}
          status={status}
          onArchive={actions.archive}
          onRestore={actions.restore}
        />
      )}
    </section>
  );
}
