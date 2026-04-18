import { groupInputSchema, type GroupInput } from "@/domain/group";
import { type Participant } from "@/domain/participant";
import {
  archiveGroup,
  createGroupWithParticipants,
  getGroupById,
  isGroupNameUnique,
  listActiveGroups,
  listArchivedGroups,
  listParticipantsByGroup,
  restoreGroup,
  updateGroupWithParticipants,
} from "@/infra/db/repositories/group-repository";
import { AppError } from "@/lib/error";

export interface GroupWithParticipants {
  id: string;
  institutionId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: "" | string;
  participants: Participant[];
}

function normalizeInput(input: GroupInput): GroupInput {
  return groupInputSchema.parse({
    name: input.name.trim(),
    participantNames: input.participantNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0),
  });
}

async function ensureUniqueName(name: string, excludeId?: string): Promise<void> {
  const unique = await isGroupNameUnique(name, excludeId);

  if (!unique) {
    throw new AppError("GROUP_NAME_TAKEN", "A group with the same name already exists.");
  }
}

export async function createGroupDefinition(input: GroupInput): Promise<GroupWithParticipants> {
  const parsed = normalizeInput(input);
  await ensureUniqueName(parsed.name);

  if (parsed.participantNames.length === 0) {
    throw new AppError("GROUP_EMPTY_PARTICIPANTS", "Group requires at least one participant.");
  }

  const result = await createGroupWithParticipants(parsed);

  return {
    ...result.group,
    participants: result.participants,
  };
}

export async function updateGroupDefinition(
  id: string,
  input: GroupInput,
): Promise<GroupWithParticipants> {
  const parsed = normalizeInput(input);
  await ensureUniqueName(parsed.name, id);

  if (parsed.participantNames.length === 0) {
    throw new AppError("GROUP_EMPTY_PARTICIPANTS", "Group requires at least one participant.");
  }

  const result = await updateGroupWithParticipants(id, parsed);

  if (!result) {
    throw new AppError("GROUP_NOT_FOUND", "Group not found for update.");
  }

  return {
    ...result.group,
    participants: result.participants,
  };
}

export async function archiveGroupDefinition(id: string): Promise<void> {
  const archived = await archiveGroup(id);

  if (!archived) {
    throw new AppError("GROUP_ARCHIVE_FAILED", "Failed to archive group.");
  }
}

export async function restoreGroupDefinition(id: string): Promise<void> {
  const restored = await restoreGroup(id);

  if (!restored) {
    throw new AppError("GROUP_RESTORE_FAILED", "Failed to restore group.");
  }
}

export async function listGroupDefinitions(
  status: "active" | "archived",
): Promise<GroupWithParticipants[]> {
  const groups = status === "active" ? await listActiveGroups() : await listArchivedGroups();

  const withParticipants = await Promise.all(
    groups.map(async (group) => ({
      ...group,
      participants: await listParticipantsByGroup(group.id),
    })),
  );

  return withParticipants;
}

export async function getGroupDefinition(id: string): Promise<GroupWithParticipants | undefined> {
  const group = await getGroupById(id);

  if (!group) {
    return undefined;
  }

  const participants = await listParticipantsByGroup(id);

  return {
    ...group,
    participants,
  };
}

export async function listActiveGroupOptions(): Promise<GroupWithParticipants[]> {
  const groups = await listActiveGroups();

  return Promise.all(
    groups.map(async (group) => ({
      ...group,
      participants: await listParticipantsByGroup(group.id),
    })),
  );
}
