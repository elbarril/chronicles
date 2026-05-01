import JSZip from "jszip";

import { encounterSchema, type Encounter } from "@/domain/encounter";
import { fieldSchema, type Field } from "@/domain/field";
import { observationFormSchema, type ObservationForm } from "@/domain/form";
import { groupSchema, type Group } from "@/domain/group";
import { observationSchema, type Observation } from "@/domain/observation";
import { participantSchema, type Participant } from "@/domain/participant";
import { db } from "@/infra/db/client";
import {
  encounterZipManifestSchema,
  MANIFEST_SCHEMA,
  type EncounterZipManifest,
} from "@/infra/export/manifest";
import { AppError } from "@/lib/error";

interface MediaImportEntry {
  id: string;
  mime: string;
  size: number;
  createdAt: string;
  blob: Blob;
}

export interface EncounterImportData {
  encounter: Encounter;
  group: Group;
  participants: Participant[];
  fields: Field[];
  form: ObservationForm;
  observations: Observation[];
  mediaEntries: MediaImportEntry[];
}

export interface EncounterImportPreview {
  manifest: EncounterZipManifest;
  data: EncounterImportData;
}

function parseJsonFile<T>(content: string): T {
  return JSON.parse(content) as T;
}

async function getRequiredText(zip: JSZip, fileName: string): Promise<string> {
  const entry = zip.file(fileName);

  if (!entry) {
    throw new AppError("IMPORT_INVALID_ZIP", `Missing required file: ${fileName}`);
  }

  return entry.async("string");
}

export async function parseEncounterZipFromJsZip(zip: JSZip): Promise<EncounterImportPreview> {
  try {
    const manifestRaw = parseJsonFile<unknown>(await getRequiredText(zip, "manifest.json"));
    const manifest = encounterZipManifestSchema.parse(manifestRaw);

    if (manifest.schema !== MANIFEST_SCHEMA) {
      throw new AppError("IMPORT_SCHEMA_MISMATCH", "Unsupported manifest schema.");
    }

    const encounter = encounterSchema.parse(
      parseJsonFile<unknown>(await getRequiredText(zip, "encounter.json")),
    );
    const group = groupSchema.parse(
      parseJsonFile<unknown>(await getRequiredText(zip, "group.json")),
    );
    const participants = parseJsonFile<unknown[]>(
      await getRequiredText(zip, "participants.json"),
    ).map((participant) => participantSchema.parse(participant));
    const fields = parseJsonFile<unknown[]>(await getRequiredText(zip, "fields.json")).map(
      (field) => fieldSchema.parse(field),
    );
    const form = observationFormSchema.parse(
      parseJsonFile<unknown>(await getRequiredText(zip, "form.json")),
    );
    const observations = parseJsonFile<unknown[]>(
      await getRequiredText(zip, "observations.json"),
    ).map((observation) => observationSchema.parse(observation));

    const mediaEntries = await Promise.all(
      manifest.mediaIndex.map(async (mediaInfo) => {
        const entry = zip.file(`media/${mediaInfo.id}`);

        if (!entry) {
          throw new AppError("IMPORT_INVALID_ZIP", `Missing media file: ${mediaInfo.id}`);
        }

        const blob = await entry.async("blob");

        return {
          id: mediaInfo.id,
          mime: mediaInfo.mime,
          size: mediaInfo.size,
          createdAt: mediaInfo.createdAt,
          blob,
        };
      }),
    );

    return {
      manifest,
      data: {
        encounter,
        group,
        participants,
        fields,
        form,
        observations,
        mediaEntries,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("IMPORT_INVALID_ZIP", "ZIP content is invalid.");
  }
}

/** Backwards-compatible entrypoint for callers that received a `File` and
 *  expect a per-encounter ZIP. New callers should use the unified import
 *  service in `features/import`, which can also parse the global
 *  `chronicle-full-v1` format. */
export async function parseEncounterZip(file: File): Promise<EncounterImportPreview> {
  let zip: JSZip;

  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    throw new AppError("IMPORT_INVALID_ZIP", "Invalid ZIP file.");
  }

  return parseEncounterZipFromJsZip(zip);
}

export async function importEncounterData(data: EncounterImportData): Promise<void> {
  try {
    await db.transaction(
      "rw",
      [db.fields, db.forms, db.groups, db.participants, db.encounters, db.observations, db.media],
      async () => {
        await db.fields.bulkPut(data.fields);
        await db.forms.put(data.form);
        await db.groups.put(data.group);
        await db.participants.bulkPut(data.participants);
        await db.encounters.put(data.encounter);
        await db.observations.bulkPut(data.observations);
        await db.media.bulkPut(
          data.mediaEntries.map((media) => ({
            id: media.id,
            mime: media.mime,
            blob: media.blob,
            size: media.size,
            createdAt: media.createdAt,
          })),
        );
      },
    );
  } catch {
    throw new AppError("IMPORT_FAILED", "Failed to import encounter ZIP.");
  }
}
