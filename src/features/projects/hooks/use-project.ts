import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import {
  getProjectDefinition,
  listProjectEncounters,
  type ProjectEncounterFilter,
} from "@/features/projects/services/project-service";

export function useProject(projectId: string, filter: ProjectEncounterFilter) {
  const project = useLiveQuery(
    async () => (projectId ? getProjectDefinition(projectId) : undefined),
    [projectId],
  );

  const encounters = useLiveQuery(
    async () => (projectId ? listProjectEncounters(projectId, filter) : []),
    [projectId, filter],
  );

  const isLoading = project === undefined || encounters === undefined;

  return useMemo(
    () => ({
      project,
      encounters: encounters ?? [],
      isLoading,
    }),
    [project, encounters, isLoading],
  );
}
