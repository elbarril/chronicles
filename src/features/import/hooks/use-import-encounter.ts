import { useState } from "react";
import { toast } from "sonner";

import { type BrandColor, useTheme } from "@/app/theme";
import { importMessages } from "@/features/import/lib/messages";
import {
  confirmImport,
  parseZipForImport,
  type ImportPreview,
} from "@/features/import/services/import-service";
import { setUserName } from "@/features/settings/services/user-name-service";
import { AppError } from "@/lib/error";

interface ImportSuccess {
  kind: "full";
}

export function useImportEncounter() {
  const { setBrandColor } = useTheme();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<ImportSuccess | null>(null);

  async function handleFileDrop(nextFile: File): Promise<void> {
    setFile(nextFile);
    setPreview(null);
    setError(null);
    setSuccess(null);
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
      await confirmImport(preview);

      if (preview.preview.data.brandColor) {
        setBrandColor(preview.preview.data.brandColor as BrandColor);
      }
      if (preview.preview.data.exportedBy) {
        setUserName(preview.preview.data.exportedBy);
      }
      setSuccess({ kind: "full" });

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
    setSuccess(null);
    setIsParsing(false);
    setIsImporting(false);
  }

  return {
    file,
    preview,
    isParsing,
    isImporting,
    error,
    success,
    handleFileDrop,
    handleConfirm,
    handleReset,
  };
}
