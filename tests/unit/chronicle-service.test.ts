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
  getChronicleByEncounterIdMock,
  deleteChronicleMock,
  getEncounterByIdMock,
  listFieldsByIdsMock,
  getProjectByIdMock,
  listParticipantsByProjectMock,
  listObservationsByEncounterMock,
  hasGeminiApiKeyMock,
  getGeminiApiKeyMock,
  generateChronicleWithGeminiMock,
  computeChronicleInputHashMock,
} = vi.hoisted(() => ({
  upsertChronicleByEncounterMock: vi.fn(),
  getChronicleByIdMock: vi.fn(),
  getChronicleByEncounterIdMock: vi.fn(),
  deleteChronicleMock: vi.fn(),
  getEncounterByIdMock: vi.fn(),
  listFieldsByIdsMock: vi.fn(),
  getProjectByIdMock: vi.fn(),
  listParticipantsByProjectMock: vi.fn(),
  listObservationsByEncounterMock: vi.fn(),
  hasGeminiApiKeyMock: vi.fn(),
  getGeminiApiKeyMock: vi.fn(),
  generateChronicleWithGeminiMock: vi.fn(),
  computeChronicleInputHashMock: vi.fn(),
}));

vi.mock("@/infra/db/repositories/chronicle-repository", () => ({
  upsertChronicleByEncounter: upsertChronicleByEncounterMock,
  getChronicleById: getChronicleByIdMock,
  getChronicleByEncounterId: getChronicleByEncounterIdMock,
  deleteChronicle: deleteChronicleMock,
  listChronicles: vi.fn(),
}));

vi.mock("@/infra/ai/chronicle-input-hash", () => ({
  computeChronicleInputHash: computeChronicleInputHashMock,
}));

vi.mock("@/infra/db/repositories/encounter-repository", () => ({
  getEncounterById: getEncounterByIdMock,
}));

vi.mock("@/infra/db/repositories/field-repository", () => ({
  listFieldsByIds: listFieldsByIdsMock,
}));

vi.mock("@/infra/db/repositories/project-repository", () => ({
  getProjectById: getProjectByIdMock,
  listParticipantsByProject: listParticipantsByProjectMock,
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
  const projectId = crypto.randomUUID();

  getEncounterByIdMock.mockResolvedValue({
    id: encounterId,
    projectId,
    name: "Sesión del lunes",
    startsAt: now,
    endsAt: now,
    participantIds: [participantId],
    archivedAt: "",
    createdAt: now,
    updatedAt: now,
  });
  getProjectByIdMock.mockResolvedValue({
    id: projectId,
    institutionId: "00000000-0000-4000-8000-000000000001",
    name: "Proyecto Alfa",
    createdAt: now,
    updatedAt: now,
    archivedAt: "",
  });
  listParticipantsByProjectMock.mockResolvedValue([
    {
      id: participantId,
      projectId,
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
      formId: crypto.randomUUID(),
      formVersion: 1,
      fieldIds: [fieldId],
      participantId,
      values: { [fieldId]: "Observación clave" },
      createdAt: now,
    },
  ]);
  upsertChronicleByEncounterMock.mockResolvedValue({
    id: crypto.randomUUID(),
    encounterId,
    title: "Crónica · Proyecto Alfa · Sesión del lunes",
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
    // Default: no existing chronicle and a fixed hash value
    getChronicleByEncounterIdMock.mockResolvedValue(undefined);
    computeChronicleInputHashMock.mockResolvedValue("hash-abc123");
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
        title: "Crónica · Proyecto Alfa · Sesión del lunes",
        body: expect.stringContaining("Proyecto: Proyecto Alfa"),
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

  it("throws when Gemini fails and no existing chronicle is available", async () => {
    const encounterId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const participantId = crypto.randomUUID();
    stubEncounterData(encounterId, fieldId, participantId);

    hasGeminiApiKeyMock.mockReturnValue(true);
    getGeminiApiKeyMock.mockReturnValue("AIzaTest");
    generateChronicleWithGeminiMock.mockRejectedValue(new Error("Network error"));
    // No existing chronicle
    getChronicleByEncounterIdMock.mockResolvedValue(undefined);

    await expect(generateChronicle(encounterId)).rejects.toMatchObject({
      code: "AI_GENERATION_FAILED",
    } satisfies Pick<AppError, "code">);
    expect(upsertChronicleByEncounterMock).not.toHaveBeenCalled();
  });

  it("returns existing chronicle with aiFailed=true when Gemini fails and chronicle exists", async () => {
    const encounterId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const participantId = crypto.randomUUID();
    stubEncounterData(encounterId, fieldId, participantId);

    hasGeminiApiKeyMock.mockReturnValue(true);
    getGeminiApiKeyMock.mockReturnValue("AIzaTest");
    generateChronicleWithGeminiMock.mockRejectedValue(
      new AppError("AI_RATE_LIMITED", "Gemini API rate limit or quota exceeded."),
    );

    const now = new Date().toISOString();
    const existingChronicle = {
      id: crypto.randomUUID(),
      encounterId,
      title: "Crónica · Proyecto Alfa · Sesión del lunes",
      body: "Crónica previa con IA.",
      generatedAt: now,
      createdAt: now,
      updatedAt: now,
      generatedWith: "gemini" as const,
      inputHash: "hash-old",
    };
    getChronicleByEncounterIdMock.mockResolvedValue(existingChronicle);
    // Hash changed so cache check doesn't return early
    computeChronicleInputHashMock.mockResolvedValue("hash-new");

    const result = await generateChronicle(encounterId);

    expect(result.aiFailed).toBe(true);
    expect(result.aiFailCode).toBe("AI_RATE_LIMITED");
    expect(result.usedAi).toBe(true);
    expect(result.chronicle).toStrictEqual(existingChronicle);
    expect(upsertChronicleByEncounterMock).not.toHaveBeenCalled();
  });

  it("throws AI_KEY_INVALID when Gemini returns 403 and no existing chronicle", async () => {
    const encounterId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const participantId = crypto.randomUUID();
    stubEncounterData(encounterId, fieldId, participantId);

    hasGeminiApiKeyMock.mockReturnValue(true);
    getGeminiApiKeyMock.mockReturnValue("AIzaBad");
    generateChronicleWithGeminiMock.mockRejectedValue(
      new AppError("AI_KEY_INVALID", "Gemini API key is not authorized."),
    );
    getChronicleByEncounterIdMock.mockResolvedValue(undefined);

    await expect(generateChronicle(encounterId)).rejects.toMatchObject({
      code: "AI_KEY_INVALID",
    } satisfies Pick<AppError, "code">);
    expect(upsertChronicleByEncounterMock).not.toHaveBeenCalled();
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

  describe("AI cache behaviour", () => {
    function stubGeminiReady(encounterId: string) {
      const fieldId = crypto.randomUUID();
      const participantId = crypto.randomUUID();
      stubEncounterData(encounterId, fieldId, participantId);
      hasGeminiApiKeyMock.mockReturnValue(true);
      getGeminiApiKeyMock.mockReturnValue("AIzaTest");
      generateChronicleWithGeminiMock.mockResolvedValue("Crónica con IA.");
    }

    it("returns cached chronicle without calling Gemini when hash matches", async () => {
      const encounterId = crypto.randomUUID();
      stubGeminiReady(encounterId);

      const now = new Date().toISOString();
      const cachedChronicle = {
        id: crypto.randomUUID(),
        encounterId,
        title: "Crónica · Proyecto Alfa · Sesión del lunes",
        body: "Crónica previa con IA.",
        generatedAt: now,
        createdAt: now,
        updatedAt: now,
        generatedWith: "gemini" as const,
        inputHash: "hash-abc123",
      };
      getChronicleByEncounterIdMock.mockResolvedValue(cachedChronicle);
      computeChronicleInputHashMock.mockResolvedValue("hash-abc123");

      const result = await generateChronicle(encounterId);

      expect(result.usedAi).toBe(true);
      expect(result.aiFailed).toBe(false);
      expect(result.chronicle).toStrictEqual(cachedChronicle);
      expect(generateChronicleWithGeminiMock).not.toHaveBeenCalled();
      expect(upsertChronicleByEncounterMock).not.toHaveBeenCalled();
    });

    it("calls Gemini and saves new hash when hash does not match (observations changed)", async () => {
      const encounterId = crypto.randomUUID();
      stubGeminiReady(encounterId);

      const now = new Date().toISOString();
      getChronicleByEncounterIdMock.mockResolvedValue({
        id: crypto.randomUUID(),
        encounterId,
        title: "Crónica · Proyecto Alfa · Sesión del lunes",
        body: "Crónica previa.",
        generatedAt: now,
        createdAt: now,
        updatedAt: now,
        generatedWith: "gemini" as const,
        inputHash: "hash-old",
      });
      // Current observations produce a different hash
      computeChronicleInputHashMock.mockResolvedValue("hash-new");

      const result = await generateChronicle(encounterId);

      expect(result.usedAi).toBe(true);
      expect(generateChronicleWithGeminiMock).toHaveBeenCalledOnce();
      expect(upsertChronicleByEncounterMock).toHaveBeenCalledWith(
        expect.objectContaining({ generatedWith: "gemini", inputHash: "hash-new" }),
      );
    });

    it("skips cache check when existing chronicle was generated deterministically", async () => {
      const encounterId = crypto.randomUUID();
      stubGeminiReady(encounterId);

      const now = new Date().toISOString();
      // Chronicle exists but was NOT generated by Gemini — cache doesn't apply
      getChronicleByEncounterIdMock.mockResolvedValue({
        id: crypto.randomUUID(),
        encounterId,
        title: "Crónica · Proyecto Alfa · Sesión del lunes",
        body: "Crónica determinista.",
        generatedAt: now,
        createdAt: now,
        updatedAt: now,
        generatedWith: "deterministic" as const,
        inputHash: undefined,
      });

      const result = await generateChronicle(encounterId);

      expect(result.usedAi).toBe(true);
      expect(generateChronicleWithGeminiMock).toHaveBeenCalledOnce();
    });
  });
});
