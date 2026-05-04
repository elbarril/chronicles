import { type Field } from "@/domain/field";
import { type FormFieldInstance } from "@/domain/form";
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
  instances: FormFieldInstance[],
  fieldsById: Map<string, Field>,
  values: Record<string, unknown>,
): Promise<Record<string, ObservationValue>> {
  const normalizedEntries = await Promise.all(
    instances.map(async (instance) => {
      const field = fieldsById.get(instance.fieldId);
      const value = values[instance.instanceId];

      if (value === undefined) {
        return [instance.instanceId, ""] as const;
      }

      if (
        field &&
        (field.type === "image" ||
          field.type === "video" ||
          field.type === "audio" ||
          field.type === "file")
      ) {
        if (isMediaBlobValue(value)) {
          const mediaId = await saveMediaBlob(value, value.type);
          return [instance.instanceId, { mediaId }] as const;
        }

        if (isMediaBlobList(value)) {
          const mediaIds = await Promise.all(value.map((blob) => saveMediaBlob(blob, blob.type)));
          return [instance.instanceId, { mediaIds }] as const;
        }

        if (typeof value === "string") {
          return [instance.instanceId, value] as const;
        }

        if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
          return [instance.instanceId, value] as const;
        }

        if (isMediaRef(value) || isMediaRefList(value)) {
          return [instance.instanceId, value] as const;
        }
      }

      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return [instance.instanceId, value] as const;
      }

      if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
        return [instance.instanceId, value] as const;
      }

      return [instance.instanceId, ""] as const;
    }),
  );

  return Object.fromEntries(normalizedEntries) as Record<string, ObservationValue>;
}

export interface ResolvedFormSnapshot {
  formId: string;
  formVersion: number;
  instances: FormFieldInstance[];
  fieldsById: Map<string, Field>;
}

async function resolveFormSnapshot(formId: string): Promise<ResolvedFormSnapshot> {
  const form = await getFormById(formId);

  if (!form) {
    throw new AppError("OBSERVATION_FORM_NOT_FOUND", "Form not found for observation.");
  }

  if (form.archivedAt && form.archivedAt !== "") {
    throw new AppError("FORM_ARCHIVED", "Cannot use an archived form for an observation.");
  }

  const allFieldIds = [...new Set(form.fields.map((inst) => inst.fieldId))];
  const fields = await listFieldsByIds(allFieldIds);
  const fieldsById = new Map(fields.map((f) => [f.id, f]));

  return {
    formId: form.id,
    formVersion: form.version,
    instances: form.fields,
    fieldsById,
  };
}

export async function createObservationDefinition(
  input: ObservationCreateInput,
): Promise<Observation> {
  const { formVersion, instances, fieldsById } = await resolveFormSnapshot(input.formId);

  const normalizedValues = await normalizeValues(instances, fieldsById, input.values);

  return createObservation({
    encounterId: input.encounterId,
    formId: input.formId,
    formVersion,
    fields: instances,
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
  const allFieldIds = [...new Set(previous.fields.map((inst) => inst.fieldId))];
  const fields = await listFieldsByIds(allFieldIds);
  const fieldsById = new Map(fields.map((f) => [f.id, f]));

  const normalizedValues = await normalizeValues(previous.fields, fieldsById, input.values);
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

/** Returns the field instances and resolved Field objects for a live form.
 *  Used when creating a new observation (not editing). */
export async function listObservationFormInstances(formId: string): Promise<{
  instances: FormFieldInstance[];
  fieldsById: Map<string, Field>;
}> {
  const { instances, fieldsById } = await resolveFormSnapshot(formId);
  return { instances, fieldsById };
}
