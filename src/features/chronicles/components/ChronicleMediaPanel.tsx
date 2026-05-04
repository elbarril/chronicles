import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Field } from "@/domain/field";
import { type Observation, type ObservationValue } from "@/domain/observation";
import { type Participant } from "@/domain/participant";
import { chronicleMessages } from "@/features/chronicles/lib/messages";
import { useEncounter } from "@/features/encounters/hooks/use-encounter";
import { ObservationMediaList } from "@/features/observations/components/ObservationMediaList";

const MEDIA_FIELD_TYPES: ReadonlySet<Field["type"]> = new Set(["audio", "video", "image", "file"]);

function mediaCount(value: ObservationValue | undefined): number {
  if (value === undefined || value === null || typeof value !== "object") {
    return 0;
  }

  if ("mediaId" in value && typeof value.mediaId === "string") {
    return 1;
  }

  if ("mediaIds" in value && Array.isArray(value.mediaIds)) {
    return value.mediaIds.length;
  }

  return 0;
}

/** Returns true if an observation has at least one media value among its instances. */
function observationHasMedia(observation: Observation, fieldsById: Map<string, Field>): boolean {
  return observation.fields.some((instance) => {
    const field = fieldsById.get(instance.fieldId);
    if (!field || !MEDIA_FIELD_TYPES.has(field.type)) return false;
    return mediaCount(observation.values[instance.instanceId] as ObservationValue) > 0;
  });
}

function observationLabel(
  observation: Observation,
  participantsById: Map<string, Participant>,
  index: number,
): string {
  const participant = observation.participantId
    ? participantsById.get(observation.participantId)
    : undefined;

  const subject = participant?.displayName ?? chronicleMessages.mediaPanelObservationFallback;

  return `Observación ${index + 1} · ${subject}`;
}

interface ChronicleMediaPanelProps {
  encounterId: string;
}

export function ChronicleMediaPanel({ encounterId }: ChronicleMediaPanelProps): JSX.Element {
  const { fields, participants, observations, isLoading } = useEncounter(encounterId);

  const sortedObservations = [...observations].sort((left, right) =>
    left.createdAt.localeCompare(right.createdAt),
  );

  const participantsById = new Map(
    participants.map((participant) => [participant.id, participant]),
  );

  const fieldsById = new Map(fields.map((f) => [f.id, f]));

  const observationsWithMedia = sortedObservations.filter((obs) =>
    observationHasMedia(obs, fieldsById),
  );

  const hasAnyMedia = observationsWithMedia.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chronicleMessages.mediaPanelTitle}</CardTitle>
        <CardDescription>{chronicleMessages.mediaPanelDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground text-sm" aria-live="polite">
            {chronicleMessages.mediaPanelLoading}
          </p>
        ) : !hasAnyMedia ? (
          <p className="text-muted-foreground text-sm">{chronicleMessages.mediaPanelEmpty}</p>
        ) : (
          <ul className="space-y-4">
            {observationsWithMedia.map((observation, index) => (
              <li key={observation.id} className="border-border space-y-2 rounded-md border p-3">
                <p className="text-muted-foreground text-xs font-medium">
                  {observationLabel(observation, participantsById, index)}
                </p>
                <ObservationMediaList
                  instances={observation.fields}
                  fieldsById={fieldsById}
                  values={observation.values}
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
