import { useState } from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { type Encounter } from "@/domain/encounter";
import { encounterMessages } from "@/features/encounters/lib/messages";

interface ProjectEncounterListTableProps {
  encounters: Encounter[];
  status: "active" | "archived";
  projectId: string;
  onArchive: (encounterId: string) => Promise<void>;
  onRestore: (encounterId: string) => Promise<void>;
  onDelete: (encounterId: string) => Promise<void>;
}

function formatDateTime(value: string): string {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function EncounterRowActions({
  encounter,
  status,
  onArchive,
  onRestore,
  onRequestDelete,
}: {
  encounter: Encounter;
  status: "active" | "archived";
  onArchive: (encounterId: string) => Promise<void>;
  onRestore: (encounterId: string) => Promise<void>;
  onRequestDelete: (encounterId: string) => void;
}): JSX.Element {
  return (
    <>
      <Button asChild size="sm" variant="outline">
        <Link to={`/encounters/${encounter.id}`}>Abrir</Link>
      </Button>
      {status === "archived" ? (
        <>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              void onRestore(encounter.id);
            }}
          >
            Restaurar
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => {
              onRequestDelete(encounter.id);
            }}
          >
            Eliminar
          </Button>
        </>
      ) : (
        <>
          <Button asChild size="sm" variant="outline">
            <Link to={`/encounters/${encounter.id}/edit`}>Editar</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              void onArchive(encounter.id);
            }}
          >
            Archivar
          </Button>
        </>
      )}
    </>
  );
}

export function ProjectEncounterListTable({
  encounters,
  status,
  projectId,
  onArchive,
  onRestore,
  onDelete,
}: ProjectEncounterListTableProps): JSX.Element {
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

  if (encounters.length === 0) {
    return (
      <div className="bg-muted/40 rounded-3xl p-6 text-center">
        <p className="text-muted-foreground mb-4">
          {status === "active"
            ? "Este proyecto todavía no tiene encuentros activos."
            : "No hay encuentros archivados en este proyecto."}
        </p>
        {status === "active" ? (
          <Button asChild>
            <Link to={`/projects/${projectId}/encounters/new`}>Crear primer encuentro</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {/* Mobile / tablet: cards */}
      <ul className="grid gap-3 lg:hidden" aria-label="Listado de encuentros del proyecto">
        {encounters.map((encounter) => (
          <li key={encounter.id} className="bg-muted/40 space-y-3 rounded-2xl p-4">
            <div className="space-y-1">
              <p className="text-base font-semibold">
                <Link
                  to={`/encounters/${encounter.id}`}
                  className="hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {encounter.name}
                </Link>
              </p>
              <p className="text-muted-foreground text-xs">
                {formatDateTime(encounter.startsAt)} → {formatDateTime(encounter.endsAt)}
              </p>
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Participantes:</dt>
                <dd>{encounter.participantIds.length}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2 pt-1">
              <EncounterRowActions
                encounter={encounter}
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
          <caption className="sr-only">Listado de encuentros del proyecto</caption>
          <thead>
            <tr className="text-muted-foreground text-xs tracking-wide uppercase">
              <th className="px-3 py-2 text-left font-medium">Nombre</th>
              <th className="px-3 py-2 text-left font-medium">Inicio</th>
              <th className="px-3 py-2 text-left font-medium">Cierre</th>
              <th className="px-3 py-2 text-left font-medium">Participantes</th>
              <th className="px-3 py-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {encounters.map((encounter) => (
              <tr key={encounter.id} className="border-border/60 border-t">
                <td className="px-3 py-3 align-middle font-medium">
                  <Link
                    to={`/encounters/${encounter.id}`}
                    className="hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {encounter.name}
                  </Link>
                </td>
                <td className="text-muted-foreground px-3 py-3 align-middle">
                  {formatDateTime(encounter.startsAt)}
                </td>
                <td className="text-muted-foreground px-3 py-3 align-middle">
                  {formatDateTime(encounter.endsAt)}
                </td>
                <td className="px-3 py-3 align-middle">{encounter.participantIds.length}</td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex flex-wrap justify-end gap-2">
                    <EncounterRowActions
                      encounter={encounter}
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
        title={encounterMessages.confirmDeleteTitle}
        description={encounterMessages.confirmDeleteDescription}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        isLoading={isDeleting}
      />
    </>
  );
}
