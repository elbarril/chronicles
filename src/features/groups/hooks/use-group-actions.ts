import { useState } from "react";
import { toast } from "sonner";

import { type GroupInput } from "@/domain/group";
import { groupMessages } from "@/features/groups/lib/messages";
import {
  archiveGroupDefinition,
  createGroupDefinition,
  restoreGroupDefinition,
  updateGroupDefinition,
} from "@/features/groups/services/group-service";
import { AppError } from "@/lib/error";

export function useGroupActions() {
  const [isSaving, setIsSaving] = useState(false);

  async function create(input: GroupInput) {
    setIsSaving(true);

    try {
      const group = await createGroupDefinition(input);
      toast.success(groupMessages.createdSuccess);
      return group;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "GROUP_NAME_TAKEN"
          ? groupMessages.nameAlreadyTaken
          : error instanceof AppError && error.code === "GROUP_EMPTY_PARTICIPANTS"
            ? groupMessages.emptyParticipants
            : groupMessages.createError;
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function update(id: string, input: GroupInput) {
    setIsSaving(true);

    try {
      const group = await updateGroupDefinition(id, input);
      toast.success(groupMessages.updatedSuccess);
      return group;
    } catch (error) {
      const message =
        error instanceof AppError && error.code === "GROUP_NAME_TAKEN"
          ? groupMessages.nameAlreadyTaken
          : error instanceof AppError && error.code === "GROUP_EMPTY_PARTICIPANTS"
            ? groupMessages.emptyParticipants
            : error instanceof AppError && error.code === "GROUP_NOT_FOUND"
              ? groupMessages.notFound
              : groupMessages.updateError;
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function archive(id: string) {
    try {
      await archiveGroupDefinition(id);
      toast.success(groupMessages.archivedSuccess);
    } catch (error) {
      toast.error(groupMessages.archiveError);
      throw error;
    }
  }

  async function restore(id: string) {
    try {
      await restoreGroupDefinition(id);
      toast.success(groupMessages.restoredSuccess);
    } catch (error) {
      toast.error(groupMessages.restoreError);
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
