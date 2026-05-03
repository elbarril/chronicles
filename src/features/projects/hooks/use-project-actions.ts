import { useState } from "react";
import { toast } from "sonner";

import { type ProjectInput } from "@/domain/project";
import { projectMessages } from "@/features/projects/lib/messages";
import {
  archiveProjectDefinition,
  createProjectDefinition,
  restoreProjectDefinition,
  updateProjectDefinition,
} from "@/features/projects/services/project-service";
import { AppError } from "@/lib/error";

export function useProjectActions() {
  const [isSaving, setIsSaving] = useState(false);

  async function create(input: ProjectInput) {
    setIsSaving(true);

    try {
      const project = await createProjectDefinition(input);
      toast.success(projectMessages.createdSuccess);
      return project;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "PROJECT_NAME_TAKEN"
          ? projectMessages.nameAlreadyTaken
          : error instanceof AppError && error.code === "PROJECT_EMPTY_PARTICIPANTS"
            ? projectMessages.emptyParticipants
            : projectMessages.createError;
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function update(id: string, input: ProjectInput) {
    setIsSaving(true);

    try {
      const project = await updateProjectDefinition(id, input);
      toast.success(projectMessages.updatedSuccess);
      return project;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "PROJECT_NAME_TAKEN"
          ? projectMessages.nameAlreadyTaken
          : error instanceof AppError && error.code === "PROJECT_EMPTY_PARTICIPANTS"
            ? projectMessages.emptyParticipants
            : error instanceof AppError && error.code === "PROJECT_NOT_FOUND"
              ? projectMessages.notFound
              : projectMessages.updateError;
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function archive(id: string) {
    try {
      await archiveProjectDefinition(id);
      toast.success(projectMessages.archivedSuccess);
    } catch (error) {
      toast.error(projectMessages.archiveError);
      throw error;
    }
  }

  async function restore(id: string) {
    try {
      await restoreProjectDefinition(id);
      toast.success(projectMessages.restoredSuccess);
    } catch (error) {
      toast.error(projectMessages.restoreError);
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
