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
