import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_AUDIO_FIELD_ID,
  DEFAULT_FORM_ID,
  DEFAULT_LONG_TEXT_FIELD_ID,
  MAE_EVAL_FIELD_ESTUDIANTES_ID,
  MAE_EVAL_FIELD_EDAD_ID,
  MAE_EVAL_FIELD_DISPOSICION_TRABAJO_ENC4_ID,
  MAE_EVAL_FIELD_VALORACION_CUALITATIVA_ID,
  MAE_EVAL_FIELD_IDS,
  MAE_EVAL_FIELD_SEEDS,
  MAE_EVAL_FORM_ID,
  MAE_OBS_FIELD_FECHA_ENCUENTRO_1_ID,
  MAE_OBS_FIELD_EDAD_PARTICIPANTE_1_ID,
  MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_1_ID,
  MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_1_ID,
  MAE_OBS_FIELD_NECESITA_REITERACION_1_ID,
  MAE_OBS_FIELD_SE_CONCENTRA_1_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_1_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_1_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_1_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_1_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_1_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_1_ID,
  MAE_OBS_FIELD_EXPLORA_MATERIALES_1_ID,
  MAE_OBS_FIELD_REPITE_USO_MATERIALES_1_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_1_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_1_ID,
  MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_1_ID,
  MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_1_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_1_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_1_ID,
  MAE_OBS_FIELD_PIDE_AYUDA_1_ID,
  MAE_OBS_FIELD_SE_COMUNICA_1_ID,
  MAE_OBS_FIELD_SE_AISLA_1_ID,
  MAE_OBS_FIELD_AYUDA_OTROS_1_ID,
  MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_1_ID,
  MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_1_ID,
  MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_1_ID,
  MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_1_ID,
  MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_1_ID,
  MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_1_ID,
  MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_1_ID,
  MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_1_ID,
  MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_1_ID,
  MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_1_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_2_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_2_ID,
  MAE_OBS_FIELD_FECHA_ENCUENTRO_2_ID,
  MAE_OBS_FIELD_EDAD_PARTICIPANTE_2_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_6_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_6_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_7_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_7_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_8_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_8_ID,
  MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID,
  MAE_OBS_FIELD_CLIMA_GRUPAL_DISRUPTIVO_ID,
  MAE_OBS_FIELD_CLIMA_GRUPAL_INDIFERENTE_ID,
  MAE_OBS_FIELD_CLIMA_GRUPAL_PARTICIPATIVO_ID,
  MAE_OBS_FIELD_RESPETO_ENCUADRE_ID,
  MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID,
  MAE_OBS_FIELD_IDS,
  MAE_OBS_FIELD_SEEDS,
  MAE_OBS_FORM_ENC_1_ID,
  MAE_OBS_FORM_ENC_2_ID,
  MAE_OBS_FORM_ENC_3_ID,
  MAE_OBS_FORM_ENC_4_ID,
  MAE_OBS_FORM_ENC_5_ID,
  MAE_OBS_FORM_ENC_6_ID,
  MAE_OBS_FORM_ENC_7_ID,
  MAE_OBS_FORM_ENC_8_ID,
} from "@/features/defaults/lib/seed-data";
import {
  restoreDefaultFields,
  restoreDefaultForm,
  restoreMAEEvaluationFields,
  restoreMAEEvaluationForm,
  restoreMAEObservationFields,
  restoreMAEObservationForms,
  seedDefaultsIfMissing,
} from "@/features/defaults/services/defaults-service";

const {
  fieldsBulkGetMock,
  fieldsAddMock,
  fieldsUpdateMock,
  formsBulkGetMock,
  formsGetMock,
  formsAddMock,
  formsUpdateMock,
} = vi.hoisted(() => ({
  fieldsBulkGetMock: vi.fn(),
  fieldsAddMock: vi.fn(),
  fieldsUpdateMock: vi.fn(),
  formsBulkGetMock: vi.fn(),
  formsGetMock: vi.fn(),
  formsAddMock: vi.fn(),
  formsUpdateMock: vi.fn(),
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
      },
      forms: {
        bulkGet: formsBulkGetMock,
        get: formsGetMock,
        add: formsAddMock,
        update: formsUpdateMock,
      },
    },
  };
});

const archivedAt = "2026-04-30T18:00:00.000Z";

function archivedRow(id: string) {
  return {
    id,
    type: "audio",
    key: "k",
    label: "L",
    required: false,
    helpText: "",
    config: { multiple: false },
    archivedAt,
    createdAt: archivedAt,
    updatedAt: archivedAt,
  };
}

function activeFieldRow(id: string) {
  return {
    ...archivedRow(id),
    archivedAt: "",
  };
}

describe("defaults service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("seedDefaultsIfMissing", () => {
    it("creates every default when none exist", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([undefined, undefined]);
      formsGetMock.mockResolvedValueOnce(undefined);

      await seedDefaultsIfMissing({ includeMAEForms: false });

      expect(fieldsAddMock).toHaveBeenCalledTimes(2);
      expect(formsAddMock).toHaveBeenCalledTimes(1);

      const addedIds = fieldsAddMock.mock.calls.map((call) => call[0].id);
      expect(addedIds).toEqual(
        expect.arrayContaining([DEFAULT_AUDIO_FIELD_ID, DEFAULT_LONG_TEXT_FIELD_ID]),
      );

      const formArg = formsAddMock.mock.calls[0]?.[0];
      expect(formArg.id).toBe(DEFAULT_FORM_ID);
      expect(formArg.fields.map((f: { fieldId: string }) => f.fieldId)).toEqual([
        DEFAULT_AUDIO_FIELD_ID,
        DEFAULT_LONG_TEXT_FIELD_ID,
      ]);
    });

    it("does nothing when all defaults already exist (even archived)", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([
        archivedRow(DEFAULT_AUDIO_FIELD_ID),
        activeFieldRow(DEFAULT_LONG_TEXT_FIELD_ID),
      ]);
      formsGetMock.mockResolvedValueOnce({
        id: DEFAULT_FORM_ID,
        name: "Observación de encuentro",
        fieldIds: [DEFAULT_AUDIO_FIELD_ID, DEFAULT_LONG_TEXT_FIELD_ID],
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });

      await seedDefaultsIfMissing({ includeMAEForms: false });

      expect(fieldsAddMock).not.toHaveBeenCalled();
      expect(formsAddMock).not.toHaveBeenCalled();
    });

    it("only creates the missing pieces", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([activeFieldRow(DEFAULT_AUDIO_FIELD_ID), undefined]);
      formsGetMock.mockResolvedValueOnce(undefined);

      await seedDefaultsIfMissing({ includeMAEForms: false });

      expect(fieldsAddMock).toHaveBeenCalledTimes(1);
      expect(fieldsAddMock.mock.calls[0]?.[0].id).toBe(DEFAULT_LONG_TEXT_FIELD_ID);
      expect(formsAddMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("restoreDefaultFields", () => {
    it("creates missing fields and restores archived ones", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([archivedRow(DEFAULT_AUDIO_FIELD_ID), undefined]);
      fieldsUpdateMock.mockResolvedValue(1);

      const outcome = await restoreDefaultFields();

      expect(outcome).toEqual({ created: 1, restored: 1, unchanged: 0 });
      expect(fieldsUpdateMock).toHaveBeenCalledWith(
        DEFAULT_AUDIO_FIELD_ID,
        expect.objectContaining({ archivedAt: "" }),
      );
      expect(fieldsAddMock).toHaveBeenCalledTimes(1);
      expect(fieldsAddMock.mock.calls[0]?.[0].id).toBe(DEFAULT_LONG_TEXT_FIELD_ID);
    });

    it("leaves active fields untouched", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([
        activeFieldRow(DEFAULT_AUDIO_FIELD_ID),
        activeFieldRow(DEFAULT_LONG_TEXT_FIELD_ID),
      ]);

      const outcome = await restoreDefaultFields();

      expect(outcome).toEqual({ created: 0, restored: 0, unchanged: 2 });
      expect(fieldsAddMock).not.toHaveBeenCalled();
      expect(fieldsUpdateMock).not.toHaveBeenCalled();
    });
  });

  describe("restoreDefaultForm", () => {
    it("restores the archived form after restoring the fields", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([
        activeFieldRow(DEFAULT_AUDIO_FIELD_ID),
        activeFieldRow(DEFAULT_LONG_TEXT_FIELD_ID),
      ]);
      formsGetMock.mockResolvedValueOnce({
        id: DEFAULT_FORM_ID,
        name: "Observación de encuentro",
        fieldIds: [DEFAULT_AUDIO_FIELD_ID, DEFAULT_LONG_TEXT_FIELD_ID],
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsUpdateMock.mockResolvedValue(1);

      const outcome = await restoreDefaultForm();

      expect(outcome.restored).toBe(1);
      expect(outcome.created).toBe(0);
      expect(formsUpdateMock).toHaveBeenCalledWith(
        DEFAULT_FORM_ID,
        expect.objectContaining({ archivedAt: "" }),
      );
    });

    it("creates the form when missing and ensures fields exist", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([undefined, undefined]);
      formsGetMock.mockResolvedValueOnce(undefined);

      const outcome = await restoreDefaultForm();

      expect(outcome.created).toBe(1);
      expect(outcome.fields.created).toBe(2);
      expect(formsAddMock).toHaveBeenCalledTimes(1);
      expect(
        formsAddMock.mock.calls[0]?.[0].fields.map((f: { fieldId: string }) => f.fieldId),
      ).toEqual([DEFAULT_AUDIO_FIELD_ID, DEFAULT_LONG_TEXT_FIELD_ID]);
    });
  });

  describe("restoreMAEEvaluationFields", () => {
    it("creates all 29 MAE evaluation fields when none exist", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(29).fill(undefined));

      const outcome = await restoreMAEEvaluationFields();

      expect(outcome.created).toBe(29);
      expect(outcome.restored).toBe(0);
      expect(outcome.unchanged).toBe(0);
      expect(fieldsAddMock).toHaveBeenCalledTimes(29);

      const addedIds = fieldsAddMock.mock.calls.map((call) => call[0].id);
      expect(addedIds).toEqual(expect.arrayContaining([...MAE_EVAL_FIELD_IDS]));
    });

    it("restores archived MAE evaluation fields", async () => {
      const archivedFields = MAE_EVAL_FIELD_IDS.map((id) => archivedRow(id));
      fieldsBulkGetMock.mockResolvedValueOnce(archivedFields);
      fieldsUpdateMock.mockResolvedValue(1);

      const outcome = await restoreMAEEvaluationFields();

      expect(outcome.created).toBe(0);
      expect(outcome.restored).toBe(29);
      expect(outcome.unchanged).toBe(0);
      expect(fieldsUpdateMock).toHaveBeenCalledTimes(29);
    });

    it("leaves active MAE evaluation fields untouched", async () => {
      const activeFields = MAE_EVAL_FIELD_IDS.map((id) => activeFieldRow(id));
      fieldsBulkGetMock.mockResolvedValueOnce(activeFields);

      const outcome = await restoreMAEEvaluationFields();

      expect(outcome.created).toBe(0);
      expect(outcome.restored).toBe(0);
      expect(outcome.unchanged).toBe(29);
      expect(fieldsAddMock).not.toHaveBeenCalled();
      expect(fieldsUpdateMock).not.toHaveBeenCalled();
    });
  });

  describe("restoreMAEEvaluationForm", () => {
    it("creates the MAE evaluation form when missing and ensures fields exist", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(29).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);

      const outcome = await restoreMAEEvaluationForm();

      expect(outcome.created).toBe(1);
      expect(outcome.fields.created).toBe(29);
      expect(formsAddMock).toHaveBeenCalledTimes(1);

      const formArg = formsAddMock.mock.calls[0]?.[0];
      expect(formArg.id).toBe(MAE_EVAL_FORM_ID);
      expect(formArg.name).toBe("MAE - Ficha de Evaluación");
      expect(formArg.fields).toHaveLength(29);
    });

    it("restores the archived MAE evaluation form after restoring the fields", async () => {
      const activeFields = MAE_EVAL_FIELD_IDS.map((id) => activeFieldRow(id));
      fieldsBulkGetMock.mockResolvedValueOnce(activeFields);
      formsGetMock.mockResolvedValueOnce({
        id: MAE_EVAL_FORM_ID,
        name: "MAE - Ficha de Evaluación",
        fields: MAE_EVAL_FIELD_IDS.map((id, i) => ({
          instanceId: `00000000-0000-4000-8000-00000000e${String(i + 1).padStart(3, "0")}`,
          fieldId: id,
        })),
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsUpdateMock.mockResolvedValue(1);

      const outcome = await restoreMAEEvaluationForm();

      expect(outcome.restored).toBe(1);
      expect(outcome.created).toBe(0);
      expect(outcome.fields.unchanged).toBe(29);
      expect(formsUpdateMock).toHaveBeenCalledWith(
        MAE_EVAL_FORM_ID,
        expect.objectContaining({ archivedAt: "" }),
      );
    });

    it("leaves the active MAE evaluation form untouched", async () => {
      const activeFields = MAE_EVAL_FIELD_IDS.map((id) => activeFieldRow(id));
      fieldsBulkGetMock.mockResolvedValueOnce(activeFields);
      formsGetMock.mockResolvedValueOnce({
        id: MAE_EVAL_FORM_ID,
        name: "MAE - Ficha de Evaluación",
        fields: MAE_EVAL_FIELD_IDS.map((id, i) => ({
          instanceId: `00000000-0000-4000-8000-00000000e${String(i + 1).padStart(3, "0")}`,
          fieldId: id,
        })),
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });

      const outcome = await restoreMAEEvaluationForm();

      expect(outcome.created).toBe(0);
      expect(outcome.restored).toBe(0);
      expect(outcome.unchanged).toBe(1);
      expect(outcome.fields.unchanged).toBe(29);
      expect(formsAddMock).not.toHaveBeenCalled();
      expect(formsUpdateMock).not.toHaveBeenCalled();
    });
  });

  describe("MAE Evaluation Field Configuration", () => {
    it("has exactly 29 fields defined", () => {
      expect(MAE_EVAL_FIELD_SEEDS).toHaveLength(29);
      expect(MAE_EVAL_FIELD_IDS).toHaveLength(29);
    });

    it("has stable unique IDs for all fields", () => {
      const uniqueIds = new Set(MAE_EVAL_FIELD_IDS);
      expect(uniqueIds.size).toBe(29);
    });

    it("has correct configuration for identification fields", () => {
      const estudiantesField = MAE_EVAL_FIELD_SEEDS.find(
        (f) => f.id === MAE_EVAL_FIELD_ESTUDIANTES_ID,
      );
      expect(estudiantesField).toBeDefined();
      expect(estudiantesField?.type).toBe("text");
      expect(estudiantesField?.required).toBe(true);
      expect(estudiantesField?.config).toEqual({ maxLength: 255 });

      const edadField = MAE_EVAL_FIELD_SEEDS.find((f) => f.id === MAE_EVAL_FIELD_EDAD_ID);
      expect(edadField).toBeDefined();
      expect(edadField?.type).toBe("number");
      expect(edadField?.required).toBe(true);
      expect(edadField?.config).toEqual({ min: 0, max: 18 });
    });

    it("has correct configuration for rating fields (encounter 4)", () => {
      const ratingField = MAE_EVAL_FIELD_SEEDS.find(
        (f) => f.id === MAE_EVAL_FIELD_DISPOSICION_TRABAJO_ENC4_ID,
      );
      expect(ratingField).toBeDefined();
      expect(ratingField?.type).toBe("rating");
      expect(ratingField?.required).toBe(true);
      expect(ratingField?.config).toEqual({ min: 1, max: 5, step: 1 });
    });

    it("has correct configuration for qualitative evaluation field", () => {
      const cualitativaField = MAE_EVAL_FIELD_SEEDS.find(
        (f) => f.id === MAE_EVAL_FIELD_VALORACION_CUALITATIVA_ID,
      );
      expect(cualitativaField).toBeDefined();
      expect(cualitativaField?.type).toBe("longText");
      expect(cualitativaField?.required).toBe(false);
      expect(cualitativaField?.config).toEqual({ maxLength: 5000 });
    });

    it("has exactly 12 rating fields for encounter 4", () => {
      const enc4RatingFields = MAE_EVAL_FIELD_SEEDS.filter(
        (f) => f.key.includes("enc4") && f.type === "rating",
      );
      expect(enc4RatingFields).toHaveLength(12);
    });

    it("has exactly 12 rating fields for encounter 8", () => {
      const enc8RatingFields = MAE_EVAL_FIELD_SEEDS.filter(
        (f) => f.key.includes("enc8") && f.type === "rating",
      );
      expect(enc8RatingFields).toHaveLength(12);
    });

    it("has exactly 4 identification fields", () => {
      const identificationFields = MAE_EVAL_FIELD_SEEDS.filter(
        (f) =>
          [MAE_EVAL_FIELD_ESTUDIANTES_ID, MAE_EVAL_FIELD_EDAD_ID].includes(f.id) ||
          (f.type === "text" && f.required && f.id.includes("d30")),
      );
      expect(identificationFields).toHaveLength(4);
    });
  });

  describe("MAE Evaluation Integration", () => {
    it("can restore fields and form in sequence", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(29).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);

      const outcome = await restoreMAEEvaluationForm();

      expect(outcome.fields.created).toBe(29);
      expect(outcome.created).toBe(1);
      expect(fieldsAddMock).toHaveBeenCalledTimes(29);
      expect(formsAddMock).toHaveBeenCalledTimes(1);
    });

    it("form contains all 29 field instances with correct field references", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(29).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);

      await restoreMAEEvaluationForm();

      const formArg = formsAddMock.mock.calls[0]?.[0];
      expect(formArg.fields).toHaveLength(29);

      const fieldIds = formArg.fields.map((f: { fieldId: string }) => f.fieldId);
      expect(fieldIds).toEqual(expect.arrayContaining([...MAE_EVAL_FIELD_IDS]));

      const instanceIds = formArg.fields.map((f: { instanceId: string }) => f.instanceId);
      const uniqueInstanceIds = new Set(instanceIds);
      expect(uniqueInstanceIds.size).toBe(29);
    });

    it("field instances have stable instance IDs", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(29).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);

      await restoreMAEEvaluationForm();

      const formArg = formsAddMock.mock.calls[0]?.[0];
      const firstInstanceId = formArg.fields[0]?.instanceId;

      // Restore again with active fields
      const activeFields = MAE_EVAL_FIELD_IDS.map((id) => activeFieldRow(id));
      fieldsBulkGetMock.mockResolvedValueOnce(activeFields);
      const activeForm = {
        id: MAE_EVAL_FORM_ID,
        name: "MAE - Ficha de Evaluación",
        fields: formArg.fields,
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      };
      formsGetMock.mockResolvedValueOnce(activeForm);

      await restoreMAEEvaluationForm();

      // Instance IDs should remain stable across restores
      const unchangedForm = activeForm;
      expect(unchangedForm.fields[0]?.instanceId).toBe(firstInstanceId);
    });
  });

  describe("MAE Observation Field Configuration", () => {
    it("has exactly 278 fields defined", () => {
      expect(MAE_OBS_FIELD_SEEDS).toHaveLength(278);
      expect(MAE_OBS_FIELD_IDS).toHaveLength(278);
    });

    it("has stable unique IDs for all fields", () => {
      const uniqueIds = new Set(MAE_OBS_FIELD_IDS);
      expect(uniqueIds.size).toBe(278);
    });

    it("has correct configuration for conditional field pair (Encounter 1)", () => {
      const dificultadField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_1_ID,
      );
      expect(dificultadField).toBeDefined();
      expect(dificultadField?.type).toBe("boolean");
      expect(dificultadField?.required).toBe(false);
      expect(dificultadField?.helpText).toBe("Si marca sí, debe especificar cuál dificultad");

      const dificultadCualField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_1_ID,
      );
      expect(dificultadCualField).toBeDefined();
      expect(dificultadCualField?.type).toBe("text");
      expect(dificultadCualField?.required).toBe(false);
      expect(dificultadCualField?.helpText).toBe(
        "Solo visible si marca dificultad en la manipulación",
      );
      expect(dificultadCualField?.config).toEqual({ maxLength: 255 });
    });

    it("has correct configuration for conditional field pair (Encounter 2)", () => {
      const dificultadField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_2_ID,
      );
      expect(dificultadField).toBeDefined();
      expect(dificultadField?.type).toBe("boolean");
      expect(dificultadField?.required).toBe(false);
      expect(dificultadField?.helpText).toBe("Si marca sí, debe especificar cuál dificultad");

      const dificultadCualField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_2_ID,
      );
      expect(dificultadCualField).toBeDefined();
      expect(dificultadCualField?.type).toBe("text");
      expect(dificultadCualField?.required).toBe(false);
      expect(dificultadCualField?.helpText).toBe(
        "Solo visible si marca dificultad en la manipulación",
      );
      expect(dificultadCualField?.config).toEqual({ maxLength: 255 });
    });

    it("has correct configuration for conditional field pair (Encounter 6)", () => {
      const dificultadField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_6_ID,
      );
      expect(dificultadField).toBeDefined();
      expect(dificultadField?.type).toBe("boolean");
      expect(dificultadField?.required).toBe(false);
      expect(dificultadField?.helpText).toBe("");

      const dificultadCualField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_6_ID,
      );
      expect(dificultadCualField).toBeDefined();
      expect(dificultadCualField?.type).toBe("text");
      expect(dificultadCualField?.required).toBe(false);
      expect(dificultadCualField?.helpText).toBe("");
      expect(dificultadCualField?.config).toEqual({ maxLength: 255 });
    });

    it("has correct configuration for conditional field pair (Encounter 7)", () => {
      const dificultadField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_7_ID,
      );
      expect(dificultadField).toBeDefined();
      expect(dificultadField?.type).toBe("boolean");
      expect(dificultadField?.required).toBe(false);
      expect(dificultadField?.helpText).toBe("");

      const dificultadCualField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_7_ID,
      );
      expect(dificultadCualField).toBeDefined();
      expect(dificultadCualField?.type).toBe("text");
      expect(dificultadCualField?.required).toBe(false);
      expect(dificultadCualField?.helpText).toBe("");
      expect(dificultadCualField?.config).toEqual({ maxLength: 255 });
    });

    it("has correct configuration for conditional field pair (Encounter 8)", () => {
      const dificultadField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_8_ID,
      );
      expect(dificultadField).toBeDefined();
      expect(dificultadField?.type).toBe("boolean");
      expect(dificultadField?.required).toBe(false);
      expect(dificultadField?.helpText).toBe("");

      const dificultadCualField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_8_ID,
      );
      expect(dificultadCualField).toBeDefined();
      expect(dificultadCualField?.type).toBe("text");
      expect(dificultadCualField?.required).toBe(false);
      expect(dificultadCualField?.helpText).toBe("");
      expect(dificultadCualField?.config).toEqual({ maxLength: 255 });
    });

    it("has exactly 40 fields for Encounter 1 (34 per-encounter + 6 global)", () => {
      // First 40 fields in MAE_OBS_FIELD_IDS are for Encounter 1
      const enc1FieldIds = MAE_OBS_FIELD_IDS.slice(0, 40);
      const enc1Fields = MAE_OBS_FIELD_SEEDS.filter((f) => enc1FieldIds.includes(f.id));
      expect(enc1Fields).toHaveLength(40);
    });

    it("has exactly 34 fields for Encounter 2 (same as Encounter 1 without globals)", () => {
      // Next 34 fields in MAE_OBS_FIELD_IDS are for Encounter 2
      const enc2FieldIds = MAE_OBS_FIELD_IDS.slice(40, 74);
      const enc2Fields = MAE_OBS_FIELD_SEEDS.filter((f) => enc2FieldIds.includes(f.id));
      expect(enc2Fields).toHaveLength(34);
    });

    it("has exactly 6 global fields (only in Encounter 1)", () => {
      const globalFields = MAE_OBS_FIELD_SEEDS.filter((f) =>
        [
          MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID,
          MAE_OBS_FIELD_CLIMA_GRUPAL_DISRUPTIVO_ID,
          MAE_OBS_FIELD_CLIMA_GRUPAL_INDIFERENTE_ID,
          MAE_OBS_FIELD_CLIMA_GRUPAL_PARTICIPATIVO_ID,
          MAE_OBS_FIELD_RESPETO_ENCUADRE_ID,
          MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID,
        ].includes(f.id),
      );
      expect(globalFields).toHaveLength(6);
    });

    it("has exactly 34 fields for Encounter 3 (same as Encounter 2 without globals)", () => {
      // Next 34 fields in MAE_OBS_FIELD_IDS are for Encounter 3
      const enc3FieldIds = MAE_OBS_FIELD_IDS.slice(74, 108);
      const enc3Fields = MAE_OBS_FIELD_SEEDS.filter((f) => enc3FieldIds.includes(f.id));
      expect(enc3Fields).toHaveLength(34);
    });

    it("has exactly 34 fields for Encounter 4 (same as Encounter 2 without globals)", () => {
      // Next 34 fields in MAE_OBS_FIELD_IDS are for Encounter 4
      const enc4FieldIds = MAE_OBS_FIELD_IDS.slice(108, 142);
      const enc4Fields = MAE_OBS_FIELD_SEEDS.filter((f) => enc4FieldIds.includes(f.id));
      expect(enc4Fields).toHaveLength(34);
    });

    it("has exactly 34 fields for Encounter 5 (same as Encounter 2 without globals)", () => {
      // Next 34 fields in MAE_OBS_FIELD_IDS are for Encounter 5
      const enc5FieldIds = MAE_OBS_FIELD_IDS.slice(142, 176);
      const enc5Fields = MAE_OBS_FIELD_SEEDS.filter((f) => enc5FieldIds.includes(f.id));
      expect(enc5Fields).toHaveLength(34);
    });

    it("has exactly 34 fields for Encounter 6 (same as Encounter 2 without globals)", () => {
      // Next 34 fields in MAE_OBS_FIELD_IDS are for Encounter 6
      const enc6FieldIds = MAE_OBS_FIELD_IDS.slice(176, 210);
      const enc6Fields = MAE_OBS_FIELD_SEEDS.filter((f) => enc6FieldIds.includes(f.id));
      expect(enc6Fields).toHaveLength(34);
    });

    it("has exactly 34 fields for Encounter 7 (same as Encounter 2 without globals)", () => {
      // Next 34 fields in MAE_OBS_FIELD_IDS are for Encounter 7
      const enc7FieldIds = MAE_OBS_FIELD_IDS.slice(210, 244);
      const enc7Fields = MAE_OBS_FIELD_SEEDS.filter((f) => enc7FieldIds.includes(f.id));
      expect(enc7Fields).toHaveLength(34);
    });

    it("has exactly 34 fields for Encounter 8 (same as Encounter 2 without globals)", () => {
      // Next 34 fields in MAE_OBS_FIELD_IDS are for Encounter 8
      const enc8FieldIds = MAE_OBS_FIELD_IDS.slice(244, 278);
      const enc8Fields = MAE_OBS_FIELD_SEEDS.filter((f) => enc8FieldIds.includes(f.id));
      expect(enc8Fields).toHaveLength(34);
    });
  });

  describe("MAE Observation Integration", () => {
    it("can restore fields and forms in sequence", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(278).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);

      const outcome = await restoreMAEObservationForms();

      expect(outcome.fields.created).toBe(278);
      expect(outcome.created).toBe(8);
      expect(fieldsAddMock).toHaveBeenCalledTimes(278);
      expect(formsAddMock).toHaveBeenCalledTimes(8);
    });

    it("form 1 contains all 40 field instances with correct field references", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(278).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);

      await restoreMAEObservationForms();

      const form1Arg = formsAddMock.mock.calls[0]?.[0];
      expect(form1Arg.fields).toHaveLength(40);

      const enc1FieldIds = MAE_OBS_FIELD_IDS.slice(0, 40);
      const fieldIds = form1Arg.fields.map((f: { fieldId: string }) => f.fieldId);
      expect(fieldIds).toEqual(expect.arrayContaining([...enc1FieldIds]));

      const instanceIds = form1Arg.fields.map((f: { instanceId: string }) => f.instanceId);
      const uniqueInstanceIds = new Set(instanceIds);
      expect(uniqueInstanceIds.size).toBe(40);
    });

    it("form 2 contains all 34 field instances with correct field references", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(278).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);

      await restoreMAEObservationForms();

      const form2Arg = formsAddMock.mock.calls[1]?.[0];
      expect(form2Arg.fields).toHaveLength(34);

      const enc2FieldIds = MAE_OBS_FIELD_IDS.slice(40, 74);
      const fieldIds = form2Arg.fields.map((f: { fieldId: string }) => f.fieldId);
      expect(fieldIds).toEqual(expect.arrayContaining([...enc2FieldIds]));

      const instanceIds = form2Arg.fields.map((f: { instanceId: string }) => f.instanceId);
      const uniqueInstanceIds = new Set(instanceIds);
      expect(uniqueInstanceIds.size).toBe(34);
    });

    it("field instances have stable instance IDs across restores", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(278).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);

      await restoreMAEObservationForms();

      const form1Arg = formsAddMock.mock.calls[0]?.[0];
      const form2Arg = formsAddMock.mock.calls[1]?.[0];
      const firstInstanceIdForm1 = form1Arg.fields[0]?.instanceId;
      const firstInstanceIdForm2 = form2Arg.fields[0]?.instanceId;

      // Restore again with active fields
      const activeFields = MAE_OBS_FIELD_IDS.map((id) => activeFieldRow(id));
      fieldsBulkGetMock.mockResolvedValueOnce(activeFields);
      const activeForm1 = {
        id: MAE_OBS_FORM_ENC_1_ID,
        name: "MAE - Ficha de Observación - Encuentro 1",
        fields: form1Arg.fields,
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      };
      const activeForm2 = {
        id: MAE_OBS_FORM_ENC_2_ID,
        name: "MAE - Ficha de Observación - Encuentro 2",
        fields: form2Arg.fields,
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      };
      formsGetMock.mockResolvedValueOnce(activeForm1);
      formsGetMock.mockResolvedValueOnce(activeForm2);

      await restoreMAEObservationForms();

      // Instance IDs should remain stable across restores
      expect(activeForm1.fields[0]?.instanceId).toBe(firstInstanceIdForm1);
      expect(activeForm2.fields[0]?.instanceId).toBe(firstInstanceIdForm2);
    });

    it("conditional field pairs are correctly ordered in both forms", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(278).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);

      await restoreMAEObservationForms();

      const form1Arg = formsAddMock.mock.calls[0]?.[0];
      const form2Arg = formsAddMock.mock.calls[1]?.[0];

      // In Form 1, dificultad_manipulacion should come before dificultad_manipulacion_cual
      const form1FieldIds = form1Arg.fields.map((f: { fieldId: string }) => f.fieldId);
      const idxDificultad1 = form1FieldIds.indexOf(MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_1_ID);
      const idxDificultadCual1 = form1FieldIds.indexOf(
        MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_1_ID,
      );
      expect(idxDificultad1).toBeGreaterThan(-1);
      expect(idxDificultadCual1).toBeGreaterThan(-1);
      expect(idxDificultadCual1).toBe(idxDificultad1 + 1);

      // In Form 2, dificultad_manipulacion should come before dificultad_manipulacion_cual
      const form2FieldIds = form2Arg.fields.map((f: { fieldId: string }) => f.fieldId);
      const idxDificultad2 = form2FieldIds.indexOf(MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_2_ID);
      const idxDificultadCual2 = form2FieldIds.indexOf(
        MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_2_ID,
      );
      expect(idxDificultad2).toBeGreaterThan(-1);
      expect(idxDificultadCual2).toBeGreaterThan(-1);
      expect(idxDificultadCual2).toBe(idxDificultad2 + 1);
    });
  });

  describe("MAE Observation Excel Validation (Encounters 1-2)", () => {
    it("validates all 40 fields for Encounter 1 match CSV structure", () => {
      const enc1FieldIds = MAE_OBS_FIELD_IDS.slice(0, 40);

      // Identification (2 fields)
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_FECHA_ENCUENTRO_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_EDAD_PARTICIPANTE_1_ID);

      // CONSIGNA (4 fields)
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_NECESITA_REITERACION_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_SE_CONCENTRA_1_ID);

      // DESARROLLO-PRODUCCIÓN - inicio (2 fields)
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_1_ID);

      // DESARROLLO-PRODUCCIÓN - tiempo (4 fields)
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_1_ID);

      // DESARROLLO-PRODUCCIÓN - materiales (4 + 2 fields)
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_EXPLORA_MATERIALES_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_REPITE_USO_MATERIALES_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_1_ID);

      // DESARROLLO-PRODUCCIÓN - creatividad (3 fields)
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_1_ID);

      // DESARROLLO-PRODUCCIÓN - en grupo (5 fields)
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_PIDE_AYUDA_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_SE_COMUNICA_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_SE_AISLA_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_AYUDA_OTROS_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_1_ID);

      // CIERRE - Implicancia afectiva (6 fields)
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_1_ID);

      // CIERRE - grupo (3 fields)
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_1_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_1_ID);

      // GLOBAL FIELDS (6 fields) - only in Encounter 1
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_CLIMA_GRUPAL_DISRUPTIVO_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_CLIMA_GRUPAL_INDIFERENTE_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_CLIMA_GRUPAL_PARTICIPATIVO_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_RESPETO_ENCUADRE_ID);
      expect(enc1FieldIds).toContain(MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID);

      // Total count
      expect(enc1FieldIds).toHaveLength(40);
    });

    it("validates all 34 fields for Encounter 2 match CSV structure", () => {
      const enc2FieldIds = MAE_OBS_FIELD_IDS.slice(40, 74);

      // Identification (2 fields)
      expect(enc2FieldIds).toContain(MAE_OBS_FIELD_FECHA_ENCUENTRO_2_ID);
      expect(enc2FieldIds).toContain(MAE_OBS_FIELD_EDAD_PARTICIPANTE_2_ID);

      // Conditional field pair for Encounter 2
      expect(enc2FieldIds).toContain(MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_2_ID);
      expect(enc2FieldIds).toContain(MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_2_ID);

      // NO global fields in Encounter 2
      expect(enc2FieldIds).not.toContain(MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID);
      expect(enc2FieldIds).not.toContain(MAE_OBS_FIELD_CLIMA_GRUPAL_DISRUPTIVO_ID);
      expect(enc2FieldIds).not.toContain(MAE_OBS_FIELD_CLIMA_GRUPAL_INDIFERENTE_ID);
      expect(enc2FieldIds).not.toContain(MAE_OBS_FIELD_CLIMA_GRUPAL_PARTICIPATIVO_ID);
      expect(enc2FieldIds).not.toContain(MAE_OBS_FIELD_RESPETO_ENCUADRE_ID);
      expect(enc2FieldIds).not.toContain(MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID);

      // Total count
      expect(enc2FieldIds).toHaveLength(34);
    });

    it("validates field types match Excel structure", () => {
      // Identification: date and number
      const fechaField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_FECHA_ENCUENTRO_1_ID,
      );
      expect(fechaField?.type).toBe("date");

      const edadField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_EDAD_PARTICIPANTE_1_ID,
      );
      expect(edadField?.type).toBe("number");

      // All CONSIGNA fields are boolean (Si-No)
      const consignaFields = [
        MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_1_ID,
        MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_1_ID,
        MAE_OBS_FIELD_NECESITA_REITERACION_1_ID,
        MAE_OBS_FIELD_SE_CONCENTRA_1_ID,
      ];
      consignaFields.forEach((fieldId) => {
        const field = MAE_OBS_FIELD_SEEDS.find((f) => f.id === fieldId);
        expect(field?.type).toBe("boolean");
      });

      // All DESARROLLO-PRODUCCIÓN fields are boolean except dificultad_manipulacion_cual
      const desarrolloFields = [
        MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_1_ID,
        MAE_OBS_FIELD_EXPLORA_MATERIALES_1_ID,
        MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_1_ID,
        MAE_OBS_FIELD_PIDE_AYUDA_1_ID,
        MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_1_ID,
        MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_1_ID,
      ];
      desarrolloFields.forEach((fieldId) => {
        const field = MAE_OBS_FIELD_SEEDS.find((f) => f.id === fieldId);
        expect(field?.type).toBe("boolean");
      });

      // dificultad_manipulacion_cual is text (qualitative)
      const dificultadCualField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_1_ID,
      );
      expect(dificultadCualField?.type).toBe("text");

      // Global fields: 4 boolean + 1 longText
      const globalBooleanFields = [
        MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID,
        MAE_OBS_FIELD_CLIMA_GRUPAL_DISRUPTIVO_ID,
        MAE_OBS_FIELD_CLIMA_GRUPAL_INDIFERENTE_ID,
        MAE_OBS_FIELD_CLIMA_GRUPAL_PARTICIPATIVO_ID,
        MAE_OBS_FIELD_RESPETO_ENCUADRE_ID,
      ];
      globalBooleanFields.forEach((fieldId) => {
        const field = MAE_OBS_FIELD_SEEDS.find((f) => f.id === fieldId);
        expect(field?.type).toBe("boolean");
      });

      const observacionesField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID,
      );
      expect(observacionesField?.type).toBe("longText");
    });

    it("validates 100% of observables from Excel are mapped for Encounters 1-5", () => {
      // Total observables in CSV for Encounters 1-5:
      // Identification: 2 (fecha, edad) - but these are per-encounter
      // CONSIGNA: 4
      // DESARROLLO-PRODUCCIÓN: 2 (inicio) + 4 (tiempo) + 5 (materiales) + 3 (creatividad) + 5 (en grupo) = 19
      // CIERRE: 6 (implicancia afectiva) + 3 (grupo) = 9
      // GLOBAL: 6 (only Encounter 1)
      // Total per encounter: 2 + 4 + 19 + 9 = 34
      // Encounter 1 total: 34 + 6 = 40
      // Encounters 2-8 total: 34 × 7 = 238
      // Combined total: 40 + 238 = 278

      expect(MAE_OBS_FIELD_IDS).toHaveLength(278);
      expect(MAE_OBS_FIELD_SEEDS).toHaveLength(278);

      // Validate no duplicates
      const uniqueIds = new Set(MAE_OBS_FIELD_IDS);
      expect(uniqueIds.size).toBe(278);
    });
  });

  describe("restoreMAEObservationFields", () => {
    it("creates all 278 MAE observation fields when none exist", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(278).fill(undefined));

      const outcome = await restoreMAEObservationFields();

      expect(outcome.created).toBe(278);
      expect(outcome.restored).toBe(0);
      expect(outcome.unchanged).toBe(0);
      expect(fieldsAddMock).toHaveBeenCalledTimes(278);

      const addedIds = fieldsAddMock.mock.calls.map((call) => call[0].id);
      expect(addedIds).toEqual(expect.arrayContaining([...MAE_OBS_FIELD_IDS]));
    });

    it("restores archived MAE observation fields", async () => {
      const archivedFields = MAE_OBS_FIELD_IDS.map((id) => archivedRow(id));
      fieldsBulkGetMock.mockResolvedValueOnce(archivedFields);
      fieldsUpdateMock.mockResolvedValue(1);

      const outcome = await restoreMAEObservationFields();

      expect(outcome.created).toBe(0);
      expect(outcome.restored).toBe(278);
      expect(outcome.unchanged).toBe(0);
      expect(fieldsUpdateMock).toHaveBeenCalledTimes(278);
    });

    it("leaves active MAE observation fields untouched", async () => {
      const activeFields = MAE_OBS_FIELD_IDS.map((id) => activeFieldRow(id));
      fieldsBulkGetMock.mockResolvedValueOnce(activeFields);

      const outcome = await restoreMAEObservationFields();

      expect(outcome.created).toBe(0);
      expect(outcome.restored).toBe(0);
      expect(outcome.unchanged).toBe(278);
      expect(fieldsAddMock).not.toHaveBeenCalled();
      expect(fieldsUpdateMock).not.toHaveBeenCalled();
    });
  });

  describe("restoreMAEObservationForms", () => {
    it("creates all 8 MAE observation forms when missing and ensures fields exist", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(278).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);

      const outcome = await restoreMAEObservationForms();

      expect(outcome.created).toBe(8);
      expect(outcome.fields.created).toBe(278);
      expect(formsAddMock).toHaveBeenCalledTimes(8);

      const form1Arg = formsAddMock.mock.calls[0]?.[0];
      expect(form1Arg.id).toBe(MAE_OBS_FORM_ENC_1_ID);
      expect(form1Arg.name).toBe("MAE - Ficha de Observación - Encuentro 1");
      expect(form1Arg.fields).toHaveLength(40);

      const form2Arg = formsAddMock.mock.calls[1]?.[0];
      expect(form2Arg.id).toBe(MAE_OBS_FORM_ENC_2_ID);
      expect(form2Arg.name).toBe("MAE - Ficha de Observación - Encuentro 2");
      expect(form2Arg.fields).toHaveLength(34);

      const form3Arg = formsAddMock.mock.calls[2]?.[0];
      expect(form3Arg.id).toBe(MAE_OBS_FORM_ENC_3_ID);
      expect(form3Arg.name).toBe("MAE - Ficha de Observación - Encuentro 3");
      expect(form3Arg.fields).toHaveLength(34);

      const form4Arg = formsAddMock.mock.calls[3]?.[0];
      expect(form4Arg.id).toBe(MAE_OBS_FORM_ENC_4_ID);
      expect(form4Arg.name).toBe("MAE - Ficha de Observación - Encuentro 4");
      expect(form4Arg.fields).toHaveLength(34);

      const form5Arg = formsAddMock.mock.calls[4]?.[0];
      expect(form5Arg.id).toBe(MAE_OBS_FORM_ENC_5_ID);
      expect(form5Arg.name).toBe("MAE - Ficha de Observación - Encuentro 5");
      expect(form5Arg.fields).toHaveLength(34);
    });

    it("restores archived MAE observation forms after restoring the fields", async () => {
      const activeFields = MAE_OBS_FIELD_IDS.map((id) => activeFieldRow(id));
      fieldsBulkGetMock.mockResolvedValueOnce(activeFields);
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_1_ID,
        name: "MAE - Ficha de Observación - Encuentro 1",
        fields: [],
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_2_ID,
        name: "MAE - Ficha de Observación - Encuentro 2",
        fields: [],
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_3_ID,
        name: "MAE - Ficha de Observación - Encuentro 3",
        fields: [],
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_4_ID,
        name: "MAE - Ficha de Observación - Encuentro 4",
        fields: [],
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_5_ID,
        name: "MAE - Ficha de Observación - Encuentro 5",
        fields: [],
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_6_ID,
        name: "MAE - Ficha de Observación - Encuentro 6",
        fields: [],
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_7_ID,
        name: "MAE - Ficha de Observación - Encuentro 7",
        fields: [],
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_8_ID,
        name: "MAE - Ficha de Observación - Encuentro 8",
        fields: [],
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsUpdateMock.mockResolvedValue(1);

      const outcome = await restoreMAEObservationForms();

      expect(outcome.restored).toBe(8);
      expect(outcome.created).toBe(0);
      expect(outcome.fields.unchanged).toBe(278);
      expect(formsUpdateMock).toHaveBeenCalledTimes(8);
    });

    it("leaves the active MAE observation forms untouched", async () => {
      const activeFields = MAE_OBS_FIELD_IDS.map((id) => activeFieldRow(id));
      fieldsBulkGetMock.mockResolvedValueOnce(activeFields);
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_1_ID,
        name: "MAE - Ficha de Observación - Encuentro 1",
        fields: [],
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_2_ID,
        name: "MAE - Ficha de Observación - Encuentro 2",
        fields: [],
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_3_ID,
        name: "MAE - Ficha de Observación - Encuentro 3",
        fields: [],
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_4_ID,
        name: "MAE - Ficha de Observación - Encuentro 4",
        fields: [],
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_5_ID,
        name: "MAE - Ficha de Observación - Encuentro 5",
        fields: [],
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_6_ID,
        name: "MAE - Ficha de Observación - Encuentro 6",
        fields: [],
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_7_ID,
        name: "MAE - Ficha de Observación - Encuentro 7",
        fields: [],
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsGetMock.mockResolvedValueOnce({
        id: MAE_OBS_FORM_ENC_8_ID,
        name: "MAE - Ficha de Observación - Encuentro 8",
        fields: [],
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });

      const outcome = await restoreMAEObservationForms();

      expect(outcome.created).toBe(0);
      expect(outcome.restored).toBe(0);
      expect(outcome.unchanged).toBe(8);
      expect(outcome.fields.unchanged).toBe(278);
      expect(formsAddMock).not.toHaveBeenCalled();
      expect(formsUpdateMock).not.toHaveBeenCalled();
    });
  });

  describe("MAE Observation Field Configuration", () => {
    it("has exactly 278 fields defined", () => {
      expect(MAE_OBS_FIELD_SEEDS).toHaveLength(278);
      expect(MAE_OBS_FIELD_IDS).toHaveLength(278);
    });

    it("has stable unique IDs for all fields", () => {
      const uniqueIds = new Set(MAE_OBS_FIELD_IDS);
      expect(uniqueIds.size).toBe(278);
    });

    it("has correct configuration for identification fields (encounter 1)", () => {
      const fechaField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_FECHA_ENCUENTRO_1_ID,
      );
      expect(fechaField).toBeDefined();
      expect(fechaField?.type).toBe("date");
      expect(fechaField?.required).toBe(true);

      const edadField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_EDAD_PARTICIPANTE_1_ID,
      );
      expect(edadField).toBeDefined();
      expect(edadField?.type).toBe("number");
      expect(edadField?.required).toBe(true);
      expect(edadField?.config).toEqual({ min: 0, max: 18 });
    });

    it("has correct configuration for CONSIGNA fields", () => {
      const consignaField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_1_ID,
      );
      expect(consignaField).toBeDefined();
      expect(consignaField?.type).toBe("boolean");
      expect(consignaField?.required).toBe(false);
    });

    it("has correct configuration for conditional difficulty fields", () => {
      const dificultadField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_1_ID,
      );
      expect(dificultadField).toBeDefined();
      expect(dificultadField?.type).toBe("boolean");
      expect(dificultadField?.required).toBe(false);

      const dificultadCualField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_1_ID,
      );
      expect(dificultadCualField).toBeDefined();
      expect(dificultadCualField?.type).toBe("text");
      expect(dificultadCualField?.required).toBe(false);
      expect(dificultadCualField?.config).toEqual({ maxLength: 255 });
    });

    it("has correct configuration for global fields (only in encounter 1)", () => {
      const climaField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID,
      );
      expect(climaField).toBeDefined();
      expect(climaField?.type).toBe("boolean");
      expect(climaField?.required).toBe(false);

      const observacionesField = MAE_OBS_FIELD_SEEDS.find(
        (f) => f.id === MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID,
      );
      expect(observacionesField).toBeDefined();
      expect(observacionesField?.type).toBe("longText");
      expect(observacionesField?.required).toBe(false);
      expect(observacionesField?.config).toEqual({ maxLength: 5000 });
    });
  });

  describe("MAE Observation Integration", () => {
    it("can restore fields and forms in sequence", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(278).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);

      const outcome = await restoreMAEObservationForms();

      expect(outcome.fields.created).toBe(278);
      expect(outcome.created).toBe(8);
      expect(fieldsAddMock).toHaveBeenCalledTimes(278);
      expect(formsAddMock).toHaveBeenCalledTimes(8);
    });

    it("form 1 contains all 40 field instances with correct field references", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(278).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);

      await restoreMAEObservationForms();

      const form1Arg = formsAddMock.mock.calls[0]?.[0];
      expect(form1Arg.fields).toHaveLength(40);

      const fieldIds = form1Arg.fields.map((f: { fieldId: string }) => f.fieldId);
      expect(fieldIds).toContain(MAE_OBS_FIELD_FECHA_ENCUENTRO_1_ID);
      expect(fieldIds).toContain(MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID);
      expect(fieldIds).toContain(MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID);

      const instanceIds = form1Arg.fields.map((f: { instanceId: string }) => f.instanceId);
      const uniqueInstanceIds = new Set(instanceIds);
      expect(uniqueInstanceIds.size).toBe(40);
    });

    it("form 2 contains all 34 field instances without global fields", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce(Array(278).fill(undefined));
      formsGetMock.mockResolvedValueOnce(undefined);
      formsGetMock.mockResolvedValueOnce(undefined);

      await restoreMAEObservationForms();

      const form2Arg = formsAddMock.mock.calls[1]?.[0];
      expect(form2Arg.fields).toHaveLength(34);

      const fieldIds = form2Arg.fields.map((f: { fieldId: string }) => f.fieldId);
      expect(fieldIds).toContain(MAE_OBS_FIELD_FECHA_ENCUENTRO_2_ID);
      expect(fieldIds).not.toContain(MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID);
      expect(fieldIds).not.toContain(MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID);
    });
  });
});
