import { type Encounter, encounterSchema } from "@/domain/encounter";
import { db } from "@/infra/db/client";

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
