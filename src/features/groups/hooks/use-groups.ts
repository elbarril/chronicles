import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { listGroupDefinitions } from "@/features/groups/services/group-service";

export function useGroups(status: "active" | "archived") {
  const groups = useLiveQuery(async () => listGroupDefinitions(status), [status]);

  const isLoading = groups === undefined;

  return useMemo(
    () => ({
      groups: groups ?? [],
      isLoading,
    }),
    [groups, isLoading],
  );
}
