import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import {
  listAllActiveEncountersWithProjectName,
  type EncounterWithProjectName,
} from "@/features/home/services/encounters-home-service";

export function useAllEncounters(): {
  encounters: EncounterWithProjectName[];
  isLoading: boolean;
} {
  const encounters = useLiveQuery(() => listAllActiveEncountersWithProjectName(), []);

  const isLoading = encounters === undefined;

  return useMemo(
    () => ({
      encounters: encounters ?? [],
      isLoading,
    }),
    [encounters, isLoading],
  );
}
