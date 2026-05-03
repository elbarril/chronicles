import { encounterInputSchema, type Encounter, type EncounterInput } from "@/domain/encounter";
import { type Field } from "@/domain/field";
import { listFieldsByIds } from "@/infra/db/repositories/field-repository";
import {
  archiveEncounter,
  createEncounter,
  getEncounterById,
  restoreEncounter,
  updateEncounter,
} from "@/infra/db/repositories/encounter-repository";
import { listObservationsByEncounter } from "@/infra/db/repositories/observation-repository";
import {
  getProjectById,
  listParticipantsByProject,
} from "@/infra/db/repositories/project-repository";
import { AppError } from "@/lib/error";

function parseEncounterInput(input: EncounterInput): EncounterInput {
  return encounterInputSchema.parse({
    ...input,
    name: input.name.trim(),
  });
}

async function ensureProjectExists(projectId: string): Promise<void> {
  const project = await getProjectById(projectId);

  if (!project || (project.archivedAt && project.archivedAt !== "")) {
    throw new AppError("ENCOUNTER_PROJECT_NOT_FOUND", "Project not found for encounter.");
  }
}

async function ensureParticipantsBelongToProject(
  projectId: string,
  participantIds: string[],
): Promise<void> {
  if (participantIds.length === 0) {
    throw new AppError(
      "ENCOUNTER_PARTICIPANTS_INVALID",
      "Encounter must have at least one participant.",
    );
  }

  const participants = await listParticipantsByProject(projectId);
  const validIds = new Set(participants.map((participant) => participant.id));

  if (!participantIds.every((id) => validIds.has(id))) {
    throw new AppError(
      "ENCOUNTER_PARTICIPANTS_INVALID",
      "Encounter participants must belong to the project.",
    );
  }
}

export async function createEncounterDefinition(input: EncounterInput): Promise<Encounter> {
  const parsed = parseEncounterInput(input);

  await ensureProjectExists(parsed.projectId);
  await ensureParticipantsBelongToProject(parsed.projectId, parsed.participantIds);

  return createEncounter({
    projectId: parsed.projectId,
    name: parsed.name,
    startsAt: parsed.startsAt,
    endsAt: parsed.endsAt,
    participantIds: parsed.participantIds,
    archivedAt: "",
  });
}

export async function updateEncounterDefinition(
  id: string,
  input: Pick<EncounterInput, "name" | "startsAt" | "endsAt" | "participantIds">,
): Promise<Encounter> {
  const previous = await getEncounterById(id);

  if (!previous) {
    throw new AppError("ENCOUNTER_NOT_FOUND", "Encounter not found for update.");
  }

  await ensureParticipantsBelongToProject(previous.projectId, input.participantIds);

  const updated = await updateEncounter(id, {
    name: input.name.trim(),
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    participantIds: input.participantIds,
  });

  if (!updated) {
    throw new AppError("ENCOUNTER_NOT_FOUND", "Encounter not found for update.");
  }

  return updated;
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

export interface EncounterDependencies {
  encounter: Encounter;
  project: Awaited<ReturnType<typeof getProjectById>>;
  participants: Awaited<ReturnType<typeof listParticipantsByProject>>;
  /** Fields snapshotted by every observation in this encounter, deduped. */
  fields: Field[];
}

export async function resolveEncounterDependencies(
  encounterId: string,
): Promise<EncounterDependencies> {
  const encounter = await getEncounterById(encounterId);

  if (!encounter) {
    throw new AppError("ENCOUNTER_NOT_FOUND", "Encounter not found.");
  }

  const [project, projectParticipants, observations] = await Promise.all([
    getProjectById(encounter.projectId),
    listParticipantsByProject(encounter.projectId),
    listObservationsByEncounter(encounter.id),
  ]);

  const allFieldIds = new Set<string>();
  observations.forEach((observation) => {
    observation.fieldIds.forEach((fieldId) => allFieldIds.add(fieldId));
  });

  const fields = allFieldIds.size > 0 ? await listFieldsByIds([...allFieldIds]) : [];

  // Restrict participants to the subset that actually attended this encounter.
  const attendedIds = new Set(encounter.participantIds);
  const participants = projectParticipants.filter((participant) => attendedIds.has(participant.id));

  return {
    encounter,
    project,
    participants,
    fields,
  };
}
