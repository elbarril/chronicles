import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { importMessages } from "@/features/import/lib/messages";

interface ImportDropZoneProps {
  fileName?: string;
  isParsing: boolean;
  onFile: (file: File) => void;
}

export function ImportDropZone({ fileName, isParsing, onFile }: ImportDropZoneProps): JSX.Element {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  function pickFirstFile(fileList: FileList | null): File | null {
    if (!fileList || fileList.length === 0) {
      return null;
    }

    return fileList.item(0);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{importMessages.dropZoneTitle}</CardTitle>
        <CardDescription>{importMessages.dropZoneDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          role="button"
          tabIndex={0}
          aria-label={importMessages.dropZoneTitle}
          aria-dropeffect="copy"
          className={`border-border rounded-md border-2 border-dashed p-6 transition ${
            isDragging ? "bg-muted/60" : "bg-background"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            if (!isDragging) {
              setIsDragging(true);
            }
          }}
          onDragLeave={() => {
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            const file = pickFirstFile(event.dataTransfer.files);

            if (file) {
              onFile(file);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              document.getElementById(inputId)?.click();
            }
          }}
        >
          <div className="flex flex-col items-start gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={isParsing}
              onClick={() => {
                document.getElementById(inputId)?.click();
              }}
            >
              {importMessages.selectFileButton}
            </Button>

            {fileName ? (
              <p className="text-sm">
                <span className="font-medium">{importMessages.fileSelected}: </span>
                {fileName}
              </p>
            ) : null}
          </div>

          <input
            id={inputId}
            type="file"
            accept=".zip"
            className="sr-only"
            onChange={(event) => {
              const file = pickFirstFile(event.target.files);

              if (file) {
                onFile(file);
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
