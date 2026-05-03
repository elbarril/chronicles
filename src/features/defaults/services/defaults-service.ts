import { encounterSchema, type Encounter } from "@/domain/encounter";
import { fieldSchema, type Field } from "@/domain/field";
import { observationFormSchema, type ObservationForm } from "@/domain/form";
import { participantSchema, type Participant } from "@/domain/participant";
import { projectSchema, type Project } from "@/domain/project";
import { generateChronicle } from "@/features/chronicles/services/chronicle-service";
import {
  buildPlaceholderWebmBlob,
  buildPlainTextFileBlob,
  buildSilentWavBlob,
  buildTinyPngBlob,
} from "@/features/defaults/lib/demo-media";
import {
  DEFAULT_FIELD_SEEDS,
  DEFAULT_FORM_SEED,
  DEFAULT_FIELD_IDS,
  DEFAULT_AUDIO_FIELD_ID,
  DEFAULT_LONG_TEXT_FIELD_ID,
  DEMO_ENCOUNTER_SEED,
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
  DEMO_FORM_SEED,
  DEMO_PROJECT_SEED,
  DEMO_PARTICIPANT_ONE_ID,
  DEMO_PARTICIPANT_SEEDS,
  DEMO_PARTICIPANT_TWO_ID,
} from "@/features/defaults/lib/seed-data";
import { createObservationDefinition } from "@/features/observations/services/observation-service";
import { db } from "@/infra/db/client";
import { AppError } from "@/lib/error";

const DEFAULT_INSTITUTION_ID = "00000000-0000-4000-8000-000000000001";

function nowIsoString(): string {
  return new Date().toISOString();
}

interface RestoreOutcome {
  created: number;
  restored: number;
  unchanged: number;
}

function emptyOutcome(): RestoreOutcome {
  return { created: 0, restored: 0, unchanged: 0 };
}

/**
 * Ensures every default field exists and is active.
 * - Missing rows are created.
 * - Archived rows are restored.
 * - Active rows are left untouched.
 */
export async function restoreDefaultFields(): Promise<RestoreOutcome> {
  const outcome = emptyOutcome();

  await db.transaction("rw", db.fields, async () => {
    const existingRows = await db.fields.bulkGet(DEFAULT_FIELD_SEEDS.map((seed) => seed.id));

    for (const [index, seed] of DEFAULT_FIELD_SEEDS.entries()) {
      const existing = existingRows[index];
      const now = nowIsoString();

      if (!existing) {
        const field: Field = fieldSchema.parse({
          ...seed,
          createdAt: now,
          updatedAt: now,
          archivedAt: "",
        });

        await db.fields.add(field);
        outcome.created += 1;

        continue;
      }

      if (existing.archivedAt && existing.archivedAt !== "") {
        await db.fields.update(existing.id, { archivedAt: "", updatedAt: now });
        outcome.restored += 1;

        continue;
      }

      outcome.unchanged += 1;
    }
  });

  return outcome;
}

/**
 * Ensures the default observation form exists and is active. Default fields
 * are restored first so the form can reference them.
 */
export async function restoreDefaultForm(): Promise<RestoreOutcome & { fields: RestoreOutcome }> {
  const fields = await restoreDefaultFields();
  const outcome = emptyOutcome();

  await db.transaction("rw", db.forms, async () => {
    const existing = await db.forms.get(DEFAULT_FORM_SEED.id);
    const now = nowIsoString();

    if (!existing) {
      const form: ObservationForm = observationFormSchema.parse({
        id: DEFAULT_FORM_SEED.id,
        name: DEFAULT_FORM_SEED.name,
        fieldIds: [...DEFAULT_FORM_SEED.fieldIds],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form);
      outcome.created += 1;

      return;
    }

    if (existing.archivedAt && existing.archivedAt !== "") {
      await db.forms.update(existing.id, { archivedAt: "", updatedAt: now });
      outcome.restored += 1;

      return;
    }

    outcome.unchanged += 1;
  });

  return { ...outcome, fields };
}

/**
 * Idempotently upserts every demo field plus the demo form (which
 * references all of them in stable order). Returns the active rows so
 * the caller can use them to build a valid observation snapshot.
 */
async function ensureDemoFieldsAndForm(): Promise<{
  fields: Field[];
  form: ObservationForm;
}> {
  await db.transaction("rw", db.fields, db.forms, async () => {
    const now = nowIsoString();

    for (const seed of DEMO_FIELD_SEEDS) {
      const existing = await db.fields.get(seed.id);

      if (!existing) {
        const field: Field = fieldSchema.parse({
          ...seed,
          createdAt: now,
          updatedAt: now,
          archivedAt: "",
        });

        await db.fields.add(field);
        continue;
      }

      if (existing.archivedAt && existing.archivedAt !== "") {
        await db.fields.update(existing.id, { archivedAt: "", updatedAt: now });
      }
    }

    const existingForm = await db.forms.get(DEMO_FORM_SEED.id);

    if (!existingForm) {
      const form: ObservationForm = observationFormSchema.parse({
        id: DEMO_FORM_SEED.id,
        name: DEMO_FORM_SEED.name,
        fieldIds: [...DEMO_FORM_SEED.fieldIds],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form);
    } else if (existingForm.archivedAt && existingForm.archivedAt !== "") {
      await db.forms.update(DEMO_FORM_SEED.id, {
        archivedAt: "",
        updatedAt: now,
      });
    }
  });

  const fields: Field[] = [];

  for (const seed of DEMO_FIELD_SEEDS) {
    const row = await db.fields.get(seed.id);

    if (!row) {
      throw new AppError("DEMO_FORM_MISSING", `Demo field missing after upsert: ${seed.id}`);
    }

    fields.push(row);
  }

  const form = await db.forms.get(DEMO_FORM_SEED.id);

  if (!form) {
    throw new AppError("DEMO_FORM_MISSING", "Demo form missing after upsert.");
  }

  return { fields, form };
}

/**
 * Builds a fully populated value map covering every demo field with
 * content valid against its Zod schema. Media values are real Blobs;
 * the observation service normalises them into media references.
 */
function buildDemoObservationValues(): Record<string, unknown> {
  return {
    [DEMO_FIELD_TEXT_ID]: "Texto corto de ejemplo.",
    [DEMO_FIELD_LONG_TEXT_ID]:
      "Esta es una descripción larga generada automáticamente para mostrar cómo se renderiza el campo de texto largo dentro del timeline y de la crónica.",
    [DEMO_FIELD_NUMBER_ID]: 42,
    [DEMO_FIELD_BOOLEAN_ID]: true,
    [DEMO_FIELD_SINGLE_CHOICE_ID]: "Opción A",
    [DEMO_FIELD_MULTI_CHOICE_ID]: ["Verde", "Azul"],
    [DEMO_FIELD_DATE_ID]: "2026-04-30",
    [DEMO_FIELD_TIME_ID]: "10:30",
    [DEMO_FIELD_DATETIME_ID]: "2026-04-30T10:30",
    [DEMO_FIELD_IMAGE_ID]: buildTinyPngBlob(),
    [DEMO_FIELD_VIDEO_ID]: buildPlaceholderWebmBlob(),
    [DEMO_FIELD_AUDIO_ID]: buildSilentWavBlob(),
    [DEMO_FIELD_FILE_ID]: buildPlainTextFileBlob(),
    [DEMO_FIELD_RATING_ID]: 4,
    [DEMO_FIELD_LOCATION_ID]: "Ciudad Autónoma de Buenos Aires",
  };
}

function buildDemoDefaultFormValues(): Record<string, unknown> {
  return {
    [DEFAULT_LONG_TEXT_FIELD_ID]:
      "Una segunda observación cargada con el formulario por defecto, para mostrar que un mismo encuentro puede mezclar formularios distintos.",
    // Audio field intentionally left empty: optional and demonstrates valid empty media.
    [DEFAULT_AUDIO_FIELD_ID]: "",
  };
}

export interface DemoEncounterOutcome {
  encounterId: string;
  created: boolean;
}

/**
 * Idempotently seeds a comprehensive end-to-end demo:
 *
 * - Demo fields (one per supported type) and a demo form referencing all of them.
 * - A demo project with two participants.
 * - An encounter belonging to the demo project, with start/end times one hour
 *   apart and both participants attending.
 * - Two pre-populated observations with valid content: one using the demo form
 *   (all field types) and one using the default form (text + audio), to show
 *   that a single encounter can mix forms.
 * - A generated chronicle for that encounter.
 *
 * Reusing stable UUIDs guarantees that re-running never duplicates rows;
 * if the demo encounter already exists the seed becomes a no-op so any
 * customisation the user made afterwards is preserved.
 */
export async function seedDemoEncounter(): Promise<DemoEncounterOutcome> {
  // Keep the basic defaults intact (audio + longText + their form). The
  // user can still rely on them for ad-hoc forms unrelated to the demo.
  await restoreDefaultForm();

  await ensureDemoFieldsAndForm();

  const existing = await db.encounters.get(DEMO_ENCOUNTER_SEED.id);

  if (existing) {
    return { encounterId: existing.id, created: false };
  }

  const now = new Date();
  const encounterEnd = now.toISOString();
  const encounterStart = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const nowIso = now.toISOString();

  await db.transaction("rw", db.projects, db.participants, db.encounters, async () => {
    const previousProject = await db.projects.get(DEMO_PROJECT_SEED.id);

    const project: Project = projectSchema.parse({
      id: DEMO_PROJECT_SEED.id,
      institutionId: DEFAULT_INSTITUTION_ID,
      name: DEMO_PROJECT_SEED.name,
      createdAt: previousProject?.createdAt ?? nowIso,
      updatedAt: nowIso,
      archivedAt: "",
    });

    await db.projects.put(project);

    for (const seed of DEMO_PARTICIPANT_SEEDS) {
      const previousParticipant = await db.participants.get(seed.id);

      const participant: Participant = participantSchema.parse({
        id: seed.id,
        projectId: project.id,
        displayName: seed.displayName,
        createdAt: previousParticipant?.createdAt ?? nowIso,
        updatedAt: nowIso,
        archivedAt: "",
      });

      await db.participants.put(participant);
    }

    const encounter: Encounter = encounterSchema.parse({
      id: DEMO_ENCOUNTER_SEED.id,
      projectId: project.id,
      name: DEMO_ENCOUNTER_SEED.name,
      startsAt: encounterStart,
      endsAt: encounterEnd,
      participantIds: [DEMO_PARTICIPANT_ONE_ID, DEMO_PARTICIPANT_TWO_ID],
      archivedAt: "",
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    await db.encounters.put(encounter);
  });

  // Pre-populate the encounter with two observations that exercise both
  // forms, to showcase that an encounter can mix forms across observations.
  // Done outside the transaction because the observation service also writes
  // to the media table and runs its own normalisation.
  await createObservationDefinition({
    encounterId: DEMO_ENCOUNTER_SEED.id,
    formId: DEMO_FORM_SEED.id,
    participantId: DEMO_PARTICIPANT_ONE_ID,
    title: "Observación con formulario completo",
    values: buildDemoObservationValues(),
  });

  await createObservationDefinition({
    encounterId: DEMO_ENCOUNTER_SEED.id,
    formId: DEFAULT_FORM_SEED.id,
    participantId: DEMO_PARTICIPANT_TWO_ID,
    title: "Observación con el formulario por defecto",
    values: buildDemoDefaultFormValues(),
  });

  // Generate the chronicle so the user can immediately see the full
  // pipeline (project → encounter → observation → chronicle) without extra clicks.
  await generateChronicle(DEMO_ENCOUNTER_SEED.id);

  return { encounterId: DEMO_ENCOUNTER_SEED.id, created: true };
}

export interface DemoEncounterRemovalOutcome {
  removed: boolean;
}

/**
 * Removes every entity that was seeded by `seedDemoEncounter`:
 *
 * - The demo chronicle (or any chronicle for the demo encounter).
 * - All observations attached to the demo encounter (media blobs they
 *   reference are cleaned up via the observation service when wiped).
 * - The demo encounter, participants and project.
 * - The demo form and the 15 demo fields.
 *
 * The basic defaults (audio + longText fields and the default form)
 * stay untouched — they are the bare-minimum scaffold and not part of
 * the demo. Re-running the operation after a partial state cleans up
 * whatever still exists, so it is safe to call repeatedly.
 *
 * Returns `{ removed: false }` when the demo encounter does not exist,
 * `{ removed: true }` when at least the demo encounter row was wiped.
 */
export async function removeDemoEncounter(): Promise<DemoEncounterRemovalOutcome> {
  const observations = await db.observations
    .where("encounterId")
    .equals(DEMO_ENCOUNTER_SEED.id)
    .toArray();

  const chronicles = await db.chronicles
    .where("encounterId")
    .equals(DEMO_ENCOUNTER_SEED.id)
    .toArray();

  // Collect every media id referenced by any of the demo observations,
  // regardless of which form snapshot they belong to.
  const mediaIds = new Set<string>();
  for (const observation of observations) {
    for (const value of Object.values(observation.values)) {
      if (typeof value === "object" && value !== null) {
        if ("mediaId" in value && typeof (value as { mediaId: unknown }).mediaId === "string") {
          mediaIds.add((value as { mediaId: string }).mediaId);
        }
        if ("mediaIds" in value && Array.isArray((value as { mediaIds: unknown }).mediaIds)) {
          for (const mediaId of (value as { mediaIds: string[] }).mediaIds) {
            mediaIds.add(mediaId);
          }
        }
      }
    }
  }

  const observationIds = observations.map((observation) => observation.id);
  const chronicleIds = chronicles.map((chronicle) => chronicle.id);

  const existingEncounter = await db.encounters.get(DEMO_ENCOUNTER_SEED.id);

  await db.transaction(
    "rw",
    [
      db.chronicles,
      db.observations,
      db.encounters,
      db.participants,
      db.projects,
      db.forms,
      db.fields,
      db.media,
    ],
    async () => {
      if (chronicleIds.length > 0) {
        await db.chronicles.bulkDelete(chronicleIds);
      }

      if (observationIds.length > 0) {
        await db.observations.bulkDelete(observationIds);
      }

      if (mediaIds.size > 0) {
        await db.media.bulkDelete([...mediaIds]);
      }

      await db.encounters.delete(DEMO_ENCOUNTER_SEED.id);

      await db.participants.bulkDelete([DEMO_PARTICIPANT_ONE_ID, DEMO_PARTICIPANT_TWO_ID]);
      await db.projects.delete(DEMO_PROJECT_SEED.id);

      await db.forms.delete(DEMO_FORM_SEED.id);
      await db.fields.bulkDelete([...DEMO_FIELD_IDS]);
    },
  );

  return { removed: Boolean(existingEncounter) };
}

/**
 * One-shot helper used at app boot: seeds defaults only when the database
 * has never seen them. Existing rows (including archived ones) are left
 * untouched so we never undo the user's explicit decisions.
 */
export async function seedDefaultsIfMissing(): Promise<void> {
  const existingFields = await db.fields.bulkGet([...DEFAULT_FIELD_IDS]);
  const existingForm = await db.forms.get(DEFAULT_FORM_SEED.id);
  const allExist = existingFields.every((row) => Boolean(row)) && Boolean(existingForm);

  if (allExist) {
    return;
  }

  await db.transaction("rw", db.fields, db.forms, async () => {
    const now = nowIsoString();

    for (const [index, seed] of DEFAULT_FIELD_SEEDS.entries()) {
      if (existingFields[index]) {
        continue;
      }

      const field: Field = fieldSchema.parse({
        ...seed,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.fields.add(field);
    }

    if (!existingForm) {
      const form: ObservationForm = observationFormSchema.parse({
        id: DEFAULT_FORM_SEED.id,
        name: DEFAULT_FORM_SEED.name,
        fieldIds: [...DEFAULT_FORM_SEED.fieldIds],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form);
    }
  });
}
