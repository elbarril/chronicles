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
  onRequestDelete: (observationId: string) => void;
}

const MEDIA_FIELD_TYPES: ReadonlySet<Field["type"]> = new Set(["audio", "video", "image", "file"]);

export function EncounterTimeline({
  observations,
  fieldsById,
  participantById,
  onEdit,
  onRequestDelete,
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
        // values are keyed by instanceId; resolve fieldId via the snapshot
        const instanceToFieldId = new Map(
          observation.fields.map((instance) => [instance.instanceId, instance.fieldId]),
        );

        const scalarEntries = Object.entries(observation.values).filter(([instanceId]) => {
          const fieldId = instanceToFieldId.get(instanceId);
          const field = fieldId ? fieldsById.get(fieldId) : undefined;
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
            </header>

            {scalarEntries.length > 0 ? (
              <dl className="grid gap-2 text-sm">
                {scalarEntries.map(([instanceId, value]) => {
                  const fieldId = instanceToFieldId.get(instanceId);
                  const instance = observation.fields.find((fi) => fi.instanceId === instanceId);
                  const field = fieldId ? fieldsById.get(fieldId) : undefined;
                  const label = instance?.labelOverride?.trim() || field?.label || instanceId;

                  return (
                    <div key={instanceId} className="grid gap-1">
                      <dt className="text-muted-foreground text-xs">{label}</dt>
                      <dd>{formatObservationValueAsText(field, value, { emptyLabel: "—" })}</dd>
                    </div>
                  );
                })}
              </dl>
            ) : null}

            <ObservationMediaList
              instances={observation.fields}
              fieldsById={fieldsById}
              values={observation.values}
            />

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
                  onRequestDelete(observation.id);
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
