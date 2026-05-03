import { z } from "zod";

export interface Participant {
  id: string;
  projectId: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: "" | string;
}

export const participantSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  displayName: z.string().trim().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  archivedAt: z.union([z.literal(""), z.string().datetime()]).optional(),
});

export const participantInputSchema = z.object({
  projectId: z.string().uuid(),
  displayName: z.string().trim().min(1),
});

export type ParticipantInput = z.infer<typeof participantInputSchema>;
