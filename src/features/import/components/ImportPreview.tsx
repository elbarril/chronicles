import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { importMessages } from "@/features/import/lib/messages";
import { type ImportPreview as UnifiedImportPreview } from "@/features/import/services/import-service";

interface ImportPreviewProps {
  preview: UnifiedImportPreview;
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
  if (preview.kind === "full") {
    const { manifest } = preview.preview;
    const counts = manifest.counts;

    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{importMessages.fullPreviewTitle}</h2>
          <CardDescription>{importMessages.fullPreviewDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <dl className="grid gap-3 sm:grid-cols-2">
            {manifest.exportedBy ? (
              <div>
                <dt className="text-muted-foreground text-sm">
                  {importMessages.fullPreviewExportedBy}
                </dt>
                <dd className="font-medium">{manifest.exportedBy}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted-foreground text-sm">
                {importMessages.fullPreviewExportedAt}
              </dt>
              <dd className="font-medium">{formatDate(manifest.exportedAt)}</dd>
            </div>
          </dl>

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted-foreground text-sm">{importMessages.summaryFields}</dt>
              <dd className="font-medium">{counts.fields}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">{importMessages.summaryForms}</dt>
              <dd className="font-medium">{counts.forms}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">{importMessages.summaryGroups}</dt>
              <dd className="font-medium">{counts.groups}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">
                {importMessages.summaryParticipants}
              </dt>
              <dd className="font-medium">{counts.participants}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">{importMessages.summaryEncounters}</dt>
              <dd className="font-medium">{counts.encounters}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">
                {importMessages.summaryObservations}
              </dt>
              <dd className="font-medium">{counts.observations}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">{importMessages.summaryChronicles}</dt>
              <dd className="font-medium">{counts.chronicles}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">{importMessages.summaryMedia}</dt>
              <dd className="font-medium">{counts.media}</dd>
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

  const { manifest, data } = preview.preview;
  const endedAt = manifest.endedAt;

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
          <h2 className="text-lg font-semibold">{manifest.encounterActivity}</h2>
          <p className="text-muted-foreground text-sm">
            {importMessages.summaryGroup}: {manifest.groupName}
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-muted-foreground text-sm">{importMessages.summaryStarted}</dt>
            <dd className="font-medium">{formatDate(manifest.startedAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{importMessages.summaryEnded}</dt>
            <dd className="font-medium">{endedAt === "" ? "-" : formatDate(endedAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{importMessages.summaryObservations}</dt>
            <dd className="font-medium">{manifest.observationCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{importMessages.summaryFields}</dt>
            <dd className="font-medium">{data.fields.length}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{importMessages.summaryMedia}</dt>
            <dd className="font-medium">{manifest.mediaIndex.length}</dd>
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
