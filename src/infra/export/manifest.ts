import { z } from "zod";

/** Current manifest schema for full Chronicle exports. F9 introduced a hard
 *  reset of the encounter/observation model, so any previous schema (`v1`,
 *  `chronicle-encounter-v1`) is no longer importable. */
export const FULL_MANIFEST_SCHEMA = "chronicle-full-v2" as const;

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
