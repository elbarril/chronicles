import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { listGeneratedChronicles } from "@/features/chronicles/services/chronicle-service";

export function useChronicles() {
  const chronicles = useLiveQuery(async () => listGeneratedChronicles(), []);

  const isLoading = chronicles === undefined;

  return useMemo(
    () => ({
      chronicles: chronicles ?? [],
      isLoading,
    }),
    [chronicles, isLoading],
  );
}
