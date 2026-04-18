import { describe, expect, it } from "vitest";

import { observationSchema } from "@/domain/observation";

describe("observation domain schema", () => {
  it("accepts scalar and media values", () => {
    const result = observationSchema.safeParse({
      id: crypto.randomUUID(),
      encounterId: crypto.randomUUID(),
      participantId: crypto.randomUUID(),
      values: {
        [crypto.randomUUID()]: "texto",
        [crypto.randomUUID()]: 5,
        [crypto.randomUUID()]: true,
        [crypto.randomUUID()]: ["A", "B"],
        [crypto.randomUUID()]: { mediaId: crypto.randomUUID() },
        [crypto.randomUUID()]: { mediaIds: [crypto.randomUUID()] },
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid media id", () => {
    const result = observationSchema.safeParse({
      id: crypto.randomUUID(),
      encounterId: crypto.randomUUID(),
      values: {
        [crypto.randomUUID()]: { mediaId: "abc" },
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.success).toBe(false);
  });
});
