import { z } from "zod";

export const MANIFEST_SCHEMA = "chronicle-encounter-v1" as const;
export const FULL_MANIFEST_SCHEMA = "chronicle-full-v1" as const;

export interface EncounterZipManifest {
  schema: typeof MANIFEST_SCHEMA;
  exportedAt: string;
  encounterActivity: string;
  groupName: string;
  startedAt: string;
  endedAt: "" | string;
  observationCount: number;
  mediaIndex: Array<{
    id: string;
    mime: string;
    size: number;
    createdAt: string;
  }>;
}

export const encounterZipManifestSchema = z.object({
  schema: z.literal(MANIFEST_SCHEMA),
  exportedAt: z.string().datetime(),
  encounterActivity: z.string().trim().min(1),
  groupName: z.string().trim().min(1),
  startedAt: z.string().datetime(),
  endedAt: z.union([z.literal(""), z.string().datetime()]),
  observationCount: z.number().int().nonnegative(),
  mediaIndex: z.array(
    z.object({
      id: z.string().uuid(),
      mime: z.string().trim().min(1),
      size: z.number().int().nonnegative(),
      createdAt: z.string().datetime(),
    }),
  ),
});

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
    groups: number;
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
    groups: z.number().int().nonnegative(),
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

/** Discriminator schema used by the importer to recognise either format
 *  before doing the full schema validation. */
export const anyManifestSchema = z.object({
  schema: z.string().trim().min(1),
});
