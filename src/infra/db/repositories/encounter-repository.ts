import { type Encounter, encounterSchema } from "@/domain/encounter";
import { collectObservationMediaIds } from "@/features/observations/lib/collect-media-ids";
import { db } from "@/infra/db/client";
import { deleteMediaBlob } from "@/infra/media/store";

function nowIsoString(): string {
  return new Date().toISOString();
}

export async function createEncounter(
  data: Omit<Encounter, "id" | "createdAt" | "updatedAt" | "archivedAt"> & {
    archivedAt?: "" | string;
  },
): Promise<Encounter> {
  const now = nowIsoString();

  const encounter = encounterSchema.parse({
    id: crypto.randomUUID(),
    archivedAt: "",
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  await db.encounters.add(encounter);

  return encounter;
}

export async function updateEncounter(
  id: string,
  data: Partial<Pick<Encounter, "name" | "startsAt" | "endsAt" | "participantIds">>,
): Promise<Encounter | null> {
  const previous = await db.encounters.get(id);

  if (!previous) {
    return null;
  }

  const next = encounterSchema.parse({
    ...previous,
    ...data,
    updatedAt: nowIsoString(),
  });

  await db.encounters.put(next);

  return next;
}

export async function getEncounterById(id: string): Promise<Encounter | undefined> {
  return db.encounters.get(id);
}

export async function listActiveEncountersByProject(projectId: string): Promise<Encounter[]> {
  const encounters = await db.encounters.where("projectId").equals(projectId).toArray();

  return encounters
    .filter((encounter) => !encounter.archivedAt || encounter.archivedAt === "")
    .sort((left, right) => right.startsAt.localeCompare(left.startsAt));
}

export async function listArchivedEncountersByProject(projectId: string): Promise<Encounter[]> {
  const encounters = await db.encounters.where("projectId").equals(projectId).toArray();

  return encounters
    .filter((encounter) => Boolean(encounter.archivedAt) && encounter.archivedAt !== "")
    .sort((left, right) => right.startsAt.localeCompare(left.startsAt));
}

export async function archiveEncounter(id: string): Promise<Encounter | null> {
  const previous = await db.encounters.get(id);

  if (!previous) {
    return null;
  }

  const now = nowIsoString();
  const next = encounterSchema.parse({
    ...previous,
    archivedAt: now,
    updatedAt: now,
  });

  await db.encounters.put(next);

  return next;
}

export async function restoreEncounter(id: string): Promise<Encounter | null> {
  const previous = await db.encounters.get(id);

  if (!previous) {
    return null;
  }

  const next = encounterSchema.parse({
    ...previous,
    archivedAt: "",
    updatedAt: nowIsoString(),
  });

  await db.encounters.put(next);

  return next;
}

export async function listEncountersByProject(projectId: string): Promise<Encounter[]> {
  return db.encounters
    .where("projectId")
    .equals(projectId)
    .toArray()
    .then((rows) => [...rows].sort((left, right) => right.startsAt.localeCompare(left.startsAt)));
}

export async function listAllActiveEncounters(): Promise<Encounter[]> {
  const all = await db.encounters.toArray();

  return all
    .filter((encounter) => !encounter.archivedAt || encounter.archivedAt === "")
    .sort((left, right) => right.startsAt.localeCompare(left.startsAt));
}

export async function deleteEncounterCascade(encounterId: string): Promise<boolean> {
  const encounter = await db.encounters.get(encounterId);

  if (!encounter) {
    return false;
  }

  // Collect observations and media ids before deleting
  const observations = await db.observations.where("encounterId").equals(encounterId).toArray();

  const allMediaIds = observations.flatMap((observation) =>
    collectObservationMediaIds(observation),
  );

  await db.transaction("rw", [db.encounters, db.observations, db.chronicles], async () => {
    // Delete the chronicle for this encounter if any
    const chronicles = await db.chronicles.where("encounterId").equals(encounterId).toArray();
    await db.chronicles.bulkDelete(chronicles.map((chronicle) => chronicle.id));

    // Delete observations
    if (observations.length > 0) {
      await db.observations.bulkDelete(observations.map((observation) => observation.id));
    }

    // Delete the encounter
    await db.encounters.delete(encounterId);
  });

  // Delete media blobs outside the transaction
  await Promise.all(allMediaIds.map((mediaId) => deleteMediaBlob(mediaId)));

  return true;
}
