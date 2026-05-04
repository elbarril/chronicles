import { participantSchema, type Participant } from "@/domain/participant";
import { projectSchema, type Project } from "@/domain/project";
import { collectObservationMediaIds } from "@/features/observations/lib/collect-media-ids";
import { db } from "@/infra/db/client";
import { deleteMediaBlob } from "@/infra/media/store";

const DEFAULT_INSTITUTION_ID = "00000000-0000-4000-8000-000000000001";

function nowIsoString(): string {
  return new Date().toISOString();
}

function normalizeName(value: string): string {
  return value.trim();
}

export async function createProjectWithParticipants(input: {
  name: string;
  participantNames: string[];
}): Promise<{ project: Project; participants: Participant[] }> {
  const now = nowIsoString();

  return db.transaction("rw", db.projects, db.participants, async () => {
    const project = projectSchema.parse({
      id: crypto.randomUUID(),
      institutionId: DEFAULT_INSTITUTION_ID,
      name: normalizeName(input.name),
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    });

    await db.projects.add(project);

    const participants = input.participantNames.map((displayName) =>
      participantSchema.parse({
        id: crypto.randomUUID(),
        projectId: project.id,
        displayName: displayName.trim(),
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      }),
    );

    if (participants.length > 0) {
      await db.participants.bulkAdd(participants);
    }

    return { project, participants };
  });
}

export async function updateProjectWithParticipants(
  projectId: string,
  input: {
    name: string;
    participantNames: string[];
  },
): Promise<{ project: Project; participants: Participant[] } | null> {
  const previous = await db.projects.get(projectId);

  if (!previous) {
    return null;
  }

  const now = nowIsoString();

  return db.transaction("rw", db.projects, db.participants, async () => {
    const project = projectSchema.parse({
      ...previous,
      name: normalizeName(input.name),
      updatedAt: now,
    });

    await db.projects.put(project);

    const existingParticipants = await db.participants
      .where("projectId")
      .equals(projectId)
      .toArray();

    if (existingParticipants.length > 0) {
      await db.participants.bulkDelete(existingParticipants.map((participant) => participant.id));
    }

    const participants = input.participantNames.map((displayName) =>
      participantSchema.parse({
        id: crypto.randomUUID(),
        projectId,
        displayName: displayName.trim(),
        createdAt: now,
        updatedAt: now,
        archivedAt: "",
      }),
    );

    if (participants.length > 0) {
      await db.participants.bulkAdd(participants);
    }

    return { project, participants };
  });
}

export async function archiveProject(projectId: string): Promise<boolean> {
  const now = nowIsoString();

  return db.transaction("rw", db.projects, db.participants, async () => {
    const projectChanges = await db.projects.update(projectId, {
      archivedAt: now,
      updatedAt: now,
    });

    if (projectChanges === 0) {
      return false;
    }

    const participants = await db.participants.where("projectId").equals(projectId).toArray();

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

export async function restoreProject(projectId: string): Promise<boolean> {
  const now = nowIsoString();

  return db.transaction("rw", db.projects, db.participants, async () => {
    const projectChanges = await db.projects.update(projectId, {
      archivedAt: "",
      updatedAt: now,
    });

    if (projectChanges === 0) {
      return false;
    }

    const participants = await db.participants.where("projectId").equals(projectId).toArray();

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

export async function getProjectById(projectId: string): Promise<Project | undefined> {
  return db.projects.get(projectId);
}

export async function listParticipantsByProject(projectId: string): Promise<Participant[]> {
  return db.participants
    .where("projectId")
    .equals(projectId)
    .filter((participant) => participant.archivedAt === "")
    .toArray()
    .then((rows) =>
      [...rows].sort((left, right) => left.displayName.localeCompare(right.displayName)),
    );
}

export async function listActiveProjects(): Promise<Project[]> {
  return db.projects
    .where("archivedAt")
    .equals("")
    .toArray()
    .then((rows) => [...rows].sort((left, right) => right.createdAt.localeCompare(left.createdAt)));
}

export async function listArchivedProjects(): Promise<Project[]> {
  return db.projects
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

export async function isProjectNameUnique(name: string, excludeId?: string): Promise<boolean> {
  const normalizedName = normalizeName(name).toLowerCase();

  const projects = await db.projects
    .where("institutionId")
    .equals(DEFAULT_INSTITUTION_ID)
    .toArray();

  return projects.every(
    (project) =>
      project.id === excludeId ||
      project.archivedAt !== "" ||
      project.name.trim().toLowerCase() !== normalizedName,
  );
}

export async function deleteProjectCascade(projectId: string): Promise<boolean> {
  const project = await db.projects.get(projectId);

  if (!project) {
    return false;
  }

  // Collect all encounters for this project
  const encounters = await db.encounters.where("projectId").equals(projectId).toArray();
  const encounterIds = encounters.map((encounter) => encounter.id);

  // Collect all observations for those encounters and gather media ids
  const allObservations =
    encounterIds.length > 0
      ? await db.observations.where("encounterId").anyOf(encounterIds).toArray()
      : [];

  const allMediaIds = allObservations.flatMap((observation) =>
    collectObservationMediaIds(observation),
  );

  await db.transaction(
    "rw",
    [db.projects, db.participants, db.encounters, db.observations, db.chronicles],
    async () => {
      // Delete chronicles linked to the encounters
      if (encounterIds.length > 0) {
        const chronicles = await db.chronicles.where("encounterId").anyOf(encounterIds).toArray();
        await db.chronicles.bulkDelete(chronicles.map((chronicle) => chronicle.id));
      }

      // Delete observations
      if (allObservations.length > 0) {
        await db.observations.bulkDelete(allObservations.map((observation) => observation.id));
      }

      // Delete encounters
      if (encounterIds.length > 0) {
        await db.encounters.bulkDelete(encounterIds);
      }

      // Delete participants
      const participants = await db.participants.where("projectId").equals(projectId).toArray();
      if (participants.length > 0) {
        await db.participants.bulkDelete(participants.map((participant) => participant.id));
      }

      // Delete the project
      await db.projects.delete(projectId);
    },
  );

  // Delete media blobs outside the transaction (IndexedDB media table is separate in store.ts)
  await Promise.all(allMediaIds.map((mediaId) => deleteMediaBlob(mediaId)));

  return true;
}
