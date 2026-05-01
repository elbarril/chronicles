import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateChronicleWithGemini } from "@/infra/ai/gemini-chronicle-generator";

const { generateTextMock } = vi.hoisted(() => ({
  generateTextMock: vi.fn(),
}));

vi.mock("@/infra/ai/gemini-client", () => ({
  generateText: generateTextMock,
}));

function makeInput() {
  const now = new Date().toISOString();
  const fieldId = crypto.randomUUID();
  const participantId = crypto.randomUUID();
  const encounterId = crypto.randomUUID();

  return {
    apiKey: "AIzaTest1234",
    encounter: {
      id: encounterId,
      groupId: crypto.randomUUID(),
      formId: crypto.randomUUID(),
      formVersion: 1,
      fieldIds: [fieldId],
      activity: "Taller de pintura",
      startedAt: now,
      endedAt: "",
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    },
    groupName: "Grupo Alfa",
    participantsById: new Map([[participantId, "Ana"]]),
    fieldsById: new Map([
      [
        fieldId,
        {
          id: fieldId,
          key: "nota",
          label: "Nota",
          type: "text" as const,
          required: true,
          config: {},
          createdAt: now,
          updatedAt: now,
          archivedAt: "",
        },
      ],
    ]),
    observations: [
      {
        id: crypto.randomUUID(),
        encounterId,
        participantId,
        values: { [fieldId]: "Participó activamente" },
        createdAt: now,
      },
    ],
  };
}

describe("gemini-chronicle-generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls generateText with the API key and a prompt containing encounter data", async () => {
    generateTextMock.mockResolvedValue("Crónica generada por IA.");

    const input = makeInput();
    const result = await generateChronicleWithGemini(input);

    expect(result).toBe("Crónica generada por IA.");
    expect(generateTextMock).toHaveBeenCalledOnce();

    const callArgs = generateTextMock.mock.calls[0]?.[0] as { apiKey: string; prompt: string };
    expect(callArgs).toBeDefined();
    expect(callArgs.apiKey).toBe("AIzaTest1234");
    expect(callArgs.prompt).toContain("Taller de pintura");
    expect(callArgs.prompt).toContain("Grupo Alfa");
    expect(callArgs.prompt).toContain("Ana");
    expect(callArgs.prompt).toContain("Participó activamente");
  });

  it("excludes media fields from the prompt", async () => {
    generateTextMock.mockResolvedValue("Crónica sin multimedia.");

    const input = makeInput();
    const imageFieldId = crypto.randomUUID();

    input.encounter.fieldIds.push(imageFieldId);

    input.fieldsById.set(imageFieldId, {
      id: imageFieldId,
      key: "foto",
      label: "Foto",
      type: "image",
      required: false,
      config: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archivedAt: "",
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    const firstObs = input.observations[0];
    if (firstObs) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (firstObs.values as any)[imageFieldId] = { mediaId: crypto.randomUUID() };
    }

    await generateChronicleWithGemini(input);

    const callArgs = generateTextMock.mock.calls[0]?.[0] as { prompt: string } | undefined;
    expect(callArgs).toBeDefined();
    expect(callArgs?.prompt).not.toContain("Foto:");
  });

  it("propagates errors from generateText", async () => {
    generateTextMock.mockRejectedValue(new Error("Network error"));

    const input = makeInput();
    await expect(generateChronicleWithGemini(input)).rejects.toThrow("Network error");
  });
});
