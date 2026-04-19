import { useState } from "react";
import { toast } from "sonner";

import { chronicleMessages } from "@/features/chronicles/lib/messages";
import {
  generateChronicle,
  removeChronicle,
} from "@/features/chronicles/services/chronicle-service";
import { AppError } from "@/lib/error";

export function useChronicleActions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function generate(encounterId: string) {
    setIsGenerating(true);

    try {
      const chronicle = await generateChronicle(encounterId);
      toast.success(chronicleMessages.createSuccess);
      return chronicle;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "CHRONICLE_ENCOUNTER_REQUIRED"
          ? chronicleMessages.encounterRequired
          : chronicleMessages.createError;

      toast.error(message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }

  async function regenerate(encounterId: string) {
    setIsGenerating(true);

    try {
      const chronicle = await generateChronicle(encounterId);
      toast.success(chronicleMessages.regenerateSuccess);
      return chronicle;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "CHRONICLE_ENCOUNTER_REQUIRED"
          ? chronicleMessages.encounterRequired
          : chronicleMessages.createError;

      toast.error(message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }

  async function remove(chronicleId: string) {
    setIsDeleting(true);

    try {
      await removeChronicle(chronicleId);
      toast.success(chronicleMessages.deleteSuccess);
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "CHRONICLE_NOT_FOUND"
          ? chronicleMessages.notFound
          : chronicleMessages.deleteError;

      toast.error(message);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    isGenerating,
    isDeleting,
    generate,
    regenerate,
    remove,
  };
}
