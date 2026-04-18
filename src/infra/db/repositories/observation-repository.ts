import { observationSchema, type Observation, type ObservationValue } from "@/domain/observation";
import { db } from "@/infra/db/client";

function nowIsoString(): string {
  return new Date().toISOString();
}

export async function createObservation(data: {
  encounterId: string;
  participantId?: string;
  values: Record<string, ObservationValue>;
}): Promise<Observation> {
  const observation = observationSchema.parse({
    id: crypto.randomUUID(),
    encounterId: data.encounterId,
    participantId: data.participantId,
    values: data.values,
    createdAt: nowIsoString(),
  });

  await db.observations.add(observation);

  return observation;
}

export async function updateObservation(
  id: string,
  data: {
    participantId?: string;
    values: Record<string, ObservationValue>;
  },
): Promise<Observation | null> {
  const previous = await db.observations.get(id);

  if (!previous) {
    return null;
  }

  const next = observationSchema.parse({
    ...previous,
    participantId: data.participantId,
    values: data.values,
  });

  await db.observations.put(next);

  return next;
}

export async function deleteObservation(id: string): Promise<boolean> {
  const existing = await db.observations.get(id);

  if (!existing) {
    return false;
  }

  await db.observations.delete(id);

  return true;
}

export async function getObservationById(id: string): Promise<Observation | undefined> {
  return db.observations.get(id);
}

export async function listObservationsByEncounter(encounterId: string): Promise<Observation[]> {
  return db.observations
    .where("encounterId")
    .equals(encounterId)
    .toArray()
    .then((rows) => [...rows].sort((left, right) => right.createdAt.localeCompare(left.createdAt)));
}
