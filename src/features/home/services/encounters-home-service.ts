import { type Encounter } from "@/domain/encounter";
import { listAllActiveEncounters } from "@/infra/db/repositories/encounter-repository";
import { getProjectById } from "@/infra/db/repositories/project-repository";

export interface EncounterWithProjectName {
  encounter: Encounter;
  projectName: string;
}

export async function listAllActiveEncountersWithProjectName(): Promise<
  EncounterWithProjectName[]
> {
  const encounters = await listAllActiveEncounters();

  const uniqueProjectIds = [...new Set(encounters.map((e) => e.projectId))];

  const projectMap = new Map<string, string>();

  await Promise.all(
    uniqueProjectIds.map(async (projectId) => {
      const project = await getProjectById(projectId);
      if (project) {
        projectMap.set(projectId, project.name);
      }
    }),
  );

  return encounters.map((encounter) => ({
    encounter,
    projectName: projectMap.get(encounter.projectId) ?? "",
  }));
}
