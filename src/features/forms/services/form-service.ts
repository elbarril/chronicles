import {
  observationFormInputSchema,
  type ObservationForm,
  type ObservationFormInput,
} from "@/domain/form";
import { listActiveFields } from "@/infra/db/repositories/field-repository";
import {
  archiveForm,
  createForm,
  getFormById,
  isFormNameUnique,
  listActiveForms,
  listArchivedForms,
  restoreForm,
  updateForm,
} from "@/infra/db/repositories/form-repository";
import { AppError } from "@/lib/error";

function normalizeName(name: string): string {
  return name.trim();
}

async function ensureUniqueName(name: string, excludeId?: string): Promise<void> {
  const unique = await isFormNameUnique(name, excludeId);

  if (!unique) {
    throw new AppError("FORM_NAME_TAKEN", "A form with the same name already exists.");
  }
}

function parseInput(input: ObservationFormInput): ObservationFormInput {
  return observationFormInputSchema.parse({
    name: normalizeName(input.name),
    fieldIds: input.fieldIds,
  });
}

export async function createObservationForm(input: ObservationFormInput): Promise<ObservationForm> {
  const parsed = parseInput(input);

  await ensureUniqueName(parsed.name);

  return createForm(parsed);
}

export async function updateObservationForm(
  id: string,
  input: ObservationFormInput,
): Promise<ObservationForm> {
  const parsed = parseInput(input);

  await ensureUniqueName(parsed.name, id);

  const updated = await updateForm(id, parsed);

  if (!updated) {
    throw new AppError("FORM_NOT_FOUND", "Form not found for update.");
  }

  return updated;
}

export async function archiveObservationForm(id: string): Promise<void> {
  const archived = await archiveForm(id);

  if (!archived) {
    throw new AppError("FORM_ARCHIVE_FAILED", "Failed to archive form.");
  }
}

export async function restoreObservationForm(id: string): Promise<void> {
  const restored = await restoreForm(id);

  if (!restored) {
    throw new AppError("FORM_RESTORE_FAILED", "Failed to restore form.");
  }
}

export async function listObservationForms(
  status: "active" | "archived",
): Promise<ObservationForm[]> {
  return status === "active" ? listActiveForms() : listArchivedForms();
}

export async function getObservationForm(id: string): Promise<ObservationForm | undefined> {
  return getFormById(id);
}

export async function listAvailableFieldsForForm(): ReturnType<typeof listActiveFields> {
  return listActiveFields();
}
