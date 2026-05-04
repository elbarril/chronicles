import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_FORM_ID,
  DEMO_ENCOUNTER_ID,
  DEMO_ENCOUNTER_IDS,
  DEMO_ENCOUNTER_SEEDS,
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
  DEMO_FORM_INSTANCE_IDS,
  DEMO_PARTICIPANT_IDS,
  DEMO_PARTICIPANT_ONE_ID,
  DEMO_PARTICIPANT_SEEDS,
  DEMO_PARTICIPANT_TWO_ID,
  DEMO_PROJECT_ID,
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
  projectsGetMock,
  projectsPutMock,
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
  projectsGetMock: vi.fn(),
  projectsPutMock: vi.fn(),
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
      projects: {
        get: projectsGetMock,
        put: projectsPutMock,
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
    fields: DEMO_FIELD_IDS.map((fieldId, i) => ({
      instanceId: DEMO_FORM_INSTANCE_IDS[i] as string,
      fieldId,
    })),
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
        id: DEFAULT_FORM_ID,
        name: "Observación de encuentro",
        fields: [
          {
            instanceId: "00000000-0000-4000-8000-00000000e001",
            fieldId: "00000000-0000-4000-8000-00000000d001",
          },
          {
            instanceId: "00000000-0000-4000-8000-00000000e002",
            fieldId: "00000000-0000-4000-8000-00000000d002",
          },
        ],
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

  it("seeds the demo project, all eight encounters, two observations and chronicle when nothing exists", async () => {
    encountersGetMock.mockResolvedValueOnce(undefined);
    projectsGetMock.mockResolvedValue(undefined);
    participantsGetMock.mockResolvedValue(undefined);

    const outcome = await seedDemoEncounter();

    expect(outcome).toEqual({
      projectId: DEMO_PROJECT_ID,
      encounterId: DEMO_ENCOUNTER_ID,
      created: true,
    });

    expect(projectsPutMock).toHaveBeenCalledOnce();
    expect(projectsPutMock.mock.calls[0]?.[0].id).toBe(DEMO_PROJECT_ID);

    // All 13 demo participants are written.
    expect(participantsPutMock).toHaveBeenCalledTimes(DEMO_PARTICIPANT_SEEDS.length);
    const participantIds = participantsPutMock.mock.calls.map((call) => call[0].id);
    expect(participantIds).toEqual([...DEMO_PARTICIPANT_IDS]);

    // All 8 encounters are written, each with the same 13 attendees.
    expect(encountersPutMock).toHaveBeenCalledTimes(DEMO_ENCOUNTER_SEEDS.length);
    const encounterArgs = encountersPutMock.mock.calls.map((call) => call[0]);
    expect(encounterArgs.map((arg) => arg.id)).toEqual([...DEMO_ENCOUNTER_IDS]);

    for (const arg of encounterArgs) {
      expect(arg.projectId).toBe(DEMO_PROJECT_ID);
      expect(arg.participantIds).toEqual([...DEMO_PARTICIPANT_IDS]);
      expect(typeof arg.startsAt).toBe("string");
      expect(typeof arg.endsAt).toBe("string");
    }

    // Two observations are created on the FIRST encounter: one with the
    // demo form and one with the default form, to showcase that an
    // encounter can mix forms.
    expect(createObservationDefinitionMock).toHaveBeenCalledTimes(2);
    const [firstObs, secondObs] = createObservationDefinitionMock.mock.calls.map((call) => call[0]);
    expect(firstObs?.encounterId).toBe(DEMO_ENCOUNTER_ID);
    expect(firstObs?.formId).toBe(DEMO_FORM_ID);
    expect(firstObs?.participantId).toBe(DEMO_PARTICIPANT_ONE_ID);

    // Values are keyed by instanceId (DEMO_FORM_INSTANCE_IDS), not by fieldId.
    // DEMO_FORM_INSTANCE_IDS index order mirrors DEMO_FIELD_SEEDS:
    //   0→text, 1→longText, 2→number, 3→boolean, 4→singleChoice,
    //   5→multiChoice, 6→date, 7→time, 8→datetime, 9→image,
    //   10→video, 11→audio, 12→file, 13→rating, 14→location
    const values = firstObs?.values as Record<string, unknown>;
    const instanceOf = (fieldId: string) => {
      const idx = DEMO_FIELD_IDS.indexOf(fieldId);
      return DEMO_FORM_INSTANCE_IDS[idx] as string;
    };

    expect(values[instanceOf(DEMO_FIELD_TEXT_ID)]).toBe("Texto corto de ejemplo.");
    expect(typeof values[instanceOf(DEMO_FIELD_LONG_TEXT_ID)]).toBe("string");
    expect(values[instanceOf(DEMO_FIELD_NUMBER_ID)]).toBe(42);
    expect(values[instanceOf(DEMO_FIELD_BOOLEAN_ID)]).toBe(true);
    expect(values[instanceOf(DEMO_FIELD_SINGLE_CHOICE_ID)]).toBe("Opción A");
    expect(values[instanceOf(DEMO_FIELD_MULTI_CHOICE_ID)]).toEqual(["Verde", "Azul"]);
    expect(values[instanceOf(DEMO_FIELD_DATE_ID)]).toBe("2026-04-30");
    expect(values[instanceOf(DEMO_FIELD_TIME_ID)]).toBe("10:30");
    expect(values[instanceOf(DEMO_FIELD_DATETIME_ID)]).toBe("2026-04-30T10:30");
    expect(values[instanceOf(DEMO_FIELD_IMAGE_ID)]).toBeInstanceOf(Blob);
    expect(values[instanceOf(DEMO_FIELD_VIDEO_ID)]).toBeInstanceOf(Blob);
    expect(values[instanceOf(DEMO_FIELD_AUDIO_ID)]).toBeInstanceOf(Blob);
    expect(values[instanceOf(DEMO_FIELD_FILE_ID)]).toBeInstanceOf(Blob);
    expect(values[instanceOf(DEMO_FIELD_RATING_ID)]).toBe(4);
    expect(values[instanceOf(DEMO_FIELD_LOCATION_ID)]).toBe("Ciudad Autónoma de Buenos Aires");

    expect(secondObs?.formId).toBe(DEFAULT_FORM_ID);
    expect(secondObs?.participantId).toBe(DEMO_PARTICIPANT_TWO_ID);

    expect(generateChronicleMock).toHaveBeenCalledOnce();
    expect(generateChronicleMock).toHaveBeenCalledWith(DEMO_ENCOUNTER_ID);
  });

  it("is idempotent: existing primary encounter returns without writing observations or chronicle", async () => {
    encountersGetMock.mockResolvedValueOnce({
      id: DEMO_ENCOUNTER_ID,
      projectId: DEMO_PROJECT_ID,
      name: "Encuentro 1",
      startsAt: isoDate,
      endsAt: isoDate,
      participantIds: [...DEMO_PARTICIPANT_IDS],
      archivedAt: "",
      createdAt: isoDate,
      updatedAt: isoDate,
    });

    const outcome = await seedDemoEncounter();

    expect(outcome).toEqual({
      projectId: DEMO_PROJECT_ID,
      encounterId: DEMO_ENCOUNTER_ID,
      created: false,
    });
    expect(projectsPutMock).not.toHaveBeenCalled();
    expect(participantsPutMock).not.toHaveBeenCalled();
    expect(encountersPutMock).not.toHaveBeenCalled();
    expect(createObservationDefinitionMock).not.toHaveBeenCalled();
    expect(generateChronicleMock).not.toHaveBeenCalled();
  });

  it("preserves the original project createdAt when re-creating only the encounter", async () => {
    encountersGetMock.mockResolvedValueOnce(undefined);

    const originalCreatedAt = "2026-04-01T10:00:00.000Z";

    projectsGetMock.mockResolvedValueOnce({
      id: DEMO_PROJECT_ID,
      institutionId: "00000000-0000-4000-8000-000000000001",
      name: "Proyecto de prueba",
      createdAt: originalCreatedAt,
      updatedAt: originalCreatedAt,
      archivedAt: "",
    });

    participantsGetMock.mockResolvedValue(undefined);

    await seedDemoEncounter();

    expect(projectsPutMock.mock.calls[0]?.[0].createdAt).toBe(originalCreatedAt);
  });
});
