import { describe, expect, it } from "vitest";

import { observationSchema } from "@/domain/observation";

function makeBaseObservation(overrides: Partial<Record<string, unknown>> = {}) {
  const instanceA = crypto.randomUUID();
  const fieldA = crypto.randomUUID();
  return {
    id: crypto.randomUUID(),
    encounterId: crypto.randomUUID(),
    formId: crypto.randomUUID(),
    formVersion: 1,
    fields: [{ instanceId: instanceA, fieldId: fieldA }],
    participantId: crypto.randomUUID(),
    values: { [instanceA]: "texto" },
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("observation domain schema", () => {
  it("accepts an observation with form snapshot, scalar and media values", () => {
    const instanceText = crypto.randomUUID();
    const instanceNumber = crypto.randomUUID();
    const instanceBool = crypto.randomUUID();
    const instanceMulti = crypto.randomUUID();
    const instanceMedia = crypto.randomUUID();
    const instanceMediaList = crypto.randomUUID();

    const fieldText = crypto.randomUUID();
    const fieldNumber = crypto.randomUUID();
    const fieldBool = crypto.randomUUID();
    const fieldMulti = crypto.randomUUID();
    const fieldMedia = crypto.randomUUID();
    const fieldMediaList = crypto.randomUUID();

    const result = observationSchema.safeParse(
      makeBaseObservation({
        fields: [
          { instanceId: instanceText, fieldId: fieldText },
          { instanceId: instanceNumber, fieldId: fieldNumber },
          { instanceId: instanceBool, fieldId: fieldBool },
          { instanceId: instanceMulti, fieldId: fieldMulti },
          { instanceId: instanceMedia, fieldId: fieldMedia },
          { instanceId: instanceMediaList, fieldId: fieldMediaList },
        ],
        values: {
          [instanceText]: "texto",
          [instanceNumber]: 5,
          [instanceBool]: true,
          [instanceMulti]: ["A", "B"],
          [instanceMedia]: { mediaId: crypto.randomUUID() },
          [instanceMediaList]: { mediaIds: [crypto.randomUUID()] },
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

  it("rejects invalid instanceId in snapshot", () => {
    const result = observationSchema.safeParse(
      makeBaseObservation({
        fields: [{ instanceId: "not-a-uuid", fieldId: crypto.randomUUID() }],
        values: { "not-a-uuid": "x" },
      }),
    );

    expect(result.success).toBe(false);
  });

  it("rejects empty field id list in snapshot", () => {
    const result = observationSchema.safeParse(makeBaseObservation({ fields: [], values: {} }));

    expect(result.success).toBe(false);
  });

  it("rejects invalid media id", () => {
    const instanceId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const result = observationSchema.safeParse(
      makeBaseObservation({
        fields: [{ instanceId, fieldId }],
        values: { [instanceId]: { mediaId: "abc" } },
      }),
    );

    expect(result.success).toBe(false);
  });
});
