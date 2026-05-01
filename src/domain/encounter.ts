import { z } from "zod";

export interface Encounter {
  id: string;
  groupId: string;
  formId: string;
  formVersion: number;
  fieldIds: string[];
  activity: string;
  startedAt: string;
  endedAt?: "" | string;
  archivedAt?: "" | string;
  createdAt: string;
  updatedAt: string;
}

export const encounterSchema = z.object({
  id: z.string().uuid(),
  groupId: z.string().uuid(),
  formId: z.string().uuid(),
  formVersion: z.number().int().positive(),
  fieldIds: z
    .array(z.string().uuid())
    .min(1)
    .refine((fieldIds) => new Set(fieldIds).size === fieldIds.length, {
      message: "fieldIds must be unique",
    }),
  activity: z.string().trim().min(1),
  startedAt: z.string().datetime(),
  endedAt: z.union([z.literal(""), z.string().datetime()]).optional(),
  archivedAt: z.union([z.literal(""), z.string().datetime()]).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const encounterInputSchema = z.object({
  groupId: z.string().uuid(),
  formId: z.string().uuid(),
  activity: z.string().trim().min(1),
  startedAt: z.string().datetime().optional(),
});

export type EncounterInput = z.infer<typeof encounterInputSchema>;
