import {
  fieldFormSchema,
  fieldTypes,
  type Field,
  type FieldFormInput,
  type FieldType,
} from "@/domain/field";
import { getDefaultConfig } from "@/features/field-definitions/lib/field-defaults";
import {
  archiveField,
  createField,
  getFieldById,
  isFieldKeyUnique,
  listActiveFields,
  listArchivedFields,
  restoreField,
  updateField,
} from "@/infra/db/repositories/field-repository";
import { AppError } from "@/lib/error";
import { slugifyLabel } from "@/lib/slugify";

function normalizeKey(value: string): string {
  return slugifyLabel(value).toLowerCase();
}

async function ensureUniqueKey(key: string, excludeId?: string): Promise<void> {
  const unique = await isFieldKeyUnique(key, excludeId);

  if (!unique) {
    throw new AppError("FIELD_KEY_TAKEN", "A field with the same key already exists.");
  }
}

export async function createFieldDefinition(input: FieldFormInput): Promise<Field> {
  const parsed = fieldFormSchema.parse({
    ...input,
    key: normalizeKey(input.key),
  });

  await ensureUniqueKey(parsed.key);

  return createField(parsed);
}

export async function updateFieldDefinition(id: string, input: FieldFormInput): Promise<Field> {
  const parsed = fieldFormSchema.parse({
    ...input,
    key: normalizeKey(input.key),
  });

  await ensureUniqueKey(parsed.key, id);

  const updated = await updateField(id, parsed);

  if (!updated) {
    throw new AppError("FIELD_NOT_FOUND", "Field not found for update.");
  }

  return updated;
}

export async function archiveFieldDefinition(id: string): Promise<void> {
  const archived = await archiveField(id);

  if (!archived) {
    throw new AppError("FIELD_ARCHIVE_FAILED", "Failed to archive field.");
  }
}

export async function restoreFieldDefinition(id: string): Promise<void> {
  const restored = await restoreField(id);

  if (!restored) {
    throw new AppError("FIELD_RESTORE_FAILED", "Failed to restore field.");
  }
}

export async function listFieldDefinitions(status: "active" | "archived"): Promise<Field[]> {
  return status === "active" ? listActiveFields() : listArchivedFields();
}

export async function getFieldDefinition(id: string): Promise<Field | undefined> {
  return getFieldById(id);
}

export function getFieldTypes(): readonly FieldType[] {
  return fieldTypes;
}

export function createFieldKeyFromLabel(label: string): string {
  return normalizeKey(label);
}

export function createDefaultConfigForType(type: FieldType) {
  return getDefaultConfig(type);
}
