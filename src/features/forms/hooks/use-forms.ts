import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import { listObservationForms } from "@/features/forms/services/form-service";

export function useObservationForms(status: "active" | "archived") {
  const forms = useLiveQuery(async () => listObservationForms(status), [status]);

  const isLoading = forms === undefined;

  return useMemo(
    () => ({
      forms: forms ?? [],
      isLoading,
    }),
    [forms, isLoading],
  );
}
