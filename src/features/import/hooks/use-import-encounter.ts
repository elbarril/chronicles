import { useState } from "react";
import { toast } from "sonner";

import { importMessages } from "@/features/import/lib/messages";
import { confirmZipImport, parseZipForImport } from "@/features/import/services/import-service";
import { type EncounterImportPreview } from "@/infra/export/encounter-importer";
import { AppError } from "@/lib/error";

export function useImportEncounter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<EncounterImportPreview | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedEncounterId, setImportedEncounterId] = useState<string | null>(null);

  async function handleFileDrop(nextFile: File): Promise<void> {
    setFile(nextFile);
    setPreview(null);
    setError(null);
    setImportedEncounterId(null);
    setIsParsing(true);

    try {
      const nextPreview = await parseZipForImport(nextFile);
      setPreview(nextPreview);
    } catch (cause) {
      const message =
        cause instanceof AppError && cause.code === "IMPORT_SCHEMA_MISMATCH"
          ? importMessages.schemaError
          : importMessages.parseError;

      setError(message);
      toast.error(message);
      throw cause;
    } finally {
      setIsParsing(false);
    }
  }

  async function handleConfirm(): Promise<void> {
    if (!preview) {
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      await confirmZipImport(preview.data);
      setImportedEncounterId(preview.data.encounter.id);
      toast.success(importMessages.importSuccess);
    } catch (cause) {
      setError(importMessages.importError);
      toast.error(importMessages.importError);
      throw cause;
    } finally {
      setIsImporting(false);
    }
  }

  function handleReset(): void {
    setFile(null);
    setPreview(null);
    setError(null);
    setImportedEncounterId(null);
    setIsParsing(false);
    setIsImporting(false);
  }

  return {
    file,
    preview,
    isParsing,
    isImporting,
    error,
    importedEncounterId,
    handleFileDrop,
    handleConfirm,
    handleReset,
  };
}
