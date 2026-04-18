import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportDropZone } from "@/features/import/components/ImportDropZone";
import { ImportPreview } from "@/features/import/components/ImportPreview";
import { useImportEncounter } from "@/features/import/hooks/use-import-encounter";
import { importMessages } from "@/features/import/lib/messages";

export function ImportPage(): JSX.Element {
  const importFlow = useImportEncounter();

  return (
    <section className="space-y-6" aria-labelledby="import-page-title">
      <header className="space-y-2">
        <h1 id="import-page-title" className="text-3xl font-bold tracking-tight">
          {importMessages.pageTitle}
        </h1>
        <p className="text-muted-foreground text-sm">{importMessages.pageDescription}</p>
      </header>

      {importFlow.importedEncounterId ? (
        <Card>
          <CardHeader>
            <CardTitle>{importMessages.successTitle}</CardTitle>
            <CardDescription>{importMessages.successDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to={`/encounters/${importFlow.importedEncounterId}`}>
                {importMessages.goToEncounter}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!importFlow.preview ? (
        <ImportDropZone
          fileName={importFlow.file?.name}
          isParsing={importFlow.isParsing}
          onFile={(file) => {
            void importFlow.handleFileDrop(file);
          }}
        />
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
    </section>
  );
}
