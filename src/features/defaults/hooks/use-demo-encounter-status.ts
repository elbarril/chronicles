import { useLiveQuery } from "dexie-react-hooks";

import { DEMO_PROJECT_SEED } from "@/features/defaults/lib/seed-data";
import { db } from "@/infra/db/client";

interface DemoEncounterStatus {
  /**
   * `true` while the live query is still resolving for the first time.
   * Consumers can use this to avoid flashing the "Crear" button before
   * the actual state is known.
   */
  isLoading: boolean;
  /**
   * `true` when the demo project row currently exists in the database.
   * This is the canonical signal for whether the demo content is loaded.
   */
  isLoaded: boolean;
}

/**
 * Reactive hook that mirrors the presence of the demo project in
 * IndexedDB. The `Crear proyecto de prueba` and
 * `Eliminar proyecto de prueba` buttons toggle based on this flag.
 */
export function useDemoEncounterStatus(): DemoEncounterStatus {
  const result = useLiveQuery(async () => {
    const row = await db.projects.get(DEMO_PROJECT_SEED.id);
    return Boolean(row);
  }, []);

  return {
    isLoading: result === undefined,
    isLoaded: result ?? false,
  };
}
