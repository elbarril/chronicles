import { useState } from "react";
import { toast } from "sonner";

import { useTheme } from "@/app/theme";
import { useUserName } from "@/features/settings/hooks/use-user-name";
import { settingsMessages } from "@/features/settings/lib/messages";
import { detectDefaultUserName } from "@/features/settings/services/user-name-service";
import { exportFullToZip } from "@/infra/export/full-exporter";

export function useExportAll() {
  const { brandColor } = useTheme();
  const { userName } = useUserName();
  const [isExporting, setIsExporting] = useState(false);

  async function exportAll(): Promise<void> {
    setIsExporting(true);

    try {
      await exportFullToZip({
        userName: userName ?? detectDefaultUserName(),
        brandColor,
      });
      toast.success(settingsMessages.exportSuccess);
    } catch (error) {
      toast.error(settingsMessages.exportError);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }

  return { exportAll, isExporting };
}
