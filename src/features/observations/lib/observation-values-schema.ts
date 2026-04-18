import { z } from "zod";

import { buildFieldValueSchema, type Field } from "@/domain/field";

export function buildObservationValuesSchema(fields: Field[]): z.ZodType<Record<string, unknown>> {
  const shape = Object.fromEntries(
    fields.map((field) => {
      const valueSchema = buildFieldValueSchema(field);

      return [field.id, valueSchema];
    }),
  );

  return z.object(shape) as z.ZodType<Record<string, unknown>>;
}
