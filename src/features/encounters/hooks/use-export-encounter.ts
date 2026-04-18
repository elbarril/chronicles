import { useState } from "react";
import { toast } from "sonner";

import { encounterMessages } from "@/features/encounters/lib/messages";
import { exportEncounterToZip } from "@/infra/export/encounter-exporter";
import { AppError } from "@/lib/error";

export function useExportEncounter() {
  const [isExporting, setIsExporting] = useState(false);

  async function exportEncounter(encounterId: string): Promise<void> {
    setIsExporting(true);

    try {
      await exportEncounterToZip(encounterId);
      toast.success(encounterMessages.exportSuccess);
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "EXPORT_ENCOUNTER_NOT_FOUND"
          ? encounterMessages.exportNotFound
          : encounterMessages.exportError;

      toast.error(message);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }

  return {
    exportEncounter,
    isExporting,
  };
}
