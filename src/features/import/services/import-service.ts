import JSZip from "jszip";

import {
  importFullData,
  parseFullZip,
  type FullImportData,
  type FullImportPreview,
} from "@/infra/export/full-importer";
import {
  anyManifestSchema,
  assertSupportedManifestSchema,
  FULL_MANIFEST_SCHEMA,
} from "@/infra/export/manifest";
import { AppError } from "@/lib/error";

export type ImportPreview = { kind: "full"; preview: FullImportPreview };

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

  // Throws with a descriptive message for legacy (v1, v2) and unknown schemas.
  assertSupportedManifestSchema(schema);

  if (schema === FULL_MANIFEST_SCHEMA) {
    return { kind: "full", preview: await parseFullZip(zip) };
  }

  // Unreachable after assertSupportedManifestSchema, kept as a type-safety net.
  throw new AppError("IMPORT_SCHEMA_MISMATCH", "Unsupported manifest schema.");
}

export async function confirmImport(preview: ImportPreview): Promise<void> {
  await importFullData(preview.preview.data);
}

export type { FullImportPreview, FullImportData };
