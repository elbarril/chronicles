import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { listFieldDefinitions } from "@/features/field-definitions/services/field-service";

export function useFields(status: "active" | "archived") {
  const fields = useLiveQuery(async () => listFieldDefinitions(status), [status]);

  const isLoading = fields === undefined;

  return useMemo(
    () => ({
      fields: fields ?? [],
      isLoading,
    }),
    [fields, isLoading],
  );
}
