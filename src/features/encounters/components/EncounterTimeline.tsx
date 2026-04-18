import { Button } from "@/components/ui/button";
import { type Observation } from "@/domain/observation";

interface EncounterTimelineProps {
  observations: Observation[];
  participantById: Map<string, string>;
  onEdit: (observation: Observation) => void;
  onDelete: (observationId: string) => Promise<void>;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function valueToText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object" && value !== null) {
    if ("mediaId" in value) {
      return "Archivo adjunto";
    }

    if ("mediaIds" in value) {
      const mediaIds = (value as { mediaIds?: unknown }).mediaIds;
      return Array.isArray(mediaIds) ? `${mediaIds.length} archivos adjuntos` : "Archivos adjuntos";
    }
  }

  return "—";
}

export function EncounterTimeline({
  observations,
  participantById,
  onEdit,
  onDelete,
}: EncounterTimelineProps): JSX.Element {
  if (observations.length === 0) {
    return (
      <div className="border-border bg-card rounded-md border p-6 text-center">
        <p className="text-muted-foreground">Todavía no hay observaciones en este encuentro.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {observations.map((observation) => (
        <li key={observation.id} className="border-border bg-card space-y-3 rounded-md border p-4">
          <header className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium">
                {observation.participantId
                  ? (participantById.get(observation.participantId) ?? "Participante desconocido")
                  : "Sin participante"}
              </p>
              <p className="text-muted-foreground text-xs">{formatDate(observation.createdAt)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  onEdit(observation);
                }}
              >
                Editar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  void onDelete(observation.id);
                }}
              >
                Eliminar
              </Button>
            </div>
          </header>

          <dl className="grid gap-2 text-sm">
            {Object.entries(observation.values).map(([fieldId, value]) => (
              <div key={fieldId} className="grid gap-1">
                <dt className="text-muted-foreground text-xs">{fieldId}</dt>
                <dd>{valueToText(value)}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}
