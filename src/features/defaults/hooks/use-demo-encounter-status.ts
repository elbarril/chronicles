import { useLiveQuery } from "dexie-react-hooks";

import { DEMO_ENCOUNTER_SEED } from "@/features/defaults/lib/seed-data";
import { db } from "@/infra/db/client";

interface DemoEncounterStatus {
  /**
   * `true` while the live query is still resolving for the first time.
   * Consumers can use this to avoid flashing the "Cargar" button before
   * the actual state is known.
   */
  isLoading: boolean;
  /**
   * `true` when the demo encounter row currently exists in the database.
   * This is the canonical signal for whether the demo content is loaded.
   */
  isLoaded: boolean;
}

/**
 * Reactive hook that mirrors the presence of the demo encounter in
 * IndexedDB. The `Cargar encuentro de prueba` and
 * `Eliminar contenido de prueba` buttons toggle based on this flag.
 */
export function useDemoEncounterStatus(): DemoEncounterStatus {
  const result = useLiveQuery(async () => {
    const row = await db.encounters.get(DEMO_ENCOUNTER_SEED.id);
    return Boolean(row);
  }, []);

  return {
    isLoading: result === undefined,
    isLoaded: result ?? false,
  };
}
