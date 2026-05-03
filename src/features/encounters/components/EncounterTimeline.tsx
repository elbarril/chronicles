import { Button } from "@/components/ui/button";
import { type Field } from "@/domain/field";
import { type Observation } from "@/domain/observation";
import { ObservationMediaList } from "@/features/observations/components/ObservationMediaList";
import { formatObservationValueAsText } from "@/features/observations/lib/format-observation-value";

interface EncounterTimelineProps {
  observations: Observation[];
  fieldsById: Map<string, Field>;
  participantById: Map<string, string>;
  onEdit: (observation: Observation) => void;
  onDelete: (observationId: string) => Promise<void>;
}

const MEDIA_FIELD_TYPES: ReadonlySet<Field["type"]> = new Set(["audio", "video", "image", "file"]);

function formatDate(value: string): string {
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function EncounterTimeline({
  observations,
  fieldsById,
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
      {observations.map((observation) => {
        const observationFields = observation.fieldIds
          .map((fieldId) => fieldsById.get(fieldId))
          .filter((field): field is Field => Boolean(field));

        const scalarEntries = Object.entries(observation.values).filter(([fieldId]) => {
          const field = fieldsById.get(fieldId);
          return !field || !MEDIA_FIELD_TYPES.has(field.type);
        });

        return (
          <li
            key={observation.id}
            className="border-border bg-card flex flex-col gap-3 rounded-md border p-4"
          >
            <header className="space-y-1">
              <h3 className="text-base leading-tight font-semibold break-words">
                {observation.title?.trim() ? observation.title : "Sin título"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {observation.participantId
                  ? (participantById.get(observation.participantId) ?? "Participante desconocido")
                  : "Sin participante"}
              </p>
              <p className="text-muted-foreground text-xs">{formatDate(observation.createdAt)}</p>
            </header>

            {scalarEntries.length > 0 ? (
              <dl className="grid gap-2 text-sm">
                {scalarEntries.map(([fieldId, value]) => {
                  const field = fieldsById.get(fieldId);

                  return (
                    <div key={fieldId} className="grid gap-1">
                      <dt className="text-muted-foreground text-xs">{field?.label ?? fieldId}</dt>
                      <dd>{formatObservationValueAsText(field, value, { emptyLabel: "—" })}</dd>
                    </div>
                  );
                })}
              </dl>
            ) : null}

            <ObservationMediaList fields={observationFields} values={observation.values} />

            <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
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
                className="w-full sm:w-auto"
                onClick={() => {
                  void onDelete(observation.id);
                }}
              >
                Eliminar
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
