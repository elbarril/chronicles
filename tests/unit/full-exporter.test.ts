import JSZip from "jszip";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { exportFullToZip } from "@/infra/export/full-exporter";

const {
  fieldsToArrayMock,
  formsToArrayMock,
  groupsToArrayMock,
  participantsToArrayMock,
  encountersToArrayMock,
  observationsToArrayMock,
  chroniclesToArrayMock,
  mediaToArrayMock,
} = vi.hoisted(() => ({
  fieldsToArrayMock: vi.fn(),
  formsToArrayMock: vi.fn(),
  groupsToArrayMock: vi.fn(),
  participantsToArrayMock: vi.fn(),
  encountersToArrayMock: vi.fn(),
  observationsToArrayMock: vi.fn(),
  chroniclesToArrayMock: vi.fn(),
  mediaToArrayMock: vi.fn(),
}));

vi.mock("@/infra/db/client", () => ({
  db: {
    fields: { toArray: fieldsToArrayMock },
    forms: { toArray: formsToArrayMock },
    groups: { toArray: groupsToArrayMock },
    participants: { toArray: participantsToArrayMock },
    encounters: { toArray: encountersToArrayMock },
    observations: { toArray: observationsToArrayMock },
    chronicles: { toArray: chroniclesToArrayMock },
    media: { toArray: mediaToArrayMock },
  },
}));

describe("full exporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("packages all entities + appearance settings into a chronicle-full-v1 ZIP", async () => {
    const groupId = crypto.randomUUID();
    const formId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const participantId = crypto.randomUUID();
    const encounterId = crypto.randomUUID();
    const observationId = crypto.randomUUID();
    const chronicleId = crypto.randomUUID();
    const mediaId = crypto.randomUUID();
    const now = new Date().toISOString();

    fieldsToArrayMock.mockResolvedValue([
      {
        id: fieldId,
        key: "nota",
        label: "Nota",
        type: "text",
        required: false,
        config: {},
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      },
    ]);
    formsToArrayMock.mockResolvedValue([
      {
        id: formId,
        name: "Formulario",
        fieldIds: [fieldId],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      },
    ]);
    groupsToArrayMock.mockResolvedValue([
      {
        id: groupId,
        institutionId: "00000000-0000-4000-8000-000000000001",
        name: "Grupo",
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      },
    ]);
    participantsToArrayMock.mockResolvedValue([
      {
        id: participantId,
        groupId,
        displayName: "Sofía",
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      },
    ]);
    encountersToArrayMock.mockResolvedValue([
      {
        id: encounterId,
        groupId,
        formId,
        formVersion: 1,
        fieldIds: [fieldId],
        activity: "Encuentro de prueba",
        startedAt: now,
        endedAt: "",
        archivedAt: "",
        createdAt: now,
        updatedAt: now,
      },
    ]);
    observationsToArrayMock.mockResolvedValue([
      {
        id: observationId,
        encounterId,
        participantId,
        title: "Observación",
        values: { [fieldId]: "Hola" },
        createdAt: now,
      },
    ]);
    chroniclesToArrayMock.mockResolvedValue([
      {
        id: chronicleId,
        encounterId,
        title: "Crónica de prueba",
        body: "Cuerpo",
        generatedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    mediaToArrayMock.mockResolvedValue([
      {
        id: mediaId,
        mime: "image/png",
        size: 4,
        createdAt: now,
        blob: new Blob([new Uint8Array([1, 2, 3, 4])], { type: "image/png" }),
      },
    ]);

    const previousCreateObjectURL = URL.createObjectURL;
    const previousRevokeObjectURL = URL.revokeObjectURL;

    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: vi.fn().mockReturnValue("blob:full-export"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: vi.fn(),
    });

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    await exportFullToZip({ userName: "Emiliano", brandColor: "indigo" });

    expect(clickSpy).toHaveBeenCalledTimes(1);

    const zipBlob = vi.mocked(URL.createObjectURL).mock.calls[0]?.[0] as Blob;
    const zip = await JSZip.loadAsync(zipBlob);

    expect(Object.keys(zip.files)).toEqual(
      expect.arrayContaining([
        "manifest.json",
        "fields.json",
        "forms.json",
        "groups.json",
        "participants.json",
        "encounters.json",
        "observations.json",
        "chronicles.json",
        `media/${mediaId}`,
      ]),
    );

    const manifestText = await zip.file("manifest.json")?.async("string");
    expect(manifestText).toContain("chronicle-full-v1");
    expect(manifestText).toContain("Emiliano");
    expect(manifestText).toContain("indigo");

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

  it("works with an empty database (no encounters or chronicles)", async () => {
    fieldsToArrayMock.mockResolvedValue([]);
    formsToArrayMock.mockResolvedValue([]);
    groupsToArrayMock.mockResolvedValue([]);
    participantsToArrayMock.mockResolvedValue([]);
    encountersToArrayMock.mockResolvedValue([]);
    observationsToArrayMock.mockResolvedValue([]);
    chroniclesToArrayMock.mockResolvedValue([]);
    mediaToArrayMock.mockResolvedValue([]);

    const previousCreateObjectURL = URL.createObjectURL;
    const previousRevokeObjectURL = URL.revokeObjectURL;

    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: vi.fn().mockReturnValue("blob:empty-full-export"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: vi.fn(),
    });

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    await exportFullToZip();

    expect(clickSpy).toHaveBeenCalledTimes(1);

    const zipBlob = vi.mocked(URL.createObjectURL).mock.calls[0]?.[0] as Blob;
    const zip = await JSZip.loadAsync(zipBlob);

    const manifestText = await zip.file("manifest.json")?.async("string");
    expect(manifestText).toContain("chronicle-full-v1");

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
