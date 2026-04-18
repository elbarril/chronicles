import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { listEncounterDefinitions } from "@/features/encounters/services/encounter-service";

export function useEncounters(status: "inProgress" | "finished") {
  const encounters = useLiveQuery(async () => listEncounterDefinitions(status), [status]);

  const isLoading = encounters === undefined;

  return useMemo(
    () => ({
      encounters: encounters ?? [],
      isLoading,
    }),
    [encounters, isLoading],
  );
}
