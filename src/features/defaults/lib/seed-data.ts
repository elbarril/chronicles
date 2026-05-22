import { type Field } from "@/domain/field";
import { type FormFieldInstance, type ObservationForm } from "@/domain/form";

/**
 * Stable identifiers for the built-in default field and form definitions.
 * These IDs are used to detect, restore, or recreate the defaults
 * regardless of label/key edits.
 */
export const DEFAULT_AUDIO_FIELD_ID = "00000000-0000-4000-8000-00000000d001";
export const DEFAULT_LONG_TEXT_FIELD_ID = "00000000-0000-4000-8000-00000000d002";
export const DEFAULT_FORM_ID = "00000000-0000-4000-8000-00000000d101";

export const DEFAULT_FIELD_IDS: readonly string[] = [
  DEFAULT_AUDIO_FIELD_ID,
  DEFAULT_LONG_TEXT_FIELD_ID,
] as const;

type DefaultFieldSeed = Omit<Field, "createdAt" | "updatedAt" | "archivedAt">;

export const DEFAULT_FIELD_SEEDS: readonly DefaultFieldSeed[] = [
  {
    id: DEFAULT_AUDIO_FIELD_ID,
    type: "audio",
    key: "audio_de_observacion",
    label: "Audio de observación",
    required: false,
    helpText: "",
    config: {
      multiple: false,
      transcriptionEnabled: true,
      transcriptionTargetFieldId: undefined,
    },
  },
  {
    id: DEFAULT_LONG_TEXT_FIELD_ID,
    type: "longText",
    key: "transcripcion_audio_de_observacion",
    label: "Transcripción de audio de observación",
    required: false,
    helpText: "",
    config: {},
  },
] as const;

/** Stable instance IDs for default form instances. */
export const DEFAULT_FORM_INSTANCE_AUDIO_ID = "00000000-0000-4000-8000-00000000e001";
export const DEFAULT_FORM_INSTANCE_LONGTEXT_ID = "00000000-0000-4000-8000-00000000e002";

type DefaultFormSeed = Pick<ObservationForm, "id" | "name" | "fields">;

export const DEFAULT_FORM_SEED: DefaultFormSeed = {
  id: DEFAULT_FORM_ID,
  name: "Observación de encuentro",
  fields: [
    { instanceId: DEFAULT_FORM_INSTANCE_AUDIO_ID, fieldId: DEFAULT_AUDIO_FIELD_ID },
    { instanceId: DEFAULT_FORM_INSTANCE_LONGTEXT_ID, fieldId: DEFAULT_LONG_TEXT_FIELD_ID },
  ] satisfies FormFieldInstance[],
};

/**
 * Stable identifiers for the comprehensive demo scenario, used by
 * "Cargar encuentro de prueba". The demo is fully populated end-to-end:
 * a dedicated form covering every supported field type, a group with
 * two participants, an encounter, an observation with valid content
 * for every field, and a generated chronicle. Reusing stable UUIDs
 * guarantees that calling the seed twice never duplicates rows.
 *
 * UUIDs are namespaced by entity (`d0xx` fields, `d1xx` forms,
 * `d2xx` projects, `d3xx` participants, `d4xx` encounters).
 */
export const DEMO_FIELD_TEXT_ID = "00000000-0000-4000-8000-00000000d011";
export const DEMO_FIELD_LONG_TEXT_ID = "00000000-0000-4000-8000-00000000d012";
export const DEMO_FIELD_NUMBER_ID = "00000000-0000-4000-8000-00000000d013";
export const DEMO_FIELD_BOOLEAN_ID = "00000000-0000-4000-8000-00000000d014";
export const DEMO_FIELD_SINGLE_CHOICE_ID = "00000000-0000-4000-8000-00000000d015";
export const DEMO_FIELD_MULTI_CHOICE_ID = "00000000-0000-4000-8000-00000000d016";
export const DEMO_FIELD_DATE_ID = "00000000-0000-4000-8000-00000000d017";
export const DEMO_FIELD_TIME_ID = "00000000-0000-4000-8000-00000000d018";
export const DEMO_FIELD_DATETIME_ID = "00000000-0000-4000-8000-00000000d019";
export const DEMO_FIELD_IMAGE_ID = "00000000-0000-4000-8000-00000000d01a";
export const DEMO_FIELD_VIDEO_ID = "00000000-0000-4000-8000-00000000d01b";
export const DEMO_FIELD_AUDIO_ID = "00000000-0000-4000-8000-00000000d01c";
export const DEMO_FIELD_FILE_ID = "00000000-0000-4000-8000-00000000d01d";
export const DEMO_FIELD_RATING_ID = "00000000-0000-4000-8000-00000000d01e";
export const DEMO_FIELD_LOCATION_ID = "00000000-0000-4000-8000-00000000d01f";

type DemoFieldSeed = Omit<Field, "createdAt" | "updatedAt" | "archivedAt">;

export const DEMO_FIELD_SEEDS: readonly DemoFieldSeed[] = [
  {
    id: DEMO_FIELD_TEXT_ID,
    type: "text",
    key: "demo_texto_corto",
    label: "Texto corto",
    required: false,
    helpText: "",
    config: { maxLength: 200 },
  },
  {
    id: DEMO_FIELD_LONG_TEXT_ID,
    type: "longText",
    key: "demo_texto_largo",
    label: "Texto largo",
    required: false,
    helpText: "",
    config: { maxLength: 2000 },
  },
  {
    id: DEMO_FIELD_NUMBER_ID,
    type: "number",
    key: "demo_numero",
    label: "Número",
    required: false,
    helpText: "",
    config: { min: 0, max: 100 },
  },
  {
    id: DEMO_FIELD_BOOLEAN_ID,
    type: "boolean",
    key: "demo_booleano",
    label: "Booleano",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: DEMO_FIELD_SINGLE_CHOICE_ID,
    type: "singleChoice",
    key: "demo_opcion_unica",
    label: "Opción única",
    required: false,
    helpText: "",
    config: { options: ["Opción A", "Opción B", "Opción C"] },
  },
  {
    id: DEMO_FIELD_MULTI_CHOICE_ID,
    type: "multiChoice",
    key: "demo_opcion_multiple",
    label: "Opción múltiple",
    required: false,
    helpText: "",
    config: { options: ["Verde", "Azul", "Rojo"] },
  },
  {
    id: DEMO_FIELD_DATE_ID,
    type: "date",
    key: "demo_fecha",
    label: "Fecha",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: DEMO_FIELD_TIME_ID,
    type: "time",
    key: "demo_hora",
    label: "Hora",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: DEMO_FIELD_DATETIME_ID,
    type: "datetime",
    key: "demo_fecha_y_hora",
    label: "Fecha y hora",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: DEMO_FIELD_IMAGE_ID,
    type: "image",
    key: "demo_imagen",
    label: "Imagen",
    required: false,
    helpText: "",
    config: { multiple: false },
  },
  {
    id: DEMO_FIELD_VIDEO_ID,
    type: "video",
    key: "demo_video",
    label: "Video",
    required: false,
    helpText: "",
    config: { multiple: false },
  },
  {
    id: DEMO_FIELD_AUDIO_ID,
    type: "audio",
    key: "demo_audio",
    label: "Audio",
    required: false,
    helpText: "",
    config: { multiple: false },
  },
  {
    id: DEMO_FIELD_FILE_ID,
    type: "file",
    key: "demo_archivo",
    label: "Archivo",
    required: false,
    helpText: "",
    config: { multiple: false },
  },
  {
    id: DEMO_FIELD_RATING_ID,
    type: "rating",
    key: "demo_calificacion",
    label: "Calificación",
    required: false,
    helpText: "",
    config: { min: 0, max: 5 },
  },
  {
    id: DEMO_FIELD_LOCATION_ID,
    type: "location",
    key: "demo_ubicacion",
    label: "Ubicación",
    required: false,
    helpText: "",
    config: {},
  },
] as const;

export const DEMO_FIELD_IDS: readonly string[] = DEMO_FIELD_SEEDS.map((seed) => seed.id);

export const DEMO_FORM_ID = "00000000-0000-4000-8000-00000000d102";

/** Stable instance IDs for demo form instances (one per demo field, same index). */
export const DEMO_FORM_INSTANCE_IDS: readonly string[] = DEMO_FIELD_SEEDS.map(
  (_, i) => `00000000-0000-4000-8000-00000000f${String(i + 1).padStart(3, "0")}`,
);

export const DEMO_FORM_SEED: Pick<ObservationForm, "id" | "name" | "fields"> = {
  id: DEMO_FORM_ID,
  name: "Formulario de prueba",
  fields: DEMO_FIELD_SEEDS.map((seed, i) => ({
    instanceId: DEMO_FORM_INSTANCE_IDS[i] as string,
    fieldId: seed.id,
  })) satisfies FormFieldInstance[],
};

export const DEMO_PROJECT_ID = "00000000-0000-4000-8000-00000000d211";

export const DEMO_PROJECT_SEED = {
  id: DEMO_PROJECT_ID,
  name: "Proyecto de prueba",
} as const;

/**
 * 13 participants seeded into the demo project. The first two are
 * reused as the participants attached to the demo observations on the
 * primary encounter, hence the dedicated `DEMO_PARTICIPANT_ONE_ID` and
 * `DEMO_PARTICIPANT_TWO_ID` aliases below.
 */
export const DEMO_PARTICIPANT_SEEDS = [
  { id: "00000000-0000-4000-8000-00000000d311", displayName: "Thiago" },
  { id: "00000000-0000-4000-8000-00000000d312", displayName: "Bautista" },
  { id: "00000000-0000-4000-8000-00000000d313", displayName: "Solange" },
  { id: "00000000-0000-4000-8000-00000000d314", displayName: "Ambar" },
  { id: "00000000-0000-4000-8000-00000000d315", displayName: "Xiomara" },
  { id: "00000000-0000-4000-8000-00000000d316", displayName: "Moises" },
  { id: "00000000-0000-4000-8000-00000000d317", displayName: "Nicole" },
  { id: "00000000-0000-4000-8000-00000000d318", displayName: "Celeste" },
  { id: "00000000-0000-4000-8000-00000000d319", displayName: "Tiziano" },
  { id: "00000000-0000-4000-8000-00000000d31a", displayName: "Florencia" },
  { id: "00000000-0000-4000-8000-00000000d31b", displayName: "Santiago" },
  { id: "00000000-0000-4000-8000-00000000d31c", displayName: "Leonel" },
  { id: "00000000-0000-4000-8000-00000000d31d", displayName: "Ayelén" },
] as const;

export const DEMO_PARTICIPANT_IDS: readonly string[] = DEMO_PARTICIPANT_SEEDS.map(
  (seed) => seed.id,
);

/** First two participants — used by the pre-loaded demo observations. */
export const DEMO_PARTICIPANT_ONE_ID = "00000000-0000-4000-8000-00000000d311";
export const DEMO_PARTICIPANT_TWO_ID = "00000000-0000-4000-8000-00000000d312";

/**
 * Eight Thursday encounters spanning May–July 2026, all running from
 * 17:00 to 18:15 (interpreted in the user's local timezone, which is
 * how the encounter form reads/writes dates).
 *
 * The first encounter (`DEMO_ENCOUNTER_ID`) is the "primary" one: it
 * receives the pre-populated observations and the auto-generated
 * chronicle so the user can see the full pipeline working out of the
 * box. The other seven are intentionally empty — they exist to give
 * the project a realistic shape.
 */
type DemoEncounterSeed = {
  readonly id: string;
  readonly name: string;
  /** Local-time start: [year, monthIndex, day, hour, minute]. */
  readonly start: readonly [number, number, number, number, number];
  /** Local-time end: [year, monthIndex, day, hour, minute]. */
  readonly end: readonly [number, number, number, number, number];
};

export const DEMO_ENCOUNTER_SEEDS: readonly DemoEncounterSeed[] = [
  {
    id: "00000000-0000-4000-8000-00000000d411",
    name: "Encuentro 1",
    start: [2026, 4, 21, 17, 0],
    end: [2026, 4, 21, 18, 15],
  },
  {
    id: "00000000-0000-4000-8000-00000000d412",
    name: "Encuentro 2",
    start: [2026, 4, 28, 17, 0],
    end: [2026, 4, 28, 18, 15],
  },
  {
    id: "00000000-0000-4000-8000-00000000d413",
    name: "Encuentro 3",
    start: [2026, 5, 4, 17, 0],
    end: [2026, 5, 4, 18, 15],
  },
  {
    id: "00000000-0000-4000-8000-00000000d414",
    name: "Encuentro 4",
    start: [2026, 5, 11, 17, 0],
    end: [2026, 5, 11, 18, 15],
  },
  {
    id: "00000000-0000-4000-8000-00000000d415",
    name: "Encuentro 5",
    start: [2026, 5, 18, 17, 0],
    end: [2026, 5, 18, 18, 15],
  },
  {
    id: "00000000-0000-4000-8000-00000000d416",
    name: "Encuentro 6",
    start: [2026, 5, 25, 17, 0],
    end: [2026, 5, 25, 18, 15],
  },
  {
    id: "00000000-0000-4000-8000-00000000d417",
    name: "Encuentro 7",
    start: [2026, 6, 2, 17, 0],
    end: [2026, 6, 2, 18, 15],
  },
  {
    id: "00000000-0000-4000-8000-00000000d418",
    name: "Encuentro 8",
    start: [2026, 6, 16, 17, 0],
    end: [2026, 6, 16, 18, 15],
  },
] as const;

export const DEMO_ENCOUNTER_IDS: readonly string[] = DEMO_ENCOUNTER_SEEDS.map((seed) => seed.id);

/**
 * Identifier of the primary demo encounter — the only one that ships
 * with pre-loaded observations and a generated chronicle. Kept under a
 * stable name (and as `DEMO_ENCOUNTER_SEED`) for backwards-compat with
 * tests, the onboarding tour and any consumer that already imported it.
 */
export const DEMO_ENCOUNTER_ID = "00000000-0000-4000-8000-00000000d411";
export const DEMO_ENCOUNTER_SEED: DemoEncounterSeed = {
  id: DEMO_ENCOUNTER_ID,
  name: "Encuentro 1",
  start: [2026, 4, 21, 17, 0],
  end: [2026, 4, 21, 18, 15],
};

/**
 * MAE Evaluation Form - Stable identifiers
 * Namespace: d03x for MAE evaluation fields
 * Namespace: d103 for MAE evaluation form
 * Namespace: e03x for MAE evaluation form instances
 */

// Identification fields (4)
export const MAE_EVAL_FIELD_ESTUDIANTES_ID = "00000000-0000-4000-8000-00000000d301";
export const MAE_EVAL_FIELD_SUPERVISORA_ID = "00000000-0000-4000-8000-00000000d302";
export const MAE_EVAL_FIELD_INSTITUCION_ID = "00000000-0000-4000-8000-00000000d303";
export const MAE_EVAL_FIELD_EDAD_ID = "00000000-0000-4000-8000-00000000d304";

// Evaluation categories - Encounter 4 (12)
export const MAE_EVAL_FIELD_DISPOSICION_TRABAJO_ENC4_ID = "00000000-0000-4000-8000-00000000d305";
export const MAE_EVAL_FIELD_INTERES_MOTIVACION_ENC4_ID = "00000000-0000-4000-8000-00000000d306";
export const MAE_EVAL_FIELD_INTERES_CONSIGNA_ENC4_ID = "00000000-0000-4000-8000-00000000d307";
export const MAE_EVAL_FIELD_CONCENTRACION_ENC4_ID = "00000000-0000-4000-8000-00000000d308";
export const MAE_EVAL_FIELD_TOLERANCIA_FRUSTRACION_ENC4_ID = "00000000-0000-4000-8000-00000000d309";
export const MAE_EVAL_FIELD_EXPERIMENTACION_MATERIALES_ENC4_ID =
  "00000000-0000-4000-8000-00000000d30a";
export const MAE_EVAL_FIELD_PRODUCCION_IMAGENES_ENC4_ID = "00000000-0000-4000-8000-00000000d30b";
export const MAE_EVAL_FIELD_LOGRO_FINALIZACION_ENC4_ID = "00000000-0000-4000-8000-00000000d30c";
export const MAE_EVAL_FIELD_INTERACCION_PARES_ENC4_ID = "00000000-0000-4000-8000-00000000d30d";
export const MAE_EVAL_FIELD_SOCIALIZACION_PRODUCCION_ENC4_ID =
  "00000000-0000-4000-8000-00000000d30e";
export const MAE_EVAL_FIELD_RECIPROCIDAD_ESCUCHA_ENC4_ID = "00000000-0000-4000-8000-00000000d30f";
export const MAE_EVAL_FIELD_ADECUACION_ENCUADRE_ENC4_ID = "00000000-0000-4000-8000-00000000d310";

// Evaluation categories - Encounter 8 (12)
export const MAE_EVAL_FIELD_DISPOSICION_TRABAJO_ENC8_ID = "00000000-0000-4000-8000-00000000d311";
export const MAE_EVAL_FIELD_INTERES_MOTIVACION_ENC8_ID = "00000000-0000-4000-8000-00000000d312";
export const MAE_EVAL_FIELD_INTERES_CONSIGNA_ENC8_ID = "00000000-0000-4000-8000-00000000d313";
export const MAE_EVAL_FIELD_CONCENTRACION_ENC8_ID = "00000000-0000-4000-8000-00000000d314";
export const MAE_EVAL_FIELD_TOLERANCIA_FRUSTRACION_ENC8_ID = "00000000-0000-4000-8000-00000000d315";
export const MAE_EVAL_FIELD_EXPERIMENTACION_MATERIALES_ENC8_ID =
  "00000000-0000-4000-8000-00000000d316";
export const MAE_EVAL_FIELD_PRODUCCION_IMAGENES_ENC8_ID = "00000000-0000-4000-8000-00000000d317";
export const MAE_EVAL_FIELD_LOGRO_FINALIZACION_ENC8_ID = "00000000-0000-4000-8000-00000000d318";
export const MAE_EVAL_FIELD_INTERACCION_PARES_ENC8_ID = "00000000-0000-4000-8000-00000000d319";
export const MAE_EVAL_FIELD_SOCIALIZACION_PRODUCCION_ENC8_ID =
  "00000000-0000-4000-8000-00000000d31a";
export const MAE_EVAL_FIELD_RECIPROCIDAD_ESCUCHA_ENC8_ID = "00000000-0000-4000-8000-00000000d31b";
export const MAE_EVAL_FIELD_ADECUACION_ENCUADRE_ENC8_ID = "00000000-0000-4000-8000-00000000d31c";

// Qualitative evaluation (1)
export const MAE_EVAL_FIELD_VALORACION_CUALITATIVA_ID = "00000000-0000-4000-8000-00000000d31d";

export const MAE_EVAL_FIELD_IDS: readonly string[] = [
  MAE_EVAL_FIELD_ESTUDIANTES_ID,
  MAE_EVAL_FIELD_SUPERVISORA_ID,
  MAE_EVAL_FIELD_INSTITUCION_ID,
  MAE_EVAL_FIELD_EDAD_ID,
  MAE_EVAL_FIELD_DISPOSICION_TRABAJO_ENC4_ID,
  MAE_EVAL_FIELD_INTERES_MOTIVACION_ENC4_ID,
  MAE_EVAL_FIELD_INTERES_CONSIGNA_ENC4_ID,
  MAE_EVAL_FIELD_CONCENTRACION_ENC4_ID,
  MAE_EVAL_FIELD_TOLERANCIA_FRUSTRACION_ENC4_ID,
  MAE_EVAL_FIELD_EXPERIMENTACION_MATERIALES_ENC4_ID,
  MAE_EVAL_FIELD_PRODUCCION_IMAGENES_ENC4_ID,
  MAE_EVAL_FIELD_LOGRO_FINALIZACION_ENC4_ID,
  MAE_EVAL_FIELD_INTERACCION_PARES_ENC4_ID,
  MAE_EVAL_FIELD_SOCIALIZACION_PRODUCCION_ENC4_ID,
  MAE_EVAL_FIELD_RECIPROCIDAD_ESCUCHA_ENC4_ID,
  MAE_EVAL_FIELD_ADECUACION_ENCUADRE_ENC4_ID,
  MAE_EVAL_FIELD_DISPOSICION_TRABAJO_ENC8_ID,
  MAE_EVAL_FIELD_INTERES_MOTIVACION_ENC8_ID,
  MAE_EVAL_FIELD_INTERES_CONSIGNA_ENC8_ID,
  MAE_EVAL_FIELD_CONCENTRACION_ENC8_ID,
  MAE_EVAL_FIELD_TOLERANCIA_FRUSTRACION_ENC8_ID,
  MAE_EVAL_FIELD_EXPERIMENTACION_MATERIALES_ENC8_ID,
  MAE_EVAL_FIELD_PRODUCCION_IMAGENES_ENC8_ID,
  MAE_EVAL_FIELD_LOGRO_FINALIZACION_ENC8_ID,
  MAE_EVAL_FIELD_INTERACCION_PARES_ENC8_ID,
  MAE_EVAL_FIELD_SOCIALIZACION_PRODUCCION_ENC8_ID,
  MAE_EVAL_FIELD_RECIPROCIDAD_ESCUCHA_ENC8_ID,
  MAE_EVAL_FIELD_ADECUACION_ENCUADRE_ENC8_ID,
  MAE_EVAL_FIELD_VALORACION_CUALITATIVA_ID,
] as const;

type MaeEvalFieldSeed = Omit<Field, "createdAt" | "updatedAt" | "archivedAt">;

export const MAE_EVAL_FIELD_SEEDS: readonly MaeEvalFieldSeed[] = [
  // Identification fields (4)
  {
    id: MAE_EVAL_FIELD_ESTUDIANTES_ID,
    type: "text",
    key: "mae_eval_estudiantes",
    label: "Estudiante/s",
    required: true,
    helpText: "",
    config: { maxLength: 255 },
  },
  {
    id: MAE_EVAL_FIELD_SUPERVISORA_ID,
    type: "text",
    key: "mae_eval_supervisora",
    label: "Supervisora",
    required: true,
    helpText: "",
    config: { maxLength: 255 },
  },
  {
    id: MAE_EVAL_FIELD_INSTITUCION_ID,
    type: "text",
    key: "mae_eval_institucion",
    label: "Institución",
    required: true,
    helpText: "",
    config: { maxLength: 255 },
  },
  {
    id: MAE_EVAL_FIELD_EDAD_ID,
    type: "number",
    key: "mae_eval_edad",
    label: "Edad",
    required: true,
    helpText: "",
    config: { min: 0, max: 18 },
  },
  // Evaluation categories - Encounter 4 (12)
  {
    id: MAE_EVAL_FIELD_DISPOSICION_TRABAJO_ENC4_ID,
    type: "rating",
    key: "mae_eval_disposicion_trabajo_enc4",
    label: "Nivel de disposición al trabajo (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_INTERES_MOTIVACION_ENC4_ID,
    type: "rating",
    key: "mae_eval_interes_motivacion_enc4",
    label: "Nivel de interés hacia la motivación (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_INTERES_CONSIGNA_ENC4_ID,
    type: "rating",
    key: "mae_eval_interes_consigna_enc4",
    label: "Nivel de interés hacia la consigna (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_CONCENTRACION_ENC4_ID,
    type: "rating",
    key: "mae_eval_concentracion_enc4",
    label: "Nivel general de concentración (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_TOLERANCIA_FRUSTRACION_ENC4_ID,
    type: "rating",
    key: "mae_eval_tolerancia_frustracion_enc4",
    label: "Nivel de tolerancia a la frustración (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_EXPERIMENTACION_MATERIALES_ENC4_ID,
    type: "rating",
    key: "mae_eval_experimentacion_materiales_enc4",
    label: "Nivel de experimentación con los materiales (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_PRODUCCION_IMAGENES_ENC4_ID,
    type: "rating",
    key: "mae_eval_produccion_imagenes_enc4",
    label: "Nivel de producción de imágenes subjetivas (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_LOGRO_FINALIZACION_ENC4_ID,
    type: "rating",
    key: "mae_eval_logro_finalizacion_enc4",
    label: "Nivel de logro (finalización de la producción) (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_INTERACCION_PARES_ENC4_ID,
    type: "rating",
    key: "mae_eval_interaccion_pares_enc4",
    label: "Nivel de Interacción con los pares (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_SOCIALIZACION_PRODUCCION_ENC4_ID,
    type: "rating",
    key: "mae_eval_socializacion_produccion_enc4",
    label: "Nivel de socialización de su producción (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_RECIPROCIDAD_ESCUCHA_ENC4_ID,
    type: "rating",
    key: "mae_eval_reciprocidad_escucha_enc4",
    label: "Nivel de reciprocidad (escucha) con sus pares (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_ADECUACION_ENCUADRE_ENC4_ID,
    type: "rating",
    key: "mae_eval_adecuacion_encuadre_enc4",
    label: "Nivel de adecuación al encuadre (4° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  // Evaluation categories - Encounter 8 (12)
  {
    id: MAE_EVAL_FIELD_DISPOSICION_TRABAJO_ENC8_ID,
    type: "rating",
    key: "mae_eval_disposicion_trabajo_enc8",
    label: "Nivel de disposición al trabajo (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_INTERES_MOTIVACION_ENC8_ID,
    type: "rating",
    key: "mae_eval_interes_motivacion_enc8",
    label: "Nivel de interés hacia la motivación (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_INTERES_CONSIGNA_ENC8_ID,
    type: "rating",
    key: "mae_eval_interes_consigna_enc8",
    label: "Nivel de interés hacia la consigna (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_CONCENTRACION_ENC8_ID,
    type: "rating",
    key: "mae_eval_concentracion_enc8",
    label: "Nivel general de concentración (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_TOLERANCIA_FRUSTRACION_ENC8_ID,
    type: "rating",
    key: "mae_eval_tolerancia_frustracion_enc8",
    label: "Nivel de tolerancia a la frustración (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_EXPERIMENTACION_MATERIALES_ENC8_ID,
    type: "rating",
    key: "mae_eval_experimentacion_materiales_enc8",
    label: "Nivel de experimentación con los materiales (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_PRODUCCION_IMAGENES_ENC8_ID,
    type: "rating",
    key: "mae_eval_produccion_imagenes_enc8",
    label: "Nivel de producción de imágenes subjetivas (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_LOGRO_FINALIZACION_ENC8_ID,
    type: "rating",
    key: "mae_eval_logro_finalizacion_enc8",
    label: "Nivel de logro (finalización de la producción) (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_INTERACCION_PARES_ENC8_ID,
    type: "rating",
    key: "mae_eval_interaccion_pares_enc8",
    label: "Nivel de Interacción con los pares (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_SOCIALIZACION_PRODUCCION_ENC8_ID,
    type: "rating",
    key: "mae_eval_socializacion_produccion_enc8",
    label: "Nivel de socialización de su producción (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_RECIPROCIDAD_ESCUCHA_ENC8_ID,
    type: "rating",
    key: "mae_eval_reciprocidad_escucha_enc8",
    label: "Nivel de reciprocidad (escucha) con sus pares (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  {
    id: MAE_EVAL_FIELD_ADECUACION_ENCUADRE_ENC8_ID,
    type: "rating",
    key: "mae_eval_adecuacion_encuadre_enc8",
    label: "Nivel de adecuación al encuadre (8° encuentro)",
    required: true,
    helpText: "Escala 1-5: 1=más bajo, 2-3=medio, 4=alto, 5=muy alto",
    config: { min: 1, max: 5, step: 1 },
  },
  // Qualitative evaluation (1)
  {
    id: MAE_EVAL_FIELD_VALORACION_CUALITATIVA_ID,
    type: "longText",
    key: "mae_eval_valoracion_cualitativa",
    label: "Valoración cualitativa (Comentarios)",
    required: false,
    helpText: "",
    config: { maxLength: 5000 },
  },
] as const;

// MAE Evaluation Form
export const MAE_EVAL_FORM_ID = "00000000-0000-4000-8000-00000000d103";

// Stable instance IDs for MAE evaluation form instances (one per field, same index order)
export const MAE_EVAL_FORM_INSTANCE_IDS: readonly string[] = MAE_EVAL_FIELD_SEEDS.map(
  (_, i) => `00000000-0000-4000-8000-00000000e${String(i + 1).padStart(3, "0")}`,
);

export const MAE_EVAL_FORM_SEED: Pick<ObservationForm, "id" | "name" | "fields"> = {
  id: MAE_EVAL_FORM_ID,
  name: "MAE - Ficha de Evaluación",
  fields: MAE_EVAL_FIELD_SEEDS.map((seed, i) => ({
    instanceId: MAE_EVAL_FORM_INSTANCE_IDS[i] as string,
    fieldId: seed.id,
  })) satisfies FormFieldInstance[],
};

/**
 * MAE Observation Forms - Stable identifiers
 * Namespace: d04x for MAE observation fields (encounters 1-5)
 * Namespace: d104 for MAE observation form 1 (encounter 1)
 * Namespace: d105 for MAE observation form 2 (encounter 2)
 * Namespace: d106 for MAE observation form 3 (encounter 3)
 * Namespace: d107 for MAE observation form 4 (encounter 4)
 * Namespace: d108 for MAE observation form 5 (encounter 5)
 * Namespace: e04x for MAE observation form 1 instances
 * Namespace: e05x for MAE observation form 2 instances
 * Namespace: e06x for MAE observation form 3 instances
 * Namespace: e07x for MAE observation form 4 instances
 * Namespace: e08x for MAE observation form 5 instances
 */

// ===== ENCOUNTER 1 FIELDS (39 fields: 33 per-encounter + 6 global) =====

// Identification (2)
export const MAE_OBS_FIELD_FECHA_ENCUENTRO_1_ID = "00000000-0000-4000-8000-00000000d401";
export const MAE_OBS_FIELD_EDAD_PARTICIPANTE_1_ID = "00000000-0000-4000-8000-00000000d402";

// CONSIGNA (4)
export const MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_1_ID = "00000000-0000-4000-8000-00000000d403";
export const MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_1_ID = "00000000-0000-4000-8000-00000000d404";
export const MAE_OBS_FIELD_NECESITA_REITERACION_1_ID = "00000000-0000-4000-8000-00000000d405";
export const MAE_OBS_FIELD_SE_CONCENTRA_1_ID = "00000000-0000-4000-8000-00000000d406";

// DESARROLLO-PRODUCCIÓN - inicio (2)
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_1_ID =
  "00000000-0000-4000-8000-00000000d407";
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_1_ID =
  "00000000-0000-4000-8000-00000000d408";

// DESARROLLO-PRODUCCIÓN - tiempo (4)
export const MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_1_ID = "00000000-0000-4000-8000-00000000d409";
export const MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_1_ID = "00000000-0000-4000-8000-00000000d40a";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_1_ID =
  "00000000-0000-4000-8000-00000000d40b";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_1_ID =
  "00000000-0000-4000-8000-00000000d40c";

// DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
export const MAE_OBS_FIELD_EXPLORA_MATERIALES_1_ID = "00000000-0000-4000-8000-00000000d40d";
export const MAE_OBS_FIELD_REPITE_USO_MATERIALES_1_ID = "00000000-0000-4000-8000-00000000d40e";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_1_ID = "00000000-0000-4000-8000-00000000d40f";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_1_ID =
  "00000000-0000-4000-8000-00000000d410";
export const MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_1_ID = "00000000-0000-4000-8000-00000000d411";

// DESARROLLO-PRODUCCIÓN - creatividad (3)
export const MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_1_ID = "00000000-0000-4000-8000-00000000d412";
export const MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_1_ID =
  "00000000-0000-4000-8000-00000000d413";
export const MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_1_ID =
  "00000000-0000-4000-8000-00000000d414";

// DESARROLLO-PRODUCCIÓN - en grupo (5)
export const MAE_OBS_FIELD_PIDE_AYUDA_1_ID = "00000000-0000-4000-8000-00000000d415";
export const MAE_OBS_FIELD_SE_COMUNICA_1_ID = "00000000-0000-4000-8000-00000000d416";
export const MAE_OBS_FIELD_SE_AISLA_1_ID = "00000000-0000-4000-8000-00000000d417";
export const MAE_OBS_FIELD_AYUDA_OTROS_1_ID = "00000000-0000-4000-8000-00000000d418";
export const MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_1_ID = "00000000-0000-4000-8000-00000000d419";

// CIERRE - Implicancia afectiva (6)
export const MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_1_ID = "00000000-0000-4000-8000-00000000d41a";
export const MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_1_ID = "00000000-0000-4000-8000-00000000d41b";
export const MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_1_ID = "00000000-0000-4000-8000-00000000d41c";
export const MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_1_ID = "00000000-0000-4000-8000-00000000d41d";
export const MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_1_ID = "00000000-0000-4000-8000-00000000d41e";
export const MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_1_ID =
  "00000000-0000-4000-8000-00000000d41f";

// CIERRE - grupo (3)
export const MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_1_ID = "00000000-0000-4000-8000-00000000d420";
export const MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_1_ID = "00000000-0000-4000-8000-00000000d421";
export const MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_1_ID = "00000000-0000-4000-8000-00000000d422";

// GLOBAL FIELDS (6) - only in Encounter 1
export const MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID = "00000000-0000-4000-8000-00000000d423";
export const MAE_OBS_FIELD_CLIMA_GRUPAL_DISRUPTIVO_ID = "00000000-0000-4000-8000-00000000d424";
export const MAE_OBS_FIELD_CLIMA_GRUPAL_INDIFERENTE_ID = "00000000-0000-4000-8000-00000000d425";
export const MAE_OBS_FIELD_CLIMA_GRUPAL_PARTICIPATIVO_ID = "00000000-0000-4000-8000-00000000d426";
export const MAE_OBS_FIELD_RESPETO_ENCUADRE_ID = "00000000-0000-4000-8000-00000000d427";
export const MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID = "00000000-0000-4000-8000-00000000d428";

// ===== ENCOUNTER 2 FIELDS (33 fields: same as Encounter 1 without globals) =====

// Identification (2)
export const MAE_OBS_FIELD_FECHA_ENCUENTRO_2_ID = "00000000-0000-4000-8000-00000000d429";
export const MAE_OBS_FIELD_EDAD_PARTICIPANTE_2_ID = "00000000-0000-4000-8000-00000000d42a";

// CONSIGNA (4)
export const MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_2_ID = "00000000-0000-4000-8000-00000000d42b";
export const MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_2_ID = "00000000-0000-4000-8000-00000000d42c";
export const MAE_OBS_FIELD_NECESITA_REITERACION_2_ID = "00000000-0000-4000-8000-00000000d42d";
export const MAE_OBS_FIELD_SE_CONCENTRA_2_ID = "00000000-0000-4000-8000-00000000d42e";

// DESARROLLO-PRODUCCIÓN - inicio (2)
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_2_ID =
  "00000000-0000-4000-8000-00000000d42f";
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_2_ID =
  "00000000-0000-4000-8000-00000000d430";

// DESARROLLO-PRODUCCIÓN - tiempo (4)
export const MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_2_ID = "00000000-0000-4000-8000-00000000d431";
export const MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_2_ID = "00000000-0000-4000-8000-00000000d432";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_2_ID =
  "00000000-0000-4000-8000-00000000d433";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_2_ID =
  "00000000-0000-4000-8000-00000000d434";

// DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
export const MAE_OBS_FIELD_EXPLORA_MATERIALES_2_ID = "00000000-0000-4000-8000-00000000d435";
export const MAE_OBS_FIELD_REPITE_USO_MATERIALES_2_ID = "00000000-0000-4000-8000-00000000d436";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_2_ID = "00000000-0000-4000-8000-00000000d437";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_2_ID =
  "00000000-0000-4000-8000-00000000d438";
export const MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_2_ID = "00000000-0000-4000-8000-00000000d439";

// DESARROLLO-PRODUCCIÓN - creatividad (3)
export const MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_2_ID = "00000000-0000-4000-8000-00000000d43a";
export const MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_2_ID =
  "00000000-0000-4000-8000-00000000d43b";
export const MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_2_ID =
  "00000000-0000-4000-8000-00000000d43c";

// DESARROLLO-PRODUCCIÓN - en grupo (5)
export const MAE_OBS_FIELD_PIDE_AYUDA_2_ID = "00000000-0000-4000-8000-00000000d43d";
export const MAE_OBS_FIELD_SE_COMUNICA_2_ID = "00000000-0000-4000-8000-00000000d43e";
export const MAE_OBS_FIELD_SE_AISLA_2_ID = "00000000-0000-4000-8000-00000000d43f";
export const MAE_OBS_FIELD_AYUDA_OTROS_2_ID = "00000000-0000-4000-8000-00000000d440";
export const MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_2_ID = "00000000-0000-4000-8000-00000000d441";

// CIERRE - Implicancia afectiva (6)
export const MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_2_ID = "00000000-0000-4000-8000-00000000d442";
export const MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_2_ID = "00000000-0000-4000-8000-00000000d443";
export const MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_2_ID = "00000000-0000-4000-8000-00000000d444";
export const MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_2_ID = "00000000-0000-4000-8000-00000000d445";
export const MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_2_ID = "00000000-0000-4000-8000-00000000d446";
export const MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_2_ID =
  "00000000-0000-4000-8000-00000000d447";

// CIERRE - grupo (3)
export const MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_2_ID = "00000000-0000-4000-8000-00000000d448";
export const MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_2_ID = "00000000-0000-4000-8000-00000000d449";
export const MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_2_ID = "00000000-0000-4000-8000-00000000d44a";

// ===== ENCOUNTER 3 FIELDS (33 fields: same as Encounter 2 without globals) =====

// Identification (2)
export const MAE_OBS_FIELD_FECHA_ENCUENTRO_3_ID = "00000000-0000-4000-8000-00000000d44b";
export const MAE_OBS_FIELD_EDAD_PARTICIPANTE_3_ID = "00000000-0000-4000-8000-00000000d44c";

// CONSIGNA (4)
export const MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_3_ID = "00000000-0000-4000-8000-00000000d44d";
export const MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_3_ID = "00000000-0000-4000-8000-00000000d44e";
export const MAE_OBS_FIELD_NECESITA_REITERACION_3_ID = "00000000-0000-4000-8000-00000000d44f";
export const MAE_OBS_FIELD_SE_CONCENTRA_3_ID = "00000000-0000-4000-8000-00000000d450";

// DESARROLLO-PRODUCCIÓN - inicio (2)
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_3_ID =
  "00000000-0000-4000-8000-00000000d451";
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_3_ID =
  "00000000-0000-4000-8000-00000000d452";

// DESARROLLO-PRODUCCIÓN - tiempo (4)
export const MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_3_ID = "00000000-0000-4000-8000-00000000d453";
export const MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_3_ID = "00000000-0000-4000-8000-00000000d454";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_3_ID =
  "00000000-0000-4000-8000-00000000d455";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_3_ID =
  "00000000-0000-4000-8000-00000000d456";

// DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
export const MAE_OBS_FIELD_EXPLORA_MATERIALES_3_ID = "00000000-0000-4000-8000-00000000d457";
export const MAE_OBS_FIELD_REPITE_USO_MATERIALES_3_ID = "00000000-0000-4000-8000-00000000d458";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_3_ID = "00000000-0000-4000-8000-00000000d459";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_3_ID =
  "00000000-0000-4000-8000-00000000d45a";
export const MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_3_ID = "00000000-0000-4000-8000-00000000d45b";

// DESARROLLO-PRODUCCIÓN - creatividad (3)
export const MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_3_ID = "00000000-0000-4000-8000-00000000d45c";
export const MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_3_ID =
  "00000000-0000-4000-8000-00000000d45d";
export const MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_3_ID =
  "00000000-0000-4000-8000-00000000d45e";

// DESARROLLO-PRODUCCIÓN - en grupo (5)
export const MAE_OBS_FIELD_PIDE_AYUDA_3_ID = "00000000-0000-4000-8000-00000000d45f";
export const MAE_OBS_FIELD_SE_COMUNICA_3_ID = "00000000-0000-4000-8000-00000000d460";
export const MAE_OBS_FIELD_SE_AISLA_3_ID = "00000000-0000-4000-8000-00000000d461";
export const MAE_OBS_FIELD_AYUDA_OTROS_3_ID = "00000000-0000-4000-8000-00000000d462";
export const MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_3_ID = "00000000-0000-4000-8000-00000000d463";

// CIERRE - Implicancia afectiva (6)
export const MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_3_ID = "00000000-0000-4000-8000-00000000d464";
export const MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_3_ID = "00000000-0000-4000-8000-00000000d465";
export const MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_3_ID = "00000000-0000-4000-8000-00000000d466";
export const MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_3_ID = "00000000-0000-4000-8000-00000000d467";
export const MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_3_ID = "00000000-0000-4000-8000-00000000d468";
export const MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_3_ID =
  "00000000-0000-4000-8000-00000000d469";

// CIERRE - grupo (3)
export const MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_3_ID = "00000000-0000-4000-8000-00000000d46a";
export const MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_3_ID = "00000000-0000-4000-8000-00000000d46b";
export const MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_3_ID = "00000000-0000-4000-8000-00000000d46c";

// ===== ENCOUNTER 4 FIELDS (33 fields: same as Encounter 2 without globals) =====

// Identification (2)
export const MAE_OBS_FIELD_FECHA_ENCUENTRO_4_ID = "00000000-0000-4000-8000-00000000d46d";
export const MAE_OBS_FIELD_EDAD_PARTICIPANTE_4_ID = "00000000-0000-4000-8000-00000000d46e";

// CONSIGNA (4)
export const MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_4_ID = "00000000-0000-4000-8000-00000000d46f";
export const MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_4_ID = "00000000-0000-4000-8000-00000000d470";
export const MAE_OBS_FIELD_NECESITA_REITERACION_4_ID = "00000000-0000-4000-8000-00000000d471";
export const MAE_OBS_FIELD_SE_CONCENTRA_4_ID = "00000000-0000-4000-8000-00000000d472";

// DESARROLLO-PRODUCCIÓN - inicio (2)
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_4_ID =
  "00000000-0000-4000-8000-00000000d473";
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_4_ID =
  "00000000-0000-4000-8000-00000000d474";

// DESARROLLO-PRODUCCIÓN - tiempo (4)
export const MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_4_ID = "00000000-0000-4000-8000-00000000d475";
export const MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_4_ID = "00000000-0000-4000-8000-00000000d476";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_4_ID =
  "00000000-0000-4000-8000-00000000d477";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_4_ID =
  "00000000-0000-4000-8000-00000000d478";

// DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
export const MAE_OBS_FIELD_EXPLORA_MATERIALES_4_ID = "00000000-0000-4000-8000-00000000d479";
export const MAE_OBS_FIELD_REPITE_USO_MATERIALES_4_ID = "00000000-0000-4000-8000-00000000d47a";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_4_ID = "00000000-0000-4000-8000-00000000d47b";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_4_ID =
  "00000000-0000-4000-8000-00000000d47c";
export const MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_4_ID = "00000000-0000-4000-8000-00000000d47d";

// DESARROLLO-PRODUCCIÓN - creatividad (3)
export const MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_4_ID = "00000000-0000-4000-8000-00000000d47e";
export const MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_4_ID =
  "00000000-0000-4000-8000-00000000d47f";
export const MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_4_ID =
  "00000000-0000-4000-8000-00000000d480";

// DESARROLLO-PRODUCCIÓN - en grupo (5)
export const MAE_OBS_FIELD_PIDE_AYUDA_4_ID = "00000000-0000-4000-8000-00000000d481";
export const MAE_OBS_FIELD_SE_COMUNICA_4_ID = "00000000-0000-4000-8000-00000000d482";
export const MAE_OBS_FIELD_SE_AISLA_4_ID = "00000000-0000-4000-8000-00000000d483";
export const MAE_OBS_FIELD_AYUDA_OTROS_4_ID = "00000000-0000-4000-8000-00000000d484";
export const MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_4_ID = "00000000-0000-4000-8000-00000000d485";

// CIERRE - Implicancia afectiva (6)
export const MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_4_ID = "00000000-0000-4000-8000-00000000d486";
export const MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_4_ID = "00000000-0000-4000-8000-00000000d487";
export const MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_4_ID = "00000000-0000-4000-8000-00000000d488";
export const MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_4_ID = "00000000-0000-4000-8000-00000000d489";
export const MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_4_ID = "00000000-0000-4000-8000-00000000d48a";
export const MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_4_ID =
  "00000000-0000-4000-8000-00000000d48b";

// CIERRE - grupo (3)
export const MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_4_ID = "00000000-0000-4000-8000-00000000d48c";
export const MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_4_ID = "00000000-0000-4000-8000-00000000d48d";
export const MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_4_ID = "00000000-0000-4000-8000-00000000d48e";

// ===== ENCOUNTER 5 FIELDS (33 fields: same as Encounter 2 without globals) =====

// Identification (2)
export const MAE_OBS_FIELD_FECHA_ENCUENTRO_5_ID = "00000000-0000-4000-8000-00000000d48f";
export const MAE_OBS_FIELD_EDAD_PARTICIPANTE_5_ID = "00000000-0000-4000-8000-00000000d490";

// CONSIGNA (4)
export const MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_5_ID = "00000000-0000-4000-8000-00000000d491";
export const MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_5_ID = "00000000-0000-4000-8000-00000000d492";
export const MAE_OBS_FIELD_NECESITA_REITERACION_5_ID = "00000000-0000-4000-8000-00000000d493";
export const MAE_OBS_FIELD_SE_CONCENTRA_5_ID = "00000000-0000-4000-8000-00000000d494";

// DESARROLLO-PRODUCCIÓN - inicio (2)
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_5_ID =
  "00000000-0000-4000-8000-00000000d495";
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_5_ID =
  "00000000-0000-4000-8000-00000000d496";

// DESARROLLO-PRODUCCIÓN - tiempo (4)
export const MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_5_ID = "00000000-0000-4000-8000-00000000d497";
export const MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_5_ID = "00000000-0000-4000-8000-00000000d498";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_5_ID =
  "00000000-0000-4000-8000-00000000d499";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_5_ID =
  "00000000-0000-4000-8000-00000000d49a";

// DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
export const MAE_OBS_FIELD_EXPLORA_MATERIALES_5_ID = "00000000-0000-4000-8000-00000000d49b";
export const MAE_OBS_FIELD_REPITE_USO_MATERIALES_5_ID = "00000000-0000-4000-8000-00000000d49c";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_5_ID = "00000000-0000-4000-8000-00000000d49d";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_5_ID =
  "00000000-0000-4000-8000-00000000d49e";
export const MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_5_ID = "00000000-0000-4000-8000-00000000d49f";

// DESARROLLO-PRODUCCIÓN - creatividad (3)
export const MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_5_ID = "00000000-0000-4000-8000-00000000d4a0";
export const MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_5_ID =
  "00000000-0000-4000-8000-00000000d4a1";
export const MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_5_ID =
  "00000000-0000-4000-8000-00000000d4a2";

// DESARROLLO-PRODUCCIÓN - en grupo (5)
export const MAE_OBS_FIELD_PIDE_AYUDA_5_ID = "00000000-0000-4000-8000-00000000d4a3";
export const MAE_OBS_FIELD_SE_COMUNICA_5_ID = "00000000-0000-4000-8000-00000000d4a4";
export const MAE_OBS_FIELD_SE_AISLA_5_ID = "00000000-0000-4000-8000-00000000d4a5";
export const MAE_OBS_FIELD_AYUDA_OTROS_5_ID = "00000000-0000-4000-8000-00000000d4a6";
export const MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_5_ID = "00000000-0000-4000-8000-00000000d4a7";

// CIERRE - Implicancia afectiva (6)
export const MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_5_ID = "00000000-0000-4000-8000-00000000d4a8";
export const MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_5_ID = "00000000-0000-4000-8000-00000000d4a9";
export const MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_5_ID = "00000000-0000-4000-8000-00000000d4aa";
export const MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_5_ID = "00000000-0000-4000-8000-00000000d4ab";
export const MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_5_ID = "00000000-0000-4000-8000-00000000d4ac";
export const MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_5_ID =
  "00000000-0000-4000-8000-00000000d4ad";

// CIERRE - grupo (3)
export const MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_5_ID = "00000000-0000-4000-8000-00000000d4ae";
export const MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_5_ID = "00000000-0000-4000-8000-00000000d4af";
export const MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_5_ID = "00000000-0000-4000-8000-00000000d4b0";

// ===== ENCOUNTER 6 FIELDS (34 fields: same as Encounter 2 without globals) =====

// Identification (2)
export const MAE_OBS_FIELD_FECHA_ENCUENTRO_6_ID = "00000000-0000-4000-8000-00000000d4b1";
export const MAE_OBS_FIELD_EDAD_PARTICIPANTE_6_ID = "00000000-0000-4000-8000-00000000d4b2";

// CONSIGNA (4)
export const MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_6_ID = "00000000-0000-4000-8000-00000000d4b3";
export const MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_6_ID = "00000000-0000-4000-8000-00000000d4b4";
export const MAE_OBS_FIELD_NECESITA_REITERACION_6_ID = "00000000-0000-4000-8000-00000000d4b5";
export const MAE_OBS_FIELD_SE_CONCENTRA_6_ID = "00000000-0000-4000-8000-00000000d4b6";

// DESARROLLO-PRODUCCIÓN - inicio (2)
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_6_ID =
  "00000000-0000-4000-8000-00000000d4b7";
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_6_ID =
  "00000000-0000-4000-8000-00000000d4b8";

// DESARROLLO-PRODUCCIÓN - tiempo (4)
export const MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_6_ID = "00000000-0000-4000-8000-00000000d4b9";
export const MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_6_ID = "00000000-0000-4000-8000-00000000d4ba";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_6_ID =
  "00000000-0000-4000-8000-00000000d4bb";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_6_ID =
  "00000000-0000-4000-8000-00000000d4bc";

// DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
export const MAE_OBS_FIELD_EXPLORA_MATERIALES_6_ID = "00000000-0000-4000-8000-00000000d4bd";
export const MAE_OBS_FIELD_REPITE_USO_MATERIALES_6_ID = "00000000-0000-4000-8000-00000000d4be";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_6_ID = "00000000-0000-4000-8000-00000000d4bf";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_6_ID =
  "00000000-0000-4000-8000-00000000d4c0";
export const MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_6_ID = "00000000-0000-4000-8000-00000000d4c1";

// DESARROLLO-PRODUCCIÓN - creatividad (3)
export const MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_6_ID = "00000000-0000-4000-8000-00000000d4c2";
export const MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_6_ID =
  "00000000-0000-4000-8000-00000000d4c3";
export const MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_6_ID =
  "00000000-0000-4000-8000-00000000d4c4";

// DESARROLLO-PRODUCCIÓN - en grupo (5)
export const MAE_OBS_FIELD_PIDE_AYUDA_6_ID = "00000000-0000-4000-8000-00000000d4c5";
export const MAE_OBS_FIELD_SE_COMUNICA_6_ID = "00000000-0000-4000-8000-00000000d4c6";
export const MAE_OBS_FIELD_SE_AISLA_6_ID = "00000000-0000-4000-8000-00000000d4c7";
export const MAE_OBS_FIELD_AYUDA_OTROS_6_ID = "00000000-0000-4000-8000-00000000d4c8";
export const MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_6_ID = "00000000-0000-4000-8000-00000000d4c9";

// CIERRE - Implicancia afectiva (6)
export const MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_6_ID = "00000000-0000-4000-8000-00000000d4ca";
export const MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_6_ID = "00000000-0000-4000-8000-00000000d4cb";
export const MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_6_ID = "00000000-0000-4000-8000-00000000d4cc";
export const MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_6_ID = "00000000-0000-4000-8000-00000000d4cd";
export const MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_6_ID = "00000000-0000-4000-8000-00000000d4ce";
export const MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_6_ID =
  "00000000-0000-4000-8000-00000000d4cf";

// CIERRE - grupo (3)
export const MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_6_ID = "00000000-0000-4000-8000-00000000d4d0";
export const MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_6_ID = "00000000-0000-4000-8000-00000000d4d1";
export const MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_6_ID = "00000000-0000-4000-8000-00000000d4d2";

// ===== ENCOUNTER 7 FIELDS (34 fields: same as Encounter 2 without globals) =====

// Identification (2)
export const MAE_OBS_FIELD_FECHA_ENCUENTRO_7_ID = "00000000-0000-4000-8000-00000000d4d3";
export const MAE_OBS_FIELD_EDAD_PARTICIPANTE_7_ID = "00000000-0000-4000-8000-00000000d4d4";

// CONSIGNA (4)
export const MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_7_ID = "00000000-0000-4000-8000-00000000d4d5";
export const MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_7_ID = "00000000-0000-4000-8000-00000000d4d6";
export const MAE_OBS_FIELD_NECESITA_REITERACION_7_ID = "00000000-0000-4000-8000-00000000d4d7";
export const MAE_OBS_FIELD_SE_CONCENTRA_7_ID = "00000000-0000-4000-8000-00000000d4d8";

// DESARROLLO-PRODUCCIÓN - inicio (2)
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_7_ID =
  "00000000-0000-4000-8000-00000000d4d9";
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_7_ID =
  "00000000-0000-4000-8000-00000000d4da";

// DESARROLLO-PRODUCCIÓN - tiempo (4)
export const MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_7_ID = "00000000-0000-4000-8000-00000000d4db";
export const MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_7_ID = "00000000-0000-4000-8000-00000000d4dc";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_7_ID =
  "00000000-0000-4000-8000-00000000d4dd";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_7_ID =
  "00000000-0000-4000-8000-00000000d4de";

// DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
export const MAE_OBS_FIELD_EXPLORA_MATERIALES_7_ID = "00000000-0000-4000-8000-00000000d4df";
export const MAE_OBS_FIELD_REPITE_USO_MATERIALES_7_ID = "00000000-0000-4000-8000-00000000d4e0";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_7_ID = "00000000-0000-4000-8000-00000000d4e1";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_7_ID =
  "00000000-0000-4000-8000-00000000d4e2";
export const MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_7_ID = "00000000-0000-4000-8000-00000000d4e3";

// DESARROLLO-PRODUCCIÓN - creatividad (3)
export const MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_7_ID = "00000000-0000-4000-8000-00000000d4e4";
export const MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_7_ID =
  "00000000-0000-4000-8000-00000000d4e5";
export const MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_7_ID =
  "00000000-0000-4000-8000-00000000d4e6";

// DESARROLLO-PRODUCCIÓN - en grupo (5)
export const MAE_OBS_FIELD_PIDE_AYUDA_7_ID = "00000000-0000-4000-8000-00000000d4e7";
export const MAE_OBS_FIELD_SE_COMUNICA_7_ID = "00000000-0000-4000-8000-00000000d4e8";
export const MAE_OBS_FIELD_SE_AISLA_7_ID = "00000000-0000-4000-8000-00000000d4e9";
export const MAE_OBS_FIELD_AYUDA_OTROS_7_ID = "00000000-0000-4000-8000-00000000d4ea";
export const MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_7_ID = "00000000-0000-4000-8000-00000000d4eb";

// CIERRE - Implicancia afectiva (6)
export const MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_7_ID = "00000000-0000-4000-8000-00000000d4ec";
export const MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_7_ID = "00000000-0000-4000-8000-00000000d4ed";
export const MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_7_ID = "00000000-0000-4000-8000-00000000d4ee";
export const MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_7_ID = "00000000-0000-4000-8000-00000000d4ef";
export const MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_7_ID = "00000000-0000-4000-8000-00000000d4f0";
export const MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_7_ID =
  "00000000-0000-4000-8000-00000000d4f1";

// CIERRE - grupo (3)
export const MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_7_ID = "00000000-0000-4000-8000-00000000d4f2";
export const MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_7_ID = "00000000-0000-4000-8000-00000000d4f3";
export const MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_7_ID = "00000000-0000-4000-8000-00000000d4f4";

// ===== ENCOUNTER 8 FIELDS (34 fields: same as Encounter 2 without globals) =====

// Identification (2)
export const MAE_OBS_FIELD_FECHA_ENCUENTRO_8_ID = "00000000-0000-4000-8000-00000000d4f5";
export const MAE_OBS_FIELD_EDAD_PARTICIPANTE_8_ID = "00000000-0000-4000-8000-00000000d4f6";

// CONSIGNA (4)
export const MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_8_ID = "00000000-0000-4000-8000-00000000d4f7";
export const MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_8_ID = "00000000-0000-4000-8000-00000000d4f8";
export const MAE_OBS_FIELD_NECESITA_REITERACION_8_ID = "00000000-0000-4000-8000-00000000d4f9";
export const MAE_OBS_FIELD_SE_CONCENTRA_8_ID = "00000000-0000-4000-8000-00000000d4fa";

// DESARROLLO-PRODUCCIÓN - inicio (2)
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_8_ID =
  "00000000-0000-4000-8000-00000000d4fb";
export const MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_8_ID =
  "00000000-0000-4000-8000-00000000d4fc";

// DESARROLLO-PRODUCCIÓN - tiempo (4)
export const MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_8_ID = "00000000-0000-4000-8000-00000000d4fd";
export const MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_8_ID = "00000000-0000-4000-8000-00000000d4fe";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_8_ID =
  "00000000-0000-4000-8000-00000000d4ff";
export const MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_8_ID =
  "00000000-0000-4000-8000-00000000d500";

// DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
export const MAE_OBS_FIELD_EXPLORA_MATERIALES_8_ID = "00000000-0000-4000-8000-00000000d501";
export const MAE_OBS_FIELD_REPITE_USO_MATERIALES_8_ID = "00000000-0000-4000-8000-00000000d502";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_8_ID = "00000000-0000-4000-8000-00000000d503";
export const MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_8_ID =
  "00000000-0000-4000-8000-00000000d504";
export const MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_8_ID = "00000000-0000-4000-8000-00000000d505";

// DESARROLLO-PRODUCCIÓN - creatividad (3)
export const MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_8_ID = "00000000-0000-4000-8000-00000000d506";
export const MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_8_ID =
  "00000000-0000-4000-8000-00000000d507";
export const MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_8_ID =
  "00000000-0000-4000-8000-00000000d508";

// DESARROLLO-PRODUCCIÓN - en grupo (5)
export const MAE_OBS_FIELD_PIDE_AYUDA_8_ID = "00000000-0000-4000-8000-00000000d509";
export const MAE_OBS_FIELD_SE_COMUNICA_8_ID = "00000000-0000-4000-8000-00000000d50a";
export const MAE_OBS_FIELD_SE_AISLA_8_ID = "00000000-0000-4000-8000-00000000d50b";
export const MAE_OBS_FIELD_AYUDA_OTROS_8_ID = "00000000-0000-4000-8000-00000000d50c";
export const MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_8_ID = "00000000-0000-4000-8000-00000000d50d";

// CIERRE - Implicancia afectiva (6)
export const MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_8_ID = "00000000-0000-4000-8000-00000000d50e";
export const MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_8_ID = "00000000-0000-4000-8000-00000000d50f";
export const MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_8_ID = "00000000-0000-4000-8000-00000000d510";
export const MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_8_ID = "00000000-0000-4000-8000-00000000d511";
export const MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_8_ID = "00000000-0000-4000-8000-00000000d512";
export const MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_8_ID =
  "00000000-0000-4000-8000-00000000d513";

// CIERRE - grupo (3)
export const MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_8_ID = "00000000-0000-4000-8000-00000000d514";
export const MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_8_ID = "00000000-0000-4000-8000-00000000d515";
export const MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_8_ID = "00000000-0000-4000-8000-00000000d516";

export const MAE_OBS_FIELD_IDS: readonly string[] = [
  // Encounter 1 (40 fields: 34 per-encounter + 6 global)
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
  MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID,
  MAE_OBS_FIELD_CLIMA_GRUPAL_DISRUPTIVO_ID,
  MAE_OBS_FIELD_CLIMA_GRUPAL_INDIFERENTE_ID,
  MAE_OBS_FIELD_CLIMA_GRUPAL_PARTICIPATIVO_ID,
  MAE_OBS_FIELD_RESPETO_ENCUADRE_ID,
  MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID,
  // Encounter 2 (34 fields: same as Encounter 1 without globals)
  MAE_OBS_FIELD_FECHA_ENCUENTRO_2_ID,
  MAE_OBS_FIELD_EDAD_PARTICIPANTE_2_ID,
  MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_2_ID,
  MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_2_ID,
  MAE_OBS_FIELD_NECESITA_REITERACION_2_ID,
  MAE_OBS_FIELD_SE_CONCENTRA_2_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_2_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_2_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_2_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_2_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_2_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_2_ID,
  MAE_OBS_FIELD_EXPLORA_MATERIALES_2_ID,
  MAE_OBS_FIELD_REPITE_USO_MATERIALES_2_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_2_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_2_ID,
  MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_2_ID,
  MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_2_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_2_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_2_ID,
  MAE_OBS_FIELD_PIDE_AYUDA_2_ID,
  MAE_OBS_FIELD_SE_COMUNICA_2_ID,
  MAE_OBS_FIELD_SE_AISLA_2_ID,
  MAE_OBS_FIELD_AYUDA_OTROS_2_ID,
  MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_2_ID,
  MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_2_ID,
  MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_2_ID,
  MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_2_ID,
  MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_2_ID,
  MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_2_ID,
  MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_2_ID,
  MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_2_ID,
  MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_2_ID,
  MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_2_ID,
  // Encounter 3 (34 fields: same as Encounter 2 without globals)
  MAE_OBS_FIELD_FECHA_ENCUENTRO_3_ID,
  MAE_OBS_FIELD_EDAD_PARTICIPANTE_3_ID,
  MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_3_ID,
  MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_3_ID,
  MAE_OBS_FIELD_NECESITA_REITERACION_3_ID,
  MAE_OBS_FIELD_SE_CONCENTRA_3_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_3_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_3_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_3_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_3_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_3_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_3_ID,
  MAE_OBS_FIELD_EXPLORA_MATERIALES_3_ID,
  MAE_OBS_FIELD_REPITE_USO_MATERIALES_3_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_3_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_3_ID,
  MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_3_ID,
  MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_3_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_3_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_3_ID,
  MAE_OBS_FIELD_PIDE_AYUDA_3_ID,
  MAE_OBS_FIELD_SE_COMUNICA_3_ID,
  MAE_OBS_FIELD_SE_AISLA_3_ID,
  MAE_OBS_FIELD_AYUDA_OTROS_3_ID,
  MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_3_ID,
  MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_3_ID,
  MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_3_ID,
  MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_3_ID,
  MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_3_ID,
  MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_3_ID,
  MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_3_ID,
  MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_3_ID,
  MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_3_ID,
  MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_3_ID,
  // Encounter 4 (34 fields: same as Encounter 2 without globals)
  MAE_OBS_FIELD_FECHA_ENCUENTRO_4_ID,
  MAE_OBS_FIELD_EDAD_PARTICIPANTE_4_ID,
  MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_4_ID,
  MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_4_ID,
  MAE_OBS_FIELD_NECESITA_REITERACION_4_ID,
  MAE_OBS_FIELD_SE_CONCENTRA_4_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_4_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_4_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_4_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_4_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_4_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_4_ID,
  MAE_OBS_FIELD_EXPLORA_MATERIALES_4_ID,
  MAE_OBS_FIELD_REPITE_USO_MATERIALES_4_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_4_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_4_ID,
  MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_4_ID,
  MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_4_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_4_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_4_ID,
  MAE_OBS_FIELD_PIDE_AYUDA_4_ID,
  MAE_OBS_FIELD_SE_COMUNICA_4_ID,
  MAE_OBS_FIELD_SE_AISLA_4_ID,
  MAE_OBS_FIELD_AYUDA_OTROS_4_ID,
  MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_4_ID,
  MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_4_ID,
  MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_4_ID,
  MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_4_ID,
  MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_4_ID,
  MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_4_ID,
  MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_4_ID,
  MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_4_ID,
  MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_4_ID,
  MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_4_ID,
  // Encounter 5 (34 fields: same as Encounter 2 without globals)
  MAE_OBS_FIELD_FECHA_ENCUENTRO_5_ID,
  MAE_OBS_FIELD_EDAD_PARTICIPANTE_5_ID,
  MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_5_ID,
  MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_5_ID,
  MAE_OBS_FIELD_NECESITA_REITERACION_5_ID,
  MAE_OBS_FIELD_SE_CONCENTRA_5_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_5_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_5_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_5_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_5_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_5_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_5_ID,
  MAE_OBS_FIELD_EXPLORA_MATERIALES_5_ID,
  MAE_OBS_FIELD_REPITE_USO_MATERIALES_5_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_5_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_5_ID,
  MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_5_ID,
  MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_5_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_5_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_5_ID,
  MAE_OBS_FIELD_PIDE_AYUDA_5_ID,
  MAE_OBS_FIELD_SE_COMUNICA_5_ID,
  MAE_OBS_FIELD_SE_AISLA_5_ID,
  MAE_OBS_FIELD_AYUDA_OTROS_5_ID,
  MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_5_ID,
  MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_5_ID,
  MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_5_ID,
  MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_5_ID,
  MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_5_ID,
  MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_5_ID,
  MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_5_ID,
  MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_5_ID,
  MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_5_ID,
  MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_5_ID,
  // Encounter 6 (34 fields)
  MAE_OBS_FIELD_FECHA_ENCUENTRO_6_ID,
  MAE_OBS_FIELD_EDAD_PARTICIPANTE_6_ID,
  MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_6_ID,
  MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_6_ID,
  MAE_OBS_FIELD_NECESITA_REITERACION_6_ID,
  MAE_OBS_FIELD_SE_CONCENTRA_6_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_6_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_6_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_6_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_6_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_6_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_6_ID,
  MAE_OBS_FIELD_EXPLORA_MATERIALES_6_ID,
  MAE_OBS_FIELD_REPITE_USO_MATERIALES_6_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_6_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_6_ID,
  MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_6_ID,
  MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_6_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_6_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_6_ID,
  MAE_OBS_FIELD_PIDE_AYUDA_6_ID,
  MAE_OBS_FIELD_SE_COMUNICA_6_ID,
  MAE_OBS_FIELD_SE_AISLA_6_ID,
  MAE_OBS_FIELD_AYUDA_OTROS_6_ID,
  MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_6_ID,
  MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_6_ID,
  MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_6_ID,
  MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_6_ID,
  MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_6_ID,
  MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_6_ID,
  MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_6_ID,
  MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_6_ID,
  MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_6_ID,
  MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_6_ID,
  // Encounter 7 (34 fields)
  MAE_OBS_FIELD_FECHA_ENCUENTRO_7_ID,
  MAE_OBS_FIELD_EDAD_PARTICIPANTE_7_ID,
  MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_7_ID,
  MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_7_ID,
  MAE_OBS_FIELD_NECESITA_REITERACION_7_ID,
  MAE_OBS_FIELD_SE_CONCENTRA_7_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_7_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_7_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_7_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_7_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_7_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_7_ID,
  MAE_OBS_FIELD_EXPLORA_MATERIALES_7_ID,
  MAE_OBS_FIELD_REPITE_USO_MATERIALES_7_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_7_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_7_ID,
  MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_7_ID,
  MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_7_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_7_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_7_ID,
  MAE_OBS_FIELD_PIDE_AYUDA_7_ID,
  MAE_OBS_FIELD_SE_COMUNICA_7_ID,
  MAE_OBS_FIELD_SE_AISLA_7_ID,
  MAE_OBS_FIELD_AYUDA_OTROS_7_ID,
  MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_7_ID,
  MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_7_ID,
  MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_7_ID,
  MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_7_ID,
  MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_7_ID,
  MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_7_ID,
  MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_7_ID,
  MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_7_ID,
  MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_7_ID,
  MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_7_ID,
  // Encounter 8 (34 fields)
  MAE_OBS_FIELD_FECHA_ENCUENTRO_8_ID,
  MAE_OBS_FIELD_EDAD_PARTICIPANTE_8_ID,
  MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_8_ID,
  MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_8_ID,
  MAE_OBS_FIELD_NECESITA_REITERACION_8_ID,
  MAE_OBS_FIELD_SE_CONCENTRA_8_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_8_ID,
  MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_8_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_8_ID,
  MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_8_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_8_ID,
  MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_8_ID,
  MAE_OBS_FIELD_EXPLORA_MATERIALES_8_ID,
  MAE_OBS_FIELD_REPITE_USO_MATERIALES_8_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_8_ID,
  MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_8_ID,
  MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_8_ID,
  MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_8_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_8_ID,
  MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_8_ID,
  MAE_OBS_FIELD_PIDE_AYUDA_8_ID,
  MAE_OBS_FIELD_SE_COMUNICA_8_ID,
  MAE_OBS_FIELD_SE_AISLA_8_ID,
  MAE_OBS_FIELD_AYUDA_OTROS_8_ID,
  MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_8_ID,
  MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_8_ID,
  MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_8_ID,
  MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_8_ID,
  MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_8_ID,
  MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_8_ID,
  MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_8_ID,
  MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_8_ID,
  MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_8_ID,
  MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_8_ID,
] as const;

type MaeObsFieldSeed = Omit<Field, "createdAt" | "updatedAt" | "archivedAt">;

export const MAE_OBS_FIELD_SEEDS: readonly MaeObsFieldSeed[] = [
  // ===== ENCOUNTER 1 FIELDS (38 fields) =====
  // Identification (2)
  {
    id: MAE_OBS_FIELD_FECHA_ENCUENTRO_1_ID,
    type: "date",
    key: "mae_obs_fecha_encuentro_1",
    label: "Fecha del encuentro 1",
    required: true,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_EDAD_PARTICIPANTE_1_ID,
    type: "number",
    key: "mae_obs_edad_participante_1",
    label: "Edad del participante",
    required: true,
    helpText: "",
    config: { min: 0, max: 18 },
  },
  // CONSIGNA (4)
  {
    id: MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_1_ID,
    type: "boolean",
    key: "mae_obs_la_toma_en_cuenta_1",
    label: "La toma en cuenta",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_1_ID,
    type: "boolean",
    key: "mae_obs_trae_emergente_propio_1",
    label: "Trae un emergente propio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_NECESITA_REITERACION_1_ID,
    type: "boolean",
    key: "mae_obs_necesita_reiteracion_1",
    label: "Necesita reiteración",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_CONCENTRA_1_ID,
    type: "boolean",
    key: "mae_obs_se_concentra_1",
    label: "Se concentra",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - inicio (2)
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_1_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_motivado_1",
    label: "Inicia la participación motivado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_1_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_indiferente_1",
    label: "Inicia la participación indiferente",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - tiempo (4)
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_1_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_dilatado_1",
    label: "Tiempo de inicio dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_1_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_esperable_1",
    label: "Tiempo de inicio esperable",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_1_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_dilatado_1",
    label: "Tiempo de realización total dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_1_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_esperable_1",
    label: "Tiempo de realización total esperable",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
  {
    id: MAE_OBS_FIELD_EXPLORA_MATERIALES_1_ID,
    type: "boolean",
    key: "mae_obs_explora_materiales_1",
    label: "Explora los materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_REPITE_USO_MATERIALES_1_ID,
    type: "boolean",
    key: "mae_obs_repite_uso_materiales_1",
    label: "Repite el uso de materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_1_ID,
    type: "boolean",
    key: "mae_obs_dificultad_manipulacion_1",
    label: "Manifiesta dificultad en la manipulación",
    required: false,
    helpText: "Si marca sí, debe especificar cuál dificultad",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_1_ID,
    type: "text",
    key: "mae_obs_dificultad_manipulacion_cual_1",
    label: "¿Cuál dificultad en la manipulación?",
    required: false,
    helpText: "Solo visible si marca dificultad en la manipulación",
    config: { maxLength: 255 },
  },
  {
    id: MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_1_ID,
    type: "boolean",
    key: "mae_obs_pide_otros_materiales_1",
    label: "Pide otros materiales",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - creatividad (3)
  {
    id: MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_1_ID,
    type: "boolean",
    key: "mae_obs_pulsion_creadora_presente_1",
    label: "Pulsión creadora presente",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_1_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_concentracion_trabajo_1",
    label: "Buen nivel de concentración y trabajo",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_1_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_tolerancia_frustracion_1",
    label: "Buen nivel de tolerancia a la frustración",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - en grupo (5)
  {
    id: MAE_OBS_FIELD_PIDE_AYUDA_1_ID,
    type: "boolean",
    key: "mae_obs_pide_ayuda_1",
    label: "Pide ayuda",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_COMUNICA_1_ID,
    type: "boolean",
    key: "mae_obs_se_comunica_1",
    label: "Se comunica",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_AISLA_1_ID,
    type: "boolean",
    key: "mae_obs_se_aisla_1",
    label: "Se aisla",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_AYUDA_OTROS_1_ID,
    type: "boolean",
    key: "mae_obs_ayuda_otros_1",
    label: "Ayuda a otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_1_ID,
    type: "boolean",
    key: "mae_obs_vinculo_favorable_at_1",
    label: "Establece vínculo favorable con el AT",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - Implicancia afectiva (6)
  {
    id: MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_1_ID,
    type: "boolean",
    key: "mae_obs_acepta_propia_obra_1",
    label: "Acepta su propia obra",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_1_ID,
    type: "boolean",
    key: "mae_obs_pone_palabras_lo_producido_1",
    label: "Puede poner en palabras lo producido",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_1_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_denotativas_1",
    label: "Realiza asociaciones denotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_1_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_connotativas_1",
    label: "Realiza asociaciones connotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_1_ID,
    type: "boolean",
    key: "mae_obs_cambios_humor_inicio_1",
    label: "Manifiesta cambios de humor con respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_1_ID,
    type: "boolean",
    key: "mae_obs_cambios_actitud_corporal_inicio_1",
    label: "Manifiesta cambios de actitud corporal respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - grupo (3)
  {
    id: MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_1_ID,
    type: "boolean",
    key: "mae_obs_respeta_palabra_otros_1",
    label: "Respeta la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_1_ID,
    type: "boolean",
    key: "mae_obs_indiferente_palabra_otros_1",
    label: "Es indiferente ante la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_1_ID,
    type: "boolean",
    key: "mae_obs_logra_esperar_turno_1",
    label: "Logra esperar su turno",
    required: false,
    helpText: "",
    config: {},
  },
  // GLOBAL FIELDS (6) - only in Encounter 1
  {
    id: MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID,
    type: "boolean",
    key: "mae_obs_clima_grupal_favorecedor",
    label: "Clima grupal favorecedor",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CLIMA_GRUPAL_DISRUPTIVO_ID,
    type: "boolean",
    key: "mae_obs_clima_grupal_disruptivo",
    label: "Clima grupal disruptivo",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CLIMA_GRUPAL_INDIFERENTE_ID,
    type: "boolean",
    key: "mae_obs_clima_grupal_indiferente",
    label: "Clima grupal indiferente",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CLIMA_GRUPAL_PARTICIPATIVO_ID,
    type: "boolean",
    key: "mae_obs_clima_grupal_participativo",
    label: "Clima grupal participativo",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_RESPETO_ENCUADRE_ID,
    type: "boolean",
    key: "mae_obs_respeto_encuadre",
    label: "Respeto al encuadre",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID,
    type: "longText",
    key: "mae_obs_observaciones_generales",
    label: "Observaciones generales",
    required: false,
    helpText: "",
    config: { maxLength: 5000 },
  },
  // ===== ENCOUNTER 2 FIELDS (33 fields) =====
  // Identification (2)
  {
    id: MAE_OBS_FIELD_FECHA_ENCUENTRO_2_ID,
    type: "date",
    key: "mae_obs_fecha_encuentro_2",
    label: "Fecha del encuentro 2",
    required: true,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_EDAD_PARTICIPANTE_2_ID,
    type: "number",
    key: "mae_obs_edad_participante_2",
    label: "Edad del participante",
    required: true,
    helpText: "",
    config: { min: 0, max: 18 },
  },
  // CONSIGNA (4)
  {
    id: MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_2_ID,
    type: "boolean",
    key: "mae_obs_la_toma_en_cuenta_2",
    label: "La toma en cuenta",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_2_ID,
    type: "boolean",
    key: "mae_obs_trae_emergente_propio_2",
    label: "Trae un emergente propio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_NECESITA_REITERACION_2_ID,
    type: "boolean",
    key: "mae_obs_necesita_reiteracion_2",
    label: "Necesita reiteración",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_CONCENTRA_2_ID,
    type: "boolean",
    key: "mae_obs_se_concentra_2",
    label: "Se concentra",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - inicio (2)
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_2_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_motivado_2",
    label: "Inicia la participación motivado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_2_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_indiferente_2",
    label: "Inicia la participación indiferente",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - tiempo (4)
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_2_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_dilatado_2",
    label: "Tiempo de inicio dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_2_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_esperable_2",
    label: "Tiempo de inicio esperable",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_2_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_dilatado_2",
    label: "Tiempo de realización total dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_2_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_esperable_2",
    label: "Tiempo de realización total esperable",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
  {
    id: MAE_OBS_FIELD_EXPLORA_MATERIALES_2_ID,
    type: "boolean",
    key: "mae_obs_explora_materiales_2",
    label: "Explora los materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_REPITE_USO_MATERIALES_2_ID,
    type: "boolean",
    key: "mae_obs_repite_uso_materiales_2",
    label: "Repite el uso de materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_2_ID,
    type: "boolean",
    key: "mae_obs_dificultad_manipulacion_2",
    label: "Manifiesta dificultad en la manipulación",
    required: false,
    helpText: "Si marca sí, debe especificar cuál dificultad",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_2_ID,
    type: "text",
    key: "mae_obs_dificultad_manipulacion_cual_2",
    label: "¿Cuál dificultad en la manipulación?",
    required: false,
    helpText: "Solo visible si marca dificultad en la manipulación",
    config: { maxLength: 255 },
  },
  {
    id: MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_2_ID,
    type: "boolean",
    key: "mae_obs_pide_otros_materiales_2",
    label: "Pide otros materiales",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - creatividad (3)
  {
    id: MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_2_ID,
    type: "boolean",
    key: "mae_obs_pulsion_creadora_presente_2",
    label: "Pulsión creadora presente",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_2_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_concentracion_trabajo_2",
    label: "Buen nivel de concentración y trabajo",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_2_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_tolerancia_frustracion_2",
    label: "Buen nivel de tolerancia a la frustración",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - en grupo (5)
  {
    id: MAE_OBS_FIELD_PIDE_AYUDA_2_ID,
    type: "boolean",
    key: "mae_obs_pide_ayuda_2",
    label: "Pide ayuda",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_COMUNICA_2_ID,
    type: "boolean",
    key: "mae_obs_se_comunica_2",
    label: "Se comunica",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_AISLA_2_ID,
    type: "boolean",
    key: "mae_obs_se_aisla_2",
    label: "Se aisla",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_AYUDA_OTROS_2_ID,
    type: "boolean",
    key: "mae_obs_ayuda_otros_2",
    label: "Ayuda a otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_2_ID,
    type: "boolean",
    key: "mae_obs_vinculo_favorable_at_2",
    label: "Establece vínculo favorable con el AT",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - Implicancia afectiva (6)
  {
    id: MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_2_ID,
    type: "boolean",
    key: "mae_obs_acepta_propia_obra_2",
    label: "Acepta su propia obra",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_2_ID,
    type: "boolean",
    key: "mae_obs_pone_palabras_lo_producido_2",
    label: "Puede poner en palabras lo producido",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_2_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_denotativas_2",
    label: "Realiza asociaciones denotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_2_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_connotativas_2",
    label: "Realiza asociaciones connotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_2_ID,
    type: "boolean",
    key: "mae_obs_cambios_humor_inicio_2",
    label: "Manifiesta cambios de humor con respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_2_ID,
    type: "boolean",
    key: "mae_obs_cambios_actitud_corporal_inicio_2",
    label: "Manifiesta cambios de actitud corporal respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - grupo (3)
  {
    id: MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_2_ID,
    type: "boolean",
    key: "mae_obs_respeta_palabra_otros_2",
    label: "Respeta la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_2_ID,
    type: "boolean",
    key: "mae_obs_indiferente_palabra_otros_2",
    label: "Es indiferente ante la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_2_ID,
    type: "boolean",
    key: "mae_obs_logra_esperar_turno_2",
    label: "Logra esperar su turno",
    required: false,
    helpText: "",
    config: {},
  },
  // ===== ENCOUNTER 3 FIELDS (34 fields) =====
  // Identification (2)
  {
    id: MAE_OBS_FIELD_FECHA_ENCUENTRO_3_ID,
    type: "date",
    key: "mae_obs_fecha_encuentro_3",
    label: "Fecha del encuentro 3",
    required: true,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_EDAD_PARTICIPANTE_3_ID,
    type: "number",
    key: "mae_obs_edad_participante_3",
    label: "Edad del participante",
    required: true,
    helpText: "",
    config: { min: 0, max: 18 },
  },
  // CONSIGNA (4)
  {
    id: MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_3_ID,
    type: "boolean",
    key: "mae_obs_la_toma_en_cuenta_3",
    label: "La toma en cuenta",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_3_ID,
    type: "boolean",
    key: "mae_obs_trae_emergente_propio_3",
    label: "Trae un emergente propio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_NECESITA_REITERACION_3_ID,
    type: "boolean",
    key: "mae_obs_necesita_reiteracion_3",
    label: "Necesita reiteración",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_CONCENTRA_3_ID,
    type: "boolean",
    key: "mae_obs_se_concentra_3",
    label: "Se concentra",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - inicio (2)
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_3_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_motivado_3",
    label: "Inicia la participación motivado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_3_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_indiferente_3",
    label: "Inicia la participación indiferente",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - tiempo (4)
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_3_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_dilatado_3",
    label: "Tiempo de inicio dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_3_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_esperable_3",
    label: "Tiempo de inicio esperable",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_3_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_dilatado_3",
    label: "Tiempo de realización total dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_3_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_esperable_3",
    label: "Tiempo de realización total esperable",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
  {
    id: MAE_OBS_FIELD_EXPLORA_MATERIALES_3_ID,
    type: "boolean",
    key: "mae_obs_explora_materiales_3",
    label: "Explora los materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_REPITE_USO_MATERIALES_3_ID,
    type: "boolean",
    key: "mae_obs_repite_uso_materiales_3",
    label: "Repite el uso de materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_3_ID,
    type: "boolean",
    key: "mae_obs_dificultad_manipulacion_3",
    label: "Manifiesta dificultad en la manipulación",
    required: false,
    helpText: "Si marca sí, debe especificar cuál dificultad",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_3_ID,
    type: "text",
    key: "mae_obs_dificultad_manipulacion_cual_3",
    label: "¿Cuál dificultad en la manipulación?",
    required: false,
    helpText: "Solo visible si marca dificultad en la manipulación",
    config: { maxLength: 255 },
  },
  {
    id: MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_3_ID,
    type: "boolean",
    key: "mae_obs_pide_otros_materiales_3",
    label: "Pide otros materiales",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - creatividad (3)
  {
    id: MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_3_ID,
    type: "boolean",
    key: "mae_obs_pulsion_creadora_presente_3",
    label: "Pulsión creadora presente",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_3_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_concentracion_trabajo_3",
    label: "Buen nivel de concentración y trabajo",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_3_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_tolerancia_frustracion_3",
    label: "Buen nivel de tolerancia a la frustración",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - en grupo (5)
  {
    id: MAE_OBS_FIELD_PIDE_AYUDA_3_ID,
    type: "boolean",
    key: "mae_obs_pide_ayuda_3",
    label: "Pide ayuda",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_COMUNICA_3_ID,
    type: "boolean",
    key: "mae_obs_se_comunica_3",
    label: "Se comunica",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_AISLA_3_ID,
    type: "boolean",
    key: "mae_obs_se_aisla_3",
    label: "Se aisla",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_AYUDA_OTROS_3_ID,
    type: "boolean",
    key: "mae_obs_ayuda_otros_3",
    label: "Ayuda a otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_3_ID,
    type: "boolean",
    key: "mae_obs_vinculo_favorable_at_3",
    label: "Establece vínculo favorable con el AT",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - Implicancia afectiva (6)
  {
    id: MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_3_ID,
    type: "boolean",
    key: "mae_obs_acepta_propia_obra_3",
    label: "Acepta su propia obra",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_3_ID,
    type: "boolean",
    key: "mae_obs_pone_palabras_lo_producido_3",
    label: "Puede poner en palabras lo producido",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_3_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_denotativas_3",
    label: "Realiza asociaciones denotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_3_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_connotativas_3",
    label: "Realiza asociaciones connotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_3_ID,
    type: "boolean",
    key: "mae_obs_cambios_humor_inicio_3",
    label: "Manifiesta cambios de humor con respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_3_ID,
    type: "boolean",
    key: "mae_obs_cambios_actitud_corporal_inicio_3",
    label: "Manifiesta cambios de actitud corporal respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - grupo (3)
  {
    id: MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_3_ID,
    type: "boolean",
    key: "mae_obs_respeta_palabra_otros_3",
    label: "Respeta la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_3_ID,
    type: "boolean",
    key: "mae_obs_indiferente_palabra_otros_3",
    label: "Es indiferente ante la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_3_ID,
    type: "boolean",
    key: "mae_obs_logra_esperar_turno_3",
    label: "Logra esperar su turno",
    required: false,
    helpText: "",
    config: {},
  },
  // ===== ENCOUNTER 4 FIELDS (34 fields) =====
  // Identification (2)
  {
    id: MAE_OBS_FIELD_FECHA_ENCUENTRO_4_ID,
    type: "date",
    key: "mae_obs_fecha_encuentro_4",
    label: "Fecha del encuentro 4",
    required: true,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_EDAD_PARTICIPANTE_4_ID,
    type: "number",
    key: "mae_obs_edad_participante_4",
    label: "Edad del participante",
    required: true,
    helpText: "",
    config: { min: 0, max: 18 },
  },
  // CONSIGNA (4)
  {
    id: MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_4_ID,
    type: "boolean",
    key: "mae_obs_la_toma_en_cuenta_4",
    label: "La toma en cuenta",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_4_ID,
    type: "boolean",
    key: "mae_obs_trae_emergente_propio_4",
    label: "Trae un emergente propio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_NECESITA_REITERACION_4_ID,
    type: "boolean",
    key: "mae_obs_necesita_reiteracion_4",
    label: "Necesita reiteración",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_CONCENTRA_4_ID,
    type: "boolean",
    key: "mae_obs_se_concentra_4",
    label: "Se concentra",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - inicio (2)
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_4_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_motivado_4",
    label: "Inicia la participación motivado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_4_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_indiferente_4",
    label: "Inicia la participación indiferente",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - tiempo (4)
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_4_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_dilatado_4",
    label: "Tiempo de inicio dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_4_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_esperable_4",
    label: "Tiempo de inicio esperable",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_4_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_dilatado_4",
    label: "Tiempo de realización total dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_4_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_esperable_4",
    label: "Tiempo de realización total esperable",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
  {
    id: MAE_OBS_FIELD_EXPLORA_MATERIALES_4_ID,
    type: "boolean",
    key: "mae_obs_explora_materiales_4",
    label: "Explora los materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_REPITE_USO_MATERIALES_4_ID,
    type: "boolean",
    key: "mae_obs_repite_uso_materiales_4",
    label: "Repite el uso de materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_4_ID,
    type: "boolean",
    key: "mae_obs_dificultad_manipulacion_4",
    label: "Manifiesta dificultad en la manipulación",
    required: false,
    helpText: "Si marca sí, debe especificar cuál dificultad",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_4_ID,
    type: "text",
    key: "mae_obs_dificultad_manipulacion_cual_4",
    label: "¿Cuál dificultad en la manipulación?",
    required: false,
    helpText: "Solo visible si marca dificultad en la manipulación",
    config: { maxLength: 255 },
  },
  {
    id: MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_4_ID,
    type: "boolean",
    key: "mae_obs_pide_otros_materiales_4",
    label: "Pide otros materiales",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - creatividad (3)
  {
    id: MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_4_ID,
    type: "boolean",
    key: "mae_obs_pulsion_creadora_presente_4",
    label: "Pulsión creadora presente",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_4_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_concentracion_trabajo_4",
    label: "Buen nivel de concentración y trabajo",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_4_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_tolerancia_frustracion_4",
    label: "Buen nivel de tolerancia a la frustración",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - en grupo (5)
  {
    id: MAE_OBS_FIELD_PIDE_AYUDA_4_ID,
    type: "boolean",
    key: "mae_obs_pide_ayuda_4",
    label: "Pide ayuda",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_COMUNICA_4_ID,
    type: "boolean",
    key: "mae_obs_se_comunica_4",
    label: "Se comunica",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_AISLA_4_ID,
    type: "boolean",
    key: "mae_obs_se_aisla_4",
    label: "Se aisla",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_AYUDA_OTROS_4_ID,
    type: "boolean",
    key: "mae_obs_ayuda_otros_4",
    label: "Ayuda a otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_4_ID,
    type: "boolean",
    key: "mae_obs_vinculo_favorable_at_4",
    label: "Establece vínculo favorable con el AT",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - Implicancia afectiva (6)
  {
    id: MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_4_ID,
    type: "boolean",
    key: "mae_obs_acepta_propia_obra_4",
    label: "Acepta su propia obra",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_4_ID,
    type: "boolean",
    key: "mae_obs_pone_palabras_lo_producido_4",
    label: "Puede poner en palabras lo producido",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_4_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_denotativas_4",
    label: "Realiza asociaciones denotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_4_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_connotativas_4",
    label: "Realiza asociaciones connotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_4_ID,
    type: "boolean",
    key: "mae_obs_cambios_humor_inicio_4",
    label: "Manifiesta cambios de humor con respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_4_ID,
    type: "boolean",
    key: "mae_obs_cambios_actitud_corporal_inicio_4",
    label: "Manifiesta cambios de actitud corporal respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - grupo (3)
  {
    id: MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_4_ID,
    type: "boolean",
    key: "mae_obs_respeta_palabra_otros_4",
    label: "Respeta la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_4_ID,
    type: "boolean",
    key: "mae_obs_indiferente_palabra_otros_4",
    label: "Es indiferente ante la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_4_ID,
    type: "boolean",
    key: "mae_obs_logra_esperar_turno_4",
    label: "Logra esperar su turno",
    required: false,
    helpText: "",
    config: {},
  },
  // ===== ENCOUNTER 5 FIELDS (34 fields) =====
  // Identification (2)
  {
    id: MAE_OBS_FIELD_FECHA_ENCUENTRO_5_ID,
    type: "date",
    key: "mae_obs_fecha_encuentro_5",
    label: "Fecha del encuentro 5",
    required: true,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_EDAD_PARTICIPANTE_5_ID,
    type: "number",
    key: "mae_obs_edad_participante_5",
    label: "Edad del participante",
    required: true,
    helpText: "",
    config: { min: 0, max: 18 },
  },
  // CONSIGNA (4)
  {
    id: MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_5_ID,
    type: "boolean",
    key: "mae_obs_la_toma_en_cuenta_5",
    label: "La toma en cuenta",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_5_ID,
    type: "boolean",
    key: "mae_obs_trae_emergente_propio_5",
    label: "Trae un emergente propio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_NECESITA_REITERACION_5_ID,
    type: "boolean",
    key: "mae_obs_necesita_reiteracion_5",
    label: "Necesita reiteración",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_CONCENTRA_5_ID,
    type: "boolean",
    key: "mae_obs_se_concentra_5",
    label: "Se concentra",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - inicio (2)
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_5_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_motivado_5",
    label: "Inicia la participación motivado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_5_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_indiferente_5",
    label: "Inicia la participación indiferente",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - tiempo (4)
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_5_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_dilatado_5",
    label: "Tiempo de inicio dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_5_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_esperable_5",
    label: "Tiempo de inicio esperable",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_5_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_dilatado_5",
    label: "Tiempo de realización total dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_5_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_esperable_5",
    label: "Tiempo de realización total esperable",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
  {
    id: MAE_OBS_FIELD_EXPLORA_MATERIALES_5_ID,
    type: "boolean",
    key: "mae_obs_explora_materiales_5",
    label: "Explora los materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_REPITE_USO_MATERIALES_5_ID,
    type: "boolean",
    key: "mae_obs_repite_uso_materiales_5",
    label: "Repite el uso de materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_5_ID,
    type: "boolean",
    key: "mae_obs_dificultad_manipulacion_5",
    label: "Manifiesta dificultad en la manipulación",
    required: false,
    helpText: "Si marca sí, debe especificar cuál dificultad",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_5_ID,
    type: "text",
    key: "mae_obs_dificultad_manipulacion_cual_5",
    label: "¿Cuál dificultad en la manipulación?",
    required: false,
    helpText: "Solo visible si marca dificultad en la manipulación",
    config: { maxLength: 255 },
  },
  {
    id: MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_5_ID,
    type: "boolean",
    key: "mae_obs_pide_otros_materiales_5",
    label: "Pide otros materiales",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - creatividad (3)
  {
    id: MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_5_ID,
    type: "boolean",
    key: "mae_obs_pulsion_creadora_presente_5",
    label: "Pulsión creadora presente",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_5_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_concentracion_trabajo_5",
    label: "Buen nivel de concentración y trabajo",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_5_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_tolerancia_frustracion_5",
    label: "Buen nivel de tolerancia a la frustración",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - en grupo (5)
  {
    id: MAE_OBS_FIELD_PIDE_AYUDA_5_ID,
    type: "boolean",
    key: "mae_obs_pide_ayuda_5",
    label: "Pide ayuda",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_COMUNICA_5_ID,
    type: "boolean",
    key: "mae_obs_se_comunica_5",
    label: "Se comunica",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_AISLA_5_ID,
    type: "boolean",
    key: "mae_obs_se_aisla_5",
    label: "Se aisla",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_AYUDA_OTROS_5_ID,
    type: "boolean",
    key: "mae_obs_ayuda_otros_5",
    label: "Ayuda a otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_5_ID,
    type: "boolean",
    key: "mae_obs_vinculo_favorable_at_5",
    label: "Establece vínculo favorable con el AT",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - Implicancia afectiva (6)
  {
    id: MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_5_ID,
    type: "boolean",
    key: "mae_obs_acepta_propia_obra_5",
    label: "Acepta su propia obra",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_5_ID,
    type: "boolean",
    key: "mae_obs_pone_palabras_lo_producido_5",
    label: "Puede poner en palabras lo producido",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_5_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_denotativas_5",
    label: "Realiza asociaciones denotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_5_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_connotativas_5",
    label: "Realiza asociaciones connotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_5_ID,
    type: "boolean",
    key: "mae_obs_cambios_humor_inicio_5",
    label: "Manifiesta cambios de humor con respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_5_ID,
    type: "boolean",
    key: "mae_obs_cambios_actitud_corporal_inicio_5",
    label: "Manifiesta cambios de actitud corporal respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - grupo (3)
  {
    id: MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_5_ID,
    type: "boolean",
    key: "mae_obs_respeta_palabra_otros_5",
    label: "Respeta la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_5_ID,
    type: "boolean",
    key: "mae_obs_indiferente_palabra_otros_5",
    label: "Es indiferente ante la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_5_ID,
    type: "boolean",
    key: "mae_obs_logra_esperar_turno_5",
    label: "Logra esperar su turno",
    required: false,
    helpText: "",
    config: {},
  },
  // ===== ENCOUNTER 6 FIELDS (34 fields) =====
  // Identification (2)
  {
    id: MAE_OBS_FIELD_FECHA_ENCUENTRO_6_ID,
    type: "date",
    key: "mae_obs_fecha_encuentro_6",
    label: "Fecha del encuentro 6",
    required: true,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_EDAD_PARTICIPANTE_6_ID,
    type: "number",
    key: "mae_obs_edad_participante_6",
    label: "Edad del participante",
    required: true,
    helpText: "",
    config: { min: 0, max: 18 },
  },
  // CONSIGNA (4)
  {
    id: MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_6_ID,
    type: "boolean",
    key: "mae_obs_la_toma_en_cuenta_6",
    label: "La toma en cuenta",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_6_ID,
    type: "boolean",
    key: "mae_obs_trae_emergente_propio_6",
    label: "Trae un emergente propio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_NECESITA_REITERACION_6_ID,
    type: "boolean",
    key: "mae_obs_necesita_reiteracion_6",
    label: "Necesita reiteración",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_CONCENTRA_6_ID,
    type: "boolean",
    key: "mae_obs_se_concentra_6",
    label: "Se concentra",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - inicio (2)
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_6_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_motivado_6",
    label: "Inicia la participación motivado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_6_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_indiferente_6",
    label: "Inicia la participación indiferente",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - tiempo (4)
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_6_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_dilatado_6",
    label: "Tiempo de inicio dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_6_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_esperable_6",
    label: "Tiempo de inicio esperable",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_6_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_dilatado_6",
    label: "Tiempo de realización total dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_6_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_esperable_6",
    label: "Tiempo de realización total esperable",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
  {
    id: MAE_OBS_FIELD_EXPLORA_MATERIALES_6_ID,
    type: "boolean",
    key: "mae_obs_explora_materiales_6",
    label: "Explora los materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_REPITE_USO_MATERIALES_6_ID,
    type: "boolean",
    key: "mae_obs_repite_uso_materiales_6",
    label: "Repite el uso de materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_6_ID,
    type: "boolean",
    key: "mae_obs_dificultad_manipulacion_6",
    label: "Manifiesta dificultad en la manipulación",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_6_ID,
    type: "text",
    key: "mae_obs_dificultad_manipulacion_cual_6",
    label: "¿Cuál dificultad en la manipulación?",
    required: false,
    helpText: "",
    config: { maxLength: 255 },
  },
  {
    id: MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_6_ID,
    type: "boolean",
    key: "mae_obs_pide_otros_materiales_6",
    label: "Pide otros materiales",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - creatividad (3)
  {
    id: MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_6_ID,
    type: "boolean",
    key: "mae_obs_pulsion_creadora_presente_6",
    label: "Pulsión creadora presente",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_6_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_concentracion_trabajo_6",
    label: "Buen nivel de concentración y trabajo",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_6_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_tolerancia_frustracion_6",
    label: "Buen nivel de tolerancia a la frustración",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - en grupo (5)
  {
    id: MAE_OBS_FIELD_PIDE_AYUDA_6_ID,
    type: "boolean",
    key: "mae_obs_pide_ayuda_6",
    label: "Pide ayuda",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_COMUNICA_6_ID,
    type: "boolean",
    key: "mae_obs_se_comunica_6",
    label: "Se comunica",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_AISLA_6_ID,
    type: "boolean",
    key: "mae_obs_se_aisla_6",
    label: "Se aisla",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_AYUDA_OTROS_6_ID,
    type: "boolean",
    key: "mae_obs_ayuda_otros_6",
    label: "Ayuda a otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_6_ID,
    type: "boolean",
    key: "mae_obs_vinculo_favorable_at_6",
    label: "Establece vínculo favorable con el AT",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - Implicancia afectiva (6)
  {
    id: MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_6_ID,
    type: "boolean",
    key: "mae_obs_acepta_propia_obra_6",
    label: "Acepta su propia obra",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_6_ID,
    type: "boolean",
    key: "mae_obs_pone_palabras_lo_producido_6",
    label: "Puede poner en palabras lo producido",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_6_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_denotativas_6",
    label: "Realiza asociaciones denotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_6_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_connotativas_6",
    label: "Realiza asociaciones connotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_6_ID,
    type: "boolean",
    key: "mae_obs_cambios_humor_inicio_6",
    label: "Manifiesta cambios de humor con respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_6_ID,
    type: "boolean",
    key: "mae_obs_cambios_actitud_corporal_inicio_6",
    label: "Manifiesta cambios de actitud corporal respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - grupo (3)
  {
    id: MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_6_ID,
    type: "boolean",
    key: "mae_obs_respeta_palabra_otros_6",
    label: "Respeta la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_6_ID,
    type: "boolean",
    key: "mae_obs_indiferente_palabra_otros_6",
    label: "Es indiferente ante la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_6_ID,
    type: "boolean",
    key: "mae_obs_logra_esperar_turno_6",
    label: "Logra esperar su turno",
    required: false,
    helpText: "",
    config: {},
  },
  // ===== ENCOUNTER 7 FIELDS (34 fields) =====
  // Identification (2)
  {
    id: MAE_OBS_FIELD_FECHA_ENCUENTRO_7_ID,
    type: "date",
    key: "mae_obs_fecha_encuentro_7",
    label: "Fecha del encuentro 7",
    required: true,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_EDAD_PARTICIPANTE_7_ID,
    type: "number",
    key: "mae_obs_edad_participante_7",
    label: "Edad del participante",
    required: true,
    helpText: "",
    config: { min: 0, max: 18 },
  },
  // CONSIGNA (4)
  {
    id: MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_7_ID,
    type: "boolean",
    key: "mae_obs_la_toma_en_cuenta_7",
    label: "La toma en cuenta",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_7_ID,
    type: "boolean",
    key: "mae_obs_trae_emergente_propio_7",
    label: "Trae un emergente propio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_NECESITA_REITERACION_7_ID,
    type: "boolean",
    key: "mae_obs_necesita_reiteracion_7",
    label: "Necesita reiteración",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_CONCENTRA_7_ID,
    type: "boolean",
    key: "mae_obs_se_concentra_7",
    label: "Se concentra",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - inicio (2)
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_7_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_motivado_7",
    label: "Inicia la participación motivado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_7_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_indiferente_7",
    label: "Inicia la participación indiferente",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - tiempo (4)
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_7_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_dilatado_7",
    label: "Tiempo de inicio dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_7_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_esperable_7",
    label: "Tiempo de inicio esperable",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_7_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_dilatado_7",
    label: "Tiempo de realización total dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_7_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_esperable_7",
    label: "Tiempo de realización total esperable",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
  {
    id: MAE_OBS_FIELD_EXPLORA_MATERIALES_7_ID,
    type: "boolean",
    key: "mae_obs_explora_materiales_7",
    label: "Explora los materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_REPITE_USO_MATERIALES_7_ID,
    type: "boolean",
    key: "mae_obs_repite_uso_materiales_7",
    label: "Repite el uso de materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_7_ID,
    type: "boolean",
    key: "mae_obs_dificultad_manipulacion_7",
    label: "Manifiesta dificultad en la manipulación",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_7_ID,
    type: "text",
    key: "mae_obs_dificultad_manipulacion_cual_7",
    label: "¿Cuál dificultad en la manipulación?",
    required: false,
    helpText: "",
    config: { maxLength: 255 },
  },
  {
    id: MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_7_ID,
    type: "boolean",
    key: "mae_obs_pide_otros_materiales_7",
    label: "Pide otros materiales",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - creatividad (3)
  {
    id: MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_7_ID,
    type: "boolean",
    key: "mae_obs_pulsion_creadora_presente_7",
    label: "Pulsión creadora presente",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_7_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_concentracion_trabajo_7",
    label: "Buen nivel de concentración y trabajo",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_7_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_tolerancia_frustracion_7",
    label: "Buen nivel de tolerancia a la frustración",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - en grupo (5)
  {
    id: MAE_OBS_FIELD_PIDE_AYUDA_7_ID,
    type: "boolean",
    key: "mae_obs_pide_ayuda_7",
    label: "Pide ayuda",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_COMUNICA_7_ID,
    type: "boolean",
    key: "mae_obs_se_comunica_7",
    label: "Se comunica",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_AISLA_7_ID,
    type: "boolean",
    key: "mae_obs_se_aisla_7",
    label: "Se aisla",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_AYUDA_OTROS_7_ID,
    type: "boolean",
    key: "mae_obs_ayuda_otros_7",
    label: "Ayuda a otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_7_ID,
    type: "boolean",
    key: "mae_obs_vinculo_favorable_at_7",
    label: "Establece vínculo favorable con el AT",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - Implicancia afectiva (6)
  {
    id: MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_7_ID,
    type: "boolean",
    key: "mae_obs_acepta_propia_obra_7",
    label: "Acepta su propia obra",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_7_ID,
    type: "boolean",
    key: "mae_obs_pone_palabras_lo_producido_7",
    label: "Puede poner en palabras lo producido",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_7_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_denotativas_7",
    label: "Realiza asociaciones denotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_7_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_connotativas_7",
    label: "Realiza asociaciones connotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_7_ID,
    type: "boolean",
    key: "mae_obs_cambios_humor_inicio_7",
    label: "Manifiesta cambios de humor con respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_7_ID,
    type: "boolean",
    key: "mae_obs_cambios_actitud_corporal_inicio_7",
    label: "Manifiesta cambios de actitud corporal respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - grupo (3)
  {
    id: MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_7_ID,
    type: "boolean",
    key: "mae_obs_respeta_palabra_otros_7",
    label: "Respeta la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_7_ID,
    type: "boolean",
    key: "mae_obs_indiferente_palabra_otros_7",
    label: "Es indiferente ante la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_7_ID,
    type: "boolean",
    key: "mae_obs_logra_esperar_turno_7",
    label: "Logra esperar su turno",
    required: false,
    helpText: "",
    config: {},
  },
  // ===== ENCOUNTER 8 FIELDS (34 fields) =====
  // Identification (2)
  {
    id: MAE_OBS_FIELD_FECHA_ENCUENTRO_8_ID,
    type: "date",
    key: "mae_obs_fecha_encuentro_8",
    label: "Fecha del encuentro 8",
    required: true,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_EDAD_PARTICIPANTE_8_ID,
    type: "number",
    key: "mae_obs_edad_participante_8",
    label: "Edad del participante",
    required: true,
    helpText: "",
    config: { min: 0, max: 18 },
  },
  // CONSIGNA (4)
  {
    id: MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_8_ID,
    type: "boolean",
    key: "mae_obs_la_toma_en_cuenta_8",
    label: "La toma en cuenta",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_8_ID,
    type: "boolean",
    key: "mae_obs_trae_emergente_propio_8",
    label: "Trae un emergente propio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_NECESITA_REITERACION_8_ID,
    type: "boolean",
    key: "mae_obs_necesita_reiteracion_8",
    label: "Necesita reiteración",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_CONCENTRA_8_ID,
    type: "boolean",
    key: "mae_obs_se_concentra_8",
    label: "Se concentra",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - inicio (2)
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_8_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_motivado_8",
    label: "Inicia la participación motivado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_8_ID,
    type: "boolean",
    key: "mae_obs_inicia_participacion_indiferente_8",
    label: "Inicia la participación indiferente",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - tiempo (4)
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_8_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_dilatado_8",
    label: "Tiempo de inicio dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_8_ID,
    type: "boolean",
    key: "mae_obs_tiempo_inicio_esperable_8",
    label: "Tiempo de inicio esperable",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_8_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_dilatado_8",
    label: "Tiempo de realización total dilatado",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_8_ID,
    type: "boolean",
    key: "mae_obs_tiempo_realizacion_esperable_8",
    label: "Tiempo de realización total esperable",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - materiales (4 + 2 extra)
  {
    id: MAE_OBS_FIELD_EXPLORA_MATERIALES_8_ID,
    type: "boolean",
    key: "mae_obs_explora_materiales_8",
    label: "Explora los materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_REPITE_USO_MATERIALES_8_ID,
    type: "boolean",
    key: "mae_obs_repite_uso_materiales_8",
    label: "Repite el uso de materiales",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_8_ID,
    type: "boolean",
    key: "mae_obs_dificultad_manipulacion_8",
    label: "Manifiesta dificultad en la manipulación",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_8_ID,
    type: "text",
    key: "mae_obs_dificultad_manipulacion_cual_8",
    label: "¿Cuál dificultad en la manipulación?",
    required: false,
    helpText: "",
    config: { maxLength: 255 },
  },
  {
    id: MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_8_ID,
    type: "boolean",
    key: "mae_obs_pide_otros_materiales_8",
    label: "Pide otros materiales",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - creatividad (3)
  {
    id: MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_8_ID,
    type: "boolean",
    key: "mae_obs_pulsion_creadora_presente_8",
    label: "Pulsión creadora presente",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_8_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_concentracion_trabajo_8",
    label: "Buen nivel de concentración y trabajo",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_8_ID,
    type: "boolean",
    key: "mae_obs_buen_nivel_tolerancia_frustracion_8",
    label: "Buen nivel de tolerancia a la frustración",
    required: false,
    helpText: "",
    config: {},
  },
  // DESARROLLO-PRODUCCIÓN - en grupo (5)
  {
    id: MAE_OBS_FIELD_PIDE_AYUDA_8_ID,
    type: "boolean",
    key: "mae_obs_pide_ayuda_8",
    label: "Pide ayuda",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_COMUNICA_8_ID,
    type: "boolean",
    key: "mae_obs_se_comunica_8",
    label: "Se comunica",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_SE_AISLA_8_ID,
    type: "boolean",
    key: "mae_obs_se_aisla_8",
    label: "Se aisla",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_AYUDA_OTROS_8_ID,
    type: "boolean",
    key: "mae_obs_ayuda_otros_8",
    label: "Ayuda a otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_8_ID,
    type: "boolean",
    key: "mae_obs_vinculo_favorable_at_8",
    label: "Establece vínculo favorable con el AT",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - Implicancia afectiva (6)
  {
    id: MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_8_ID,
    type: "boolean",
    key: "mae_obs_acepta_propia_obra_8",
    label: "Acepta su propia obra",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_8_ID,
    type: "boolean",
    key: "mae_obs_pone_palabras_lo_producido_8",
    label: "Puede poner en palabras lo producido",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_8_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_denotativas_8",
    label: "Realiza asociaciones denotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_8_ID,
    type: "boolean",
    key: "mae_obs_asociaciones_connotativas_8",
    label: "Realiza asociaciones connotativas",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_8_ID,
    type: "boolean",
    key: "mae_obs_cambios_humor_inicio_8",
    label: "Manifiesta cambios de humor con respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_8_ID,
    type: "boolean",
    key: "mae_obs_cambios_actitud_corporal_inicio_8",
    label: "Manifiesta cambios de actitud corporal respecto al inicio",
    required: false,
    helpText: "",
    config: {},
  },
  // CIERRE - grupo (3)
  {
    id: MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_8_ID,
    type: "boolean",
    key: "mae_obs_respeta_palabra_otros_8",
    label: "Respeta la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_8_ID,
    type: "boolean",
    key: "mae_obs_indiferente_palabra_otros_8",
    label: "Es indiferente ante la palabra de los otros",
    required: false,
    helpText: "",
    config: {},
  },
  {
    id: MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_8_ID,
    type: "boolean",
    key: "mae_obs_logra_esperar_turno_8",
    label: "Logra esperar su turno",
    required: false,
    helpText: "",
    config: {},
  },
] as const;

// MAE Observation Forms
export const MAE_OBS_FORM_ENC_1_ID = "00000000-0000-4000-8000-00000000d104";
export const MAE_OBS_FORM_ENC_2_ID = "00000000-0000-4000-8000-00000000d105";
export const MAE_OBS_FORM_ENC_3_ID = "00000000-0000-4000-8000-00000000d106";
export const MAE_OBS_FORM_ENC_4_ID = "00000000-0000-4000-8000-00000000d107";
export const MAE_OBS_FORM_ENC_5_ID = "00000000-0000-4000-8000-00000000d108";
export const MAE_OBS_FORM_ENC_6_ID = "00000000-0000-4000-8000-00000000d109";
export const MAE_OBS_FORM_ENC_7_ID = "00000000-0000-4000-8000-00000000d10a";
export const MAE_OBS_FORM_ENC_8_ID = "00000000-0000-4000-8000-00000000d10b";

// Stable instance IDs for MAE observation form 1 instances (40 instances)
export const MAE_OBS_FORM_ENC_1_INSTANCE_IDS: readonly string[] = [
  "00000000-0000-4000-8000-00000000e401",
  "00000000-0000-4000-8000-00000000e402",
  "00000000-0000-4000-8000-00000000e403",
  "00000000-0000-4000-8000-00000000e404",
  "00000000-0000-4000-8000-00000000e405",
  "00000000-0000-4000-8000-00000000e406",
  "00000000-0000-4000-8000-00000000e407",
  "00000000-0000-4000-8000-00000000e408",
  "00000000-0000-4000-8000-00000000e409",
  "00000000-0000-4000-8000-00000000e40a",
  "00000000-0000-4000-8000-00000000e40b",
  "00000000-0000-4000-8000-00000000e40c",
  "00000000-0000-4000-8000-00000000e40d",
  "00000000-0000-4000-8000-00000000e40e",
  "00000000-0000-4000-8000-00000000e40f",
  "00000000-0000-4000-8000-00000000e410",
  "00000000-0000-4000-8000-00000000e411",
  "00000000-0000-4000-8000-00000000e412",
  "00000000-0000-4000-8000-00000000e413",
  "00000000-0000-4000-8000-00000000e414",
  "00000000-0000-4000-8000-00000000e415",
  "00000000-0000-4000-8000-00000000e416",
  "00000000-0000-4000-8000-00000000e417",
  "00000000-0000-4000-8000-00000000e418",
  "00000000-0000-4000-8000-00000000e419",
  "00000000-0000-4000-8000-00000000e41a",
  "00000000-0000-4000-8000-00000000e41b",
  "00000000-0000-4000-8000-00000000e41c",
  "00000000-0000-4000-8000-00000000e41d",
  "00000000-0000-4000-8000-00000000e41e",
  "00000000-0000-4000-8000-00000000e41f",
  "00000000-0000-4000-8000-00000000e420",
  "00000000-0000-4000-8000-00000000e421",
  "00000000-0000-4000-8000-00000000e422",
  "00000000-0000-4000-8000-00000000e423",
  "00000000-0000-4000-8000-00000000e424",
  "00000000-0000-4000-8000-00000000e425",
  "00000000-0000-4000-8000-00000000e426",
  "00000000-0000-4000-8000-00000000e427",
  "00000000-0000-4000-8000-00000000e428",
] as const;

// Stable instance IDs for MAE observation form 2 instances (34 instances)
export const MAE_OBS_FORM_ENC_2_INSTANCE_IDS: readonly string[] = [
  "00000000-0000-4000-8000-00000000e501",
  "00000000-0000-4000-8000-00000000e502",
  "00000000-0000-4000-8000-00000000e503",
  "00000000-0000-4000-8000-00000000e504",
  "00000000-0000-4000-8000-00000000e505",
  "00000000-0000-4000-8000-00000000e506",
  "00000000-0000-4000-8000-00000000e507",
  "00000000-0000-4000-8000-00000000e508",
  "00000000-0000-4000-8000-00000000e509",
  "00000000-0000-4000-8000-00000000e50a",
  "00000000-0000-4000-8000-00000000e50b",
  "00000000-0000-4000-8000-00000000e50c",
  "00000000-0000-4000-8000-00000000e50d",
  "00000000-0000-4000-8000-00000000e50e",
  "00000000-0000-4000-8000-00000000e50f",
  "00000000-0000-4000-8000-00000000e510",
  "00000000-0000-4000-8000-00000000e511",
  "00000000-0000-4000-8000-00000000e512",
  "00000000-0000-4000-8000-00000000e513",
  "00000000-0000-4000-8000-00000000e514",
  "00000000-0000-4000-8000-00000000e515",
  "00000000-0000-4000-8000-00000000e516",
  "00000000-0000-4000-8000-00000000e517",
  "00000000-0000-4000-8000-00000000e518",
  "00000000-0000-4000-8000-00000000e519",
  "00000000-0000-4000-8000-00000000e51a",
  "00000000-0000-4000-8000-00000000e51b",
  "00000000-0000-4000-8000-00000000e51c",
  "00000000-0000-4000-8000-00000000e51d",
  "00000000-0000-4000-8000-00000000e51e",
  "00000000-0000-4000-8000-00000000e51f",
  "00000000-0000-4000-8000-00000000e520",
  "00000000-0000-4000-8000-00000000e521",
  "00000000-0000-4000-8000-00000000e522",
] as const;

// Stable instance IDs for MAE observation form 3 instances (34 instances)
export const MAE_OBS_FORM_ENC_3_INSTANCE_IDS: readonly string[] = [
  "00000000-0000-4000-8000-00000000e601",
  "00000000-0000-4000-8000-00000000e602",
  "00000000-0000-4000-8000-00000000e603",
  "00000000-0000-4000-8000-00000000e604",
  "00000000-0000-4000-8000-00000000e605",
  "00000000-0000-4000-8000-00000000e606",
  "00000000-0000-4000-8000-00000000e607",
  "00000000-0000-4000-8000-00000000e608",
  "00000000-0000-4000-8000-00000000e609",
  "00000000-0000-4000-8000-00000000e60a",
  "00000000-0000-4000-8000-00000000e60b",
  "00000000-0000-4000-8000-00000000e60c",
  "00000000-0000-4000-8000-00000000e60d",
  "00000000-0000-4000-8000-00000000e60e",
  "00000000-0000-4000-8000-00000000e60f",
  "00000000-0000-4000-8000-00000000e610",
  "00000000-0000-4000-8000-00000000e611",
  "00000000-0000-4000-8000-00000000e612",
  "00000000-0000-4000-8000-00000000e613",
  "00000000-0000-4000-8000-00000000e614",
  "00000000-0000-4000-8000-00000000e615",
  "00000000-0000-4000-8000-00000000e616",
  "00000000-0000-4000-8000-00000000e617",
  "00000000-0000-4000-8000-00000000e618",
  "00000000-0000-4000-8000-00000000e619",
  "00000000-0000-4000-8000-00000000e61a",
  "00000000-0000-4000-8000-00000000e61b",
  "00000000-0000-4000-8000-00000000e61c",
  "00000000-0000-4000-8000-00000000e61d",
  "00000000-0000-4000-8000-00000000e61e",
  "00000000-0000-4000-8000-00000000e61f",
  "00000000-0000-4000-8000-00000000e620",
  "00000000-0000-4000-8000-00000000e621",
  "00000000-0000-4000-8000-00000000e622",
] as const;

// Stable instance IDs for MAE observation form 4 instances (34 instances)
export const MAE_OBS_FORM_ENC_4_INSTANCE_IDS: readonly string[] = [
  "00000000-0000-4000-8000-00000000e701",
  "00000000-0000-4000-8000-00000000e702",
  "00000000-0000-4000-8000-00000000e703",
  "00000000-0000-4000-8000-00000000e704",
  "00000000-0000-4000-8000-00000000e705",
  "00000000-0000-4000-8000-00000000e706",
  "00000000-0000-4000-8000-00000000e707",
  "00000000-0000-4000-8000-00000000e708",
  "00000000-0000-4000-8000-00000000e709",
  "00000000-0000-4000-8000-00000000e70a",
  "00000000-0000-4000-8000-00000000e70b",
  "00000000-0000-4000-8000-00000000e70c",
  "00000000-0000-4000-8000-00000000e70d",
  "00000000-0000-4000-8000-00000000e70e",
  "00000000-0000-4000-8000-00000000e70f",
  "00000000-0000-4000-8000-00000000e710",
  "00000000-0000-4000-8000-00000000e711",
  "00000000-0000-4000-8000-00000000e712",
  "00000000-0000-4000-8000-00000000e713",
  "00000000-0000-4000-8000-00000000e714",
  "00000000-0000-4000-8000-00000000e715",
  "00000000-0000-4000-8000-00000000e716",
  "00000000-0000-4000-8000-00000000e717",
  "00000000-0000-4000-8000-00000000e718",
  "00000000-0000-4000-8000-00000000e719",
  "00000000-0000-4000-8000-00000000e71a",
  "00000000-0000-4000-8000-00000000e71b",
  "00000000-0000-4000-8000-00000000e71c",
  "00000000-0000-4000-8000-00000000e71d",
  "00000000-0000-4000-8000-00000000e71e",
  "00000000-0000-4000-8000-00000000e71f",
  "00000000-0000-4000-8000-00000000e720",
  "00000000-0000-4000-8000-00000000e721",
  "00000000-0000-4000-8000-00000000e722",
] as const;

// Stable instance IDs for MAE observation form 5 instances (34 instances)
export const MAE_OBS_FORM_ENC_5_INSTANCE_IDS: readonly string[] = [
  "00000000-0000-4000-8000-00000000e801",
  "00000000-0000-4000-8000-00000000e802",
  "00000000-0000-4000-8000-00000000e803",
  "00000000-0000-4000-8000-00000000e804",
  "00000000-0000-4000-8000-00000000e805",
  "00000000-0000-4000-8000-00000000e806",
  "00000000-0000-4000-8000-00000000e807",
  "00000000-0000-4000-8000-00000000e808",
  "00000000-0000-4000-8000-00000000e809",
  "00000000-0000-4000-8000-00000000e80a",
  "00000000-0000-4000-8000-00000000e80b",
  "00000000-0000-4000-8000-00000000e80c",
  "00000000-0000-4000-8000-00000000e80d",
  "00000000-0000-4000-8000-00000000e80e",
  "00000000-0000-4000-8000-00000000e80f",
  "00000000-0000-4000-8000-00000000e810",
  "00000000-0000-4000-8000-00000000e811",
  "00000000-0000-4000-8000-00000000e812",
  "00000000-0000-4000-8000-00000000e813",
  "00000000-0000-4000-8000-00000000e814",
  "00000000-0000-4000-8000-00000000e815",
  "00000000-0000-4000-8000-00000000e816",
  "00000000-0000-4000-8000-00000000e817",
  "00000000-0000-4000-8000-00000000e818",
  "00000000-0000-4000-8000-00000000e819",
  "00000000-0000-4000-8000-00000000e81a",
  "00000000-0000-4000-8000-00000000e81b",
  "00000000-0000-4000-8000-00000000e81c",
  "00000000-0000-4000-8000-00000000e81d",
  "00000000-0000-4000-8000-00000000e81e",
  "00000000-0000-4000-8000-00000000e81f",
  "00000000-0000-4000-8000-00000000e820",
  "00000000-0000-4000-8000-00000000e821",
  "00000000-0000-4000-8000-00000000e822",
] as const;

// Stable instance IDs for MAE observation form 6 instances (34 instances)
export const MAE_OBS_FORM_ENC_6_INSTANCE_IDS: readonly string[] = [
  "00000000-0000-4000-8000-00000000e901",
  "00000000-0000-4000-8000-00000000e902",
  "00000000-0000-4000-8000-00000000e903",
  "00000000-0000-4000-8000-00000000e904",
  "00000000-0000-4000-8000-00000000e905",
  "00000000-0000-4000-8000-00000000e906",
  "00000000-0000-4000-8000-00000000e907",
  "00000000-0000-4000-8000-00000000e908",
  "00000000-0000-4000-8000-00000000e909",
  "00000000-0000-4000-8000-00000000e90a",
  "00000000-0000-4000-8000-00000000e90b",
  "00000000-0000-4000-8000-00000000e90c",
  "00000000-0000-4000-8000-00000000e90d",
  "00000000-0000-4000-8000-00000000e90e",
  "00000000-0000-4000-8000-00000000e90f",
  "00000000-0000-4000-8000-00000000e910",
  "00000000-0000-4000-8000-00000000e911",
  "00000000-0000-4000-8000-00000000e912",
  "00000000-0000-4000-8000-00000000e913",
  "00000000-0000-4000-8000-00000000e914",
  "00000000-0000-4000-8000-00000000e915",
  "00000000-0000-4000-8000-00000000e916",
  "00000000-0000-4000-8000-00000000e917",
  "00000000-0000-4000-8000-00000000e918",
  "00000000-0000-4000-8000-00000000e919",
  "00000000-0000-4000-8000-00000000e91a",
  "00000000-0000-4000-8000-00000000e91b",
  "00000000-0000-4000-8000-00000000e91c",
  "00000000-0000-4000-8000-00000000e91d",
  "00000000-0000-4000-8000-00000000e91e",
  "00000000-0000-4000-8000-00000000e91f",
  "00000000-0000-4000-8000-00000000e920",
  "00000000-0000-4000-8000-00000000e921",
  "00000000-0000-4000-8000-00000000e922",
] as const;

// Stable instance IDs for MAE observation form 7 instances (34 instances)
export const MAE_OBS_FORM_ENC_7_INSTANCE_IDS: readonly string[] = [
  "00000000-0000-4000-8000-00000000ea01",
  "00000000-0000-4000-8000-00000000ea02",
  "00000000-0000-4000-8000-00000000ea03",
  "00000000-0000-4000-8000-00000000ea04",
  "00000000-0000-4000-8000-00000000ea05",
  "00000000-0000-4000-8000-00000000ea06",
  "00000000-0000-4000-8000-00000000ea07",
  "00000000-0000-4000-8000-00000000ea08",
  "00000000-0000-4000-8000-00000000ea09",
  "00000000-0000-4000-8000-00000000ea0a",
  "00000000-0000-4000-8000-00000000ea0b",
  "00000000-0000-4000-8000-00000000ea0c",
  "00000000-0000-4000-8000-00000000ea0d",
  "00000000-0000-4000-8000-00000000ea0e",
  "00000000-0000-4000-8000-00000000ea0f",
  "00000000-0000-4000-8000-00000000ea10",
  "00000000-0000-4000-8000-00000000ea11",
  "00000000-0000-4000-8000-00000000ea12",
  "00000000-0000-4000-8000-00000000ea13",
  "00000000-0000-4000-8000-00000000ea14",
  "00000000-0000-4000-8000-00000000ea15",
  "00000000-0000-4000-8000-00000000ea16",
  "00000000-0000-4000-8000-00000000ea17",
  "00000000-0000-4000-8000-00000000ea18",
  "00000000-0000-4000-8000-00000000ea19",
  "00000000-0000-4000-8000-00000000ea1a",
  "00000000-0000-4000-8000-00000000ea1b",
  "00000000-0000-4000-8000-00000000ea1c",
  "00000000-0000-4000-8000-00000000ea1d",
  "00000000-0000-4000-8000-00000000ea1e",
  "00000000-0000-4000-8000-00000000ea1f",
  "00000000-0000-4000-8000-00000000ea20",
  "00000000-0000-4000-8000-00000000ea21",
  "00000000-0000-4000-8000-00000000ea22",
] as const;

// Stable instance IDs for MAE observation form 8 instances (34 instances)
export const MAE_OBS_FORM_ENC_8_INSTANCE_IDS: readonly string[] = [
  "00000000-0000-4000-8000-00000000eb01",
  "00000000-0000-4000-8000-00000000eb02",
  "00000000-0000-4000-8000-00000000eb03",
  "00000000-0000-4000-8000-00000000eb04",
  "00000000-0000-4000-8000-00000000eb05",
  "00000000-0000-4000-8000-00000000eb06",
  "00000000-0000-4000-8000-00000000eb07",
  "00000000-0000-4000-8000-00000000eb08",
  "00000000-0000-4000-8000-00000000eb09",
  "00000000-0000-4000-8000-00000000eb0a",
  "00000000-0000-4000-8000-00000000eb0b",
  "00000000-0000-4000-8000-00000000eb0c",
  "00000000-0000-4000-8000-00000000eb0d",
  "00000000-0000-4000-8000-00000000eb0e",
  "00000000-0000-4000-8000-00000000eb0f",
  "00000000-0000-4000-8000-00000000eb10",
  "00000000-0000-4000-8000-00000000eb11",
  "00000000-0000-4000-8000-00000000eb12",
  "00000000-0000-4000-8000-00000000eb13",
  "00000000-0000-4000-8000-00000000eb14",
  "00000000-0000-4000-8000-00000000eb15",
  "00000000-0000-4000-8000-00000000eb16",
  "00000000-0000-4000-8000-00000000eb17",
  "00000000-0000-4000-8000-00000000eb18",
  "00000000-0000-4000-8000-00000000eb19",
  "00000000-0000-4000-8000-00000000eb1a",
  "00000000-0000-4000-8000-00000000eb1b",
  "00000000-0000-4000-8000-00000000eb1c",
  "00000000-0000-4000-8000-00000000eb1d",
  "00000000-0000-4000-8000-00000000eb1e",
  "00000000-0000-4000-8000-00000000eb1f",
  "00000000-0000-4000-8000-00000000eb20",
  "00000000-0000-4000-8000-00000000eb21",
  "00000000-0000-4000-8000-00000000eb22",
] as const;

// Helper function to create field instances for Encounter 1 (40 fields)
function createEncounter1FieldInstances(): FormFieldInstance[] {
  const encounter1FieldIds = [
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
    MAE_OBS_FIELD_CLIMA_GRUPAL_FAVORECEDOR_ID,
    MAE_OBS_FIELD_CLIMA_GRUPAL_DISRUPTIVO_ID,
    MAE_OBS_FIELD_CLIMA_GRUPAL_INDIFERENTE_ID,
    MAE_OBS_FIELD_CLIMA_GRUPAL_PARTICIPATIVO_ID,
    MAE_OBS_FIELD_RESPETO_ENCUADRE_ID,
    MAE_OBS_FIELD_OBSERVACIONES_GENERALES_ID,
  ];

  return encounter1FieldIds.map((fieldId, i) => ({
    instanceId: MAE_OBS_FORM_ENC_1_INSTANCE_IDS[i] as string,
    fieldId,
  }));
}

// Helper function to create field instances for Encounter 2 (34 fields, no globals)
function createEncounter2FieldInstances(): FormFieldInstance[] {
  const encounter2FieldIds = [
    MAE_OBS_FIELD_FECHA_ENCUENTRO_2_ID,
    MAE_OBS_FIELD_EDAD_PARTICIPANTE_2_ID,
    MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_2_ID,
    MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_2_ID,
    MAE_OBS_FIELD_NECESITA_REITERACION_2_ID,
    MAE_OBS_FIELD_SE_CONCENTRA_2_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_2_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_2_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_2_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_2_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_2_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_2_ID,
    MAE_OBS_FIELD_EXPLORA_MATERIALES_2_ID,
    MAE_OBS_FIELD_REPITE_USO_MATERIALES_2_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_2_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_2_ID,
    MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_2_ID,
    MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_2_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_2_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_2_ID,
    MAE_OBS_FIELD_PIDE_AYUDA_2_ID,
    MAE_OBS_FIELD_SE_COMUNICA_2_ID,
    MAE_OBS_FIELD_SE_AISLA_2_ID,
    MAE_OBS_FIELD_AYUDA_OTROS_2_ID,
    MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_2_ID,
    MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_2_ID,
    MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_2_ID,
    MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_2_ID,
    MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_2_ID,
    MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_2_ID,
    MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_2_ID,
    MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_2_ID,
    MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_2_ID,
    MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_2_ID,
  ];

  return encounter2FieldIds.map((fieldId, i) => ({
    instanceId: MAE_OBS_FORM_ENC_2_INSTANCE_IDS[i] as string,
    fieldId,
  }));
}

// Helper function to create field instances for Encounter 3 (34 fields, no globals)
function createEncounter3FieldInstances(): FormFieldInstance[] {
  const encounter3FieldIds = [
    MAE_OBS_FIELD_FECHA_ENCUENTRO_3_ID,
    MAE_OBS_FIELD_EDAD_PARTICIPANTE_3_ID,
    MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_3_ID,
    MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_3_ID,
    MAE_OBS_FIELD_NECESITA_REITERACION_3_ID,
    MAE_OBS_FIELD_SE_CONCENTRA_3_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_3_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_3_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_3_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_3_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_3_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_3_ID,
    MAE_OBS_FIELD_EXPLORA_MATERIALES_3_ID,
    MAE_OBS_FIELD_REPITE_USO_MATERIALES_3_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_3_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_3_ID,
    MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_3_ID,
    MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_3_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_3_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_3_ID,
    MAE_OBS_FIELD_PIDE_AYUDA_3_ID,
    MAE_OBS_FIELD_SE_COMUNICA_3_ID,
    MAE_OBS_FIELD_SE_AISLA_3_ID,
    MAE_OBS_FIELD_AYUDA_OTROS_3_ID,
    MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_3_ID,
    MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_3_ID,
    MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_3_ID,
    MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_3_ID,
    MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_3_ID,
    MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_3_ID,
    MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_3_ID,
    MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_3_ID,
    MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_3_ID,
    MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_3_ID,
  ];

  return encounter3FieldIds.map((fieldId, i) => ({
    instanceId: MAE_OBS_FORM_ENC_3_INSTANCE_IDS[i] as string,
    fieldId,
  }));
}

// Helper function to create field instances for Encounter 4 (34 fields, no globals)
function createEncounter4FieldInstances(): FormFieldInstance[] {
  const encounter4FieldIds = [
    MAE_OBS_FIELD_FECHA_ENCUENTRO_4_ID,
    MAE_OBS_FIELD_EDAD_PARTICIPANTE_4_ID,
    MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_4_ID,
    MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_4_ID,
    MAE_OBS_FIELD_NECESITA_REITERACION_4_ID,
    MAE_OBS_FIELD_SE_CONCENTRA_4_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_4_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_4_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_4_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_4_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_4_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_4_ID,
    MAE_OBS_FIELD_EXPLORA_MATERIALES_4_ID,
    MAE_OBS_FIELD_REPITE_USO_MATERIALES_4_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_4_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_4_ID,
    MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_4_ID,
    MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_4_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_4_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_4_ID,
    MAE_OBS_FIELD_PIDE_AYUDA_4_ID,
    MAE_OBS_FIELD_SE_COMUNICA_4_ID,
    MAE_OBS_FIELD_SE_AISLA_4_ID,
    MAE_OBS_FIELD_AYUDA_OTROS_4_ID,
    MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_4_ID,
    MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_4_ID,
    MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_4_ID,
    MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_4_ID,
    MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_4_ID,
    MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_4_ID,
    MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_4_ID,
    MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_4_ID,
    MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_4_ID,
    MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_4_ID,
  ];

  return encounter4FieldIds.map((fieldId, i) => ({
    instanceId: MAE_OBS_FORM_ENC_4_INSTANCE_IDS[i] as string,
    fieldId,
  }));
}

// Helper function to create field instances for Encounter 5 (34 fields, no globals)
function createEncounter5FieldInstances(): FormFieldInstance[] {
  const encounter5FieldIds = [
    MAE_OBS_FIELD_FECHA_ENCUENTRO_5_ID,
    MAE_OBS_FIELD_EDAD_PARTICIPANTE_5_ID,
    MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_5_ID,
    MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_5_ID,
    MAE_OBS_FIELD_NECESITA_REITERACION_5_ID,
    MAE_OBS_FIELD_SE_CONCENTRA_5_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_5_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_5_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_5_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_5_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_5_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_5_ID,
    MAE_OBS_FIELD_EXPLORA_MATERIALES_5_ID,
    MAE_OBS_FIELD_REPITE_USO_MATERIALES_5_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_5_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_5_ID,
    MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_5_ID,
    MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_5_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_5_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_5_ID,
    MAE_OBS_FIELD_PIDE_AYUDA_5_ID,
    MAE_OBS_FIELD_SE_COMUNICA_5_ID,
    MAE_OBS_FIELD_SE_AISLA_5_ID,
    MAE_OBS_FIELD_AYUDA_OTROS_5_ID,
    MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_5_ID,
    MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_5_ID,
    MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_5_ID,
    MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_5_ID,
    MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_5_ID,
    MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_5_ID,
    MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_5_ID,
    MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_5_ID,
    MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_5_ID,
    MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_5_ID,
  ];

  return encounter5FieldIds.map((fieldId, i) => ({
    instanceId: MAE_OBS_FORM_ENC_5_INSTANCE_IDS[i] as string,
    fieldId,
  }));
}

// Helper function to create field instances for Encounter 6 (34 fields, no globals)
function createEncounter6FieldInstances(): FormFieldInstance[] {
  const encounter6FieldIds = [
    MAE_OBS_FIELD_FECHA_ENCUENTRO_6_ID,
    MAE_OBS_FIELD_EDAD_PARTICIPANTE_6_ID,
    MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_6_ID,
    MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_6_ID,
    MAE_OBS_FIELD_NECESITA_REITERACION_6_ID,
    MAE_OBS_FIELD_SE_CONCENTRA_6_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_6_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_6_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_6_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_6_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_6_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_6_ID,
    MAE_OBS_FIELD_EXPLORA_MATERIALES_6_ID,
    MAE_OBS_FIELD_REPITE_USO_MATERIALES_6_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_6_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_6_ID,
    MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_6_ID,
    MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_6_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_6_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_6_ID,
    MAE_OBS_FIELD_PIDE_AYUDA_6_ID,
    MAE_OBS_FIELD_SE_COMUNICA_6_ID,
    MAE_OBS_FIELD_SE_AISLA_6_ID,
    MAE_OBS_FIELD_AYUDA_OTROS_6_ID,
    MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_6_ID,
    MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_6_ID,
    MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_6_ID,
    MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_6_ID,
    MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_6_ID,
    MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_6_ID,
    MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_6_ID,
    MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_6_ID,
    MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_6_ID,
    MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_6_ID,
  ];

  return encounter6FieldIds.map((fieldId, i) => ({
    instanceId: MAE_OBS_FORM_ENC_6_INSTANCE_IDS[i] as string,
    fieldId,
  }));
}

// Helper function to create field instances for Encounter 7 (34 fields, no globals)
function createEncounter7FieldInstances(): FormFieldInstance[] {
  const encounter7FieldIds = [
    MAE_OBS_FIELD_FECHA_ENCUENTRO_7_ID,
    MAE_OBS_FIELD_EDAD_PARTICIPANTE_7_ID,
    MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_7_ID,
    MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_7_ID,
    MAE_OBS_FIELD_NECESITA_REITERACION_7_ID,
    MAE_OBS_FIELD_SE_CONCENTRA_7_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_7_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_7_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_7_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_7_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_7_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_7_ID,
    MAE_OBS_FIELD_EXPLORA_MATERIALES_7_ID,
    MAE_OBS_FIELD_REPITE_USO_MATERIALES_7_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_7_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_7_ID,
    MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_7_ID,
    MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_7_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_7_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_7_ID,
    MAE_OBS_FIELD_PIDE_AYUDA_7_ID,
    MAE_OBS_FIELD_SE_COMUNICA_7_ID,
    MAE_OBS_FIELD_SE_AISLA_7_ID,
    MAE_OBS_FIELD_AYUDA_OTROS_7_ID,
    MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_7_ID,
    MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_7_ID,
    MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_7_ID,
    MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_7_ID,
    MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_7_ID,
    MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_7_ID,
    MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_7_ID,
    MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_7_ID,
    MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_7_ID,
    MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_7_ID,
  ];

  return encounter7FieldIds.map((fieldId, i) => ({
    instanceId: MAE_OBS_FORM_ENC_7_INSTANCE_IDS[i] as string,
    fieldId,
  }));
}

// Helper function to create field instances for Encounter 8 (34 fields, no globals)
function createEncounter8FieldInstances(): FormFieldInstance[] {
  const encounter8FieldIds = [
    MAE_OBS_FIELD_FECHA_ENCUENTRO_8_ID,
    MAE_OBS_FIELD_EDAD_PARTICIPANTE_8_ID,
    MAE_OBS_FIELD_LA_TOMA_EN_CUENTA_8_ID,
    MAE_OBS_FIELD_TRAE_EMERGENTE_PROPIO_8_ID,
    MAE_OBS_FIELD_NECESITA_REITERACION_8_ID,
    MAE_OBS_FIELD_SE_CONCENTRA_8_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_MOTIVADO_8_ID,
    MAE_OBS_FIELD_INICIA_PARTICIPACION_INDIFERENTE_8_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_DILATADO_8_ID,
    MAE_OBS_FIELD_TIEMPO_INICIO_ESPERABLE_8_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_DILATADO_8_ID,
    MAE_OBS_FIELD_TIEMPO_REALIZACION_ESPERABLE_8_ID,
    MAE_OBS_FIELD_EXPLORA_MATERIALES_8_ID,
    MAE_OBS_FIELD_REPITE_USO_MATERIALES_8_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_8_ID,
    MAE_OBS_FIELD_DIFICULTAD_MANIPULACION_CUAL_8_ID,
    MAE_OBS_FIELD_PIDE_OTROS_MATERIALES_8_ID,
    MAE_OBS_FIELD_PULSION_CREADORA_PRESENTE_8_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_CONCENTRACION_TRABAJO_8_ID,
    MAE_OBS_FIELD_BUEN_NIVEL_TOLERANCIA_FRUSTRACION_8_ID,
    MAE_OBS_FIELD_PIDE_AYUDA_8_ID,
    MAE_OBS_FIELD_SE_COMUNICA_8_ID,
    MAE_OBS_FIELD_SE_AISLA_8_ID,
    MAE_OBS_FIELD_AYUDA_OTROS_8_ID,
    MAE_OBS_FIELD_VINCULO_FAVORABLE_AT_8_ID,
    MAE_OBS_FIELD_ACEPTA_PROPIA_OBRA_8_ID,
    MAE_OBS_FIELD_PONE_PALABRAS_LO_PRODUCIDO_8_ID,
    MAE_OBS_FIELD_ASOCIACIONES_DENOTATIVAS_8_ID,
    MAE_OBS_FIELD_ASOCIACIONES_CONNOTATIVAS_8_ID,
    MAE_OBS_FIELD_CAMBIOS_HUMOR_INICIO_8_ID,
    MAE_OBS_FIELD_CAMBIOS_ACTITUD_CORPORAL_INICIO_8_ID,
    MAE_OBS_FIELD_RESPETA_PALABRA_OTROS_8_ID,
    MAE_OBS_FIELD_INDIFERENTE_PALABRA_OTROS_8_ID,
    MAE_OBS_FIELD_LOGRA_ESPERAR_TURNO_8_ID,
  ];

  return encounter8FieldIds.map((fieldId, i) => ({
    instanceId: MAE_OBS_FORM_ENC_8_INSTANCE_IDS[i] as string,
    fieldId,
  }));
}

export const MAE_OBS_FORM_ENC_1_SEED: Pick<ObservationForm, "id" | "name" | "fields"> = {
  id: MAE_OBS_FORM_ENC_1_ID,
  name: "MAE - Ficha de Observación - Encuentro 1",
  fields: createEncounter1FieldInstances(),
};

export const MAE_OBS_FORM_ENC_2_SEED: Pick<ObservationForm, "id" | "name" | "fields"> = {
  id: MAE_OBS_FORM_ENC_2_ID,
  name: "MAE - Ficha de Observación - Encuentro 2",
  fields: createEncounter2FieldInstances(),
};

export const MAE_OBS_FORM_ENC_3_SEED: Pick<ObservationForm, "id" | "name" | "fields"> = {
  id: MAE_OBS_FORM_ENC_3_ID,
  name: "MAE - Ficha de Observación - Encuentro 3",
  fields: createEncounter3FieldInstances(),
};

export const MAE_OBS_FORM_ENC_4_SEED: Pick<ObservationForm, "id" | "name" | "fields"> = {
  id: MAE_OBS_FORM_ENC_4_ID,
  name: "MAE - Ficha de Observación - Encuentro 4",
  fields: createEncounter4FieldInstances(),
};

export const MAE_OBS_FORM_ENC_5_SEED: Pick<ObservationForm, "id" | "name" | "fields"> = {
  id: MAE_OBS_FORM_ENC_5_ID,
  name: "MAE - Ficha de Observación - Encuentro 5",
  fields: createEncounter5FieldInstances(),
};

export const MAE_OBS_FORM_ENC_6_SEED: Pick<ObservationForm, "id" | "name" | "fields"> = {
  id: MAE_OBS_FORM_ENC_6_ID,
  name: "MAE - Ficha de Observación - Encuentro 6",
  fields: createEncounter6FieldInstances(),
};

export const MAE_OBS_FORM_ENC_7_SEED: Pick<ObservationForm, "id" | "name" | "fields"> = {
  id: MAE_OBS_FORM_ENC_7_ID,
  name: "MAE - Ficha de Observación - Encuentro 7",
  fields: createEncounter7FieldInstances(),
};

export const MAE_OBS_FORM_ENC_8_SEED: Pick<ObservationForm, "id" | "name" | "fields"> = {
  id: MAE_OBS_FORM_ENC_8_ID,
  name: "MAE - Ficha de Observación - Encuentro 8",
  fields: createEncounter8FieldInstances(),
};
