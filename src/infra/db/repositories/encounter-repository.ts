import { type Encounter, encounterSchema } from "@/domain/encounter";
import { db } from "@/infra/db/client";

function nowIsoString(): string {
  return new Date().toISOString();
}

export async function createEncounter(
  data: Omit<Encounter, "id" | "createdAt" | "updatedAt">,
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
  data: Partial<Pick<Encounter, "activity" | "endedAt">>,
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

export async function finishEncounter(id: string, endedAt?: string): Promise<Encounter | null> {
  const previous = await db.encounters.get(id);

  if (!previous) {
    return null;
  }

  const next = encounterSchema.parse({
    ...previous,
    endedAt: endedAt ?? nowIsoString(),
    updatedAt: nowIsoString(),
  });

  await db.encounters.put(next);

  return next;
}

export async function getEncounterById(id: string): Promise<Encounter | undefined> {
  return db.encounters.get(id);
}

export async function listEncounterByStatus(
  status: "inProgress" | "finished",
): Promise<Encounter[]> {
  const encounters = await db.encounters.toArray();

  return encounters
    .filter((encounter) => {
      if (encounter.archivedAt && encounter.archivedAt !== "") {
        return false;
      }

      return status === "inProgress" ? encounter.endedAt === "" : encounter.endedAt !== "";
    })
    .sort((left, right) => right.startedAt.localeCompare(left.startedAt));
}

export async function listArchivedEncounters(): Promise<Encounter[]> {
  const encounters = await db.encounters.toArray();

  return encounters
    .filter((encounter) => Boolean(encounter.archivedAt) && encounter.archivedAt !== "")
    .sort((left, right) => right.startedAt.localeCompare(left.startedAt));
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

export async function listEncountersByGroup(groupId: string): Promise<Encounter[]> {
  return db.encounters
    .where("groupId")
    .equals(groupId)
    .toArray()
    .then((rows) => [...rows].sort((left, right) => right.startedAt.localeCompare(left.startedAt)));
}
