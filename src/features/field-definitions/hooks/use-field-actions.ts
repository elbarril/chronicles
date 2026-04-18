import { useState } from "react";
import { toast } from "sonner";

import { type FieldFormInput } from "@/domain/field";
import { fieldMessages } from "@/features/field-definitions/lib/messages";
import {
  archiveFieldDefinition,
  createFieldDefinition,
  restoreFieldDefinition,
  updateFieldDefinition,
} from "@/features/field-definitions/services/field-service";
import { AppError } from "@/lib/error";

export function useFieldActions() {
  const [isSaving, setIsSaving] = useState(false);

  async function create(input: FieldFormInput) {
    setIsSaving(true);

    try {
      const field = await createFieldDefinition(input);
      toast.success(fieldMessages.createdSuccess);
      return field;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "FIELD_KEY_TAKEN"
          ? fieldMessages.keyAlreadyTaken
          : fieldMessages.createError;
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function update(id: string, input: FieldFormInput) {
    setIsSaving(true);

    try {
      const field = await updateFieldDefinition(id, input);
      toast.success(fieldMessages.updatedSuccess);
      return field;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "FIELD_KEY_TAKEN"
          ? fieldMessages.keyAlreadyTaken
          : error instanceof AppError && error.code === "FIELD_NOT_FOUND"
            ? fieldMessages.notFound
            : fieldMessages.updateError;
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function archive(id: string) {
    try {
      await archiveFieldDefinition(id);
      toast.success(fieldMessages.archivedSuccess);
    } catch (error) {
      toast.error(fieldMessages.archiveError);
      throw error;
    }
  }

  async function restore(id: string) {
    try {
      await restoreFieldDefinition(id);
      toast.success(fieldMessages.restoredSuccess);
    } catch (error) {
      toast.error(fieldMessages.restoreError);
      throw error;
    }
  }

  return {
    isSaving,
    create,
    update,
    archive,
    restore,
  };
}
