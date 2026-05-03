import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportDropZone } from "@/features/import/components/ImportDropZone";
import { ImportPreview } from "@/features/import/components/ImportPreview";
import { useImportEncounter } from "@/features/import/hooks/use-import-encounter";
import { importMessages } from "@/features/import/lib/messages";

export function ImportSection(): JSX.Element {
  const importFlow = useImportEncounter();

  return (
    <div className="space-y-4">
      {importFlow.success ? (
        <Card>
          <CardHeader>
            <CardTitle>{importMessages.fullSuccessTitle}</CardTitle>
            <CardDescription>{importMessages.fullSuccessDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary">
              <Link to="/">{importMessages.goToHome}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!importFlow.preview ? (
        <div data-tour="import.dropzone">
          <ImportDropZone
            fileName={importFlow.file?.name}
            isParsing={importFlow.isParsing}
            onFile={(file) => {
              void importFlow.handleFileDrop(file);
            }}
          />
        </div>
      ) : (
        <ImportPreview
          preview={importFlow.preview}
          isImporting={importFlow.isImporting}
          onConfirm={() => {
            void importFlow.handleConfirm();
          }}
          onCancel={importFlow.handleReset}
        />
      )}

      {importFlow.error ? (
        <p role="status" className="text-destructive text-sm">
          {importFlow.error}
        </p>
      ) : null}
    </div>
  );
}
