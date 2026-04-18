import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  archiveObservationForm,
  createObservationForm,
  listObservationForms,
  restoreObservationForm,
  updateObservationForm,
} from "@/features/forms/services/form-service";
import { AppError } from "@/lib/error";

const {
  createFormMock,
  updateFormMock,
  archiveFormMock,
  restoreFormMock,
  listActiveFormsMock,
  listArchivedFormsMock,
  isFormNameUniqueMock,
  getFormByIdMock,
} = vi.hoisted(() => ({
  createFormMock: vi.fn(),
  updateFormMock: vi.fn(),
  archiveFormMock: vi.fn(),
  restoreFormMock: vi.fn(),
  listActiveFormsMock: vi.fn(),
  listArchivedFormsMock: vi.fn(),
  isFormNameUniqueMock: vi.fn(),
  getFormByIdMock: vi.fn(),
}));

vi.mock("@/infra/db/repositories/form-repository", () => ({
  createForm: createFormMock,
  updateForm: updateFormMock,
  archiveForm: archiveFormMock,
  restoreForm: restoreFormMock,
  listActiveForms: listActiveFormsMock,
  listArchivedForms: listArchivedFormsMock,
  isFormNameUnique: isFormNameUniqueMock,
  getFormById: getFormByIdMock,
}));

vi.mock("@/infra/db/repositories/field-repository", () => ({
  listActiveFields: vi.fn(),
}));

describe("form service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates form when name is unique", async () => {
    const now = new Date().toISOString();
    const createdForm = {
      id: crypto.randomUUID(),
      name: "Sesión inicial",
      fieldIds: [crypto.randomUUID()],
      version: 1,
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    };

    isFormNameUniqueMock.mockResolvedValue(true);
    createFormMock.mockResolvedValue(createdForm);

    const result = await createObservationForm({
      name: " Sesión inicial ",
      fieldIds: createdForm.fieldIds,
    });

    expect(result).toEqual(createdForm);
    expect(isFormNameUniqueMock).toHaveBeenCalledWith("Sesión inicial", undefined);
    expect(createFormMock).toHaveBeenCalledWith({
      name: "Sesión inicial",
      fieldIds: createdForm.fieldIds,
    });
  });

  it("throws when creating with duplicated active name", async () => {
    isFormNameUniqueMock.mockResolvedValue(false);

    await expect(
      createObservationForm({
        name: "Sesión inicial",
        fieldIds: [crypto.randomUUID()],
      }),
    ).rejects.toMatchObject({
      name: "AppError",
      code: "FORM_NAME_TAKEN",
    } satisfies Pick<AppError, "name" | "code">);
  });

  it("bumps version by delegating to repository update", async () => {
    const existingId = crypto.randomUUID();
    const now = new Date().toISOString();

    isFormNameUniqueMock.mockResolvedValue(true);
    updateFormMock.mockResolvedValue({
      id: existingId,
      name: "Sesión editada",
      fieldIds: [crypto.randomUUID()],
      version: 2,
      createdAt: now,
      updatedAt: now,
      archivedAt: "",
    });

    const result = await updateObservationForm(existingId, {
      name: "Sesión editada",
      fieldIds: [crypto.randomUUID()],
    });

    expect(result.version).toBe(2);
    expect(updateFormMock).toHaveBeenCalledTimes(1);
  });

  it("throws not found when repository cannot update", async () => {
    isFormNameUniqueMock.mockResolvedValue(true);
    updateFormMock.mockResolvedValue(null);

    await expect(
      updateObservationForm(crypto.randomUUID(), {
        name: "Sesión",
        fieldIds: [crypto.randomUUID()],
      }),
    ).rejects.toMatchObject({
      name: "AppError",
      code: "FORM_NOT_FOUND",
    } satisfies Pick<AppError, "name" | "code">);
  });

  it("selects active list by status", async () => {
    listActiveFormsMock.mockResolvedValue([]);

    await listObservationForms("active");

    expect(listActiveFormsMock).toHaveBeenCalledTimes(1);
    expect(listArchivedFormsMock).not.toHaveBeenCalled();
  });

  it("selects archived list by status", async () => {
    listArchivedFormsMock.mockResolvedValue([]);

    await listObservationForms("archived");

    expect(listArchivedFormsMock).toHaveBeenCalledTimes(1);
    expect(listActiveFormsMock).not.toHaveBeenCalled();
  });

  it("throws when archiving fails", async () => {
    archiveFormMock.mockResolvedValue(false);

    await expect(archiveObservationForm(crypto.randomUUID())).rejects.toMatchObject({
      name: "AppError",
      code: "FORM_ARCHIVE_FAILED",
    } satisfies Pick<AppError, "name" | "code">);
  });

  it("throws when restoring fails", async () => {
    restoreFormMock.mockResolvedValue(false);

    await expect(restoreObservationForm(crypto.randomUUID())).rejects.toMatchObject({
      name: "AppError",
      code: "FORM_RESTORE_FAILED",
    } satisfies Pick<AppError, "name" | "code">);
  });
});
