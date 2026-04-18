import { describe, expect, it } from "vitest";

import { participantInputSchema, participantSchema } from "@/domain/participant";

describe("participant domain schemas", () => {
  it("accepts a valid participant", () => {
    const now = new Date().toISOString();
    const result = participantSchema.safeParse({
      id: crypto.randomUUID(),
      groupId: crypto.randomUUID(),
      displayName: "Juan",
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing group id", () => {
    const result = participantInputSchema.safeParse({
      groupId: "",
      displayName: "Juan",
    });

    expect(result.success).toBe(false);
  });
});
