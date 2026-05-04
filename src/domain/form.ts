import { z } from "zod";

export const formFieldInstanceSchema = z.object({
  /** Stable key for this slot within the form (and within observation snapshots). */
  instanceId: z.string().uuid(),
  /** Reference to the Field entity that defines type + config. */
  fieldId: z.string().uuid(),
  /** Optional per-instance label shown instead of Field.label. */
  labelOverride: z.string().trim().min(1).optional(),
});

export type FormFieldInstance = z.infer<typeof formFieldInstanceSchema>;

/** Input variant used when creating or editing a form. The instanceId is
 *  optional here: the service assigns a new UUID for entries that arrive
 *  without one (e.g. freshly added rows in the builder). */
export const formFieldInstanceInputSchema = z.object({
  instanceId: z.string().uuid().optional(),
  fieldId: z.string().uuid(),
  labelOverride: z.string().trim().min(1).optional(),
});

export type FormFieldInstanceInput = z.infer<typeof formFieldInstanceInputSchema>;

export interface ObservationForm {
  id: string;
  name: string;
  /** Ordered list of field instances. The same fieldId may appear more than
   *  once (each with a distinct instanceId and an optional label override). */
  fields: FormFieldInstance[];
  version: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: "" | string;
}

export const observationFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
  fields: z.array(formFieldInstanceSchema).min(1),
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  archivedAt: z.union([z.literal(""), z.string().datetime()]).optional(),
});

export const observationFormInputSchema = z.object({
  name: z.string().trim().min(1),
  fields: z.array(formFieldInstanceInputSchema).min(1),
});

export type ObservationFormInput = z.infer<typeof observationFormInputSchema>;
