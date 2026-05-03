import { describe, expect, it } from "vitest";

import { projectInputSchema, projectSchema } from "@/domain/project";

describe("project domain schemas", () => {
  it("accepts a valid project", () => {
    const now = new Date().toISOString();
    const result = projectSchema.safeParse({
      id: crypto.randomUUID(),
      institutionId: crypto.randomUUID(),
      name: "Taller de música",
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty names", () => {
    const now = new Date().toISOString();
    const result = projectSchema.safeParse({
      id: crypto.randomUUID(),
      institutionId: crypto.randomUUID(),
      name: " ",
      createdAt: now,
      updatedAt: now,
    });

    expect(result.success).toBe(false);
  });

  it("accepts archivedAt as empty string or datetime", () => {
    const now = new Date().toISOString();
    const base = {
      id: crypto.randomUUID(),
      institutionId: crypto.randomUUID(),
      name: "Sala",
      createdAt: now,
      updatedAt: now,
    };

    expect(projectSchema.safeParse({ ...base, archivedAt: "" }).success).toBe(true);
    expect(projectSchema.safeParse({ ...base, archivedAt: now }).success).toBe(true);
    expect(projectSchema.safeParse({ ...base, archivedAt: "no-date" }).success).toBe(false);
  });

  it("normalises participantNames as required field in input schema", () => {
    expect(
      projectInputSchema.safeParse({ name: "Sala", participantNames: ["Sofía"] }).success,
    ).toBe(true);

    // Empty list is allowed at the schema level (the service rejects it
    // separately so empty-participants gets a dedicated error code).
    expect(projectInputSchema.safeParse({ name: "Sala", participantNames: [] }).success).toBe(true);

    // Empty string participants are rejected.
    expect(projectInputSchema.safeParse({ name: "Sala", participantNames: [""] }).success).toBe(
      false,
    );
  });
});
