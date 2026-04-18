import JSZip from "jszip";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { exportEncounterToZip } from "@/infra/export/encounter-exporter";

const {
  resolveEncounterDependenciesMock,
  listObservationsByEncounterMock,
  groupGetMock,
  participantToArrayMock,
  mediaGetMock,
} = vi.hoisted(() => ({
  resolveEncounterDependenciesMock: vi.fn(),
  listObservationsByEncounterMock: vi.fn(),
  groupGetMock: vi.fn(),
  participantToArrayMock: vi.fn(),
  mediaGetMock: vi.fn(),
}));

vi.mock("@/features/encounters/services/encounter-service", () => ({
  resolveEncounterDependencies: resolveEncounterDependenciesMock,
}));

vi.mock("@/infra/db/repositories/observation-repository", () => ({
  listObservationsByEncounter: listObservationsByEncounterMock,
}));

vi.mock("@/infra/db/client", () => ({
  db: {
    groups: {
      get: groupGetMock,
    },
    participants: {
      where: vi.fn(() => ({
        equals: vi.fn(() => ({
          toArray: participantToArrayMock,
        })),
      })),
    },
    media: {
      get: mediaGetMock,
    },
  },
}));

describe("encounter exporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports encounter data and media into a zip blob", async () => {
    const encounterId = crypto.randomUUID();
    const groupId = crypto.randomUUID();
    const formId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const participantId = crypto.randomUUID();
    const mediaId = crypto.randomUUID();

    resolveEncounterDependenciesMock.mockResolvedValue({
      encounter: {
        id: encounterId,
        groupId,
        formId,
        formVersion: 1,
        fieldIds: [fieldId],
        activity: "Actividad Export",
        startedAt: new Date().toISOString(),
        endedAt: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      fields: [
        {
          id: fieldId,
          key: "nota",
          label: "Nota",
          type: "text",
          required: true,
          config: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          archivedAt: "",
        },
      ],
      form: {
        id: formId,
        name: "Formulario Export",
        fieldIds: [fieldId],
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: "",
      },
      participants: [],
    });

    groupGetMock.mockResolvedValue({
      id: groupId,
      institutionId: "00000000-0000-4000-8000-000000000001",
      name: "Grupo Export",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archivedAt: "",
    });

    participantToArrayMock.mockResolvedValue([
      {
        id: participantId,
        groupId,
        displayName: "Sofía",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: "",
      },
    ]);

    listObservationsByEncounterMock.mockResolvedValue([
      {
        id: crypto.randomUUID(),
        encounterId,
        participantId,
        values: {
          [fieldId]: { mediaId },
        },
        createdAt: new Date().toISOString(),
      },
    ]);

    mediaGetMock.mockResolvedValue({
      id: mediaId,
      mime: "image/png",
      size: 4,
      createdAt: new Date().toISOString(),
      blob: new Blob([new Uint8Array([1, 2, 3, 4])], { type: "image/png" }),
    });

    const previousCreateObjectURL = URL.createObjectURL;
    const previousRevokeObjectURL = URL.revokeObjectURL;

    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: vi.fn().mockReturnValue("blob:encounter-export"),
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: vi.fn(),
    });

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    await exportEncounterToZip(encounterId);

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);

    const zipBlob = vi.mocked(URL.createObjectURL).mock.calls[0]?.[0] as Blob;
    const zip = await JSZip.loadAsync(zipBlob);

    expect(Object.keys(zip.files)).toEqual(
      expect.arrayContaining([
        "manifest.json",
        "encounter.json",
        "group.json",
        "participants.json",
        "fields.json",
        "form.json",
        "observations.json",
        `media/${mediaId}`,
      ]),
    );

    const manifestText = await zip.file("manifest.json")?.async("string");
    expect(manifestText).toContain("chronicle-encounter-v1");

    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: previousCreateObjectURL,
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: previousRevokeObjectURL,
    });

    clickSpy.mockRestore();
  });
});
