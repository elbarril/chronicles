import { z } from "zod";

export interface Observation {
  id: string;
  encounterId: string;
  participantId?: string;
  values: Record<string, unknown>;
  createdAt: string;
}

export const observationSchema = z.object({
  id: z.string().uuid(),
  encounterId: z.string().uuid(),
  participantId: z.string().uuid().optional(),
  values: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
});
