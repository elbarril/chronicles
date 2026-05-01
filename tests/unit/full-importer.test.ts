import JSZip from "jszip";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { confirmImport, parseZipForImport } from "@/features/import/services/import-service";
import { FULL_MANIFEST_SCHEMA, MANIFEST_SCHEMA } from "@/infra/export/manifest";

const {
  transactionMock,
  fieldsBulkPutMock,
  formsBulkPutMock,
  groupsBulkPutMock,
  participantsBulkPutMock,
  encountersBulkPutMock,
  observationsBulkPutMock,
  chroniclesBulkPutMock,
  mediaBulkPutMock,
  formsPutLegacyMock,
  groupsPutLegacyMock,
  encountersPutLegacyMock,
} = vi.hoisted(() => ({
  transactionMock: vi.fn(),
  fieldsBulkPutMock: vi.fn(),
  formsBulkPutMock: vi.fn(),
  groupsBulkPutMock: vi.fn(),
  participantsBulkPutMock: vi.fn(),
  encountersBulkPutMock: vi.fn(),
  observationsBulkPutMock: vi.fn(),
  chroniclesBulkPutMock: vi.fn(),
  mediaBulkPutMock: vi.fn(),
  formsPutLegacyMock: vi.fn(),
  groupsPutLegacyMock: vi.fn(),
  encountersPutLegacyMock: vi.fn(),
}));

vi.mock("@/infra/db/client", () => ({
  db: {
    transaction: transactionMock,
    fields: { bulkPut: fieldsBulkPutMock },
    forms: { bulkPut: formsBulkPutMock, put: formsPutLegacyMock },
    groups: { bulkPut: groupsBulkPutMock, put: groupsPutLegacyMock },
    participants: { bulkPut: participantsBulkPutMock },
    encounters: { bulkPut: encountersBulkPutMock, put: encountersPutLegacyMock },
    observations: { bulkPut: observationsBulkPutMock },
    chronicles: { bulkPut: chroniclesBulkPutMock },
    media: { bulkPut: mediaBulkPutMock },
  },
}));

function isoNow(): string {
  return new Date().toISOString();
}

async function buildFullZip(): Promise<File> {
  const fieldId = crypto.randomUUID();
  const formId = crypto.randomUUID();
  const groupId = crypto.randomUUID();
  const participantId = crypto.randomUUID();
  const encounterId = crypto.randomUUID();
  const chronicleId = crypto.randomUUID();
  const mediaId = crypto.randomUUID();
  const now = isoNow();

  const zip = new JSZip();
  zip.file(
    "manifest.json",
    JSON.stringify({
      schema: FULL_MANIFEST_SCHEMA,
      exportedAt: now,
      exportedBy: "Emiliano",
      brandColor: "forest",
      counts: {
        fields: 1,
        forms: 1,
        groups: 1,
        participants: 1,
        encounters: 1,
        observations: 1,
        chronicles: 1,
        media: 1,
      },
      mediaIndex: [{ id: mediaId, mime: "image/png", size: 4, createdAt: now }],
    }),
  );
  zip.file(
    "fields.json",
    JSON.stringify([
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
    ]),
  );
  zip.file(
    "forms.json",
    JSON.stringify([
      {
        id: formId,
        name: "Formulario",
        fieldIds: [fieldId],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      },
    ]),
  );
  zip.file(
    "groups.json",
    JSON.stringify([
      {
        id: groupId,
        institutionId: "00000000-0000-4000-8000-000000000001",
        name: "Grupo",
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      },
    ]),
  );
  zip.file(
    "participants.json",
    JSON.stringify([
      {
        id: participantId,
        groupId,
        displayName: "Sofía",
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      },
    ]),
  );
  zip.file(
    "encounters.json",
    JSON.stringify([
      {
        id: encounterId,
        groupId,
        formId,
        formVersion: 1,
        fieldIds: [fieldId],
        activity: "Encuentro",
        startedAt: now,
        endedAt: "",
        archivedAt: "",
        createdAt: now,
        updatedAt: now,
      },
    ]),
  );
  zip.file(
    "observations.json",
    JSON.stringify([
      {
        id: crypto.randomUUID(),
        encounterId,
        participantId,
        values: { [fieldId]: "Hola" },
        createdAt: now,
      },
    ]),
  );
  zip.file(
    "chronicles.json",
    JSON.stringify([
      {
        id: chronicleId,
        encounterId,
        title: "Crónica",
        body: "Cuerpo",
        generatedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ]),
  );
  zip.file(`media/${mediaId}`, new Uint8Array([1, 2, 3, 4]));

  const buffer = await zip.generateAsync({ type: "arraybuffer" });
  return new File([buffer], "chronicle-export.zip", { type: "application/zip" });
}

async function buildEncounterZip(): Promise<File> {
  const fieldId = crypto.randomUUID();
  const formId = crypto.randomUUID();
  const groupId = crypto.randomUUID();
  const encounterId = crypto.randomUUID();
  const now = isoNow();

  const zip = new JSZip();
  zip.file(
    "manifest.json",
    JSON.stringify({
      schema: MANIFEST_SCHEMA,
      exportedAt: now,
      encounterActivity: "Encuentro",
      groupName: "Grupo",
      startedAt: now,
      endedAt: "",
      observationCount: 0,
      mediaIndex: [],
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
      activity: "Encuentro",
      startedAt: now,
      endedAt: "",
      createdAt: now,
      updatedAt: now,
    }),
  );
  zip.file(
    "group.json",
    JSON.stringify({
      id: groupId,
      institutionId: "00000000-0000-4000-8000-000000000001",
      name: "Grupo",
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    }),
  );
  zip.file("participants.json", JSON.stringify([]));
  zip.file(
    "fields.json",
    JSON.stringify([
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
    ]),
  );
  zip.file(
    "form.json",
    JSON.stringify({
      id: formId,
      name: "Formulario",
      fieldIds: [fieldId],
      version: 1,
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    }),
  );
  zip.file("observations.json", JSON.stringify([]));

  const buffer = await zip.generateAsync({ type: "arraybuffer" });
  return new File([buffer], "encounter.zip", { type: "application/zip" });
}

describe("import service dispatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transactionMock.mockImplementation(async (_mode, _tables, callback) => callback());
  });

  it("parses a chronicle-full-v1 ZIP and reports counts + appearance", async () => {
    const file = await buildFullZip();
    const result = await parseZipForImport(file);

    expect(result.kind).toBe("full");
    if (result.kind !== "full") return;

    expect(result.preview.manifest.exportedBy).toBe("Emiliano");
    expect(result.preview.manifest.brandColor).toBe("forest");
    expect(result.preview.manifest.counts).toMatchObject({
      fields: 1,
      forms: 1,
      groups: 1,
      participants: 1,
      encounters: 1,
      observations: 1,
      chronicles: 1,
      media: 1,
    });
    expect(result.preview.data.mediaEntries).toHaveLength(1);
  });

  it("imports a chronicle-full-v1 ZIP through bulkPut for every table", async () => {
    const file = await buildFullZip();
    const preview = await parseZipForImport(file);

    await confirmImport(preview);

    expect(transactionMock).toHaveBeenCalledTimes(1);
    expect(fieldsBulkPutMock).toHaveBeenCalledTimes(1);
    expect(formsBulkPutMock).toHaveBeenCalledTimes(1);
    expect(groupsBulkPutMock).toHaveBeenCalledTimes(1);
    expect(participantsBulkPutMock).toHaveBeenCalledTimes(1);
    expect(encountersBulkPutMock).toHaveBeenCalledTimes(1);
    expect(observationsBulkPutMock).toHaveBeenCalledTimes(1);
    expect(chroniclesBulkPutMock).toHaveBeenCalledTimes(1);
    expect(mediaBulkPutMock).toHaveBeenCalledTimes(1);
  });

  it("recognises a legacy chronicle-encounter-v1 ZIP and exposes its preview", async () => {
    const file = await buildEncounterZip();
    const result = await parseZipForImport(file);

    expect(result.kind).toBe("encounter");
    if (result.kind !== "encounter") return;
    expect(result.preview.manifest.encounterActivity).toBe("Encuentro");
  });
});
