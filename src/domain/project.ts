import { z } from "zod";

export interface Project {
  id: string;
  institutionId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: "" | string;
}

export const projectSchema = z.object({
  id: z.string().uuid(),
  institutionId: z.string().uuid(),
  name: z.string().trim().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  archivedAt: z.union([z.literal(""), z.string().datetime()]).optional(),
});

export const projectInputParticipantSchema = z.object({
  /**
   * Stable identity for an existing participant. Undefined for newly added
   * rows that the repository must turn into fresh records. Keeping the id
   * across edits is what prevents `encounter.participantIds` from going
   * stale every time the project is updated.
   */
  id: z.string().uuid().optional(),
  displayName: z.string().trim().min(1),
});

export type ProjectInputParticipant = z.infer<typeof projectInputParticipantSchema>;

export const projectInputSchema = z.object({
  name: z.string().trim().min(1),
  participants: z.array(projectInputParticipantSchema).default([]),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
