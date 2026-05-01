import { describe, expect, it } from "vitest";

import { encounterInputSchema, encounterSchema } from "@/domain/encounter";

describe("encounter domain schemas", () => {
  it("accepts a valid encounter with form snapshot", () => {
    const now = new Date().toISOString();
    const result = encounterSchema.safeParse({
      id: crypto.randomUUID(),
      groupId: crypto.randomUUID(),
      formId: crypto.randomUUID(),
      formVersion: 2,
      fieldIds: [crypto.randomUUID(), crypto.randomUUID()],
      activity: "Juego de roles",
      startedAt: now,
      endedAt: "",
      createdAt: now,
      updatedAt: now,
    });

    expect(result.success).toBe(true);
  });

  it("rejects duplicated field ids", () => {
    const repeatedId = crypto.randomUUID();
    const result = encounterSchema.safeParse({
      id: crypto.randomUUID(),
      groupId: crypto.randomUUID(),
      formId: crypto.randomUUID(),
      formVersion: 1,
      fieldIds: [repeatedId, repeatedId],
      activity: "Encuentro",
      startedAt: new Date().toISOString(),
      endedAt: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    expect(result.success).toBe(false);
  });

  it("accepts archivedAt as empty string or datetime", () => {
    const now = new Date().toISOString();
    const base = {
      id: crypto.randomUUID(),
      groupId: crypto.randomUUID(),
      formId: crypto.randomUUID(),
      formVersion: 1,
      fieldIds: [crypto.randomUUID()],
      activity: "Encuentro",
      startedAt: now,
      endedAt: "",
      createdAt: now,
      updatedAt: now,
    };

    expect(encounterSchema.safeParse({ ...base, archivedAt: "" }).success).toBe(true);
    expect(encounterSchema.safeParse({ ...base, archivedAt: now }).success).toBe(true);
    expect(encounterSchema.safeParse({ ...base, archivedAt: "no-date" }).success).toBe(false);
  });

  it("requires activity in input schema", () => {
    const result = encounterInputSchema.safeParse({
      groupId: crypto.randomUUID(),
      formId: crypto.randomUUID(),
      activity: " ",
    });

    expect(result.success).toBe(false);
  });
});
