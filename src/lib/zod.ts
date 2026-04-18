import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldValues, type Resolver } from "react-hook-form";
import { type z } from "zod";

export function buildResolver<TFieldValues extends FieldValues>(
  schema: z.ZodTypeAny,
): Resolver<TFieldValues> {
  const typedSchema = schema as Parameters<typeof zodResolver>[0];

  return zodResolver(typedSchema) as Resolver<TFieldValues>;
}
