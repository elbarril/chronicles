import { describe, expect, it } from "vitest";

import { encounterInputSchema, encounterSchema } from "@/domain/encounter";

function makeBaseEncounter(overrides: Partial<Record<string, unknown>> = {}) {
  const start = new Date("2026-05-02T10:00:00.000Z").toISOString();
  const end = new Date("2026-05-02T11:00:00.000Z").toISOString();
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    projectId: crypto.randomUUID(),
    name: "Sesión del lunes",
    startsAt: start,
    endsAt: end,
    participantIds: [crypto.randomUUID(), crypto.randomUUID()],
    archivedAt: "",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("encounter domain schemas", () => {
  it("accepts a valid post-event encounter", () => {
    const result = encounterSchema.safeParse(makeBaseEncounter());

    expect(result.success).toBe(true);
  });

  it("rejects duplicated participant ids", () => {
    const repeated = crypto.randomUUID();
    const result = encounterSchema.safeParse(
      makeBaseEncounter({ participantIds: [repeated, repeated] }),
    );

    expect(result.success).toBe(false);
  });

  it("rejects empty participant list", () => {
    const result = encounterSchema.safeParse(makeBaseEncounter({ participantIds: [] }));

    expect(result.success).toBe(false);
  });

  it("rejects encounter where endsAt is before startsAt", () => {
    const start = new Date("2026-05-02T11:00:00.000Z").toISOString();
    const end = new Date("2026-05-02T10:00:00.000Z").toISOString();

    const result = encounterSchema.safeParse(makeBaseEncounter({ startsAt: start, endsAt: end }));

    expect(result.success).toBe(false);
  });

  it("accepts archivedAt as empty string or datetime", () => {
    const now = new Date().toISOString();

    expect(encounterSchema.safeParse(makeBaseEncounter({ archivedAt: "" })).success).toBe(true);
    expect(encounterSchema.safeParse(makeBaseEncounter({ archivedAt: now })).success).toBe(true);
    expect(encounterSchema.safeParse(makeBaseEncounter({ archivedAt: "no-date" })).success).toBe(
      false,
    );
  });

  it("rejects empty name in input schema", () => {
    const start = new Date().toISOString();
    const end = new Date().toISOString();

    const result = encounterInputSchema.safeParse({
      projectId: crypto.randomUUID(),
      name: " ",
      startsAt: start,
      endsAt: end,
      participantIds: [crypto.randomUUID()],
    });

    expect(result.success).toBe(false);
  });

  it("requires non-empty participant list in input schema", () => {
    const start = new Date().toISOString();
    const end = new Date().toISOString();

    const result = encounterInputSchema.safeParse({
      projectId: crypto.randomUUID(),
      name: "Sesión",
      startsAt: start,
      endsAt: end,
      participantIds: [],
    });

    expect(result.success).toBe(false);
  });
});
