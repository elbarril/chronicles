import JSZip from "jszip";

import { encounterSchema } from "@/domain/encounter";
import { fieldSchema } from "@/domain/field";
import { observationFormSchema, type ObservationForm } from "@/domain/form";
import { groupSchema, type Group } from "@/domain/group";
import { observationSchema, type Observation, type ObservationValue } from "@/domain/observation";
import { participantSchema, type Participant } from "@/domain/participant";
import { resolveEncounterDependencies } from "@/features/encounters/services/encounter-service";
import { db } from "@/infra/db/client";
import { listObservationsByEncounter } from "@/infra/db/repositories/observation-repository";
import { type EncounterZipManifest, MANIFEST_SCHEMA } from "@/infra/export/manifest";
import { AppError } from "@/lib/error";
import { slugifyLabel } from "@/lib/slugify";

function nowIsoString(): string {
  return new Date().toISOString();
}

function collectMediaIds(values: Record<string, ObservationValue>): string[] {
  return Object.values(values).flatMap((value) => {
    if (typeof value !== "object" || value === null) {
      return [];
    }

    if ("mediaId" in value && typeof value.mediaId === "string") {
      return [value.mediaId];
    }

    if (
      "mediaIds" in value &&
      Array.isArray(value.mediaIds) &&
      value.mediaIds.every((mediaId) => typeof mediaId === "string")
    ) {
      return value.mediaIds;
    }

    return [];
  });
}

function buildFileName(activity: string): string {
  const date = nowIsoString().slice(0, 10);
  return `chronicle-${slugifyLabel(activity)}-${date}.zip`;
}

function assertForm(form: ObservationForm | undefined): ObservationForm {
  if (!form) {
    throw new AppError("EXPORT_ENCOUNTER_NOT_FOUND", "Encounter form snapshot not found.");
  }

  return observationFormSchema.parse(form);
}

async function resolveGroup(groupId: string): Promise<Group> {
  const group = await db.groups.get(groupId);

  if (!group) {
    throw new AppError("EXPORT_ENCOUNTER_NOT_FOUND", "Encounter group not found.");
  }

  return groupSchema.parse(group);
}

async function resolveParticipants(groupId: string): Promise<Participant[]> {
  const participants = await db.participants.where("groupId").equals(groupId).toArray();
  return participants.map((participant) => participantSchema.parse(participant));
}

async function resolveMediaRecords(observations: Observation[]) {
  const mediaIds = new Set(
    observations.flatMap((observation) => collectMediaIds(observation.values)),
  );

  const mediaRecords = await Promise.all(
    [...mediaIds].map(async (mediaId) => {
      const media = await db.media.get(mediaId);

      if (!media) {
        return null;
      }

      return {
        id: media.id,
        mime: media.mime,
        size: media.size,
        createdAt: media.createdAt,
        blob: media.blob,
      };
    }),
  );

  return mediaRecords.filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function triggerDownload(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

export async function exportEncounterToZip(encounterId: string): Promise<void> {
  try {
    const { encounter, fields, form } = await resolveEncounterDependencies(encounterId);
    const parsedEncounter = encounterSchema.parse(encounter);

    const parsedFields = fields.map((field) => fieldSchema.parse(field));
    const parsedForm = assertForm(form);
    const group = await resolveGroup(parsedEncounter.groupId);
    const participants = await resolveParticipants(parsedEncounter.groupId);

    const observations = (await listObservationsByEncounter(encounterId))
      .slice()
      .reverse()
      .map((observation) => observationSchema.parse(observation));

    const mediaRecords = await resolveMediaRecords(observations);

    const manifest: EncounterZipManifest = {
      schema: MANIFEST_SCHEMA,
      exportedAt: nowIsoString(),
      encounterActivity: parsedEncounter.activity,
      groupName: group.name,
      startedAt: parsedEncounter.startedAt,
      endedAt: parsedEncounter.endedAt ?? "",
      observationCount: observations.length,
      mediaIndex: mediaRecords.map((media) => ({
        id: media.id,
        mime: media.mime,
        size: media.size,
        createdAt: media.createdAt,
      })),
    };

    const zip = new JSZip();
    zip.file("manifest.json", JSON.stringify(manifest, null, 2));
    zip.file("encounter.json", JSON.stringify(parsedEncounter, null, 2));
    zip.file("group.json", JSON.stringify(group, null, 2));
    zip.file("participants.json", JSON.stringify(participants, null, 2));
    zip.file("fields.json", JSON.stringify(parsedFields, null, 2));
    zip.file("form.json", JSON.stringify(parsedForm, null, 2));
    zip.file("observations.json", JSON.stringify(observations, null, 2));

    for (const media of mediaRecords) {
      zip.file(`media/${media.id}`, media.blob);
    }

    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    triggerDownload(blob, buildFileName(parsedEncounter.activity));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("EXPORT_FAILED", "Failed to export encounter ZIP.");
  }
}
