import { z } from "zod";

export const MANIFEST_SCHEMA = "chronicle-encounter-v1" as const;

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
