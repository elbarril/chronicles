import { z } from "zod";

import { AppError } from "@/lib/error";

/** Current manifest schema for full Chronicle exports. F11 migrated
 *  ObservationForm and Observation to use FormFieldInstance[] (fields) instead
 *  of string[] (fieldIds), and keyed observation values by instanceId instead
 *  of fieldId. Any previous schema (`v1`, `v2`, `chronicle-encounter-v1`) is
 *  no longer importable. */
export const FULL_MANIFEST_SCHEMA = "chronicle-full-v3" as const;

/** All known legacy schema identifiers that are explicitly unsupported. */
const LEGACY_SCHEMAS = [
  "chronicle-encounter-v1",
  "chronicle-full-v1",
  "chronicle-full-v2",
] as const;
type LegacySchema = (typeof LEGACY_SCHEMAS)[number];

function isLegacySchema(schema: string): schema is LegacySchema {
  return (LEGACY_SCHEMAS as readonly string[]).includes(schema);
}

/** Validate that the manifest schema string is acceptable for import.
 *  Throws an `AppError` with a stable code when the schema is a known
 *  legacy version or is simply unrecognised. Service-level messages are
 *  in English; the UI maps `IMPORT_SCHEMA_MISMATCH` to user copy via
 *  `src/features/import/lib/messages.ts`. */
export function assertSupportedManifestSchema(schema: string): void {
  if (isLegacySchema(schema)) {
    throw new AppError(
      "IMPORT_SCHEMA_MISMATCH",
      `Manifest schema "${schema}" is no longer supported. Export from a newer Chronicle version.`,
    );
  }

  if (schema !== FULL_MANIFEST_SCHEMA) {
    throw new AppError(
      "IMPORT_SCHEMA_MISMATCH",
      `Unknown manifest schema "${schema}". Only "${FULL_MANIFEST_SCHEMA}" is accepted.`,
    );
  }
}

export interface FullZipManifest {
  schema: typeof FULL_MANIFEST_SCHEMA;
  exportedAt: string;
  /** Optional author name set by the user in Settings (or detected). */
  exportedBy?: string;
  /** Optional brand color preference at export time. */
  brandColor?: "amber" | "indigo" | "forest";
  counts: {
    fields: number;
    forms: number;
    projects: number;
    participants: number;
    encounters: number;
    observations: number;
    chronicles: number;
    media: number;
  };
  mediaIndex: Array<{
    id: string;
    mime: string;
    size: number;
    createdAt: string;
  }>;
}

export const fullZipManifestSchema = z.object({
  schema: z.literal(FULL_MANIFEST_SCHEMA),
  exportedAt: z.string().datetime(),
  exportedBy: z.string().trim().min(1).optional(),
  brandColor: z.enum(["amber", "indigo", "forest"]).optional(),
  counts: z.object({
    fields: z.number().int().nonnegative(),
    forms: z.number().int().nonnegative(),
    projects: z.number().int().nonnegative(),
    participants: z.number().int().nonnegative(),
    encounters: z.number().int().nonnegative(),
    observations: z.number().int().nonnegative(),
    chronicles: z.number().int().nonnegative(),
    media: z.number().int().nonnegative(),
  }),
  mediaIndex: z.array(
    z.object({
      id: z.string().uuid(),
      mime: z.string().trim().min(1),
      size: z.number().int().nonnegative(),
      createdAt: z.string().datetime(),
    }),
  ),
});

/** Discriminator schema used by the importer to recognise the format
 *  before doing the full schema validation. */
export const anyManifestSchema = z.object({
  schema: z.string().trim().min(1),
});
