import { type Field } from "@/domain/field";
import { observationSchema, type Observation, type ObservationValue } from "@/domain/observation";
import { collectObservationMediaIds } from "@/features/observations/lib/collect-media-ids";
import { listFieldsByIds } from "@/infra/db/repositories/field-repository";
import { getFormById } from "@/infra/db/repositories/form-repository";
import {
  createObservation,
  deleteObservation,
  getObservationById,
  listObservationsByEncounter,
  updateObservation,
} from "@/infra/db/repositories/observation-repository";
import { deleteMediaBlob, saveMediaBlob } from "@/infra/media/store";
import { AppError } from "@/lib/error";

interface ObservationCreateInput {
  encounterId: string;
  formId: string;
  participantId?: string;
  title?: string;
  values: Record<string, unknown>;
}

interface ObservationUpdateInput {
  formId: string;
  participantId?: string;
  title?: string;
  values: Record<string, unknown>;
}

function normalizeTitle(title: string | undefined): string | undefined {
  if (typeof title !== "string") {
    return undefined;
  }

  const trimmed = title.trim();
  return trimmed.length > 0 ? trimmed : undefined;
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

async function resolveFormSnapshot(
  formId: string,
): Promise<{ form: Awaited<ReturnType<typeof getFormById>>; fields: Field[] }> {
  const form = await getFormById(formId);

  if (!form) {
    throw new AppError("OBSERVATION_FORM_NOT_FOUND", "Form not found for observation.");
  }

  if (form.archivedAt && form.archivedAt !== "") {
    throw new AppError("FORM_ARCHIVED", "Cannot use an archived form for an observation.");
  }

  const fields = await listFieldsByIds(form.fieldIds);

  return { form, fields };
}

export async function createObservationDefinition(
  input: ObservationCreateInput,
): Promise<Observation> {
  const { form, fields } = await resolveFormSnapshot(input.formId);

  if (!form) {
    throw new AppError("OBSERVATION_FORM_NOT_FOUND", "Form not found for observation.");
  }

  const normalizedValues = await normalizeValues(fields, input.values);

  return createObservation({
    encounterId: input.encounterId,
    formId: form.id,
    formVersion: form.version,
    fieldIds: form.fieldIds,
    participantId: input.participantId,
    title: normalizeTitle(input.title),
    values: normalizedValues,
  });
}

export async function updateObservationDefinition(
  observationId: string,
  input: ObservationUpdateInput,
): Promise<Observation> {
  const previous = await getObservationById(observationId);

  if (!previous) {
    throw new AppError("OBSERVATION_NOT_FOUND", "Observation not found for update.");
  }

  // Re-resolve fields using the snapshot the observation was created with so
  // updates keep referencing the same form version, even if the live form has
  // since been edited.
  const fields = await listFieldsByIds(previous.fieldIds);

  const normalizedValues = await normalizeValues(fields, input.values);
  const next = await updateObservation(observationId, {
    participantId: input.participantId,
    title: normalizeTitle(input.title),
    values: normalizedValues,
  });

  if (!next) {
    throw new AppError("OBSERVATION_NOT_FOUND", "Observation not found for update.");
  }

  const previousMediaIds = new Set(collectObservationMediaIds(previous));
  const nextMediaIds = new Set(collectObservationMediaIds(next));

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

  const mediaIds = collectObservationMediaIds(previous);

  await Promise.all(mediaIds.map((mediaId) => deleteMediaBlob(mediaId)));
}

export async function listEncounterObservations(encounterId: string) {
  return listObservationsByEncounter(encounterId);
}

export async function listObservationFormFields(formId: string): Promise<Field[]> {
  const { fields } = await resolveFormSnapshot(formId);
  return fields;
}
