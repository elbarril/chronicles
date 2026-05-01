import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExportAll } from "@/features/settings/hooks/use-export-all";
import { settingsMessages } from "@/features/settings/lib/messages";

export function ExportSection(): JSX.Element {
  const { exportAll, isExporting } = useExportAll();

  return (
    <div data-tour="settings.export">
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        disabled={isExporting}
        onClick={() => {
          void exportAll();
        }}
      >
        <Download className="mr-2 h-4 w-4" aria-hidden="true" />
        {isExporting ? settingsMessages.exportingButton : settingsMessages.exportButton}
      </Button>
    </div>
  );
}
