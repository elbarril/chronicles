import { z } from "zod";

import { formFieldInstanceSchema } from "@/domain/form";

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
  formId: string;
  formVersion: number;
  /** Snapshot of the form's field instances at observation creation time.
   *  Values in `values` are keyed by `instanceId`. */
  fields: import("@/domain/form").FormFieldInstance[];
  participantId?: string;
  title?: string;
  /** Keyed by FormFieldInstance.instanceId */
  values: Record<string, ObservationValue>;
  createdAt: string;
}

export const observationSchema = z.object({
  id: z.string().uuid(),
  encounterId: z.string().uuid(),
  formId: z.string().uuid(),
  formVersion: z.number().int().positive(),
  fields: z.array(formFieldInstanceSchema).min(1),
  participantId: z.string().uuid().optional(),
  title: z.string().trim().min(1).optional(),
  values: z.record(z.string(), observationValueSchema),
  createdAt: z.string().datetime(),
});

export const observationInputSchema = z.object({
  encounterId: z.string().uuid(),
  formId: z.string().uuid(),
  participantId: z.string().uuid().optional(),
  title: z.string().trim().min(1).optional(),
  values: z.record(z.string(), z.unknown()),
});

export type ObservationInput = z.infer<typeof observationInputSchema>;
