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
  DEFAULT_FORM_SEEDS,
  DEFAULT_FIELD_IDS,
  DEFAULT_FORM_IDS,
  DEMO_ENCOUNTER_ID,
  DEMO_ENCOUNTER_IDS,
  DEMO_ENCOUNTER_SEEDS,
  DEMO_FIELD_IDS,
  DEMO_FIELD_SEEDS,
  DEMO_FORM_INSTANCE_IDS,
  DEMO_FORM_SEED,
  DEFAULT_FORM_INSTANCE_AUDIO_ID,
  DEFAULT_FORM_INSTANCE_LONGTEXT_ID,
  DEMO_PARTICIPANT_IDS,
  DEMO_PROJECT_SEED,
  DEMO_PARTICIPANT_ONE_ID,
  DEMO_PARTICIPANT_SEEDS,
  DEMO_PARTICIPANT_TWO_ID,
  MAE_EVAL_FIELD_SEEDS,
  MAE_EVAL_FORM_SEED,
  MAE_OBS_FIELD_SEEDS,
  MAE_OBS_FORM_ENC_1_ID,
  MAE_OBS_FORM_ENC_1_SEED,
  MAE_OBS_FORM_ENC_2_ID,
  MAE_OBS_FORM_ENC_2_SEED,
  MAE_OBS_FORM_ENC_3_ID,
  MAE_OBS_FORM_ENC_3_SEED,
  MAE_OBS_FORM_ENC_4_ID,
  MAE_OBS_FORM_ENC_4_SEED,
  MAE_OBS_FORM_ENC_5_ID,
  MAE_OBS_FORM_ENC_5_SEED,
  MAE_OBS_FORM_ENC_6_ID,
  MAE_OBS_FORM_ENC_6_SEED,
  MAE_OBS_FORM_ENC_7_ID,
  MAE_OBS_FORM_ENC_7_SEED,
  MAE_OBS_FORM_ENC_8_ID,
  MAE_OBS_FORM_ENC_8_SEED,
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
        fields: [...DEFAULT_FORM_SEED.fields],
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
 * Ensures every default field exists and is active.
 * - Missing rows are created.
 * - Archived rows are restored.
 * - Active rows are left untouched.
 *
 * This restores all default fields including MAE fields.
 */
export async function restoreAllDefaultFields(): Promise<RestoreOutcome> {
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
 * Ensures all default forms exist and are active. All default fields
 * are restored first so the forms can reference them.
 *
 * This restores all 10 default forms:
 * - 1 basic "Observación de encuentro" form
 * - 1 MAE evaluation form
 * - 8 MAE observation forms (encounters 1-8)
 */
export async function restoreAllDefaultForms(): Promise<
  RestoreOutcome & { fields: RestoreOutcome }
> {
  const fields = await restoreAllDefaultFields();
  const outcome = emptyOutcome();

  await db.transaction("rw", db.forms, async () => {
    const existingRows = await db.forms.bulkGet(DEFAULT_FORM_SEEDS.map((seed) => seed.id));
    const now = nowIsoString();

    for (const [index, seed] of DEFAULT_FORM_SEEDS.entries()) {
      const existing = existingRows[index];

      if (!existing) {
        const form: ObservationForm = observationFormSchema.parse({
          id: seed.id,
          name: seed.name,
          fields: [...seed.fields],
          version: 1,
          createdAt: now,
          updatedAt: now,
          archivedAt: "",
        });

        await db.forms.add(form);
        outcome.created += 1;

        continue;
      }

      if (existing.archivedAt && existing.archivedAt !== "") {
        await db.forms.update(existing.id, { archivedAt: "", updatedAt: now });
        outcome.restored += 1;

        continue;
      }

      outcome.unchanged += 1;
    }
  });

  return { ...outcome, fields };
}

/**
 * Ensures every MAE evaluation field exists and is active.
 * - Missing rows are created.
 * - Archived rows are restored.
 * - Active rows are left untouched.
 */
export async function restoreMAEEvaluationFields(): Promise<RestoreOutcome> {
  const outcome = emptyOutcome();

  await db.transaction("rw", db.fields, async () => {
    const existingRows = await db.fields.bulkGet(MAE_EVAL_FIELD_SEEDS.map((seed) => seed.id));

    for (const [index, seed] of MAE_EVAL_FIELD_SEEDS.entries()) {
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
 * Ensures the MAE evaluation form exists and is active. MAE evaluation
 * fields are restored first so the form can reference them.
 */
export async function restoreMAEEvaluationForm(): Promise<
  RestoreOutcome & { fields: RestoreOutcome }
> {
  const fields = await restoreMAEEvaluationFields();
  const outcome = emptyOutcome();

  await db.transaction("rw", db.forms, async () => {
    const existing = await db.forms.get(MAE_EVAL_FORM_SEED.id);
    const now = nowIsoString();

    if (!existing) {
      const form: ObservationForm = observationFormSchema.parse({
        id: MAE_EVAL_FORM_SEED.id,
        name: MAE_EVAL_FORM_SEED.name,
        fields: [...MAE_EVAL_FORM_SEED.fields],
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
 * Ensures every MAE observation field exists and is active.
 * - Missing rows are created.
 * - Archived rows are restored.
 * - Active rows are left untouched.
 */
export async function restoreMAEObservationFields(): Promise<RestoreOutcome> {
  const outcome = emptyOutcome();

  await db.transaction("rw", db.fields, async () => {
    const existingRows = await db.fields.bulkGet(MAE_OBS_FIELD_SEEDS.map((seed) => seed.id));

    for (const [index, seed] of MAE_OBS_FIELD_SEEDS.entries()) {
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
 * Ensures the MAE observation forms (encounters 1-8) exist and are active.
 * MAE observation fields are restored first so the forms can reference them.
 */
export async function restoreMAEObservationForms(): Promise<
  RestoreOutcome & { fields: RestoreOutcome }
> {
  const fields = await restoreMAEObservationFields();
  const outcome = emptyOutcome();

  await db.transaction("rw", db.forms, async () => {
    const now = nowIsoString();

    // Restore form 1
    const existingForm1 = await db.forms.get(MAE_OBS_FORM_ENC_1_ID);

    if (!existingForm1) {
      const form1: ObservationForm = observationFormSchema.parse({
        id: MAE_OBS_FORM_ENC_1_SEED.id,
        name: MAE_OBS_FORM_ENC_1_SEED.name,
        fields: [...MAE_OBS_FORM_ENC_1_SEED.fields],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form1);
      outcome.created += 1;
    } else if (existingForm1.archivedAt && existingForm1.archivedAt !== "") {
      await db.forms.update(existingForm1.id, { archivedAt: "", updatedAt: now });
      outcome.restored += 1;
    } else {
      outcome.unchanged += 1;
    }

    // Restore form 2
    const existingForm2 = await db.forms.get(MAE_OBS_FORM_ENC_2_ID);

    if (!existingForm2) {
      const form2: ObservationForm = observationFormSchema.parse({
        id: MAE_OBS_FORM_ENC_2_SEED.id,
        name: MAE_OBS_FORM_ENC_2_SEED.name,
        fields: [...MAE_OBS_FORM_ENC_2_SEED.fields],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form2);
      outcome.created += 1;
    } else if (existingForm2.archivedAt && existingForm2.archivedAt !== "") {
      await db.forms.update(existingForm2.id, { archivedAt: "", updatedAt: now });
      outcome.restored += 1;
    } else {
      outcome.unchanged += 1;
    }

    // Restore form 3
    const existingForm3 = await db.forms.get(MAE_OBS_FORM_ENC_3_ID);

    if (!existingForm3) {
      const form3: ObservationForm = observationFormSchema.parse({
        id: MAE_OBS_FORM_ENC_3_SEED.id,
        name: MAE_OBS_FORM_ENC_3_SEED.name,
        fields: [...MAE_OBS_FORM_ENC_3_SEED.fields],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form3);
      outcome.created += 1;
    } else if (existingForm3.archivedAt && existingForm3.archivedAt !== "") {
      await db.forms.update(existingForm3.id, { archivedAt: "", updatedAt: now });
      outcome.restored += 1;
    } else {
      outcome.unchanged += 1;
    }

    // Restore form 4
    const existingForm4 = await db.forms.get(MAE_OBS_FORM_ENC_4_ID);

    if (!existingForm4) {
      const form4: ObservationForm = observationFormSchema.parse({
        id: MAE_OBS_FORM_ENC_4_SEED.id,
        name: MAE_OBS_FORM_ENC_4_SEED.name,
        fields: [...MAE_OBS_FORM_ENC_4_SEED.fields],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form4);
      outcome.created += 1;
    } else if (existingForm4.archivedAt && existingForm4.archivedAt !== "") {
      await db.forms.update(existingForm4.id, { archivedAt: "", updatedAt: now });
      outcome.restored += 1;
    } else {
      outcome.unchanged += 1;
    }

    // Restore form 5
    const existingForm5 = await db.forms.get(MAE_OBS_FORM_ENC_5_ID);

    if (!existingForm5) {
      const form5: ObservationForm = observationFormSchema.parse({
        id: MAE_OBS_FORM_ENC_5_SEED.id,
        name: MAE_OBS_FORM_ENC_5_SEED.name,
        fields: [...MAE_OBS_FORM_ENC_5_SEED.fields],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form5);
      outcome.created += 1;
    } else if (existingForm5.archivedAt && existingForm5.archivedAt !== "") {
      await db.forms.update(existingForm5.id, { archivedAt: "", updatedAt: now });
      outcome.restored += 1;
    } else {
      outcome.unchanged += 1;
    }

    // Restore form 6
    const existingForm6 = await db.forms.get(MAE_OBS_FORM_ENC_6_ID);

    if (!existingForm6) {
      const form6: ObservationForm = observationFormSchema.parse({
        id: MAE_OBS_FORM_ENC_6_SEED.id,
        name: MAE_OBS_FORM_ENC_6_SEED.name,
        fields: [...MAE_OBS_FORM_ENC_6_SEED.fields],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form6);
      outcome.created += 1;
    } else if (existingForm6.archivedAt && existingForm6.archivedAt !== "") {
      await db.forms.update(existingForm6.id, { archivedAt: "", updatedAt: now });
      outcome.restored += 1;
    } else {
      outcome.unchanged += 1;
    }

    // Restore form 7
    const existingForm7 = await db.forms.get(MAE_OBS_FORM_ENC_7_ID);

    if (!existingForm7) {
      const form7: ObservationForm = observationFormSchema.parse({
        id: MAE_OBS_FORM_ENC_7_SEED.id,
        name: MAE_OBS_FORM_ENC_7_SEED.name,
        fields: [...MAE_OBS_FORM_ENC_7_SEED.fields],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form7);
      outcome.created += 1;
    } else if (existingForm7.archivedAt && existingForm7.archivedAt !== "") {
      await db.forms.update(existingForm7.id, { archivedAt: "", updatedAt: now });
      outcome.restored += 1;
    } else {
      outcome.unchanged += 1;
    }

    // Restore form 8
    const existingForm8 = await db.forms.get(MAE_OBS_FORM_ENC_8_ID);

    if (!existingForm8) {
      const form8: ObservationForm = observationFormSchema.parse({
        id: MAE_OBS_FORM_ENC_8_SEED.id,
        name: MAE_OBS_FORM_ENC_8_SEED.name,
        fields: [...MAE_OBS_FORM_ENC_8_SEED.fields],
        version: 1,
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      });

      await db.forms.add(form8);
      outcome.created += 1;
    } else if (existingForm8.archivedAt && existingForm8.archivedAt !== "") {
      await db.forms.update(existingForm8.id, { archivedAt: "", updatedAt: now });
      outcome.restored += 1;
    } else {
      outcome.unchanged += 1;
    }
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
        fields: [...DEMO_FORM_SEED.fields],
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
 * content valid against its Zod schema. Keys are instanceIds (not fieldIds).
 * Media values are real Blobs; the observation service normalises them into
 * media references.
 *
 * DEMO_FORM_INSTANCE_IDS index order mirrors DEMO_FIELD_SEEDS:
 *   0→text, 1→longText, 2→number, 3→boolean, 4→singleChoice,
 *   5→multiChoice, 6→date, 7→time, 8→datetime, 9→image,
 *   10→video, 11→audio, 12→file, 13→rating, 14→location
 */
function buildDemoObservationValues(): Record<string, unknown> {
  // DEMO_FORM_INSTANCE_IDS index order mirrors DEMO_FIELD_SEEDS (15 entries).
  // Using Object.fromEntries avoids noUncheckedIndexedAccess issues with
  // dynamic property keys derived from a readonly array.
  const rawValues: Array<[string, unknown]> = [
    ["Texto corto de ejemplo."],
    [
      "Esta es una descripción larga generada automáticamente para mostrar cómo se renderiza el campo de texto largo dentro del timeline y de la crónica.",
    ],
    [42],
    [true],
    ["Opción A"],
    [["Verde", "Azul"]],
    ["2026-04-30"],
    ["10:30"],
    ["2026-04-30T10:30"],
    [buildTinyPngBlob()],
    [buildPlaceholderWebmBlob()],
    [buildSilentWavBlob()],
    [buildPlainTextFileBlob()],
    [4],
    ["Ciudad Autónoma de Buenos Aires"],
  ].map(
    (entry, i) => [DEMO_FORM_INSTANCE_IDS[i] ?? `__missing_${i}`, entry[0]] as [string, unknown],
  );

  return Object.fromEntries(rawValues);
}

function buildDemoDefaultFormValues(): Record<string, unknown> {
  return {
    // longText instance
    [DEFAULT_FORM_INSTANCE_LONGTEXT_ID]:
      "Una segunda observación cargada con el formulario por defecto, para mostrar que un mismo encuentro puede mezclar formularios distintos.",
    // Audio field intentionally left empty: optional and demonstrates valid empty media.
    [DEFAULT_FORM_INSTANCE_AUDIO_ID]: "",
  };
}

export interface DemoEncounterOutcome {
  /** ID of the demo project. */
  projectId: string;
  /**
   * ID of the primary demo encounter — the one with pre-populated
   * observations and the auto-generated chronicle. Kept under this name
   * so callers (onboarding tour, support page) can navigate to it.
   */
  encounterId: string;
  created: boolean;
}

/** Builds an ISO datetime string from a [Y, M, D, h, m] tuple in local time. */
function localTupleToIso(tuple: readonly [number, number, number, number, number]): string {
  const [year, monthIndex, day, hour, minute] = tuple;
  return new Date(year, monthIndex, day, hour, minute, 0, 0).toISOString();
}

/**
 * Idempotently seeds a comprehensive end-to-end demo:
 *
 * - Demo fields (one per supported type) and a demo form referencing all of them.
 * - A demo project with thirteen participants.
 * - Eight Thursday encounters (May–July 2026, 17:00–18:15) belonging to
 *   the demo project, all with every participant attending.
 * - On the **first** encounter, two pre-populated observations with valid
 *   content (one using the demo form covering every field type, one using
 *   the default form) plus an auto-generated chronicle, so the user can
 *   instantly see the full pipeline working.
 * - The other seven encounters are intentionally left empty so the user
 *   can practice loading observations from a realistic starting point.
 *
 * Reusing stable UUIDs guarantees that re-running never duplicates rows;
 * if the primary demo encounter already exists the seed becomes a no-op
 * so any customisation the user made afterwards is preserved.
 */
export async function seedDemoEncounter(): Promise<DemoEncounterOutcome> {
  // Keep the basic defaults intact (audio + longText + their form). The
  // user can still rely on them for ad-hoc forms unrelated to the demo.
  await restoreDefaultForm();

  await ensureDemoFieldsAndForm();

  const existingPrimary = await db.encounters.get(DEMO_ENCOUNTER_ID);

  if (existingPrimary) {
    return {
      projectId: DEMO_PROJECT_SEED.id,
      encounterId: existingPrimary.id,
      created: false,
    };
  }

  const nowIso = new Date().toISOString();
  const allParticipantIds = [...DEMO_PARTICIPANT_IDS];

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

    for (const encounterSeed of DEMO_ENCOUNTER_SEEDS) {
      const encounter: Encounter = encounterSchema.parse({
        id: encounterSeed.id,
        projectId: project.id,
        name: encounterSeed.name,
        startsAt: localTupleToIso(encounterSeed.start),
        endsAt: localTupleToIso(encounterSeed.end),
        participantIds: allParticipantIds,
        archivedAt: "",
        createdAt: nowIso,
        updatedAt: nowIso,
      });

      await db.encounters.put(encounter);
    }
  });

  // Pre-populate the FIRST encounter with two observations that exercise
  // both forms, to showcase that an encounter can mix forms across
  // observations. Done outside the transaction because the observation
  // service also writes to the media table and runs its own normalisation.
  await createObservationDefinition({
    encounterId: DEMO_ENCOUNTER_ID,
    formId: DEMO_FORM_SEED.id,
    participantId: DEMO_PARTICIPANT_ONE_ID,
    title: "Observación con formulario completo",
    values: buildDemoObservationValues(),
  });

  await createObservationDefinition({
    encounterId: DEMO_ENCOUNTER_ID,
    formId: DEFAULT_FORM_SEED.id,
    participantId: DEMO_PARTICIPANT_TWO_ID,
    title: "Observación con el formulario por defecto",
    values: buildDemoDefaultFormValues(),
  });

  // Generate the chronicle for the populated encounter so the user can
  // immediately see the full pipeline (project → encounter → observation
  // → chronicle) without extra clicks.
  await generateChronicle(DEMO_ENCOUNTER_ID);

  return {
    projectId: DEMO_PROJECT_SEED.id,
    encounterId: DEMO_ENCOUNTER_ID,
    created: true,
  };
}

export interface DemoEncounterRemovalOutcome {
  removed: boolean;
}

/**
 * Removes every entity that was seeded by `seedDemoEncounter`:
 *
 * - All chronicles for any of the demo encounters.
 * - All observations attached to any demo encounter (media blobs they
 *   reference are cleaned up too).
 * - The eight demo encounters, the thirteen demo participants and the
 *   demo project.
 * - The demo form and the 15 demo fields.
 *
 * The basic defaults (audio + longText fields and the default form)
 * stay untouched — they are the bare-minimum scaffold and not part of
 * the demo. Re-running the operation after a partial state cleans up
 * whatever still exists, so it is safe to call repeatedly.
 *
 * Returns `{ removed: false }` when the demo project does not exist,
 * `{ removed: true }` when at least the demo project row was wiped.
 */
export async function removeDemoEncounter(): Promise<DemoEncounterRemovalOutcome> {
  // Pull observations and chronicles attached to ANY of the eight demo
  // encounters — the user may have added their own observations on the
  // empty encounters and we still want to clean those up since they
  // belong to demo content.
  const observations = (
    await Promise.all(
      DEMO_ENCOUNTER_IDS.map((encounterId) =>
        db.observations.where("encounterId").equals(encounterId).toArray(),
      ),
    )
  ).flat();

  const chronicles = (
    await Promise.all(
      DEMO_ENCOUNTER_IDS.map((encounterId) =>
        db.chronicles.where("encounterId").equals(encounterId).toArray(),
      ),
    )
  ).flat();

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

  const existingProject = await db.projects.get(DEMO_PROJECT_SEED.id);

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

      await db.encounters.bulkDelete([...DEMO_ENCOUNTER_IDS]);

      await db.participants.bulkDelete([...DEMO_PARTICIPANT_IDS]);
      await db.projects.delete(DEMO_PROJECT_SEED.id);

      await db.forms.delete(DEMO_FORM_SEED.id);
      await db.fields.bulkDelete([...DEMO_FIELD_IDS]);
    },
  );

  return { removed: Boolean(existingProject) };
}

/**
 * One-shot helper used at app boot: seeds defaults only when the database
 * has never seen them. Existing rows (including archived ones) are left
 * untouched so we never undo the user's explicit decisions.
 */
export async function seedDefaultsIfMissing(): Promise<void> {
  const existingFields = await db.fields.bulkGet([...DEFAULT_FIELD_IDS]);
  const existingForms = await db.forms.bulkGet([...DEFAULT_FORM_IDS]);
  const allFieldsExist = existingFields.every((row) => Boolean(row));
  const allFormsExist = existingForms.every((row) => Boolean(row));
  const allExist = allFieldsExist && allFormsExist;

  if (!allExist) {
    await db.transaction("rw", db.fields, db.forms, async () => {
      const now = nowIsoString();

      // Seed default fields
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

      // Seed all default forms (built-in + MAE)
      for (const [index, seed] of DEFAULT_FORM_SEEDS.entries()) {
        if (existingForms[index]) {
          continue;
        }

        const form: ObservationForm = observationFormSchema.parse({
          id: seed.id,
          name: seed.name,
          fields: [...seed.fields],
          version: 1,
          createdAt: now,
          updatedAt: now,
          archivedAt: "",
        });

        await db.forms.add(form);
      }
    });
  }
}
