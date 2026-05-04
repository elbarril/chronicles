import { expect, test } from "@playwright/test";

/**
 * Fields are now managed exclusively from inside the form builder, via
 * the "Editar campos" dialog. This test exercises the full lifecycle
 * (create → archive → restore) without leaving /forms/new.
 */
test("can create, archive and restore a field from the form builder dialog", async ({ page }) => {
  const suffix = Date.now().toString();
  const fieldName = `Participación ${suffix}`;

  await page.goto("/forms/new");

  // Open the manage-fields dialog.
  await page.getByRole("button", { name: "Editar campos" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Campos" })).toBeVisible();

  // Create a new field from inside the dialog.
  await dialog.getByRole("button", { name: "+ Nuevo campo" }).click();
  await expect(dialog.getByRole("heading", { name: "Nuevo campo" })).toBeVisible();
  await dialog.getByLabel("Nombre del campo").fill(fieldName);
  await dialog.getByLabel("Tipo").selectOption("number");
  await dialog.getByRole("button", { name: "Guardar campo" }).click();

  // Back to list view, the new field shows up in the "Activos" tab.
  await expect(dialog.getByRole("cell", { name: fieldName })).toBeVisible();

  // Archive it from the dialog row actions.
  await dialog
    .locator("tr", { hasText: fieldName })
    .getByRole("button", { name: "Archivar" })
    .click();
  await expect(dialog.getByRole("cell", { name: fieldName })).toHaveCount(0);

  // Switch to the archived tab; the field shows up there.
  await dialog.getByRole("tab", { name: "Archivados" }).click();
  await expect(dialog.getByRole("cell", { name: fieldName })).toBeVisible();

  // Restore it.
  await dialog
    .locator("tr", { hasText: fieldName })
    .getByRole("button", { name: "Restaurar" })
    .click();
  await expect(dialog.getByRole("cell", { name: fieldName })).toHaveCount(0);

  // Verify it is back among the active fields.
  await dialog.getByRole("tab", { name: "Activos" }).click();
  await expect(dialog.getByRole("cell", { name: fieldName })).toBeVisible();
});
