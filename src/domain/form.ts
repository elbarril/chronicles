import { z } from "zod";

export interface ObservationForm {
  id: string;
  name: string;
  fieldIds: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: "" | string;
}

export const observationFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
  fieldIds: z
    .array(z.string().uuid())
    .min(1)
    .refine((fieldIds) => new Set(fieldIds).size === fieldIds.length, {
      message: "fieldIds must be unique",
    }),
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  archivedAt: z.union([z.literal(""), z.string().datetime()]).optional(),
});

export const observationFormInputSchema = z.object({
  name: z.string().trim().min(1),
  fieldIds: z
    .array(z.string().uuid())
    .min(1)
    .refine((fieldIds) => new Set(fieldIds).size === fieldIds.length, {
      message: "fieldIds must be unique",
    }),
});

export type ObservationFormInput = z.infer<typeof observationFormInputSchema>;
