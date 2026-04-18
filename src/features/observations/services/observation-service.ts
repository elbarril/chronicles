import { type Field } from "@/domain/field";
import { observationSchema, type ObservationValue } from "@/domain/observation";
import {
  createObservation,
  deleteObservation,
  getObservationById,
  listObservationsByEncounter,
  updateObservation,
} from "@/infra/db/repositories/observation-repository";
import { deleteMediaBlob, saveMediaBlob } from "@/infra/media/store";
import { AppError } from "@/lib/error";

interface ObservationInput {
  encounterId: string;
  participantId?: string;
  values: Record<string, unknown>;
}

function isMediaBlobValue(value: unknown): value is Blob {
  return value instanceof Blob;
}

function isMediaBlobList(value: unknown): value is Blob[] {
  return Array.isArray(value) && value.every((item) => item instanceof Blob);
}

function isMediaRef(value: unknown): value is { mediaId: string } {
  return typeof value === "object" && value !== null && "mediaId" in value;
}

function isMediaRefList(value: unknown): value is { mediaIds: string[] } {
  return typeof value === "object" && value !== null && "mediaIds" in value;
}

async function normalizeValues(
  fields: Field[],
  values: Record<string, unknown>,
): Promise<Record<string, ObservationValue>> {
  const normalizedEntries = await Promise.all(
    fields.map(async (field) => {
      const value = values[field.id];

      if (value === undefined) {
        return [field.id, ""] as const;
      }

      if (
        field.type === "image" ||
        field.type === "video" ||
        field.type === "audio" ||
        field.type === "file"
      ) {
        if (isMediaBlobValue(value)) {
          const mediaId = await saveMediaBlob(value, value.type);
          return [field.id, { mediaId }] as const;
        }

        if (isMediaBlobList(value)) {
          const mediaIds = await Promise.all(value.map((blob) => saveMediaBlob(blob, blob.type)));
          return [field.id, { mediaIds }] as const;
        }

        if (typeof value === "string") {
          return [field.id, value] as const;
        }

        if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
          return [field.id, value] as const;
        }

        if (isMediaRef(value) || isMediaRefList(value)) {
          return [field.id, value] as const;
        }
      }

      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return [field.id, value] as const;
      }

      if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
        return [field.id, value] as const;
      }

      return [field.id, ""] as const;
    }),
  );

  return Object.fromEntries(normalizedEntries) as Record<string, ObservationValue>;
}

function collectMediaIds(values: Record<string, ObservationValue>): string[] {
  return Object.values(values).flatMap((value) => {
    if (typeof value !== "object" || value === null) {
      return [];
    }

    if ("mediaId" in value && typeof value.mediaId === "string") {
      return [value.mediaId];
    }

    if ("mediaIds" in value && Array.isArray(value.mediaIds)) {
      return value.mediaIds;
    }

    return [];
  });
}

export async function createObservationDefinition(fields: Field[], input: ObservationInput) {
  const normalizedValues = await normalizeValues(fields, input.values);

  return createObservation({
    encounterId: input.encounterId,
    participantId: input.participantId,
    values: normalizedValues,
  });
}

export async function updateObservationDefinition(
  fields: Field[],
  observationId: string,
  input: Omit<ObservationInput, "encounterId">,
) {
  const previous = await getObservationById(observationId);

  if (!previous) {
    throw new AppError("OBSERVATION_NOT_FOUND", "Observation not found for update.");
  }

  const normalizedValues = await normalizeValues(fields, input.values);
  const next = await updateObservation(observationId, {
    participantId: input.participantId,
    values: normalizedValues,
  });

  if (!next) {
    throw new AppError("OBSERVATION_NOT_FOUND", "Observation not found for update.");
  }

  const previousMediaIds = new Set(collectMediaIds(previous.values));
  const nextMediaIds = new Set(collectMediaIds(next.values));

  const removedMediaIds = [...previousMediaIds].filter((mediaId) => !nextMediaIds.has(mediaId));

  await Promise.all(removedMediaIds.map((mediaId) => deleteMediaBlob(mediaId)));

  return observationSchema.parse(next);
}

export async function deleteObservationDefinition(observationId: string): Promise<void> {
  const previous = await getObservationById(observationId);

  if (!previous) {
    throw new AppError("OBSERVATION_NOT_FOUND", "Observation not found for delete.");
  }

  const deleted = await deleteObservation(observationId);

  if (!deleted) {
    throw new AppError("OBSERVATION_NOT_FOUND", "Observation not found for delete.");
  }

  const mediaIds = collectMediaIds(previous.values);

  await Promise.all(mediaIds.map((mediaId) => deleteMediaBlob(mediaId)));
}

export async function listEncounterObservations(encounterId: string) {
  return listObservationsByEncounter(encounterId);
}
