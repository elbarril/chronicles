import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { listProjectDefinitions } from "@/features/projects/services/project-service";

export function useProjects(status: "active" | "archived") {
  const projects = useLiveQuery(async () => listProjectDefinitions(status), [status]);

  const isLoading = projects === undefined;

  return useMemo(
    () => ({
      projects: projects ?? [],
      isLoading,
    }),
    [projects, isLoading],
  );
}
