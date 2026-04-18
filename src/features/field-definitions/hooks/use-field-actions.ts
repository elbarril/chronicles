import { useState } from "react";
import { toast } from "sonner";

import { type FieldFormInput } from "@/domain/field";
import {
  archiveFieldDefinition,
  createFieldDefinition,
  restoreFieldDefinition,
  updateFieldDefinition,
} from "@/features/field-definitions/services/field-service";

export function useFieldActions() {
  const [isSaving, setIsSaving] = useState(false);

  async function create(input: FieldFormInput) {
    setIsSaving(true);

    try {
      const field = await createFieldDefinition(input);
      toast.success("Campo creado correctamente.");
      return field;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear el campo.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function update(id: string, input: FieldFormInput) {
    setIsSaving(true);

    try {
      const field = await updateFieldDefinition(id, input);
      toast.success("Campo actualizado.");
      return field;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el campo.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function archive(id: string) {
    try {
      await archiveFieldDefinition(id);
      toast.success("Campo archivado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo archivar el campo.");
      throw error;
    }
  }

  async function restore(id: string) {
    try {
      await restoreFieldDefinition(id);
      toast.success("Campo restaurado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo restaurar el campo.");
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
