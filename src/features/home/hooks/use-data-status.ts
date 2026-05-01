import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { type DataStatus, getDataStatus } from "@/features/home/services/data-status-service";

export function useDataStatus() {
  const status = useLiveQuery<DataStatus | undefined>(async () => getDataStatus(), []);

  const isLoading = status === undefined;

  return useMemo(
    () => ({
      status,
      isLoading,
    }),
    [status, isLoading],
  );
}
