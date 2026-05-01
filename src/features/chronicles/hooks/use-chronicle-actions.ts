import { useState } from "react";
import { toast } from "sonner";

import { type Chronicle } from "@/domain/chronicle";
import { chronicleMessages } from "@/features/chronicles/lib/messages";
import {
  generateChronicle,
  type GenerateChronicleResult,
  removeChronicle,
} from "@/features/chronicles/services/chronicle-service";
import { AppError } from "@/lib/error";

function aiFallbackMessage(result: GenerateChronicleResult): string {
  if (result.aiFailCode === "AI_RATE_LIMITED") return chronicleMessages.aiRateLimitWarning;
  if (result.aiFailCode === "AI_KEY_INVALID") return chronicleMessages.aiKeyInvalidWarning;
  return chronicleMessages.aiFallbackWarning;
}

export function useChronicleActions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function generate(encounterId: string): Promise<Chronicle> {
    setIsGenerating(true);

    try {
      const result = await generateChronicle(encounterId);
      if (result.aiFailed) {
        toast.warning(aiFallbackMessage(result));
      } else if (result.usedAi) {
        toast.success(chronicleMessages.createSuccessAi);
      } else {
        toast.success(chronicleMessages.createSuccess);
      }
      return result.chronicle;
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

  async function regenerate(encounterId: string): Promise<Chronicle> {
    setIsGenerating(true);

    try {
      const result = await generateChronicle(encounterId);
      if (result.aiFailed) {
        toast.warning(aiFallbackMessage(result));
      } else if (result.usedAi) {
        toast.success(chronicleMessages.regenerateSuccessAi);
      } else {
        toast.success(chronicleMessages.regenerateSuccess);
      }
      return result.chronicle;
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
