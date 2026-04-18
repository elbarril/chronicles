import { useState } from "react";
import { toast } from "sonner";

import { type Field } from "@/domain/field";
import { observationMessages } from "@/features/observations/lib/messages";
import {
  createObservationDefinition,
  deleteObservationDefinition,
  updateObservationDefinition,
} from "@/features/observations/services/observation-service";
import { AppError } from "@/lib/error";

interface ObservationCreateInput {
  encounterId: string;
  participantId?: string;
  values: Record<string, unknown>;
}

interface ObservationUpdateInput {
  participantId?: string;
  values: Record<string, unknown>;
}

export function useObservationActions(fields: Field[]) {
  const [isSaving, setIsSaving] = useState(false);

  async function create(input: ObservationCreateInput) {
    setIsSaving(true);

    try {
      const observation = await createObservationDefinition(fields, input);
      toast.success(observationMessages.createdSuccess);
      return observation;
    } catch (error) {
      toast.error(observationMessages.createError);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function update(observationId: string, input: ObservationUpdateInput) {
    setIsSaving(true);

    try {
      const observation = await updateObservationDefinition(fields, observationId, input);
      toast.success(observationMessages.updatedSuccess);
      return observation;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "OBSERVATION_NOT_FOUND"
          ? observationMessages.notFound
          : observationMessages.updateError;
      toast.error(message);
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
      const message =
        error instanceof AppError && error.code === "OBSERVATION_NOT_FOUND"
          ? observationMessages.notFound
          : observationMessages.deleteError;
      toast.error(message);
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
