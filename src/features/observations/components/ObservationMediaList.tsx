import { type MediaKind, MediaItem } from "@/components/media/MediaItem";
import { type Field } from "@/domain/field";
import { type FormFieldInstance } from "@/domain/form";
import { type Observation, type ObservationValue } from "@/domain/observation";

const MEDIA_FIELD_TYPES: ReadonlySet<Field["type"]> = new Set(["audio", "video", "image", "file"]);

function fieldKind(type: Field["type"]): MediaKind | null {
  if (type === "audio" || type === "video" || type === "image" || type === "file") {
    return type;
  }

  return null;
}

function extractMediaIds(value: ObservationValue | undefined): string[] {
  if (value === undefined || value === null || typeof value !== "object") {
    return [];
  }

  if ("mediaId" in value && typeof value.mediaId === "string") {
    return [value.mediaId];
  }

  if ("mediaIds" in value && Array.isArray(value.mediaIds)) {
    return value.mediaIds.filter((id): id is string => typeof id === "string");
  }

  return [];
}

interface ObservationMediaListProps {
  instances: FormFieldInstance[];
  fieldsById: Map<string, Field>;
  values: Observation["values"];
  emptyLabel?: string;
}

/**
 * Renders all media attachments found across an observation's values
 * (one entry per media id, grouped by instance). Returns `null` when the
 * observation has no media, unless an `emptyLabel` is provided.
 */
export function ObservationMediaList({
  instances,
  fieldsById,
  values,
  emptyLabel,
}: ObservationMediaListProps): JSX.Element | null {
  const items = instances.flatMap((instance) => {
    const field = fieldsById.get(instance.fieldId);

    if (!field || !MEDIA_FIELD_TYPES.has(field.type)) {
      return [];
    }

    const kind = fieldKind(field.type);

    if (!kind) {
      return [];
    }

    const mediaIds = extractMediaIds(values[instance.instanceId]);
    const label = instance.labelOverride?.trim() || field.label;

    return mediaIds.map((mediaId) => ({
      key: `${instance.instanceId}-${mediaId}`,
      kind,
      mediaId,
      label,
    }));
  });

  if (items.length === 0) {
    if (!emptyLabel) {
      return null;
    }

    return <p className="text-muted-foreground text-sm">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.key} className="space-y-1">
          <p className="text-muted-foreground text-xs">{item.label}</p>
          <MediaItem mediaId={item.mediaId} kind={item.kind} label={item.label} />
        </li>
      ))}
    </ul>
  );
}
