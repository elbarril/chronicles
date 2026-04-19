import { describe, expect, it } from "vitest";

import { chronicleInputSchema, chronicleSchema } from "@/domain/chronicle";

describe("chronicle domain schemas", () => {
  it("accepts a valid chronicle", () => {
    const now = new Date().toISOString();

    const result = chronicleSchema.safeParse({
      id: crypto.randomUUID(),
      encounterId: crypto.randomUUID(),
      title: "Crónica · Actividad inicial",
      body: "Texto de crónica",
      generatedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing encounter id", () => {
    const now = new Date().toISOString();

    const result = chronicleSchema.safeParse({
      id: crypto.randomUUID(),
      encounterId: "",
      title: "Crónica",
      body: "Texto",
      generatedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty body in input schema", () => {
    const result = chronicleInputSchema.safeParse({
      encounterId: crypto.randomUUID(),
      title: "Crónica",
      body: "   ",
    });

    expect(result.success).toBe(false);
  });
});
