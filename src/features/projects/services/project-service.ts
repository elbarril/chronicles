import { type Encounter } from "@/domain/encounter";
import { type Participant } from "@/domain/participant";
import { projectInputSchema, type ProjectInput } from "@/domain/project";
import {
  listActiveEncountersByProject,
  listArchivedEncountersByProject,
} from "@/infra/db/repositories/encounter-repository";
import {
  archiveProject,
  createProjectWithParticipants,
  getProjectById,
  isProjectNameUnique,
  listActiveProjects,
  listArchivedProjects,
  listParticipantsByProject,
  restoreProject,
  updateProjectWithParticipants,
} from "@/infra/db/repositories/project-repository";
import { AppError } from "@/lib/error";

export interface ProjectWithParticipants {
  id: string;
  institutionId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: "" | string;
  participants: Participant[];
}

function normalizeInput(input: ProjectInput): ProjectInput {
  return projectInputSchema.parse({
    name: input.name.trim(),
    participantNames: input.participantNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0),
  });
}

async function ensureUniqueName(name: string, excludeId?: string): Promise<void> {
  const unique = await isProjectNameUnique(name, excludeId);

  if (!unique) {
    throw new AppError("PROJECT_NAME_TAKEN", "A project with the same name already exists.");
  }
}

export async function createProjectDefinition(
  input: ProjectInput,
): Promise<ProjectWithParticipants> {
  const parsed = normalizeInput(input);
  await ensureUniqueName(parsed.name);

  if (parsed.participantNames.length === 0) {
    throw new AppError("PROJECT_EMPTY_PARTICIPANTS", "Project requires at least one participant.");
  }

  const result = await createProjectWithParticipants(parsed);

  return {
    ...result.project,
    participants: result.participants,
  };
}

export async function updateProjectDefinition(
  id: string,
  input: ProjectInput,
): Promise<ProjectWithParticipants> {
  const parsed = normalizeInput(input);
  await ensureUniqueName(parsed.name, id);

  if (parsed.participantNames.length === 0) {
    throw new AppError("PROJECT_EMPTY_PARTICIPANTS", "Project requires at least one participant.");
  }

  const result = await updateProjectWithParticipants(id, parsed);

  if (!result) {
    throw new AppError("PROJECT_NOT_FOUND", "Project not found for update.");
  }

  return {
    ...result.project,
    participants: result.participants,
  };
}

export async function archiveProjectDefinition(id: string): Promise<void> {
  const archived = await archiveProject(id);

  if (!archived) {
    throw new AppError("PROJECT_ARCHIVE_FAILED", "Failed to archive project.");
  }
}

export async function restoreProjectDefinition(id: string): Promise<void> {
  const restored = await restoreProject(id);

  if (!restored) {
    throw new AppError("PROJECT_RESTORE_FAILED", "Failed to restore project.");
  }
}

export async function listProjectDefinitions(
  status: "active" | "archived",
): Promise<ProjectWithParticipants[]> {
  const projects = status === "active" ? await listActiveProjects() : await listArchivedProjects();

  return Promise.all(
    projects.map(async (project) => ({
      ...project,
      participants: await listParticipantsByProject(project.id),
    })),
  );
}

export async function getProjectDefinition(
  id: string,
): Promise<ProjectWithParticipants | undefined> {
  const project = await getProjectById(id);

  if (!project) {
    return undefined;
  }

  const participants = await listParticipantsByProject(id);

  return {
    ...project,
    participants,
  };
}

export async function listActiveProjectOptions(): Promise<ProjectWithParticipants[]> {
  const projects = await listActiveProjects();

  return Promise.all(
    projects.map(async (project) => ({
      ...project,
      participants: await listParticipantsByProject(project.id),
    })),
  );
}

export type ProjectEncounterFilter = "active" | "archived";

export async function listProjectEncounters(
  projectId: string,
  filter: ProjectEncounterFilter,
): Promise<Encounter[]> {
  return filter === "archived"
    ? listArchivedEncountersByProject(projectId)
    : listActiveEncountersByProject(projectId);
}
