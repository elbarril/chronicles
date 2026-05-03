import { useState } from "react";
import { toast } from "sonner";

import { observationMessages } from "@/features/observations/lib/messages";
import {
  createObservationDefinition,
  deleteObservationDefinition,
  updateObservationDefinition,
} from "@/features/observations/services/observation-service";
import { AppError } from "@/lib/error";

interface ObservationCreateInput {
  encounterId: string;
  formId: string;
  participantId?: string;
  title?: string;
  values: Record<string, unknown>;
}

interface ObservationUpdateInput {
  formId: string;
  participantId?: string;
  title?: string;
  values: Record<string, unknown>;
}

export function useObservationActions() {
  const [isSaving, setIsSaving] = useState(false);

  function mapErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof AppError)) {
      return fallback;
    }

    switch (error.code) {
      case "OBSERVATION_FORM_NOT_FOUND":
        return observationMessages.formNotFound;
      case "FORM_ARCHIVED":
        return observationMessages.formArchived;
      case "OBSERVATION_NOT_FOUND":
        return observationMessages.notFound;
      default:
        return fallback;
    }
  }

  async function create(input: ObservationCreateInput) {
    setIsSaving(true);

    try {
      const observation = await createObservationDefinition(input);
      toast.success(observationMessages.createdSuccess);
      return observation;
    } catch (error) {
      toast.error(mapErrorMessage(error, observationMessages.createError));
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function update(observationId: string, input: ObservationUpdateInput) {
    setIsSaving(true);

    try {
      const observation = await updateObservationDefinition(observationId, input);
      toast.success(observationMessages.updatedSuccess);
      return observation;
    } catch (error) {
      toast.error(mapErrorMessage(error, observationMessages.updateError));
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function remove(observationId: string) {
    try {
      await deleteObservationDefinition(observationId);
      toast.success(observationMessages.deletedSuccess);
    } catch (error) {
      toast.error(mapErrorMessage(error, observationMessages.deleteError));
      throw error;
    }
  }

  return {
    isSaving,
    create,
    update,
    remove,
  };
}
