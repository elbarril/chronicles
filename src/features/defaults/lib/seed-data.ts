import { type Field } from "@/domain/field";
import { type ObservationForm } from "@/domain/form";

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
    config: { multiple: false },
  },
  {
    id: DEFAULT_LONG_TEXT_FIELD_ID,
    type: "longText",
    key: "texto_de_observacion",
    label: "Texto de observación",
    required: false,
    helpText: "",
    config: {},
  },
] as const;

type DefaultFormSeed = Pick<ObservationForm, "id" | "name" | "fieldIds">;

export const DEFAULT_FORM_SEED: DefaultFormSeed = {
  id: DEFAULT_FORM_ID,
  name: "Observación de encuentro",
  fieldIds: [...DEFAULT_FIELD_IDS],
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
 * `d2xx` groups, `d3xx` participants, `d4xx` encounters).
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

export const DEMO_FORM_SEED: Pick<ObservationForm, "id" | "name" | "fieldIds"> = {
  id: DEMO_FORM_ID,
  name: "Formulario de prueba",
  fieldIds: [...DEMO_FIELD_IDS],
};

export const DEMO_PROJECT_ID = "00000000-0000-4000-8000-00000000d211";
export const DEMO_PARTICIPANT_ONE_ID = "00000000-0000-4000-8000-00000000d311";
export const DEMO_PARTICIPANT_TWO_ID = "00000000-0000-4000-8000-00000000d312";
export const DEMO_ENCOUNTER_ID = "00000000-0000-4000-8000-00000000d411";

export const DEMO_PROJECT_SEED = {
  id: DEMO_PROJECT_ID,
  name: "Proyecto de prueba",
} as const;

export const DEMO_PARTICIPANT_SEEDS = [
  { id: DEMO_PARTICIPANT_ONE_ID, displayName: "Persona uno" },
  { id: DEMO_PARTICIPANT_TWO_ID, displayName: "Persona dos" },
] as const;

export const DEMO_ENCOUNTER_SEED = {
  id: DEMO_ENCOUNTER_ID,
  name: "Encuentro de prueba",
} as const;
