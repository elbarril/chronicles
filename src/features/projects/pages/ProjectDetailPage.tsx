import { Link, useNavigate, useParams, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import { useEncounterActions } from "@/features/encounters/hooks/use-encounter-actions";
import { ProjectEncounterListTable } from "@/features/projects/components/ProjectEncounterListTable";
import { useProject } from "@/features/projects/hooks/use-project";
import { useProjectActions } from "@/features/projects/hooks/use-project-actions";
import { type ProjectEncounterFilter } from "@/features/projects/services/project-service";

function parseEncounterStatus(value: string | null): ProjectEncounterFilter {
  return value === "archived" ? "archived" : "active";
}

function formatDate(value: string): string {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function ProjectDetailPage(): JSX.Element {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = params.id ?? "";
  const [searchParams, setSearchParams] = useSearchParams();
  const status = parseEncounterStatus(searchParams.get("status"));
  const { project, encounters, isLoading } = useProject(projectId, status);
  const projectActions = useProjectActions();
  const encounterActions = useEncounterActions();

  if (!projectId) {
    return <p className="text-muted-foreground text-sm">Proyecto inválido.</p>;
  }

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Cargando proyecto...</p>;
  }

  if (!project) {
    return (
      <section className="space-y-3" aria-labelledby="project-missing-title">
        <h1 id="project-missing-title" className="text-3xl font-bold tracking-tight">
          Proyecto no encontrado
        </h1>
        <p className="text-muted-foreground text-sm">
          No pudimos encontrar este proyecto. Puede haber sido eliminado.
        </p>
        <Button type="button" variant="secondary" onClick={() => navigate("/projects")}>
          Volver a proyectos
        </Button>
      </section>
    );
  }

  const isArchived = Boolean(project.archivedAt && project.archivedAt !== "");

  async function handleArchiveEncounter(encounterId: string): Promise<void> {
    await encounterActions.archive(encounterId);
  }

  async function handleRestoreEncounter(encounterId: string): Promise<void> {
    await encounterActions.restore(encounterId);
  }

  return (
    <section className="space-y-6" aria-labelledby="project-detail-title">
      <nav aria-label="Migas de pan">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/projects">← Volver a proyectos</Link>
        </Button>
      </nav>

      <header
        className="border-border bg-card flex flex-col gap-4 rounded-md border p-4"
        data-tour="project.detail.header"
      >
        <div className="space-y-1">
          <h1 id="project-detail-title" className="text-2xl font-bold tracking-tight break-words">
            {project.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {project.participants.length} participante
            {project.participants.length === 1 ? "" : "s"} · creado el{" "}
            {formatDate(project.createdAt)}
          </p>
          {isArchived ? <p className="text-muted-foreground text-xs">Archivado</p> : null}
        </div>

        <ul
          className="flex flex-wrap gap-2"
          aria-label="Lista de participantes"
          data-tour="project.detail.participants"
        >
          {project.participants.map((participant) => (
            <li
              key={participant.id}
              className="bg-muted text-foreground rounded-full px-3 py-1 text-xs"
            >
              {participant.displayName}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap">
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link to={`/projects/${project.id}/edit`}>Editar proyecto</Link>
          </Button>
          {isArchived ? (
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                void projectActions.restore(project.id);
              }}
            >
              Restaurar proyecto
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                void projectActions.archive(project.id);
              }}
            >
              Archivar proyecto
            </Button>
          )}
        </div>
      </header>

      <section className="space-y-4" aria-labelledby="project-encounters-title">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="project-encounters-title" className="text-xl font-semibold">
            Encuentros del proyecto
          </h2>
          <Button asChild data-tour="project.detail.new-encounter">
            <Link to={`/projects/${project.id}/encounters/new`}>Crear encuentro</Link>
          </Button>
        </header>

        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtros de estado de encuentros"
          data-tour="project.detail.encounters-filter"
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

        <ProjectEncounterListTable
          encounters={encounters}
          status={status}
          projectId={project.id}
          onArchive={handleArchiveEncounter}
          onRestore={handleRestoreEncounter}
        />
      </section>
    </section>
  );
}
