import { z } from "zod";

export interface ObservationForm {
  id: string;
  name: string;
  fieldIds: string[];
  version: number;
  archivedAt?: string;
}

export const observationFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  fieldIds: z.array(z.string().uuid()),
  version: z.number().int().positive(),
  archivedAt: z.string().datetime().optional(),
});
