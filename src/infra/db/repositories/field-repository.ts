import { fieldSchema, type Field, type FieldFormInput } from "@/domain/field";
import { db } from "@/infra/db/client";

function nowIsoString(): string {
  return new Date().toISOString();
}

export async function createField(data: FieldFormInput): Promise<Field> {
  const now = nowIsoString();

  const field: Field = fieldSchema.parse({
    id: crypto.randomUUID(),
    ...data,
    createdAt: now,
    updatedAt: now,
    archivedAt: "",
  });

  await db.fields.add(field);

  return field;
}

export async function updateField(
  id: string,
  data: Partial<Omit<Field, "id" | "createdAt" | "updatedAt">>,
): Promise<Field | null> {
  const previous = await db.fields.get(id);

  if (!previous) {
    return null;
  }

  const next = fieldSchema.parse({
    ...previous,
    ...data,
    id,
    updatedAt: nowIsoString(),
  });

  await db.fields.put(next);

  return next;
}

export async function archiveField(id: string): Promise<boolean> {
  const changes = await db.fields.update(id, {
    archivedAt: nowIsoString(),
    updatedAt: nowIsoString(),
  });

  return changes > 0;
}

export async function restoreField(id: string): Promise<boolean> {
  const changes = await db.fields.update(id, {
    archivedAt: "",
    updatedAt: nowIsoString(),
  });

  return changes > 0;
}

export async function getFieldById(id: string): Promise<Field | undefined> {
  return db.fields.get(id);
}

export async function listActiveFields(): Promise<Field[]> {
  return db.fields
    .where("archivedAt")
    .equals("")
    .toArray()
    .then((rows) => [...rows].sort((left, right) => right.createdAt.localeCompare(left.createdAt)));
}

export async function listArchivedFields(): Promise<Field[]> {
  return db.fields
    .where("archivedAt")
    .notEqual("")
    .toArray()
    .then((rows) => rows.filter((row) => row.archivedAt && row.archivedAt !== ""))
    .then((rows) =>
      [...rows].sort((left, right) =>
        (right.archivedAt ?? "").localeCompare(left.archivedAt ?? ""),
      ),
    );
}

export async function isFieldKeyUnique(key: string, excludeId?: string): Promise<boolean> {
  const normalizedKey = key.trim().toLowerCase();

  const sameKey = await db.fields.where("key").equals(normalizedKey).toArray();

  return sameKey.every((field) => field.id === excludeId || field.archivedAt !== "");
}
