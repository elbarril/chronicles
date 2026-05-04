import {
  observationFormSchema,
  type FormFieldInstance,
  type ObservationForm,
  type ObservationFormInput,
} from "@/domain/form";
import { db } from "@/infra/db/client";

function nowIsoString(): string {
  return new Date().toISOString();
}

function normalizeName(name: string): string {
  return name.trim();
}

/** Resolve field instances from input, assigning new instanceIds to entries
 *  that arrive without one (freshly added rows in the builder). */
function resolveInstances(inputFields: ObservationFormInput["fields"]): FormFieldInstance[] {
  return inputFields.map((entry) => ({
    instanceId: entry.instanceId ?? crypto.randomUUID(),
    fieldId: entry.fieldId,
    ...(entry.labelOverride !== undefined ? { labelOverride: entry.labelOverride } : {}),
  }));
}

export async function createForm(data: ObservationFormInput): Promise<ObservationForm> {
  const now = nowIsoString();

  const form: ObservationForm = observationFormSchema.parse({
    id: crypto.randomUUID(),
    name: normalizeName(data.name),
    fields: resolveInstances(data.fields),
    version: 1,
    createdAt: now,
    updatedAt: now,
    archivedAt: "",
  });

  await db.forms.add(form);

  return form;
}

export async function updateForm(
  id: string,
  data: ObservationFormInput,
): Promise<ObservationForm | null> {
  const previous = await db.forms.get(id);

  if (!previous) {
    return null;
  }

  const next = observationFormSchema.parse({
    ...previous,
    name: normalizeName(data.name),
    fields: resolveInstances(data.fields),
    version: previous.version + 1,
    updatedAt: nowIsoString(),
  });

  await db.forms.put(next);

  return next;
}

export async function archiveForm(id: string): Promise<boolean> {
  const now = nowIsoString();
  const changes = await db.forms.update(id, {
    archivedAt: now,
    updatedAt: now,
  });

  return changes > 0;
}

export async function restoreForm(id: string): Promise<boolean> {
  const now = nowIsoString();
  const changes = await db.forms.update(id, {
    archivedAt: "",
    updatedAt: now,
  });

  return changes > 0;
}

export async function getFormById(id: string): Promise<ObservationForm | undefined> {
  return db.forms.get(id);
}

export async function listActiveForms(): Promise<ObservationForm[]> {
  return db.forms
    .where("archivedAt")
    .equals("")
    .toArray()
    .then((rows) => [...rows].sort((left, right) => right.createdAt.localeCompare(left.createdAt)));
}

export async function listArchivedForms(): Promise<ObservationForm[]> {
  return db.forms
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

export async function deleteForm(id: string): Promise<boolean> {
  const form = await db.forms.get(id);

  if (!form) {
    return false;
  }

  await db.forms.delete(id);

  return true;
}

export async function isFormNameUnique(name: string, excludeId?: string): Promise<boolean> {
  const normalizedName = normalizeName(name).toLowerCase();
  const forms = await db.forms.toArray();

  return forms.every(
    (form) =>
      form.id === excludeId ||
      form.archivedAt !== "" ||
      form.name.trim().toLowerCase() !== normalizedName,
  );
}
