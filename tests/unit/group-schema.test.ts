import { describe, expect, it } from "vitest";

import { groupInputSchema, groupSchema } from "@/domain/group";

describe("group domain schemas", () => {
  it("accepts a valid group", () => {
    const now = new Date().toISOString();
    const result = groupSchema.safeParse({
      id: crypto.randomUUID(),
      institutionId: crypto.randomUUID(),
      name: "Sala Azul",
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = groupInputSchema.safeParse({
      name: "  ",
      participantNames: ["Ana"],
    });

    expect(result.success).toBe(false);
  });
});
