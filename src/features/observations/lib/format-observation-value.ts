import { type Field } from "@/domain/field";

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
});

/**
 * Formats a date-only string (`YYYY-MM-DD`) using the local calendar
 * so the rendered date never shifts due to UTC interpretation.
 */
function formatLocalDate(value: string): string {
  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  if (!match) {
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? trimmed : dateFormatter.format(parsed);
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return dateFormatter.format(date);
}

/**
 * Formats a datetime string (e.g. `YYYY-MM-DDTHH:mm`) using the same
 * locale conventions as the rest of the app (chronicle generation
 * timestamps, observation createdAt, etc.).
 */
function formatLocalDateTime(value: string): string {
  const trimmed = value.trim();
  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }

  return dateTimeFormatter.format(parsed);
}

interface FormatOptions {
  /**
   * Label shown when the value is missing, empty or unsupported.
   * Timeline uses an em-dash, chronicle body uses an explicit "Sin dato".
   */
  emptyLabel?: string;
  /**
   * Label shown for a single attached media reference. Mostly used in
   * the chronicle body since the encounter timeline renders an inline
   * player instead.
   */
  mediaSingleLabel?: string;
  /**
   * Label shown for multiple attached media references.
   */
  mediaCountLabel?: (count: number) => string;
}

const DEFAULT_EMPTY_LABEL = "Sin dato";
const DEFAULT_MEDIA_SINGLE_LABEL = "Archivo multimedia adjunto";
const DEFAULT_MEDIA_COUNT_LABEL = (count: number): string =>
  `${count} archivo(s) multimedia adjunto(s)`;

/**
 * Renders an observation value as a human-readable string for the
 * encounter timeline and chronicle body. Field-aware so that
 * `date`, `datetime` and `boolean` values match the locale conventions
 * used elsewhere in the UI:
 *
 * - `date`        → `30/4/26` (es-AR short date)
 * - `datetime`    → `30/4/26 10:30` (es-AR short date + time)
 * - `boolean`     → `Verdadero` / `Falso`
 *
 * If the field is unknown (form drift), the value is still formatted
 * sensibly using its JavaScript type as a fallback.
 */
export function formatObservationValueAsText(
  field: Field | undefined,
  value: unknown,
  options: FormatOptions = {},
): string {
  const emptyLabel = options.emptyLabel ?? DEFAULT_EMPTY_LABEL;
  const mediaSingleLabel = options.mediaSingleLabel ?? DEFAULT_MEDIA_SINGLE_LABEL;
  const mediaCountLabel = options.mediaCountLabel ?? DEFAULT_MEDIA_COUNT_LABEL;

  if (value === undefined || value === null) {
    return emptyLabel;
  }

  if (field?.type === "date") {
    return typeof value === "string" && value.trim() !== "" ? formatLocalDate(value) : emptyLabel;
  }

  if (field?.type === "datetime") {
    return typeof value === "string" && value.trim() !== ""
      ? formatLocalDateTime(value)
      : emptyLabel;
  }

  if (field?.type === "boolean" || typeof value === "boolean") {
    if (typeof value !== "boolean") {
      return emptyLabel;
    }

    return value ? "Verdadero" : "Falso";
  }

  if (typeof value === "string") {
    return value.trim() === "" ? emptyLabel : value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.length === 0 ? emptyLabel : value.join(", ");
  }

  if (typeof value === "object") {
    if ("mediaId" in value && typeof (value as { mediaId: unknown }).mediaId === "string") {
      return mediaSingleLabel;
    }

    if ("mediaIds" in value && Array.isArray((value as { mediaIds: unknown }).mediaIds)) {
      const mediaIds = (value as { mediaIds: unknown[] }).mediaIds;
      return mediaCountLabel(mediaIds.length);
    }
  }

  return emptyLabel;
}
