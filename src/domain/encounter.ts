import { z } from "zod";

export interface Encounter {
  id: string;
  groupId: string;
  formId: string;
  activity: string;
  startedAt: string;
  endedAt?: string;
}

export const encounterSchema = z.object({
  id: z.string().uuid(),
  groupId: z.string().uuid(),
  formId: z.string().uuid(),
  activity: z.string().min(1),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
});
