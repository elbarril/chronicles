import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEMO_ENCOUNTER_ID,
  DEMO_FIELD_AUDIO_ID,
  DEMO_FIELD_BOOLEAN_ID,
  DEMO_FIELD_DATE_ID,
  DEMO_FIELD_DATETIME_ID,
  DEMO_FIELD_FILE_ID,
  DEMO_FIELD_IDS,
  DEMO_FIELD_IMAGE_ID,
  DEMO_FIELD_LOCATION_ID,
  DEMO_FIELD_LONG_TEXT_ID,
  DEMO_FIELD_MULTI_CHOICE_ID,
  DEMO_FIELD_NUMBER_ID,
  DEMO_FIELD_RATING_ID,
  DEMO_FIELD_SEEDS,
  DEMO_FIELD_SINGLE_CHOICE_ID,
  DEMO_FIELD_TEXT_ID,
  DEMO_FIELD_TIME_ID,
  DEMO_FIELD_VIDEO_ID,
  DEMO_FORM_ID,
  DEMO_GROUP_ID,
  DEMO_PARTICIPANT_ONE_ID,
  DEMO_PARTICIPANT_TWO_ID,
} from "@/features/defaults/lib/seed-data";
import { seedDemoEncounter } from "@/features/defaults/services/defaults-service";

const {
  fieldsBulkGetMock,
  fieldsAddMock,
  fieldsUpdateMock,
  fieldsGetMock,
  formsGetMock,
  formsAddMock,
  formsUpdateMock,
  groupsGetMock,
  groupsPutMock,
  participantsGetMock,
  participantsPutMock,
  encountersGetMock,
  encountersPutMock,
  createObservationDefinitionMock,
  generateChronicleMock,
} = vi.hoisted(() => ({
  fieldsBulkGetMock: vi.fn(),
  fieldsAddMock: vi.fn(),
  fieldsUpdateMock: vi.fn(),
  fieldsGetMock: vi.fn(),
  formsGetMock: vi.fn(),
  formsAddMock: vi.fn(),
  formsUpdateMock: vi.fn(),
  groupsGetMock: vi.fn(),
  groupsPutMock: vi.fn(),
  participantsGetMock: vi.fn(),
  participantsPutMock: vi.fn(),
  encountersGetMock: vi.fn(),
  encountersPutMock: vi.fn(),
  createObservationDefinitionMock: vi.fn(),
  generateChronicleMock: vi.fn(),
}));

vi.mock("@/infra/db/client", () => {
  type TransactionFn = () => Promise<unknown>;

  return {
    db: {
      transaction: (_mode: string, ..._args: unknown[]) => {
        const fn = _args[_args.length - 1] as TransactionFn;
        return fn();
      },
      fields: {
        bulkGet: fieldsBulkGetMock,
        add: fieldsAddMock,
        update: fieldsUpdateMock,
        get: fieldsGetMock,
      },
      forms: {
        get: formsGetMock,
        add: formsAddMock,
        update: formsUpdateMock,
      },
      groups: {
        get: groupsGetMock,
        put: groupsPutMock,
      },
      participants: {
        get: participantsGetMock,
        put: participantsPutMock,
      },
      encounters: {
        get: encountersGetMock,
        put: encountersPutMock,
      },
    },
  };
});

vi.mock("@/features/observations/services/observation-service", () => ({
  createObservationDefinition: createObservationDefinitionMock,
}));

vi.mock("@/features/chronicles/services/chronicle-service", () => ({
  generateChronicle: generateChronicleMock,
}));

const isoDate = "2026-04-30T18:00:00.000Z";

function activeFieldRow(seedIndex: number) {
  const seed = DEMO_FIELD_SEEDS[seedIndex];

  if (!seed) {
    throw new Error(`Demo seed missing at index ${seedIndex}`);
  }

  return {
    ...seed,
    archivedAt: "",
    createdAt: isoDate,
    updatedAt: isoDate,
  };
}

function activeDemoForm() {
  return {
    id: DEMO_FORM_ID,
    name: "Formulario de prueba",
    fieldIds: [...DEMO_FIELD_IDS],
    version: 1,
    archivedAt: "",
    createdAt: isoDate,
    updatedAt: isoDate,
  };
}

describe("seedDemoEncounter (comprehensive demo)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // restoreDefaultForm() reads the basic defaults via bulkGet/get and
    // upserts them; we always present them as already active to keep the
    // test focused on the comprehensive demo.
    fieldsBulkGetMock.mockResolvedValue([
      {
        id: "00000000-0000-4000-8000-00000000d001",
        type: "audio",
        key: "audio_de_observacion",
        label: "Audio de observación",
        required: false,
        helpText: "",
        config: { multiple: false },
        archivedAt: "",
        createdAt: isoDate,
        updatedAt: isoDate,
      },
      {
        id: "00000000-0000-4000-8000-00000000d002",
        type: "longText",
        key: "texto_de_observacion",
        label: "Texto de observación",
        required: false,
        helpText: "",
        config: {},
        archivedAt: "",
        createdAt: isoDate,
        updatedAt: isoDate,
      },
    ]);

    // formsGetMock is queried for both the basic default form and the
    // demo form. The basic default form is always active; the demo form
    // is presented as already active to focus on the demo encounter path.
    formsGetMock.mockImplementation(async (id: string) => {
      if (id === DEMO_FORM_ID) {
        return activeDemoForm();
      }

      return {
        id: "00000000-0000-4000-8000-00000000d101",
        name: "Observación de encuentro",
        fieldIds: ["00000000-0000-4000-8000-00000000d001", "00000000-0000-4000-8000-00000000d002"],
        version: 1,
        archivedAt: "",
        createdAt: isoDate,
        updatedAt: isoDate,
      };
    });

    fieldsGetMock.mockImplementation(async (id: string) => {
      const seedIndex = DEMO_FIELD_SEEDS.findIndex((seed) => seed.id === id);

      if (seedIndex === -1) {
        return undefined;
      }

      return activeFieldRow(seedIndex);
    });
  });

  it("seeds the comprehensive demo, observation and chronicle when nothing exists", async () => {
    encountersGetMock.mockResolvedValueOnce(undefined);
    groupsGetMock.mockResolvedValue(undefined);
    participantsGetMock.mockResolvedValue(undefined);

    const outcome = await seedDemoEncounter();

    expect(outcome).toEqual({ encounterId: DEMO_ENCOUNTER_ID, created: true });

    expect(groupsPutMock).toHaveBeenCalledOnce();
    expect(groupsPutMock.mock.calls[0]?.[0].id).toBe(DEMO_GROUP_ID);

    expect(participantsPutMock).toHaveBeenCalledTimes(2);
    const participantIds = participantsPutMock.mock.calls.map((call) => call[0].id);
    expect(participantIds).toEqual([DEMO_PARTICIPANT_ONE_ID, DEMO_PARTICIPANT_TWO_ID]);

    expect(encountersPutMock).toHaveBeenCalledOnce();
    const encounterArg = encountersPutMock.mock.calls[0]?.[0];
    expect(encounterArg.id).toBe(DEMO_ENCOUNTER_ID);
    expect(encounterArg.formId).toBe(DEMO_FORM_ID);
    expect(encounterArg.fieldIds).toEqual(DEMO_FIELD_IDS);

    // Observation creation should be invoked once with values for every
    // demo field: scalars passed through as-is, media values as Blobs so
    // the observation service can normalise them into mediaIds.
    expect(createObservationDefinitionMock).toHaveBeenCalledOnce();
    const [fieldsArg, observationInput] = createObservationDefinitionMock.mock.calls[0] ?? [];
    expect(fieldsArg).toHaveLength(DEMO_FIELD_SEEDS.length);
    expect(observationInput.encounterId).toBe(DEMO_ENCOUNTER_ID);
    expect(observationInput.participantId).toBe(DEMO_PARTICIPANT_ONE_ID);

    const values = observationInput.values as Record<string, unknown>;
    expect(values[DEMO_FIELD_TEXT_ID]).toBe("Texto corto de ejemplo.");
    expect(typeof values[DEMO_FIELD_LONG_TEXT_ID]).toBe("string");
    expect(values[DEMO_FIELD_NUMBER_ID]).toBe(42);
    expect(values[DEMO_FIELD_BOOLEAN_ID]).toBe(true);
    expect(values[DEMO_FIELD_SINGLE_CHOICE_ID]).toBe("Opción A");
    expect(values[DEMO_FIELD_MULTI_CHOICE_ID]).toEqual(["Verde", "Azul"]);
    expect(values[DEMO_FIELD_DATE_ID]).toBe("2026-04-30");
    expect(values[DEMO_FIELD_TIME_ID]).toBe("10:30");
    expect(values[DEMO_FIELD_DATETIME_ID]).toBe("2026-04-30T10:30");
    expect(values[DEMO_FIELD_IMAGE_ID]).toBeInstanceOf(Blob);
    expect(values[DEMO_FIELD_VIDEO_ID]).toBeInstanceOf(Blob);
    expect(values[DEMO_FIELD_AUDIO_ID]).toBeInstanceOf(Blob);
    expect(values[DEMO_FIELD_FILE_ID]).toBeInstanceOf(Blob);
    expect(values[DEMO_FIELD_RATING_ID]).toBe(4);
    expect(values[DEMO_FIELD_LOCATION_ID]).toBe("Ciudad Autónoma de Buenos Aires");

    expect(generateChronicleMock).toHaveBeenCalledOnce();
    expect(generateChronicleMock).toHaveBeenCalledWith(DEMO_ENCOUNTER_ID);
  });

  it("is idempotent: existing encounter returns without writing observation or chronicle", async () => {
    encountersGetMock.mockResolvedValueOnce({
      id: DEMO_ENCOUNTER_ID,
      groupId: DEMO_GROUP_ID,
      formId: DEMO_FORM_ID,
      formVersion: 1,
      fieldIds: [...DEMO_FIELD_IDS],
      activity: "Actividad de prueba",
      startedAt: isoDate,
      endedAt: "",
      createdAt: isoDate,
      updatedAt: isoDate,
    });

    const outcome = await seedDemoEncounter();

    expect(outcome).toEqual({ encounterId: DEMO_ENCOUNTER_ID, created: false });
    expect(groupsPutMock).not.toHaveBeenCalled();
    expect(participantsPutMock).not.toHaveBeenCalled();
    expect(encountersPutMock).not.toHaveBeenCalled();
    expect(createObservationDefinitionMock).not.toHaveBeenCalled();
    expect(generateChronicleMock).not.toHaveBeenCalled();
  });

  it("preserves the original group createdAt when re-creating only the encounter", async () => {
    encountersGetMock.mockResolvedValueOnce(undefined);

    const originalCreatedAt = "2026-04-01T10:00:00.000Z";

    groupsGetMock.mockResolvedValueOnce({
      id: DEMO_GROUP_ID,
      institutionId: "00000000-0000-4000-8000-000000000001",
      name: "Grupo de prueba",
      createdAt: originalCreatedAt,
      updatedAt: originalCreatedAt,
      archivedAt: "",
    });

    participantsGetMock.mockResolvedValue(undefined);

    await seedDemoEncounter();

    expect(groupsPutMock.mock.calls[0]?.[0].createdAt).toBe(originalCreatedAt);
  });

  it("creates the demo form when it does not yet exist", async () => {
    encountersGetMock.mockResolvedValueOnce(undefined);
    groupsGetMock.mockResolvedValue(undefined);
    participantsGetMock.mockResolvedValue(undefined);

    // Track upserts so that post-upsert reads see the rows the seed
    // service just wrote, mimicking the real Dexie behaviour.
    const addedFieldsById = new Map<string, unknown>();
    fieldsAddMock.mockImplementation(async (row: { id: string }) => {
      addedFieldsById.set(row.id, row);
    });

    fieldsGetMock.mockImplementation(async (id: string) => {
      if (addedFieldsById.has(id)) {
        return addedFieldsById.get(id);
      }

      return undefined;
    });

    let demoFormPersisted: unknown;
    formsAddMock.mockImplementation(async (row: { id: string }) => {
      if (row.id === DEMO_FORM_ID) {
        demoFormPersisted = row;
      }
    });

    formsGetMock.mockImplementation(async (id: string) => {
      if (id === DEMO_FORM_ID) {
        return demoFormPersisted;
      }

      return {
        id: "00000000-0000-4000-8000-00000000d101",
        name: "Observación de encuentro",
        fieldIds: ["00000000-0000-4000-8000-00000000d001", "00000000-0000-4000-8000-00000000d002"],
        version: 1,
        archivedAt: "",
        createdAt: isoDate,
        updatedAt: isoDate,
      };
    });

    await seedDemoEncounter();

    const addedDemoFieldIds = fieldsAddMock.mock.calls
      .map((call) => call[0].id)
      .filter((id: string) => DEMO_FIELD_IDS.includes(id));

    expect(addedDemoFieldIds).toEqual([...DEMO_FIELD_IDS]);

    expect(formsAddMock).toHaveBeenCalled();
    const demoFormAdd = formsAddMock.mock.calls.find((call) => call[0]?.id === DEMO_FORM_ID);
    expect(demoFormAdd?.[0].fieldIds).toEqual(DEMO_FIELD_IDS);
  });
});
