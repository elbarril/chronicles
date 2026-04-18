import { z } from "zod";

export const fieldTypes = [
  "text",
  "longText",
  "number",
  "boolean",
  "singleChoice",
  "multiChoice",
  "date",
  "time",
  "datetime",
  "image",
  "video",
  "audio",
  "file",
  "rating",
  "location",
] as const;

export type FieldType = (typeof fieldTypes)[number];

export interface Field {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  helpText?: string;
  options?: string[];
  accept?: string;
  max?: number;
  min?: number;
  multiple?: boolean;
  archivedAt?: string;
}

export const fieldSchema = z.object({
  id: z.string().uuid(),
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(fieldTypes),
  required: z.boolean(),
  helpText: z.string().optional(),
  options: z.array(z.string()).optional(),
  accept: z.string().optional(),
  max: z.number().optional(),
  min: z.number().optional(),
  multiple: z.boolean().optional(),
  archivedAt: z.string().datetime().optional(),
});

export function buildFieldValueSchema(field: Field): z.ZodType<unknown> {
  switch (field.type) {
    case "text":
    case "longText":
    case "location":
      return z.string();
    case "number":
    case "rating":
      return z.number();
    case "boolean":
      return z.boolean();
    case "singleChoice":
      return z.string();
    case "multiChoice":
      return z.array(z.string());
    case "date":
    case "time":
    case "datetime":
      return z.string();
    case "image":
    case "video":
    case "audio":
    case "file":
      return z.string();
    default:
      return z.unknown();
  }
}
