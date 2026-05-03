import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { type Chronicle } from "@/domain/chronicle";
import { getChronicleForEncounter } from "@/features/chronicles/services/chronicle-service";

interface UseChronicleByEncounterResult {
  chronicle: Chronicle | undefined;
  isLoading: boolean;
}

/**
 * Reactively resolves the chronicle stored for a given encounter id.
 * Distinguishes "still loading" from "no chronicle yet" by wrapping the
 * resolved value in a marker object, so consumers can render an empty state
 * once the lookup completed.
 */
export function useChronicleByEncounter(encounterId: string): UseChronicleByEncounterResult {
  const result = useLiveQuery(async () => {
    if (!encounterId) {
      return { resolved: true, chronicle: undefined as Chronicle | undefined };
    }

    const chronicle = await getChronicleForEncounter(encounterId);
    return { resolved: true, chronicle };
  }, [encounterId]);

  const isLoading = result === undefined;
  const chronicle = result?.chronicle;

  return useMemo(
    () => ({
      chronicle,
      isLoading,
    }),
    [chronicle, isLoading],
  );
}
