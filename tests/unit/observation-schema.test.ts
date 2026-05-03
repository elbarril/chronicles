import { describe, expect, it } from "vitest";

import { observationSchema } from "@/domain/observation";

function makeBaseObservation(overrides: Partial<Record<string, unknown>> = {}) {
  const fieldA = crypto.randomUUID();
  return {
    id: crypto.randomUUID(),
    encounterId: crypto.randomUUID(),
    formId: crypto.randomUUID(),
    formVersion: 1,
    fieldIds: [fieldA],
    participantId: crypto.randomUUID(),
    values: { [fieldA]: "texto" },
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("observation domain schema", () => {
  it("accepts an observation with form snapshot, scalar and media values", () => {
    const fieldText = crypto.randomUUID();
    const fieldNumber = crypto.randomUUID();
    const fieldBool = crypto.randomUUID();
    const fieldMulti = crypto.randomUUID();
    const fieldMedia = crypto.randomUUID();
    const fieldMediaList = crypto.randomUUID();

    const result = observationSchema.safeParse(
      makeBaseObservation({
        fieldIds: [fieldText, fieldNumber, fieldBool, fieldMulti, fieldMedia, fieldMediaList],
        values: {
          [fieldText]: "texto",
          [fieldNumber]: 5,
          [fieldBool]: true,
          [fieldMulti]: ["A", "B"],
          [fieldMedia]: { mediaId: crypto.randomUUID() },
          [fieldMediaList]: { mediaIds: [crypto.randomUUID()] },
        },
      }),
    );

    expect(result.success).toBe(true);
  });

  it("accepts an optional title", () => {
    const result = observationSchema.safeParse(makeBaseObservation({ title: "Llegada del grupo" }));

    expect(result.success).toBe(true);
  });

  it("rejects empty title strings", () => {
    const result = observationSchema.safeParse(makeBaseObservation({ title: "   " }));

    expect(result.success).toBe(false);
  });

  it("rejects duplicated field ids in snapshot", () => {
    const repeated = crypto.randomUUID();
    const result = observationSchema.safeParse(
      makeBaseObservation({ fieldIds: [repeated, repeated], values: { [repeated]: "x" } }),
    );

    expect(result.success).toBe(false);
  });

  it("rejects empty field id list in snapshot", () => {
    const result = observationSchema.safeParse(makeBaseObservation({ fieldIds: [], values: {} }));

    expect(result.success).toBe(false);
  });

  it("rejects invalid media id", () => {
    const fieldId = crypto.randomUUID();
    const result = observationSchema.safeParse(
      makeBaseObservation({
        fieldIds: [fieldId],
        values: { [fieldId]: { mediaId: "abc" } },
      }),
    );

    expect(result.success).toBe(false);
  });
});
