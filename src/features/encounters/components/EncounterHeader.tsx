import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { type Encounter } from "@/domain/encounter";
import { type Participant } from "@/domain/participant";
import { encounterMessages } from "@/features/encounters/lib/messages";

interface EncounterHeaderProps {
  encounter: Encounter;
  projectName: string;
  participants: Participant[];
  observationCount: number;
  onArchive: () => Promise<void>;
  onRestore: () => Promise<void>;
  onRequestDelete: () => void;
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

export function EncounterHeader({
  encounter,
  projectName,
  participants,
  observationCount,
  onArchive,
  onRestore,
  onRequestDelete,
}: EncounterHeaderProps): JSX.Element {
  const isArchived = Boolean(encounter.archivedAt && encounter.archivedAt !== "");

  return (
    <header
      className="border-border bg-card flex flex-col gap-4 rounded-md border p-4"
      data-tour="encounter.detail.header"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight break-words">{encounter.name}</h1>
        <p className="text-muted-foreground text-sm">Proyecto: {projectName}</p>
        {isArchived ? <p className="text-muted-foreground text-xs">Archivado</p> : null}
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">Inicio</dt>
          <dd>{formatDate(encounter.startsAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Cierre</dt>
          <dd>{formatDate(encounter.endsAt)}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-muted-foreground">Observaciones</dt>
          <dd>
            {observationCount} observación
            {observationCount === 1 ? "" : "es"}
          </dd>
        </div>
      </dl>

      <section
        className="space-y-2"
        aria-labelledby="encounter-attendees-title"
        data-tour="encounter.detail.attendees"
      >
        <h2 id="encounter-attendees-title" className="text-muted-foreground text-xs font-medium">
          Asistieron ({participants.length})
        </h2>
        {participants.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No hay participantes registrados en este encuentro.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2" aria-label="Lista de asistentes">
            {participants.map((participant) => (
              <li
                key={participant.id}
                className="bg-muted text-foreground rounded-full px-3 py-1 text-xs"
              >
                {participant.displayName}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto"
          data-tour="encounter.detail.view-chronicle"
        >
          <Link to={`/encounters/${encounter.id}/chronicle`}>
            {encounterMessages.viewChronicleButton}
          </Link>
        </Button>

        {isArchived ? (
          <>
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                void onRestore();
              }}
            >
              Restaurar encuentro
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={onRequestDelete}
            >
              Eliminar encuentro
            </Button>
          </>
        ) : (
          <>
            <Button
              asChild
              variant="secondary"
              className="w-full sm:w-auto"
              data-tour="encounter.detail.edit"
            >
              <Link to={`/encounters/${encounter.id}/edit`}>{encounterMessages.editButton}</Link>
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                void onArchive();
              }}
            >
              Archivar encuentro
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
