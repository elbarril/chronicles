import JSZip from "jszip";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { importEncounterData, parseEncounterZip } from "@/infra/export/encounter-importer";
import { MANIFEST_SCHEMA } from "@/infra/export/manifest";
import { AppError } from "@/lib/error";

const {
  transactionMock,
  fieldsBulkPutMock,
  formsPutMock,
  groupsPutMock,
  participantsBulkPutMock,
  encountersPutMock,
  observationsBulkPutMock,
  mediaBulkPutMock,
} = vi.hoisted(() => ({
  transactionMock: vi.fn(),
  fieldsBulkPutMock: vi.fn(),
  formsPutMock: vi.fn(),
  groupsPutMock: vi.fn(),
  participantsBulkPutMock: vi.fn(),
  encountersPutMock: vi.fn(),
  observationsBulkPutMock: vi.fn(),
  mediaBulkPutMock: vi.fn(),
}));

vi.mock("@/infra/db/client", () => ({
  db: {
    transaction: transactionMock,
    fields: {
      bulkPut: fieldsBulkPutMock,
    },
    forms: {
      put: formsPutMock,
    },
    groups: {
      put: groupsPutMock,
    },
    participants: {
      bulkPut: participantsBulkPutMock,
    },
    encounters: {
      put: encountersPutMock,
    },
    observations: {
      bulkPut: observationsBulkPutMock,
    },
    media: {
      bulkPut: mediaBulkPutMock,
    },
  },
}));

describe("encounter importer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transactionMock.mockImplementation(async (_mode, _tables, callback) => callback());
  });

  it("parses a valid encounter zip and returns preview data", async () => {
    const encounterId = crypto.randomUUID();
    const groupId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const formId = crypto.randomUUID();
    const mediaId = crypto.randomUUID();

    const zip = new JSZip();
    zip.file(
      "manifest.json",
      JSON.stringify({
        schema: MANIFEST_SCHEMA,
        exportedAt: new Date().toISOString(),
        encounterActivity: "Actividad Import",
        groupName: "Grupo Import",
        startedAt: new Date().toISOString(),
        endedAt: "",
        observationCount: 1,
        mediaIndex: [
          {
            id: mediaId,
            mime: "image/png",
            size: 4,
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    );
    zip.file(
      "encounter.json",
      JSON.stringify({
        id: encounterId,
        groupId,
        formId,
        formVersion: 1,
        fieldIds: [fieldId],
        activity: "Actividad Import",
        startedAt: new Date().toISOString(),
        endedAt: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
    zip.file(
      "group.json",
      JSON.stringify({
        id: groupId,
        institutionId: "00000000-0000-4000-8000-000000000001",
        name: "Grupo Import",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: "",
      }),
    );
    zip.file(
      "participants.json",
      JSON.stringify([
        {
          id: crypto.randomUUID(),
          groupId,
          displayName: "Sofía",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          archivedAt: "",
        },
      ]),
    );
    zip.file(
      "fields.json",
      JSON.stringify([
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
      ]),
    );
    zip.file(
      "form.json",
      JSON.stringify({
        id: formId,
        name: "Formulario",
        fieldIds: [fieldId],
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: "",
      }),
    );
    zip.file(
      "observations.json",
      JSON.stringify([
        {
          id: crypto.randomUUID(),
          encounterId,
          values: {
            [fieldId]: { mediaId },
          },
          createdAt: new Date().toISOString(),
        },
      ]),
    );
    zip.file("media/" + mediaId, new Uint8Array([1, 2, 3, 4]));

    const zipBytes = await zip.generateAsync({ type: "arraybuffer" });
    const file = new File([zipBytes], "encounter.zip", { type: "application/zip" });

    const preview = await parseEncounterZip(file);

    expect(preview.manifest.schema).toBe(MANIFEST_SCHEMA);
    expect(preview.data.encounter.id).toBe(encounterId);
    expect(preview.data.mediaEntries).toHaveLength(1);
  });

  it("throws IMPORT_INVALID_ZIP for non-zip content", async () => {
    const file = new File(["not a zip"], "invalid.txt", { type: "text/plain" });

    await expect(parseEncounterZip(file)).rejects.toMatchObject({
      name: "AppError",
      code: "IMPORT_INVALID_ZIP",
    } satisfies Pick<AppError, "name" | "code">);
  });

  it("imports parsed data with transactional upsert", async () => {
    const encounterId = crypto.randomUUID();
    const groupId = crypto.randomUUID();
    const fieldId = crypto.randomUUID();
    const formId = crypto.randomUUID();

    await importEncounterData({
      encounter: {
        id: encounterId,
        groupId,
        formId,
        formVersion: 1,
        fieldIds: [fieldId],
        activity: "Actividad",
        startedAt: new Date().toISOString(),
        endedAt: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      group: {
        id: groupId,
        institutionId: "00000000-0000-4000-8000-000000000001",
        name: "Grupo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: "",
      },
      participants: [],
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
        name: "Formulario",
        fieldIds: [fieldId],
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: "",
      },
      observations: [],
      mediaEntries: [],
    });

    expect(transactionMock).toHaveBeenCalledTimes(1);
    expect(fieldsBulkPutMock).toHaveBeenCalledTimes(1);
    expect(formsPutMock).toHaveBeenCalledTimes(1);
    expect(groupsPutMock).toHaveBeenCalledTimes(1);
    expect(participantsBulkPutMock).toHaveBeenCalledTimes(1);
    expect(encountersPutMock).toHaveBeenCalledTimes(1);
    expect(observationsBulkPutMock).toHaveBeenCalledTimes(1);
    expect(mediaBulkPutMock).toHaveBeenCalledTimes(1);
  });
});
