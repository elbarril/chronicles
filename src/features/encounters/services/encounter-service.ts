import { encounterInputSchema, type Encounter, type EncounterInput } from "@/domain/encounter";
import { type ObservationForm } from "@/domain/form";
import {
  archiveEncounter,
  createEncounter,
  finishEncounter,
  getEncounterById,
  listArchivedEncounters,
  listEncounterByStatus,
  restoreEncounter,
  updateEncounter,
} from "@/infra/db/repositories/encounter-repository";
import { listFieldsByIds } from "@/infra/db/repositories/field-repository";
import { getFormById, listActiveForms } from "@/infra/db/repositories/form-repository";
import {
  getGroupById,
  listActiveGroups,
  listParticipantsByGroup,
} from "@/infra/db/repositories/group-repository";
import { AppError } from "@/lib/error";

function parseEncounterInput(input: EncounterInput): EncounterInput {
  return encounterInputSchema.parse({
    ...input,
    activity: input.activity.trim(),
  });
}

async function resolveEncounterForm(formId: string): Promise<ObservationForm> {
  const form = await getFormById(formId);

  if (!form) {
    throw new AppError("ENCOUNTER_FORM_NOT_FOUND", "Form not found for encounter.");
  }

  if (form.archivedAt && form.archivedAt !== "") {
    throw new AppError("ENCOUNTER_FORM_ARCHIVED", "Cannot create encounter using archived form.");
  }

  return form;
}

async function ensureGroupExists(groupId: string): Promise<void> {
  const group = await getGroupById(groupId);

  if (!group || (group.archivedAt && group.archivedAt !== "")) {
    throw new AppError("ENCOUNTER_GROUP_NOT_FOUND", "Group not found for encounter.");
  }
}

export async function createEncounterDefinition(input: EncounterInput): Promise<Encounter> {
  const parsed = parseEncounterInput(input);

  await ensureGroupExists(parsed.groupId);
  const form = await resolveEncounterForm(parsed.formId);

  return createEncounter({
    groupId: parsed.groupId,
    formId: form.id,
    formVersion: form.version,
    fieldIds: form.fieldIds,
    activity: parsed.activity,
    startedAt: parsed.startedAt ?? new Date().toISOString(),
    endedAt: "",
    archivedAt: "",
  });
}

export async function updateEncounterDefinition(
  id: string,
  input: Pick<EncounterInput, "activity">,
): Promise<Encounter> {
  const updated = await updateEncounter(id, {
    activity: input.activity.trim(),
  });

  if (!updated) {
    throw new AppError("ENCOUNTER_NOT_FOUND", "Encounter not found for update.");
  }

  return updated;
}

export async function finishEncounterDefinition(id: string): Promise<Encounter> {
  const finished = await finishEncounter(id);

  if (!finished) {
    throw new AppError("ENCOUNTER_NOT_FOUND", "Encounter not found for finish.");
  }

  return finished;
}

export type EncounterListFilter = "inProgress" | "finished" | "archived";

export async function listEncounterDefinitions(filter: EncounterListFilter): Promise<Encounter[]> {
  if (filter === "archived") {
    return listArchivedEncounters();
  }

  return listEncounterByStatus(filter);
}

export async function archiveEncounterDefinition(id: string): Promise<Encounter> {
  const archived = await archiveEncounter(id);

  if (!archived) {
    throw new AppError("ENCOUNTER_NOT_FOUND", "Encounter not found for archive.");
  }

  return archived;
}

export async function restoreEncounterDefinition(id: string): Promise<Encounter> {
  const restored = await restoreEncounter(id);

  if (!restored) {
    throw new AppError("ENCOUNTER_NOT_FOUND", "Encounter not found for restore.");
  }

  return restored;
}

export async function getEncounterDefinition(id: string): Promise<Encounter | undefined> {
  return getEncounterById(id);
}

export async function listEncounterCreateDependencies(): Promise<{
  groups: Awaited<ReturnType<typeof listActiveGroups>>;
  forms: Awaited<ReturnType<typeof listActiveForms>>;
}> {
  const [groups, forms] = await Promise.all([listActiveGroups(), listActiveForms()]);

  return {
    groups,
    forms,
  };
}

export async function resolveEncounterFields(encounterId: string) {
  const encounter = await getEncounterById(encounterId);

  if (!encounter) {
    throw new AppError("ENCOUNTER_NOT_FOUND", "Encounter not found.");
  }

  const fields = await listFieldsByIds(encounter.fieldIds);

  return {
    encounter,
    fields,
  };
}

export async function resolveEncounterDependencies(encounterId: string) {
  const encounter = await getEncounterById(encounterId);

  if (!encounter) {
    throw new AppError("ENCOUNTER_NOT_FOUND", "Encounter not found.");
  }

  const [fields, participants, form] = await Promise.all([
    listFieldsByIds(encounter.fieldIds),
    listParticipantsByGroup(encounter.groupId),
    getFormById(encounter.formId),
  ]);

  return {
    encounter,
    fields,
    participants,
    form,
  };
}
