import JSZip from "jszip";

import { type BrandColor } from "@/app/theme";
import { chronicleSchema, type Chronicle } from "@/domain/chronicle";
import { encounterSchema, type Encounter } from "@/domain/encounter";
import { fieldSchema, type Field } from "@/domain/field";
import { observationFormSchema, type ObservationForm } from "@/domain/form";
import { groupSchema, type Group } from "@/domain/group";
import { observationSchema, type Observation } from "@/domain/observation";
import { participantSchema, type Participant } from "@/domain/participant";
import { db } from "@/infra/db/client";
import {
  FULL_MANIFEST_SCHEMA,
  fullZipManifestSchema,
  type FullZipManifest,
} from "@/infra/export/manifest";
import { AppError } from "@/lib/error";

interface MediaImportEntry {
  id: string;
  mime: string;
  size: number;
  createdAt: string;
  blob: Blob;
}

export interface FullImportData {
  fields: Field[];
  forms: ObservationForm[];
  groups: Group[];
  participants: Participant[];
  encounters: Encounter[];
  observations: Observation[];
  chronicles: Chronicle[];
  mediaEntries: MediaImportEntry[];
  brandColor?: BrandColor;
  exportedBy?: string;
}

export interface FullImportPreview {
  manifest: FullZipManifest;
  data: FullImportData;
}

async function getRequiredText(zip: JSZip, fileName: string): Promise<string> {
  const entry = zip.file(fileName);
  if (!entry) {
    throw new AppError("IMPORT_INVALID_ZIP", `Missing required file: ${fileName}`);
  }
  return entry.async("string");
}

async function getOptionalText(zip: JSZip, fileName: string): Promise<string | null> {
  const entry = zip.file(fileName);
  if (!entry) {
    return null;
  }
  return entry.async("string");
}

function parseJson<T>(content: string): T {
  return JSON.parse(content) as T;
}

export async function parseFullZip(zip: JSZip): Promise<FullImportPreview> {
  try {
    const manifestRaw = parseJson<unknown>(await getRequiredText(zip, "manifest.json"));
    const manifest = fullZipManifestSchema.parse(manifestRaw);

    if (manifest.schema !== FULL_MANIFEST_SCHEMA) {
      throw new AppError("IMPORT_SCHEMA_MISMATCH", "Unsupported manifest schema.");
    }

    const fields = parseJson<unknown[]>(await getRequiredText(zip, "fields.json")).map((field) =>
      fieldSchema.parse(field),
    );
    const forms = parseJson<unknown[]>(await getRequiredText(zip, "forms.json")).map((form) =>
      observationFormSchema.parse(form),
    );
    const groups = parseJson<unknown[]>(await getRequiredText(zip, "groups.json")).map((group) =>
      groupSchema.parse(group),
    );
    const participants = parseJson<unknown[]>(await getRequiredText(zip, "participants.json")).map(
      (participant) => participantSchema.parse(participant),
    );
    const encounters = parseJson<unknown[]>(await getRequiredText(zip, "encounters.json")).map(
      (encounter) => encounterSchema.parse(encounter),
    );
    const observations = parseJson<unknown[]>(await getRequiredText(zip, "observations.json")).map(
      (observation) => observationSchema.parse(observation),
    );

    const chroniclesText = await getOptionalText(zip, "chronicles.json");
    const chronicles = chroniclesText
      ? parseJson<unknown[]>(chroniclesText).map((chronicle) => chronicleSchema.parse(chronicle))
      : [];

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
        fields,
        forms,
        groups,
        participants,
        encounters,
        observations,
        chronicles,
        mediaEntries,
        brandColor: manifest.brandColor,
        exportedBy: manifest.exportedBy,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("IMPORT_INVALID_ZIP", "Full export ZIP content is invalid.");
  }
}

export async function importFullData(data: FullImportData): Promise<void> {
  try {
    await db.transaction(
      "rw",
      [
        db.fields,
        db.forms,
        db.groups,
        db.participants,
        db.encounters,
        db.observations,
        db.chronicles,
        db.media,
      ],
      async () => {
        await db.fields.bulkPut(data.fields);
        await db.forms.bulkPut(data.forms);
        await db.groups.bulkPut(data.groups);
        await db.participants.bulkPut(data.participants);
        await db.encounters.bulkPut(data.encounters);
        await db.observations.bulkPut(data.observations);
        await db.chronicles.bulkPut(data.chronicles);
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
    throw new AppError("IMPORT_FAILED", "Failed to import full Chronicle data ZIP.");
  }
}
