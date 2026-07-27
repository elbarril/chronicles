import { expect, test } from "@playwright/test";

/**
 * Verifies the full form-builder flow without leaving /forms/new:
 * the seeded default fields ("Audio de observación" and "Transcripción de
 * audio de observación") are reused so the test stays focused on the form
 * composition flow (add → save → version → archive →
 * restore) rather than on field creation, which is exercised by
 * `fields-from-form-builder.spec.ts`.
 */
test("can compose, version, archive and restore a form", async ({ page }) => {
  const suffix = Date.now().toString();
  const formName = `Sesión grupal ${suffix}`;
  const audioFieldName = "Audio de observación";
  const textFieldName = "Transcripción de audio de observación";

  await page.goto("/forms/new");
  await page.getByLabel("Nombre del formulario").fill(formName);

  const availableFieldsPanel = page.locator("div", { hasText: "Campos disponibles" }).first();
  const selectedList = page.locator('ol[aria-label="Campos seleccionados del formulario"]');

  // Smoke-check that the dialog exists and surfaces the seeded defaults; the
  // dialog itself is exercised end-to-end in fields-from-form-builder.spec.ts.
  await page.getByRole("button", { name: "Editar campos" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("cell", { name: audioFieldName, exact: true })).toBeVisible();
  await expect(dialog.getByRole("cell", { name: textFieldName, exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  // Add one instance using the available-fields picker button.
  await availableFieldsPanel
    .locator("li", { hasText: textFieldName })
    .locator("button")
    .first()
    .click();

  await expect(selectedList.locator("li")).toHaveCount(1);
  await expect(selectedList.getByText(textFieldName)).toBeVisible();

  // Save the new form.
  await page.getByRole("button", { name: "Guardar formulario" }).click();
  await expect(page.getByRole("heading", { name: "Formularios" })).toBeVisible();
  await expect(page.getByRole("cell", { name: formName })).toBeVisible();

  // Edit the form: change the name (versioning) and save again.
  await page.locator("tr", { hasText: formName }).getByRole("link", { name: "Editar" }).click();
  await expect(page.getByRole("heading", { name: "Editar formulario" })).toBeVisible();
  await page.getByLabel("Nombre del formulario").fill(`${formName} (editado)`);
  await page.getByRole("button", { name: "Guardar formulario" }).click();
  await expect(page.getByRole("heading", { name: "Formularios" })).toBeVisible();
  await expect(page.getByRole("cell", { name: `${formName} (editado)` })).toBeVisible();

  // Archive the form, then verify it lands in the archived tab.
  await page.locator("tr", { hasText: `${formName} (editado)` }).getByRole("button", { name: "Archivar" }).click();
  await page.getByRole("button", { name: "Archivados" }).click();
  await expect(page.getByRole("cell", { name: `${formName} (editado)` })).toBeVisible();

  // Restore it and verify it comes back to the active tab.
  await page
    .locator("tr", { hasText: `${formName} (editado)` })
    .getByRole("button", { name: "Restaurar" })
    .click();
  await page.getByRole("button", { name: "Activos" }).click();
  await expect(page.getByRole("cell", { name: `${formName} (editado)` })).toBeVisible();
});
