import JSZip from "jszip";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { confirmImport, parseZipForImport } from "@/features/import/services/import-service";
import { FULL_MANIFEST_SCHEMA } from "@/infra/export/manifest";

const {
  transactionMock,
  fieldsBulkPutMock,
  formsBulkPutMock,
  projectsBulkPutMock,
  participantsBulkPutMock,
  encountersBulkPutMock,
  observationsBulkPutMock,
  chroniclesBulkPutMock,
  mediaBulkPutMock,
} = vi.hoisted(() => ({
  transactionMock: vi.fn(),
  fieldsBulkPutMock: vi.fn(),
  formsBulkPutMock: vi.fn(),
  projectsBulkPutMock: vi.fn(),
  participantsBulkPutMock: vi.fn(),
  encountersBulkPutMock: vi.fn(),
  observationsBulkPutMock: vi.fn(),
  chroniclesBulkPutMock: vi.fn(),
  mediaBulkPutMock: vi.fn(),
}));

vi.mock("@/infra/db/client", () => ({
  db: {
    transaction: transactionMock,
    fields: { bulkPut: fieldsBulkPutMock },
    forms: { bulkPut: formsBulkPutMock },
    projects: { bulkPut: projectsBulkPutMock },
    participants: { bulkPut: participantsBulkPutMock },
    encounters: { bulkPut: encountersBulkPutMock },
    observations: { bulkPut: observationsBulkPutMock },
    chronicles: { bulkPut: chroniclesBulkPutMock },
    media: { bulkPut: mediaBulkPutMock },
  },
}));

function isoNow(): string {
  return new Date().toISOString();
}

interface FullSampleSeed {
  fieldId: string;
  instanceId: string;
  formId: string;
  projectId: string;
  participantId: string;
  encounterId: string;
  observationId: string;
  chronicleId: string;
}

function buildFullZip(seed: FullSampleSeed): JSZip {
  const now = isoNow();
  const zip = new JSZip();

  const manifest = {
    schema: FULL_MANIFEST_SCHEMA,
    exportedAt: now,
    counts: {
      fields: 1,
      forms: 1,
      projects: 1,
      participants: 1,
      encounters: 1,
      observations: 1,
      chronicles: 1,
      media: 0,
    },
    mediaIndex: [],
  };

  zip.file("manifest.json", JSON.stringify(manifest));
  zip.file(
    "fields.json",
    JSON.stringify([
      {
        id: seed.fieldId,
        key: "nota",
        label: "Nota",
        type: "text",
        required: true,
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
        id: seed.formId,
        name: "Form 1",
        fields: [{ instanceId: seed.instanceId, fieldId: seed.fieldId }],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      },
    ]),
  );
  zip.file(
    "projects.json",
    JSON.stringify([
      {
        id: seed.projectId,
        institutionId: "00000000-0000-4000-8000-000000000001",
        name: "Proyecto exportado",
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
        id: seed.participantId,
        projectId: seed.projectId,
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
        id: seed.encounterId,
        projectId: seed.projectId,
        name: "Sesión exportada",
        startsAt: now,
        endsAt: now,
        participantIds: [seed.participantId],
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
        id: seed.observationId,
        encounterId: seed.encounterId,
        formId: seed.formId,
        formVersion: 1,
        fields: [{ instanceId: seed.instanceId, fieldId: seed.fieldId }],
        participantId: seed.participantId,
        values: { [seed.instanceId]: "Texto" },
        createdAt: now,
      },
    ]),
  );
  zip.file(
    "chronicles.json",
    JSON.stringify([
      {
        id: seed.chronicleId,
        encounterId: seed.encounterId,
        title: "Crónica de prueba",
        body: "Cuerpo",
        generatedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ]),
  );

  return zip;
}

async function fileFromZip(zip: JSZip, name: string): Promise<File> {
  const blob = await zip.generateAsync({ type: "blob" });
  return new File([blob], name, { type: "application/zip" });
}

describe("full importer + import service dispatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transactionMock.mockImplementation(async (...args: unknown[]) => {
      const fn = args[args.length - 1] as () => Promise<unknown>;
      return fn();
    });
  });

  it("parses a chronicle-full-v2 zip and imports every table", async () => {
    const seed: FullSampleSeed = {
      fieldId: crypto.randomUUID(),
      instanceId: crypto.randomUUID(),
      formId: crypto.randomUUID(),
      projectId: crypto.randomUUID(),
      participantId: crypto.randomUUID(),
      encounterId: crypto.randomUUID(),
      observationId: crypto.randomUUID(),
      chronicleId: crypto.randomUUID(),
    };
    const zip = buildFullZip(seed);
    const file = await fileFromZip(zip, "full.zip");

    const preview = await parseZipForImport(file);

    expect(preview.kind).toBe("full");
    if (preview.kind !== "full") return;

    expect(preview.preview.manifest.schema).toBe(FULL_MANIFEST_SCHEMA);
    expect(preview.preview.manifest.counts.projects).toBe(1);
    expect(preview.preview.data.projects).toHaveLength(1);

    await confirmImport(preview);

    expect(fieldsBulkPutMock).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: seed.fieldId })]),
    );
    expect(formsBulkPutMock).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: seed.formId })]),
    );
    expect(projectsBulkPutMock).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: seed.projectId })]),
    );
    expect(participantsBulkPutMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: seed.participantId, projectId: seed.projectId }),
      ]),
    );
    expect(encountersBulkPutMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: seed.encounterId,
          projectId: seed.projectId,
          participantIds: [seed.participantId],
        }),
      ]),
    );
    expect(observationsBulkPutMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: seed.observationId,
          formId: seed.formId,
          formVersion: 1,
          fields: [{ instanceId: seed.instanceId, fieldId: seed.fieldId }],
        }),
      ]),
    );
    expect(chroniclesBulkPutMock).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: seed.chronicleId })]),
    );
    expect(mediaBulkPutMock).toHaveBeenCalledWith([]);
  });

  it("rejects manifests using a legacy schema", async () => {
    const zip = new JSZip();
    zip.file(
      "manifest.json",
      JSON.stringify({ schema: "chronicle-full-v1", exportedAt: isoNow() }),
    );

    const file = await fileFromZip(zip, "legacy.zip");

    await expect(parseZipForImport(file)).rejects.toMatchObject({
      code: "IMPORT_SCHEMA_MISMATCH",
    });
  });

  it("rejects zip without manifest", async () => {
    const zip = new JSZip();
    zip.file("readme.txt", "no manifest");
    const file = await fileFromZip(zip, "empty.zip");

    await expect(parseZipForImport(file)).rejects.toMatchObject({
      code: "IMPORT_INVALID_ZIP",
    });
  });
});
