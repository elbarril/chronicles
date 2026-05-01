import { chronicleSchema, type Chronicle, type ChronicleInput } from "@/domain/chronicle";
import { db } from "@/infra/db/client";

function nowIsoString(): string {
  return new Date().toISOString();
}

export async function createChronicle(data: ChronicleInput): Promise<Chronicle> {
  const now = nowIsoString();

  const chronicle = chronicleSchema.parse({
    id: crypto.randomUUID(),
    encounterId: data.encounterId,
    title: data.title.trim(),
    body: data.body.trim(),
    generatedAt: now,
    createdAt: now,
    updatedAt: now,
    generatedWith: data.generatedWith,
  });

  await db.chronicles.add(chronicle);

  return chronicle;
}

export async function updateChronicle(
  id: string,
  data: Pick<ChronicleInput, "title" | "body" | "generatedWith">,
): Promise<Chronicle | null> {
  const previous = await db.chronicles.get(id);

  if (!previous) {
    return null;
  }

  const next = chronicleSchema.parse({
    ...previous,
    title: data.title.trim(),
    body: data.body.trim(),
    generatedAt: nowIsoString(),
    updatedAt: nowIsoString(),
    generatedWith: data.generatedWith,
  });

  await db.chronicles.put(next);

  return next;
}

export async function upsertChronicleByEncounter(data: ChronicleInput): Promise<Chronicle> {
  const existing = await db.chronicles.where("encounterId").equals(data.encounterId).first();

  if (!existing) {
    return createChronicle(data);
  }

  const next = chronicleSchema.parse({
    ...existing,
    title: data.title.trim(),
    body: data.body.trim(),
    generatedAt: nowIsoString(),
    updatedAt: nowIsoString(),
    generatedWith: data.generatedWith,
  });

  await db.chronicles.put(next);

  return next;
}

export async function getChronicleById(id: string): Promise<Chronicle | undefined> {
  return db.chronicles.get(id);
}

export async function getChronicleByEncounterId(
  encounterId: string,
): Promise<Chronicle | undefined> {
  return db.chronicles.where("encounterId").equals(encounterId).first();
}

export async function listChronicles(): Promise<Chronicle[]> {
  return db.chronicles
    .toArray()
    .then((rows) =>
      [...rows].sort((left, right) => right.generatedAt.localeCompare(left.generatedAt)),
    );
}

export async function deleteChronicle(id: string): Promise<boolean> {
  const existing = await db.chronicles.get(id);

  if (!existing) {
    return false;
  }

  await db.chronicles.delete(id);

  return true;
}
