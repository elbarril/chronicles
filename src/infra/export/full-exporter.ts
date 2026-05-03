import JSZip from "jszip";

import { type BrandColor } from "@/app/theme";
import { chronicleSchema, type Chronicle } from "@/domain/chronicle";
import { encounterSchema, type Encounter } from "@/domain/encounter";
import { fieldSchema, type Field } from "@/domain/field";
import { observationFormSchema, type ObservationForm } from "@/domain/form";
import { observationSchema, type Observation } from "@/domain/observation";
import { participantSchema, type Participant } from "@/domain/participant";
import { projectSchema, type Project } from "@/domain/project";
import { db } from "@/infra/db/client";
import { FULL_MANIFEST_SCHEMA, type FullZipManifest } from "@/infra/export/manifest";
import { AppError } from "@/lib/error";
import { slugifyLabel } from "@/lib/slugify";

interface MediaRecord {
  id: string;
  mime: string;
  size: number;
  createdAt: string;
  blob: Blob;
}

export interface FullExportOptions {
  /** Stored user name (or detected default). Used as the author of the export
   *  and as part of the suggested file name. */
  userName?: string;
  /** Current brand color preference. Persisted in the export so an
   *  imported backup can restore the user's appearance. */
  brandColor?: BrandColor;
}

function nowIsoString(): string {
  return new Date().toISOString();
}

function buildFileName(userName: string | undefined): string {
  const date = nowIsoString().slice(0, 10);
  const slug = userName ? slugifyLabel(userName) : "";
  return slug ? `chronicle-${slug}-${date}.zip` : `chronicle-${date}.zip`;
}

function triggerDownload(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

async function loadAll(): Promise<{
  fields: Field[];
  forms: ObservationForm[];
  projects: Project[];
  participants: Participant[];
  encounters: Encounter[];
  observations: Observation[];
  chronicles: Chronicle[];
  media: MediaRecord[];
}> {
  const [
    rawFields,
    rawForms,
    rawProjects,
    rawParticipants,
    rawEncounters,
    rawObservations,
    rawChronicles,
    rawMedia,
  ] = await Promise.all([
    db.fields.toArray(),
    db.forms.toArray(),
    db.projects.toArray(),
    db.participants.toArray(),
    db.encounters.toArray(),
    db.observations.toArray(),
    db.chronicles.toArray(),
    db.media.toArray(),
  ]);

  return {
    fields: rawFields.map((field) => fieldSchema.parse(field)),
    forms: rawForms.map((form) => observationFormSchema.parse(form)),
    projects: rawProjects.map((project) => projectSchema.parse(project)),
    participants: rawParticipants.map((participant) => participantSchema.parse(participant)),
    encounters: rawEncounters.map((encounter) => encounterSchema.parse(encounter)),
    observations: rawObservations.map((observation) => observationSchema.parse(observation)),
    chronicles: rawChronicles.map((chronicle) => chronicleSchema.parse(chronicle)),
    media: rawMedia.map((media) => ({
      id: media.id,
      mime: media.mime,
      size: media.size,
      createdAt: media.createdAt,
      blob: media.blob,
    })),
  };
}

export async function exportFullToZip(options: FullExportOptions = {}): Promise<void> {
  try {
    const data = await loadAll();

    const manifest: FullZipManifest = {
      schema: FULL_MANIFEST_SCHEMA,
      exportedAt: nowIsoString(),
      ...(options.userName ? { exportedBy: options.userName } : {}),
      ...(options.brandColor ? { brandColor: options.brandColor } : {}),
      counts: {
        fields: data.fields.length,
        forms: data.forms.length,
        projects: data.projects.length,
        participants: data.participants.length,
        encounters: data.encounters.length,
        observations: data.observations.length,
        chronicles: data.chronicles.length,
        media: data.media.length,
      },
      mediaIndex: data.media.map((media) => ({
        id: media.id,
        mime: media.mime,
        size: media.size,
        createdAt: media.createdAt,
      })),
    };

    const zip = new JSZip();
    zip.file("manifest.json", JSON.stringify(manifest, null, 2));
    zip.file("fields.json", JSON.stringify(data.fields, null, 2));
    zip.file("forms.json", JSON.stringify(data.forms, null, 2));
    zip.file("projects.json", JSON.stringify(data.projects, null, 2));
    zip.file("participants.json", JSON.stringify(data.participants, null, 2));
    zip.file("encounters.json", JSON.stringify(data.encounters, null, 2));
    zip.file("observations.json", JSON.stringify(data.observations, null, 2));
    zip.file("chronicles.json", JSON.stringify(data.chronicles, null, 2));

    for (const media of data.media) {
      zip.file(`media/${media.id}`, media.blob);
    }

    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    triggerDownload(blob, buildFileName(options.userName));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("EXPORT_FAILED", "Failed to export full Chronicle data ZIP.");
  }
}
