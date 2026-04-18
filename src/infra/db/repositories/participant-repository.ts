import { type Participant } from "@/domain/participant";
import { db } from "@/infra/db/client";

function nowIsoString(): string {
  return new Date().toISOString();
}

export async function getParticipantById(id: string): Promise<Participant | undefined> {
  return db.participants.get(id);
}

export async function listActiveParticipantsByGroup(groupId: string): Promise<Participant[]> {
  return db.participants
    .where("groupId")
    .equals(groupId)
    .filter((participant) => participant.archivedAt === "")
    .toArray()
    .then((rows) =>
      [...rows].sort((left, right) => left.displayName.localeCompare(right.displayName)),
    );
}

export async function archiveParticipantsByGroup(groupId: string): Promise<void> {
  const now = nowIsoString();
  const participants = await db.participants.where("groupId").equals(groupId).toArray();

  await Promise.all(
    participants.map((participant) =>
      db.participants.update(participant.id, {
        archivedAt: now,
        updatedAt: now,
      }),
    ),
  );
}

export async function restoreParticipantsByGroup(groupId: string): Promise<void> {
  const now = nowIsoString();
  const participants = await db.participants.where("groupId").equals(groupId).toArray();

  await Promise.all(
    participants.map((participant) =>
      db.participants.update(participant.id, {
        archivedAt: "",
        updatedAt: now,
      }),
    ),
  );
}
