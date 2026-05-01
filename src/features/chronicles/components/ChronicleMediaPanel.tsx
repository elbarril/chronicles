import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Field } from "@/domain/field";
import { type Observation, type ObservationValue } from "@/domain/observation";
import { type Participant } from "@/domain/participant";
import { chronicleMessages } from "@/features/chronicles/lib/messages";
import { useEncounter } from "@/features/encounters/hooks/use-encounter";
import { ObservationMediaList } from "@/features/observations/components/ObservationMediaList";

const MEDIA_FIELD_TYPES: ReadonlySet<Field["type"]> = new Set(["audio", "video", "image", "file"]);

function formatDate(value: string): string {
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function hasAnyMedia(observations: Observation[], mediaFieldIds: Set<string>): boolean {
  return observations.some((observation) =>
    Object.entries(observation.values).some(([fieldId, value]) => {
      if (!mediaFieldIds.has(fieldId)) {
        return false;
      }

      return mediaCount(value as ObservationValue) > 0;
    }),
  );
}

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

function observationLabel(
  observation: Observation,
  participantsById: Map<string, Participant>,
  index: number,
): string {
  const participant = observation.participantId
    ? participantsById.get(observation.participantId)
    : undefined;

  const datePart = formatDate(observation.createdAt);
  const subject = participant?.displayName ?? chronicleMessages.mediaPanelObservationFallback;

  return `Observación ${index + 1} · ${subject} · ${datePart}`;
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

  const mediaFieldIds = new Set(
    fields.filter((field) => MEDIA_FIELD_TYPES.has(field.type)).map((field) => field.id),
  );

  const observationsWithMedia = sortedObservations.filter((observation) =>
    Object.entries(observation.values).some(
      ([fieldId, value]) => mediaFieldIds.has(fieldId) && mediaCount(value as ObservationValue) > 0,
    ),
  );

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
        ) : !hasAnyMedia(sortedObservations, mediaFieldIds) ? (
          <p className="text-muted-foreground text-sm">{chronicleMessages.mediaPanelEmpty}</p>
        ) : (
          <ul className="space-y-4">
            {observationsWithMedia.map((observation, index) => (
              <li key={observation.id} className="border-border space-y-2 rounded-md border p-3">
                <p className="text-muted-foreground text-xs font-medium">
                  {observationLabel(observation, participantsById, index)}
                </p>
                <ObservationMediaList fields={fields} values={observation.values} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
