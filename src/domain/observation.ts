import { z } from "zod";

const mediaValueSchema = z.union([
  z.object({ mediaId: z.string().uuid() }),
  z.object({ mediaIds: z.array(z.string().uuid()).min(1) }),
]);

const observationValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  mediaValueSchema,
]);

export type ObservationValue = z.infer<typeof observationValueSchema>;

export interface Observation {
  id: string;
  encounterId: string;
  participantId?: string;
  title?: string;
  values: Record<string, ObservationValue>;
  createdAt: string;
}

export const observationSchema = z.object({
  id: z.string().uuid(),
  encounterId: z.string().uuid(),
  participantId: z.string().uuid().optional(),
  title: z.string().trim().min(1).optional(),
  values: z.record(z.string(), observationValueSchema),
  createdAt: z.string().datetime(),
});

export const observationInputSchema = z.object({
  encounterId: z.string().uuid(),
  participantId: z.string().uuid().optional(),
  title: z.string().trim().min(1).optional(),
  values: z.record(z.string(), z.unknown()),
});

export type ObservationInput = z.infer<typeof observationInputSchema>;
