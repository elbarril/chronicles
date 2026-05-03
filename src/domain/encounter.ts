import { z } from "zod";

export interface Encounter {
  id: string;
  projectId: string;
  name: string;
  startsAt: string;
  endsAt: string;
  participantIds: string[];
  archivedAt?: "" | string;
  createdAt: string;
  updatedAt: string;
}

export const encounterSchema = z
  .object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    name: z.string().trim().min(1),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    participantIds: z
      .array(z.string().uuid())
      .min(1)
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "participantIds must be unique",
      }),
    archivedAt: z.union([z.literal(""), z.string().datetime()]).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .refine((value) => value.endsAt >= value.startsAt, {
    message: "endsAt must be greater than or equal to startsAt",
    path: ["endsAt"],
  });

export const encounterInputSchema = z
  .object({
    projectId: z.string().uuid(),
    name: z.string().trim().min(1),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    participantIds: z
      .array(z.string().uuid())
      .min(1)
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "participantIds must be unique",
      }),
  })
  .refine((value) => value.endsAt >= value.startsAt, {
    message: "endsAt must be greater than or equal to startsAt",
    path: ["endsAt"],
  });

export type EncounterInput = z.infer<typeof encounterInputSchema>;
