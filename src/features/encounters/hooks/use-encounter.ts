import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { resolveEncounterDependencies } from "@/features/encounters/services/encounter-service";
import { listEncounterObservations } from "@/features/observations/services/observation-service";

export function useEncounter(encounterId: string) {
  const dependencies = useLiveQuery(async () => {
    if (!encounterId) {
      return undefined;
    }

    try {
      return await resolveEncounterDependencies(encounterId);
    } catch {
      return null;
    }
  }, [encounterId]);

  const observations = useLiveQuery(
    async () => (encounterId ? listEncounterObservations(encounterId) : []),
    [encounterId],
  );

  const isLoading = dependencies === undefined || observations === undefined;

  return useMemo(
    () => ({
      encounter: dependencies?.encounter,
      project: dependencies?.project,
      participants: dependencies?.participants ?? [],
      fields: dependencies?.fields ?? [],
      observations: observations ?? [],
      isLoading,
    }),
    [dependencies, observations, isLoading],
  );
}
