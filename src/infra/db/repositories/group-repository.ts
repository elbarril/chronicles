import { groupSchema, type Group } from "@/domain/group";
import { participantSchema, type Participant } from "@/domain/participant";
import { db } from "@/infra/db/client";

const DEFAULT_INSTITUTION_ID = "00000000-0000-4000-8000-000000000001";

function nowIsoString(): string {
  return new Date().toISOString();
}

function normalizeName(value: string): string {
  return value.trim();
}

export async function createGroupWithParticipants(input: {
  name: string;
  participantNames: string[];
}): Promise<{ group: Group; participants: Participant[] }> {
  const now = nowIsoString();

  return db.transaction("rw", db.groups, db.participants, async () => {
    const group = groupSchema.parse({
      id: crypto.randomUUID(),
      institutionId: DEFAULT_INSTITUTION_ID,
      name: normalizeName(input.name),
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    });

    await db.groups.add(group);

    const participants = input.participantNames.map((displayName) =>
      participantSchema.parse({
        id: crypto.randomUUID(),
        groupId: group.id,
        displayName: displayName.trim(),
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      }),
    );

    if (participants.length > 0) {
      await db.participants.bulkAdd(participants);
    }

    return { group, participants };
  });
}

export async function updateGroupWithParticipants(
  groupId: string,
  input: {
    name: string;
    participantNames: string[];
  },
): Promise<{ group: Group; participants: Participant[] } | null> {
  const previous = await db.groups.get(groupId);

  if (!previous) {
    return null;
  }

  const now = nowIsoString();

  return db.transaction("rw", db.groups, db.participants, async () => {
    const group = groupSchema.parse({
      ...previous,
      name: normalizeName(input.name),
      updatedAt: now,
    });

    await db.groups.put(group);

    const existingParticipants = await db.participants.where("groupId").equals(groupId).toArray();

    if (existingParticipants.length > 0) {
      await db.participants.bulkDelete(existingParticipants.map((participant) => participant.id));
    }

    const participants = input.participantNames.map((displayName) =>
      participantSchema.parse({
        id: crypto.randomUUID(),
        groupId,
        displayName: displayName.trim(),
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      }),
    );

    if (participants.length > 0) {
      await db.participants.bulkAdd(participants);
    }

    return { group, participants };
  });
}

export async function archiveGroup(groupId: string): Promise<boolean> {
  const now = nowIsoString();

  return db.transaction("rw", db.groups, db.participants, async () => {
    const groupChanges = await db.groups.update(groupId, {
      archivedAt: now,
      updatedAt: now,
    });

    if (groupChanges === 0) {
      return false;
    }

    const participants = await db.participants.where("groupId").equals(groupId).toArray();

    await Promise.all(
      participants.map((participant) =>
        db.participants.update(participant.id, {
          archivedAt: now,
          updatedAt: now,
        }),
      ),
    );

    return true;
  });
}

export async function restoreGroup(groupId: string): Promise<boolean> {
  const now = nowIsoString();

  return db.transaction("rw", db.groups, db.participants, async () => {
    const groupChanges = await db.groups.update(groupId, {
      archivedAt: "",
      updatedAt: now,
    });

    if (groupChanges === 0) {
      return false;
    }

    const participants = await db.participants.where("groupId").equals(groupId).toArray();

    await Promise.all(
      participants.map((participant) =>
        db.participants.update(participant.id, {
          archivedAt: "",
          updatedAt: now,
        }),
      ),
    );

    return true;
  });
}

export async function getGroupById(groupId: string): Promise<Group | undefined> {
  return db.groups.get(groupId);
}

export async function listParticipantsByGroup(groupId: string): Promise<Participant[]> {
  return db.participants
    .where("groupId")
    .equals(groupId)
    .filter((participant) => participant.archivedAt === "")
    .toArray()
    .then((rows) =>
      [...rows].sort((left, right) => left.displayName.localeCompare(right.displayName)),
    );
}

export async function listActiveGroups(): Promise<Group[]> {
  return db.groups
    .where("archivedAt")
    .equals("")
    .toArray()
    .then((rows) => [...rows].sort((left, right) => right.createdAt.localeCompare(left.createdAt)));
}

export async function listArchivedGroups(): Promise<Group[]> {
  return db.groups
    .where("archivedAt")
    .notEqual("")
    .toArray()
    .then((rows) => rows.filter((row) => row.archivedAt && row.archivedAt !== ""))
    .then((rows) =>
      [...rows].sort((left, right) =>
        (right.archivedAt ?? "").localeCompare(left.archivedAt ?? ""),
      ),
    );
}

export async function isGroupNameUnique(name: string, excludeId?: string): Promise<boolean> {
  const normalizedName = normalizeName(name).toLowerCase();

  const groups = await db.groups.where("institutionId").equals(DEFAULT_INSTITUTION_ID).toArray();

  return groups.every(
    (group) =>
      group.id === excludeId ||
      group.archivedAt !== "" ||
      group.name.trim().toLowerCase() !== normalizedName,
  );
}
