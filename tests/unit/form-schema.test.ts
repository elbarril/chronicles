import { describe, expect, it } from "vitest";

import { observationFormInputSchema, observationFormSchema } from "@/domain/form";

describe("form domain schemas", () => {
  it("accepts a valid observation form", () => {
    const now = new Date().toISOString();
    const result = observationFormSchema.safeParse({
      id: crypto.randomUUID(),
      name: "Sesión grupal",
      fieldIds: [crypto.randomUUID(), crypto.randomUUID()],
      version: 1,
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects input without fields", () => {
    const result = observationFormInputSchema.safeParse({
      name: "Sesión grupal",
      fieldIds: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicated field ids", () => {
    const repeatedId = crypto.randomUUID();
    const result = observationFormInputSchema.safeParse({
      name: "Sesión grupal",
      fieldIds: [repeatedId, repeatedId],
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = observationFormInputSchema.safeParse({
      name: "   ",
      fieldIds: [crypto.randomUUID()],
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid archivedAt value", () => {
    const now = new Date().toISOString();
    const result = observationFormSchema.safeParse({
      id: crypto.randomUUID(),
      name: "Sesión grupal",
      fieldIds: [crypto.randomUUID()],
      version: 2,
      createdAt: now,
      updatedAt: now,
      archivedAt: "archived yesterday",
    });

    expect(result.success).toBe(false);
  });
});
