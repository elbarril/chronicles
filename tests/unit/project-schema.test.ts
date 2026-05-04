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

  it("accepts a participants array with optional ids", () => {
    // Brand-new row (no id) is valid.
    expect(
      projectInputSchema.safeParse({
        name: "Sala",
        participants: [{ displayName: "Sofía" }],
      }).success,
    ).toBe(true);

    // Existing row carrying its stable id is valid.
    expect(
      projectInputSchema.safeParse({
        name: "Sala",
        participants: [{ id: crypto.randomUUID(), displayName: "Sofía" }],
      }).success,
    ).toBe(true);

    // Empty list is allowed at the schema level (the service rejects it
    // separately so empty-participants gets a dedicated error code).
    expect(projectInputSchema.safeParse({ name: "Sala", participants: [] }).success).toBe(true);

    // Empty string display name is rejected.
    expect(
      projectInputSchema.safeParse({
        name: "Sala",
        participants: [{ displayName: "" }],
      }).success,
    ).toBe(false);

    // Non-uuid id is rejected.
    expect(
      projectInputSchema.safeParse({
        name: "Sala",
        participants: [{ id: "not-a-uuid", displayName: "Sofía" }],
      }).success,
    ).toBe(false);
  });
});
