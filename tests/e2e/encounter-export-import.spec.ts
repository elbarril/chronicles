import { expect, test } from "@playwright/test";

test("can export everything from settings and import it back", async ({ page }, testInfo) => {
  const suffix = Date.now().toString();
  const groupName = `Grupo Export ${suffix}`;
  const fieldName = `Nota Export ${suffix}`;
  const fieldKey = `nota_export_${suffix}`;
  const formName = `Formulario Export ${suffix}`;
  const activityName = `Actividad Export ${suffix}`;

  await page.goto("/groups/new");
  await page.getByLabel("Nombre del grupo").fill(groupName);
  await page.getByPlaceholder("Participante 1").fill("Sofía");
  await page.getByRole("button", { name: "Guardar grupo" }).click();
  await expect(page.getByRole("heading", { name: "Grupos" })).toBeVisible();

  await page.goto("/fields/new");
  await page.getByLabel("Nombre del campo").fill(fieldName);
  await page.getByLabel("Clave técnica").fill(fieldKey);
  await page.getByLabel("Tipo").selectOption("text");
  await page.getByRole("button", { name: "Guardar campo" }).click();
  await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();

  await page.goto("/forms/new");
  await page.getByLabel("Nombre del formulario").fill(formName);
  const availableFieldsPanel = page.locator("div", { hasText: "Campos disponibles" }).first();
  await availableFieldsPanel
    .locator("li", { hasText: fieldName })
    .getByRole("button", { name: "Agregar" })
    .click();
  await page.getByRole("button", { name: "Guardar formulario" }).click();
  await expect(page.getByRole("heading", { name: "Formularios" })).toBeVisible();

  await page.goto("/encounters/new");
  await expect(page.getByRole("heading", { name: "Nuevo encuentro" })).toBeVisible();
  await page.getByLabel("Actividad").fill(activityName);
  await page.getByLabel("Grupo").selectOption({ label: groupName });
  await page.getByLabel("Formulario").selectOption({ label: `${formName} (v1)` });
  await page.getByRole("button", { name: "Crear encuentro" }).click();

  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel(new RegExp(fieldName)).fill("Observación exportable");
  await page.getByRole("button", { name: "Guardar observación" }).click();

  await page.goto("/settings");
  await expect(page.getByRole("heading", { name: "Exportar todo" })).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /^Exportar todo/ }).click(),
  ]);

  const downloadPath = testInfo.outputPath(`chronicle-${suffix}.zip`);
  await download.saveAs(downloadPath);

  // Now drop the same ZIP into the import section in the same page.
  await page.locator('input[type="file"]').setInputFiles(downloadPath);

  await expect(
    page.getByRole("heading", { name: "Vista previa de importación completa" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Importar" }).click();

  // The success card title is "Importación completada" — there is also a
  // toast with the same text but a trailing dot, which would trigger
  // strict-mode if we matched too loosely.
  await expect(page.getByText("Importación completada", { exact: true })).toBeVisible();

  // Sanity check: the encounter we created should still be there.
  await page.goto("/encounters");
  await expect(page.getByRole("heading", { name: "Encuentros" })).toBeVisible();
  await expect(page.getByRole("link", { name: activityName }).first()).toBeVisible();
});
