import { expect, test } from "@playwright/test";

const audioFieldName = "Audio de observación";
const textFieldName = "Transcripción de audio de observación";
const defaultFormName = "Observación de encuentro";

/**
 * Verifies that:
 * - Default fields and form are seeded automatically on app boot.
 * - A default field can be archived and restored from inside the
 *   "Editar campos" dialog (no /fields page exists anymore).
 * - A default form can be archived from /forms and restored via the
 *   "Cargar formulario por defecto" button on the form list.
 */
test("preloads default fields and form, and they can be archived and restored", async ({
  page,
}) => {
  // Default form is visible on /forms.
  await page.goto("/forms");
  await expect(page.getByRole("heading", { name: "Formularios" })).toBeVisible();
  await expect(page.getByRole("cell", { name: defaultFormName })).toBeVisible();

  // Default fields are visible inside the "Editar campos" dialog.
  await page.goto("/forms/new");
  await page.getByRole("button", { name: "Editar campos" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("cell", { name: audioFieldName, exact: true })).toBeVisible();
  await expect(dialog.getByRole("cell", { name: textFieldName, exact: true })).toBeVisible();

  // Archive the audio default field, then restore it from the
  // "Archivados" tab inside the dialog.
  await dialog
    .locator("tr", { hasText: audioFieldName })
    .getByRole("button", { name: "Archivar" })
    .first()
    .click();
  await expect(dialog.getByRole("cell", { name: audioFieldName, exact: true })).toHaveCount(0);

  await dialog.getByRole("tab", { name: "Archivados" }).click();
  await expect(dialog.getByRole("cell", { name: audioFieldName, exact: true })).toBeVisible();

  await dialog
    .locator("tr", { hasText: audioFieldName })
    .getByRole("button", { name: "Restaurar" })
    .first()
    .click();
  await expect(dialog.getByRole("cell", { name: audioFieldName, exact: true })).toHaveCount(0);

  await dialog.getByRole("tab", { name: "Activos" }).click();
  await expect(dialog.getByRole("cell", { name: audioFieldName, exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  // Archive the default form, then bring it back via "Cargar formulario
  // por defecto", which also re-creates default fields if needed.
  await page.goto("/forms");
  await page
    .locator("tr", { hasText: defaultFormName })
    .getByRole("button", { name: "Archivar" })
    .click();
  await expect(page.getByRole("cell", { name: defaultFormName })).toHaveCount(0);

  await page.getByRole("button", { name: "Cargar formulario por defecto" }).click();
  await expect(page.getByRole("cell", { name: defaultFormName })).toBeVisible();
});
