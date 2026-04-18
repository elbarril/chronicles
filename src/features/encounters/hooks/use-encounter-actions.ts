import { useState } from "react";
import { toast } from "sonner";

import { type EncounterInput } from "@/domain/encounter";
import { encounterMessages } from "@/features/encounters/lib/messages";
import {
  createEncounterDefinition,
  finishEncounterDefinition,
  updateEncounterDefinition,
} from "@/features/encounters/services/encounter-service";
import { AppError } from "@/lib/error";

export function useEncounterActions() {
  const [isSaving, setIsSaving] = useState(false);

  async function create(input: EncounterInput) {
    setIsSaving(true);

    try {
      const encounter = await createEncounterDefinition(input);
      toast.success(encounterMessages.createdSuccess);
      return encounter;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "ENCOUNTER_FORM_NOT_FOUND"
          ? encounterMessages.formNotFound
          : error instanceof AppError && error.code === "ENCOUNTER_FORM_ARCHIVED"
            ? encounterMessages.formArchived
            : error instanceof AppError && error.code === "ENCOUNTER_GROUP_NOT_FOUND"
              ? encounterMessages.groupNotFound
              : encounterMessages.createError;
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function update(id: string, input: Pick<EncounterInput, "activity">) {
    setIsSaving(true);

    try {
      const encounter = await updateEncounterDefinition(id, input);
      toast.success(encounterMessages.updatedSuccess);
      return encounter;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "ENCOUNTER_NOT_FOUND"
          ? encounterMessages.notFound
          : encounterMessages.updateError;
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function finish(id: string) {
    try {
      const encounter = await finishEncounterDefinition(id);
      toast.success(encounterMessages.finishedSuccess);
      return encounter;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "ENCOUNTER_NOT_FOUND"
          ? encounterMessages.notFound
          : encounterMessages.finishError;
      toast.error(message);
      throw error;
    }
  }

  return {
    isSaving,
    create,
    update,
    finish,
  };
}
