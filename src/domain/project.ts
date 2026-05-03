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

export const projectInputSchema = z.object({
  name: z.string().trim().min(1),
  participantNames: z.array(z.string().trim().min(1)).default([]),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
