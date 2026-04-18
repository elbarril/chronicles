import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { resolveEncounterDependencies } from "@/features/encounters/services/encounter-service";
import { listEncounterObservations } from "@/features/observations/services/observation-service";

export function useEncounter(encounterId: string) {
  const dependencies = useLiveQuery(
    async () => resolveEncounterDependencies(encounterId),
    [encounterId],
  );
  const observations = useLiveQuery(
    async () => listEncounterObservations(encounterId),
    [encounterId],
  );

  const isLoading = dependencies === undefined || observations === undefined;

  return useMemo(
    () => ({
      encounter: dependencies?.encounter,
      fields: dependencies?.fields ?? [],
      participants: dependencies?.participants ?? [],
      form: dependencies?.form,
      observations: observations ?? [],
      isLoading,
    }),
    [dependencies, observations, isLoading],
  );
}
