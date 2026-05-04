import { useState } from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { projectMessages } from "@/features/projects/lib/messages";
import { type ProjectWithParticipants } from "@/features/projects/services/project-service";

interface ProjectListTableProps {
  projects: ProjectWithParticipants[];
  status: "active" | "archived";
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function ProjectActions({
  project,
  status,
  onArchive,
  onRestore,
  onRequestDelete,
}: {
  project: ProjectWithParticipants;
  status: "active" | "archived";
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onRequestDelete: (id: string) => void;
}): JSX.Element {
  if (status === "active") {
    return (
      <>
        <Button asChild size="sm" variant="outline">
          <Link to={`/projects/${project.id}`}>Abrir</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to={`/projects/${project.id}/edit`}>Editar</Link>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            void onArchive(project.id);
          }}
        >
          Archivar
        </Button>
      </>
    );
  }

  return (
    <>
      <Button asChild size="sm" variant="outline">
        <Link to={`/projects/${project.id}`}>Abrir</Link>
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          void onRestore(project.id);
        }}
      >
        Restaurar
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() => {
          onRequestDelete(project.id);
        }}
      >
        Eliminar
      </Button>
    </>
  );
}

export function ProjectListTable({
  projects,
  status,
  onArchive,
  onRestore,
  onDelete,
}: ProjectListTableProps): JSX.Element {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete(): Promise<void> {
    if (!pendingDeleteId) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(pendingDeleteId);
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  }

  if (projects.length === 0) {
    return (
      <div className="bg-muted/40 rounded-3xl p-6 text-center">
        <p className="text-muted-foreground mb-4">
          {status === "active"
            ? "Todavía no hay proyectos activos."
            : "No hay proyectos archivados para mostrar."}
        </p>
        {status === "active" ? (
          <Button asChild>
            <Link to="/projects/new">Crear primer proyecto</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {/* Mobile / tablet: cards */}
      <ul className="grid gap-3 lg:hidden" aria-label="Listado de proyectos">
        {projects.map((project) => (
          <li key={project.id} className="bg-muted/40 space-y-3 rounded-2xl p-4">
            <div className="space-y-1">
              <p className="text-base font-semibold">
                <Link
                  to={`/projects/${project.id}`}
                  className="hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {project.name}
                </Link>
              </p>
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Participantes:</dt>
                <dd>{project.participants.length}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2 pt-1">
              <ProjectActions
                project={project}
                status={status}
                onArchive={onArchive}
                onRestore={onRestore}
                onRequestDelete={setPendingDeleteId}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Listado de proyectos</caption>
          <thead>
            <tr className="text-muted-foreground text-xs tracking-wide uppercase">
              <th className="px-3 py-2 text-left font-medium">Nombre</th>
              <th className="px-3 py-2 text-left font-medium">Participantes</th>
              <th className="px-3 py-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-border/60 border-t">
                <td className="px-3 py-3 align-middle font-medium">
                  <Link
                    to={`/projects/${project.id}`}
                    className="hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {project.name}
                  </Link>
                </td>
                <td className="px-3 py-3 align-middle">{project.participants.length}</td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex justify-end gap-2">
                    <ProjectActions
                      project={project}
                      status={status}
                      onArchive={onArchive}
                      onRestore={onRestore}
                      onRequestDelete={setPendingDeleteId}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteDialog
        open={pendingDeleteId !== null}
        title={projectMessages.confirmDeleteTitle}
        description={projectMessages.confirmDeleteDescription}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        isLoading={isDeleting}
      />
    </>
  );
}
