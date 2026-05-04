import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateChronicleWithGemini } from "@/infra/ai/gemini-chronicle-generator";

const { generateTextMock } = vi.hoisted(() => ({
  generateTextMock: vi.fn(),
}));

vi.mock("@/infra/ai/gemini-client", () => ({
  generateText: generateTextMock,
}));

function makeInput() {
  const start = new Date("2026-05-02T10:00:00.000Z").toISOString();
  const end = new Date("2026-05-02T11:00:00.000Z").toISOString();
  const fieldId = crypto.randomUUID();
  const instanceId = crypto.randomUUID();
  const participantId = crypto.randomUUID();
  const encounterId = crypto.randomUUID();
  const projectId = crypto.randomUUID();

  return {
    apiKey: "AIzaTest1234",
    encounter: {
      id: encounterId,
      projectId,
      name: "Taller de pintura",
      startsAt: start,
      endsAt: end,
      participantIds: [participantId],
      archivedAt: "",
      createdAt: start,
      updatedAt: start,
    },
    projectName: "Proyecto Alfa",
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
          createdAt: start,
          updatedAt: start,
          archivedAt: "",
        },
      ],
    ]),
    observations: [
      {
        id: crypto.randomUUID(),
        encounterId,
        formId: crypto.randomUUID(),
        formVersion: 1,
        fields: [{ instanceId, fieldId }],
        participantId,
        values: { [instanceId]: "Participó activamente" },
        createdAt: start,
        updatedAt: start,
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
    expect(callArgs.prompt).toContain("Proyecto Alfa");
    expect(callArgs.prompt).toContain("Ana");
    expect(callArgs.prompt).toContain("Participó activamente");
  });

  it("excludes media fields from the prompt", async () => {
    generateTextMock.mockResolvedValue("Crónica sin multimedia.");

    const input = makeInput();
    const imageFieldId = crypto.randomUUID();
    const imageInstanceId = crypto.randomUUID();

    const firstObs = input.observations[0];
    if (firstObs) {
      firstObs.fields = [
        ...firstObs.fields,
        { instanceId: imageInstanceId, fieldId: imageFieldId },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (firstObs.values as any)[imageInstanceId] = { mediaId: crypto.randomUUID() };
    }

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
