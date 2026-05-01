import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  generateChronicle,
  getChronicleDetail,
  removeChronicle,
} from "@/features/chronicles/services/chronicle-service";
import { AppError } from "@/lib/error";

const {
  upsertChronicleByEncounterMock,
  getChronicleByIdMock,
  deleteChronicleMock,
  getEncounterByIdMock,
  listFieldsByIdsMock,
  getGroupByIdMock,
  listParticipantsByGroupMock,
  listObservationsByEncounterMock,
  hasGeminiApiKeyMock,
  getGeminiApiKeyMock,
  generateChronicleWithGeminiMock,
} = vi.hoisted(() => ({
  upsertChronicleByEncounterMock: vi.fn(),
  getChronicleByIdMock: vi.fn(),
  deleteChronicleMock: vi.fn(),
  getEncounterByIdMock: vi.fn(),
  listFieldsByIdsMock: vi.fn(),
  getGroupByIdMock: vi.fn(),
  listParticipantsByGroupMock: vi.fn(),
  listObservationsByEncounterMock: vi.fn(),
  hasGeminiApiKeyMock: vi.fn(),
  getGeminiApiKeyMock: vi.fn(),
  generateChronicleWithGeminiMock: vi.fn(),
}));

vi.mock("@/infra/db/repositories/chronicle-repository", () => ({
  upsertChronicleByEncounter: upsertChronicleByEncounterMock,
  getChronicleById: getChronicleByIdMock,
  getChronicleByEncounterId: vi.fn(),
  deleteChronicle: deleteChronicleMock,
  listChronicles: vi.fn(),
}));

vi.mock("@/infra/db/repositories/encounter-repository", () => ({
  getEncounterById: getEncounterByIdMock,
}));

vi.mock("@/infra/db/repositories/field-repository", () => ({
  listFieldsByIds: listFieldsByIdsMock,
}));

vi.mock("@/infra/db/repositories/group-repository", () => ({
  getGroupById: getGroupByIdMock,
  listParticipantsByGroup: listParticipantsByGroupMock,
}));

vi.mock("@/infra/db/repositories/observation-repository", () => ({
  listObservationsByEncounter: listObservationsByEncounterMock,
}));

vi.mock("@/features/settings/services/settings-service", () => ({
  hasGeminiApiKey: hasGeminiApiKeyMock,
  getGeminiApiKey: getGeminiApiKeyMock,
}));

vi.mock("@/infra/ai/gemini-chronicle-generator", () => ({
  generateChronicleWithGemini: generateChronicleWithGeminiMock,
}));

function stubEncounterData(encounterId: string, fieldId: string, participantId: string) {
  const now = new Date().toISOString();

  getEncounterByIdMock.mockResolvedValue({
    id: encounterId,
    groupId: crypto.randomUUID(),
    formId: crypto.randomUUID(),
    formVersion: 1,
    fieldIds: [fieldId],
    activity: "Actividad de prueba",
    startedAt: now,
    endedAt: "",
    createdAt: now,
    updatedAt: now,
    archivedAt: "",
  });
  getGroupByIdMock.mockResolvedValue({
    id: crypto.randomUUID(),
    institutionId: "00000000-0000-4000-8000-000000000001",
    name: "Grupo Alfa",
    createdAt: now,
    updatedAt: now,
    archivedAt: "",
  });
  listParticipantsByGroupMock.mockResolvedValue([
    {
      id: participantId,
      groupId: crypto.randomUUID(),
      displayName: "Sofía",
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    },
  ]);
  listFieldsByIdsMock.mockResolvedValue([
    {
      id: fieldId,
      key: "nota",
      label: "Nota",
      type: "text",
      required: true,
      config: {},
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    },
  ]);
  listObservationsByEncounterMock.mockResolvedValue([
    {
      id: crypto.randomUUID(),
      encounterId,
      participantId,
      values: { [fieldId]: "Observación clave" },
      createdAt: now,
    },
  ]);
  upsertChronicleByEncounterMock.mockResolvedValue({
    id: crypto.randomUUID(),
    encounterId,
    title: "Crónica · Actividad de prueba",
    body: "body",
    generatedAt: now,
    createdAt: now,
    updatedAt: now,
  });
}

describe("chronicle service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hasGeminiApiKeyMock.mockReturnValue(false);
    getGeminiApiKeyMock.mockReturnValue(null);
  });

  it("throws when generating without an existing encounter", async () => {
    getEncounterByIdMock.mockResolvedValue(undefined);

    await expect(generateChronicle(crypto.randomUUID())).rejects.toMatchObject({
      name: "AppError",
      code: "CHRONICLE_ENCOUNTER_REQUIRED",
    } satisfies Pick<AppError, "name" | "code">);
  });

  it("builds deterministic chronicle and returns usedAi=false when no API key", async () => {
    const encounterId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const participantId = crypto.randomUUID();
    stubEncounterData(encounterId, fieldId, participantId);

    const result = await generateChronicle(encounterId);

    expect(result.usedAi).toBe(false);
    expect(result.aiFailed).toBe(false);
    expect(generateChronicleWithGeminiMock).not.toHaveBeenCalled();
    expect(upsertChronicleByEncounterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        encounterId,
        title: "Crónica · Actividad de prueba",
        body: expect.stringContaining("Grupo: Grupo Alfa"),
        generatedWith: "deterministic",
      }),
    );
  });

  it("uses Gemini when API key is configured and returns usedAi=true", async () => {
    const encounterId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const participantId = crypto.randomUUID();
    stubEncounterData(encounterId, fieldId, participantId);

    hasGeminiApiKeyMock.mockReturnValue(true);
    getGeminiApiKeyMock.mockReturnValue("AIzaTest");
    generateChronicleWithGeminiMock.mockResolvedValue("Crónica con IA.");

    const result = await generateChronicle(encounterId);

    expect(result.usedAi).toBe(true);
    expect(result.aiFailed).toBe(false);
    expect(generateChronicleWithGeminiMock).toHaveBeenCalledOnce();
    expect(upsertChronicleByEncounterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        body: "Crónica con IA.",
        generatedWith: "gemini",
      }),
    );
  });

  it("falls back to deterministic and sets aiFailed=true when Gemini throws", async () => {
    const encounterId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const participantId = crypto.randomUUID();
    stubEncounterData(encounterId, fieldId, participantId);

    hasGeminiApiKeyMock.mockReturnValue(true);
    getGeminiApiKeyMock.mockReturnValue("AIzaTest");
    generateChronicleWithGeminiMock.mockRejectedValue(new Error("Network error"));

    const result = await generateChronicle(encounterId);

    expect(result.usedAi).toBe(false);
    expect(result.aiFailed).toBe(true);
    expect(upsertChronicleByEncounterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        generatedWith: "deterministic",
      }),
    );
  });

  it("throws not found when requesting unknown chronicle detail", async () => {
    getChronicleByIdMock.mockResolvedValue(undefined);

    await expect(getChronicleDetail(crypto.randomUUID())).rejects.toMatchObject({
      name: "AppError",
      code: "CHRONICLE_NOT_FOUND",
    } satisfies Pick<AppError, "name" | "code">);
  });

  it("throws not found when delete does not remove chronicle", async () => {
    deleteChronicleMock.mockResolvedValue(false);

    await expect(removeChronicle(crypto.randomUUID())).rejects.toMatchObject({
      name: "AppError",
      code: "CHRONICLE_NOT_FOUND",
    } satisfies Pick<AppError, "name" | "code">);
  });
});
