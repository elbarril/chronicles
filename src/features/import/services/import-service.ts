import JSZip from "jszip";

import {
  importEncounterData,
  parseEncounterZipFromJsZip,
  type EncounterImportData,
  type EncounterImportPreview,
} from "@/infra/export/encounter-importer";
import {
  importFullData,
  parseFullZip,
  type FullImportData,
  type FullImportPreview,
} from "@/infra/export/full-importer";
import { anyManifestSchema, FULL_MANIFEST_SCHEMA, MANIFEST_SCHEMA } from "@/infra/export/manifest";
import { AppError } from "@/lib/error";

export type ImportPreview =
  | { kind: "encounter"; preview: EncounterImportPreview }
  | { kind: "full"; preview: FullImportPreview };

async function readManifestSchema(zip: JSZip): Promise<string> {
  const entry = zip.file("manifest.json");
  if (!entry) {
    throw new AppError("IMPORT_INVALID_ZIP", "Missing required file: manifest.json");
  }
  const text = await entry.async("string");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new AppError("IMPORT_INVALID_ZIP", "Invalid manifest.json content.");
  }
  return anyManifestSchema.parse(parsed).schema;
}

export async function parseZipForImport(file: File): Promise<ImportPreview> {
  let zip: JSZip;

  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    throw new AppError("IMPORT_INVALID_ZIP", "Invalid ZIP file.");
  }

  const schema = await readManifestSchema(zip);

  if (schema === FULL_MANIFEST_SCHEMA) {
    return { kind: "full", preview: await parseFullZip(zip) };
  }

  if (schema === MANIFEST_SCHEMA) {
    return { kind: "encounter", preview: await parseEncounterZipFromJsZip(zip) };
  }

  throw new AppError("IMPORT_SCHEMA_MISMATCH", "Unsupported manifest schema.");
}

export async function confirmImport(preview: ImportPreview): Promise<void> {
  if (preview.kind === "encounter") {
    await importEncounterData(preview.preview.data);
    return;
  }

  await importFullData(preview.preview.data);
}

// Backwards-compatible aliases for callers/tests that still use the old
// per-encounter-only signatures.
export async function confirmZipImport(data: EncounterImportData): Promise<void> {
  await importEncounterData(data);
}

export type { EncounterImportPreview, EncounterImportData, FullImportPreview, FullImportData };
