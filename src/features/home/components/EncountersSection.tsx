import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAllEncounters } from "@/features/home/hooks/use-all-encounters";
import { useProjects } from "@/features/projects/hooks/use-projects";

const PAGE_SIZE = 4;

function formatDateTime(value: string): string {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function ProjectSelectorDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): JSX.Element {
  const navigate = useNavigate();
  const { projects, isLoading } = useProjects("active");

  function handleSelectProject(projectId: string): void {
    onClose();
    navigate(`/projects/${projectId}/encounters/new`);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Elegí el proyecto</DialogTitle>
          <DialogDescription>
            Seleccioná el proyecto en el que querés registrar el nuevo encuentro.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Cargando proyectos...</p>
        ) : projects.length === 0 ? (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Todavía no tenés proyectos activos. Creá uno primero para poder registrar encuentros.
            </p>
            <Button asChild>
              <Link to="/projects/new" onClick={onClose}>
                Crear proyecto
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-2" aria-label="Proyectos activos">
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  className="bg-card hover:bg-accent focus-visible:ring-ring w-full rounded-2xl border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  onClick={() => handleSelectProject(project.id)}
                >
                  <p className="font-semibold">{project.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {project.participants.length === 1
                      ? "1 participante"
                      : `${project.participants.length} participantes`}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function EncountersSection(): JSX.Element {
  const { encounters, isLoading } = useAllEncounters();
  const [page, setPage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(encounters.length / PAGE_SIZE));

  const pageEncounters = useMemo(
    () => encounters.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [encounters, page],
  );

  function handlePrevious(): void {
    setPage((p) => Math.max(0, p - 1));
  }

  function handleNext(): void {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }

  return (
    <section
      className="space-y-4"
      aria-labelledby="home-encounters-title"
      data-tour="home.encounters.section"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="home-encounters-title" className="text-xl font-semibold tracking-tight">
          Encuentros recientes
        </h2>
        <Button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          data-tour="home.encounters.new-button"
        >
          Nuevo encuentro
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando encuentros...</p>
      ) : encounters.length === 0 ? (
        <div className="bg-muted/40 rounded-3xl p-6 text-center">
          <p className="text-muted-foreground mb-4 text-sm">
            Todavía no hay encuentros registrados. Creá uno para empezar.
          </p>
          <Button type="button" onClick={() => setIsDialogOpen(true)}>
            Crear primer encuentro
          </Button>
        </div>
      ) : (
        <>
          <ul
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Lista de encuentros recientes"
          >
            {pageEncounters.map(({ encounter, projectName }) => (
              <li
                key={encounter.id}
                className="bg-card flex flex-col gap-3 rounded-2xl border p-4"
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <Link
                    to={`/encounters/${encounter.id}`}
                    className="hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    <p className="truncate font-semibold">{encounter.name}</p>
                  </Link>
                  <p className="text-muted-foreground text-xs">{projectName}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDateTime(encounter.startsAt)}
                  </p>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link to={`/encounters/${encounter.id}`}>Abrir</Link>
                </Button>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div
              className="flex items-center justify-center gap-2"
              role="navigation"
              aria-label="Paginación de encuentros"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={page === 0}
                aria-label="Página anterior"
              >
                ← Anterior
              </Button>
              <span className="text-muted-foreground text-xs" aria-live="polite">
                {page + 1} de {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={page === totalPages - 1}
                aria-label="Página siguiente"
              >
                Siguiente →
              </Button>
            </div>
          )}
        </>
      )}

      <ProjectSelectorDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </section>
  );
}
