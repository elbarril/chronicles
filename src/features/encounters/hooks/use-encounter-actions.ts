import { useState } from "react";
import { toast } from "sonner";

import { type EncounterInput } from "@/domain/encounter";
import { encounterMessages } from "@/features/encounters/lib/messages";
import {
  archiveEncounterDefinition,
  createEncounterDefinition,
  deleteEncounterDefinition,
  restoreEncounterDefinition,
  updateEncounterDefinition,
} from "@/features/encounters/services/encounter-service";
import { AppError } from "@/lib/error";

export function useEncounterActions() {
  const [isSaving, setIsSaving] = useState(false);

  function mapErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof AppError)) {
      return fallback;
    }

    switch (error.code) {
      case "ENCOUNTER_PROJECT_NOT_FOUND":
        return encounterMessages.projectNotFound;
      case "ENCOUNTER_PARTICIPANTS_INVALID":
        return encounterMessages.participantsInvalid;
      case "ENCOUNTER_TIME_INVALID":
        return encounterMessages.timeInvalid;
      case "ENCOUNTER_NOT_FOUND":
        return encounterMessages.notFound;
      default:
        return fallback;
    }
  }

  async function create(input: EncounterInput) {
    setIsSaving(true);

    try {
      const encounter = await createEncounterDefinition(input);
      toast.success(encounterMessages.createdSuccess);
      return encounter;
    } catch (error) {
      toast.error(mapErrorMessage(error, encounterMessages.createError));
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function update(id: string, input: EncounterInput) {
    setIsSaving(true);

    try {
      const encounter = await updateEncounterDefinition(id, input);
      toast.success(encounterMessages.updatedSuccess);
      return encounter;
    } catch (error) {
      toast.error(mapErrorMessage(error, encounterMessages.updateError));
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function archive(id: string) {
    try {
      const encounter = await archiveEncounterDefinition(id);
      toast.success(encounterMessages.archivedSuccess);
      return encounter;
    } catch (error) {
      toast.error(mapErrorMessage(error, encounterMessages.archiveError));
      throw error;
    }
  }

  async function restore(id: string) {
    try {
      const encounter = await restoreEncounterDefinition(id);
      toast.success(encounterMessages.restoredSuccess);
      return encounter;
    } catch (error) {
      toast.error(mapErrorMessage(error, encounterMessages.restoreError));
      throw error;
    }
  }

  async function remove(id: string) {
    try {
      await deleteEncounterDefinition(id);
      toast.success(encounterMessages.deletedSuccess);
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "ENCOUNTER_DELETE_NOT_ARCHIVED"
          ? encounterMessages.deleteNotArchived
          : encounterMessages.deleteError;
      toast.error(message);
      throw error;
    }
  }

  return {
    isSaving,
    create,
    update,
    archive,
    restore,
    remove,
  };
}
