import { describe, expect, it } from "vitest";

import { participantInputSchema, participantSchema } from "@/domain/participant";

describe("participant domain schemas", () => {
  it("accepts a valid participant", () => {
    const now = new Date().toISOString();
    const result = participantSchema.safeParse({
      id: crypto.randomUUID(),
      projectId: crypto.randomUUID(),
      displayName: "Juan",
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing project id", () => {
    const result = participantInputSchema.safeParse({
      projectId: "",
      displayName: "Juan",
    });

    expect(result.success).toBe(false);
  });
});
