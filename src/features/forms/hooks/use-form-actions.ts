import { useState } from "react";
import { toast } from "sonner";

import { type ObservationFormInput } from "@/domain/form";
import { formMessages } from "@/features/forms/lib/messages";
import {
  archiveObservationForm,
  createObservationForm,
  restoreObservationForm,
  updateObservationForm,
} from "@/features/forms/services/form-service";
import { AppError } from "@/lib/error";

export function useFormActions() {
  const [isSaving, setIsSaving] = useState(false);

  async function create(input: ObservationFormInput) {
    setIsSaving(true);

    try {
      const form = await createObservationForm(input);
      toast.success(formMessages.createdSuccess);
      return form;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "FORM_NAME_TAKEN"
          ? formMessages.nameAlreadyTaken
          : formMessages.createError;
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function update(id: string, input: ObservationFormInput) {
    setIsSaving(true);

    try {
      const form = await updateObservationForm(id, input);
      toast.success(formMessages.updatedSuccess);
      return form;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "FORM_NAME_TAKEN"
          ? formMessages.nameAlreadyTaken
          : error instanceof AppError && error.code === "FORM_NOT_FOUND"
            ? formMessages.notFound
            : formMessages.updateError;
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function archive(id: string) {
    try {
      await archiveObservationForm(id);
      toast.success(formMessages.archivedSuccess);
    } catch (error) {
      toast.error(formMessages.archiveError);
      throw error;
    }
  }

  async function restore(id: string) {
    try {
      await restoreObservationForm(id);
      toast.success(formMessages.restoredSuccess);
    } catch (error) {
      toast.error(formMessages.restoreError);
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
