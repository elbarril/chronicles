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

const baseFieldSchema = z.object({
  id: z.string().uuid(),
  key: z.string().min(1),
  label: z.string().min(1),
  required: z.boolean(),
  helpText: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  archivedAt: z.union([z.literal(""), z.string().datetime()]).optional(),
});

const textConfigSchema = z.object({
  maxLength: z.number().int().positive().optional(),
});

const numberConfigSchema = z
  .object({
    min: z.number().optional(),
    max: z.number().optional(),
  })
  .refine(
    (config) =>
      config.min !== undefined && config.max !== undefined ? config.min <= config.max : true,
    {
      message: "min must be less than or equal to max",
    },
  );

const singleChoiceConfigSchema = z.object({
  options: z.array(z.string().trim().min(1)).min(1),
});

const multiChoiceConfigSchema = z
  .object({
    options: z.array(z.string().trim().min(1)).min(1),
    minSelect: z.number().int().nonnegative().optional(),
    maxSelect: z.number().int().positive().optional(),
  })
  .refine(
    (config) =>
      config.minSelect !== undefined && config.maxSelect !== undefined
        ? config.minSelect <= config.maxSelect
        : true,
    {
      message: "minSelect must be less than or equal to maxSelect",
    },
  );

const dateLikeConfigSchema = z.object({
  min: z.string().optional(),
  max: z.string().optional(),
});

const mediaConfigSchema = z.object({
  accept: z.string().optional(),
  multiple: z.boolean().optional(),
});

const ratingConfigSchema = z
  .object({
    min: z.number().int().min(0),
    max: z.number().int().positive(),
    step: z.number().positive().optional(),
  })
  .refine((config) => config.min <= config.max, {
    message: "min must be less than or equal to max",
  });

const emptyConfigSchema = z.object({}).strict();

export const fieldSchema = z.discriminatedUnion("type", [
  baseFieldSchema.extend({ type: z.literal("text"), config: textConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("longText"), config: textConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("number"), config: numberConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("boolean"), config: emptyConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("singleChoice"), config: singleChoiceConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("multiChoice"), config: multiChoiceConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("date"), config: dateLikeConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("time"), config: dateLikeConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("datetime"), config: dateLikeConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("image"), config: mediaConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("video"), config: mediaConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("audio"), config: mediaConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("file"), config: mediaConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("rating"), config: ratingConfigSchema }),
  baseFieldSchema.extend({ type: z.literal("location"), config: emptyConfigSchema }),
]);

const baseFieldFormSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  required: z.boolean(),
  helpText: z.string().optional(),
});

export const fieldFormSchema = z.discriminatedUnion("type", [
  baseFieldFormSchema.extend({ type: z.literal("text"), config: textConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("longText"), config: textConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("number"), config: numberConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("boolean"), config: emptyConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("singleChoice"), config: singleChoiceConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("multiChoice"), config: multiChoiceConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("date"), config: dateLikeConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("time"), config: dateLikeConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("datetime"), config: dateLikeConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("image"), config: mediaConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("video"), config: mediaConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("audio"), config: mediaConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("file"), config: mediaConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("rating"), config: ratingConfigSchema }),
  baseFieldFormSchema.extend({ type: z.literal("location"), config: emptyConfigSchema }),
]);

export type Field = z.infer<typeof fieldSchema>;
export type FieldFormInput = z.infer<typeof fieldFormSchema>;
export type FieldConfig = Field["config"];

export function buildFieldValueSchema(field: Field): z.ZodType<unknown> {
  const maybeOptional = <T extends z.ZodTypeAny>(schema: T): z.ZodType<unknown> => {
    return field.required ? schema : schema.optional();
  };

  switch (field.type) {
    case "text":
      return maybeOptional(
        field.config.maxLength !== undefined
          ? z.string().max(field.config.maxLength)
          : z.string().trim(),
      );
    case "longText":
      return maybeOptional(
        field.config.maxLength !== undefined
          ? z.string().max(field.config.maxLength)
          : z.string().trim(),
      );
    case "location":
      return maybeOptional(z.string().trim());
    case "number":
      return maybeOptional(
        z
          .number()
          .refine((value) => (field.config.min !== undefined ? value >= field.config.min : true))
          .refine((value) => (field.config.max !== undefined ? value <= field.config.max : true)),
      );
    case "rating":
      return maybeOptional(z.number().min(field.config.min).max(field.config.max));
    case "boolean":
      return maybeOptional(z.boolean());
    case "singleChoice":
      return maybeOptional(
        z.string().refine((value) => field.config.options.includes(value), {
          message: "value must be one of the configured options",
        }),
      );
    case "multiChoice":
      return maybeOptional(
        z
          .array(
            z.string().refine((value) => field.config.options.includes(value), {
              message: "value must be one of the configured options",
            }),
          )
          .refine(
            (value) =>
              field.config.minSelect !== undefined ? value.length >= field.config.minSelect : true,
            { message: "not enough selected options" },
          )
          .refine(
            (value) =>
              field.config.maxSelect !== undefined ? value.length <= field.config.maxSelect : true,
            { message: "too many selected options" },
          ),
      );
    case "date":
    case "time":
    case "datetime":
      return maybeOptional(z.string().min(1));
    case "image":
    case "video":
    case "audio":
    case "file":
      return maybeOptional(field.config.multiple ? z.array(z.string()) : z.string());
    default:
      return z.unknown();
  }
}
