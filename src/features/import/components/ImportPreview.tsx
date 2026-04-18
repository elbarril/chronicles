import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { importMessages } from "@/features/import/lib/messages";
import { type EncounterImportPreview } from "@/infra/export/encounter-importer";

interface ImportPreviewProps {
  preview: EncounterImportPreview;
  isImporting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function formatDate(dateValue: string): string {
  return new Date(dateValue).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function ImportPreview({
  preview,
  isImporting,
  onConfirm,
  onCancel,
}: ImportPreviewProps): JSX.Element {
  const endedAt = preview.manifest.endedAt;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">{importMessages.previewTitle}</h2>
          <span className="bg-muted rounded-full px-2 py-1 text-xs font-medium">
            {endedAt === "" ? importMessages.statusInProgress : importMessages.statusFinished}
          </span>
        </div>
        <CardDescription>{importMessages.previewDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{preview.manifest.encounterActivity}</h2>
          <p className="text-muted-foreground text-sm">
            {importMessages.summaryGroup}: {preview.manifest.groupName}
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-muted-foreground text-sm">{importMessages.summaryStarted}</dt>
            <dd className="font-medium">{formatDate(preview.manifest.startedAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{importMessages.summaryEnded}</dt>
            <dd className="font-medium">{endedAt === "" ? "-" : formatDate(endedAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{importMessages.summaryObservations}</dt>
            <dd className="font-medium">{preview.manifest.observationCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{importMessages.summaryFields}</dt>
            <dd className="font-medium">{preview.data.fields.length}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{importMessages.summaryMedia}</dt>
            <dd className="font-medium">{preview.manifest.mediaIndex.length}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={isImporting} onClick={onConfirm}>
            {isImporting ? importMessages.importingButton : importMessages.importButton}
          </Button>
          <Button type="button" variant="secondary" disabled={isImporting} onClick={onCancel}>
            {importMessages.cancelButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
