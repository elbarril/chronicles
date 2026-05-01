import { type MediaKind, MediaItem } from "@/components/media/MediaItem";
import { type Field } from "@/domain/field";
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
  fields: Field[];
  values: Observation["values"];
  emptyLabel?: string;
}

/**
 * Renders all media attachments found across an observation's values
 * (one entry per media id, grouped by field). Returns `null` when the
 * observation has no media, unless an `emptyLabel` is provided.
 */
export function ObservationMediaList({
  fields,
  values,
  emptyLabel,
}: ObservationMediaListProps): JSX.Element | null {
  const mediaFields = fields.filter((field) => MEDIA_FIELD_TYPES.has(field.type));

  const items = mediaFields.flatMap((field) => {
    const kind = fieldKind(field.type);

    if (!kind) {
      return [];
    }

    const mediaIds = extractMediaIds(values[field.id]);

    return mediaIds.map((mediaId) => ({
      key: `${field.id}-${mediaId}`,
      field,
      kind,
      mediaId,
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
          <p className="text-muted-foreground text-xs">{item.field.label}</p>
          <MediaItem mediaId={item.mediaId} kind={item.kind} label={item.field.label} />
        </li>
      ))}
    </ul>
  );
}
