import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { getChronicleDetail } from "@/features/chronicles/services/chronicle-service";
import { AppError } from "@/lib/error";

export function useChronicle(chronicleId: string) {
  const detail = useLiveQuery(async () => {
    if (!chronicleId) {
      return null;
    }

    try {
      return await getChronicleDetail(chronicleId);
    } catch (error) {
      if (error instanceof AppError && error.code === "CHRONICLE_NOT_FOUND") {
        return null;
      }

      throw error;
    }
  }, [chronicleId]);

  const isLoading = detail === undefined;

  return useMemo(
    () => ({
      detail: detail ?? null,
      isLoading,
    }),
    [detail, isLoading],
  );
}
