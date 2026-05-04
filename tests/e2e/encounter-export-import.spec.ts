import { expect, test } from "@playwright/test";

test("can export everything from settings and import it back", async ({ page }, testInfo) => {
  const suffix = Date.now().toString();
  const projectName = `Proyecto Export ${suffix}`;
  const fieldName = `Nota Export ${suffix}`;
  const formName = `Formulario Export ${suffix}`;
  const encounterName = `Encuentro Export ${suffix}`;

  await page.goto("/projects/new");
  await page.getByLabel("Nombre del proyecto").fill(projectName);
  await page.getByPlaceholder("Participante 1").fill("Sofía");
  await page.getByRole("button", { name: "Guardar proyecto" }).click();
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

  await page.goto("/fields/new");
  await page.getByLabel("Nombre del campo").fill(fieldName);
  await page.getByLabel("Tipo").selectOption("text");
  await page.getByRole("button", { name: "Guardar campo" }).click();
  await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();

  await page.goto("/forms/new");
  await page.getByLabel("Nombre del formulario").fill(formName);
  const availableFieldsPanel = page.locator("div", { hasText: "Campos disponibles" }).first();
  await availableFieldsPanel
    .locator("li", { hasText: fieldName })
    .locator("button").first()
    .click();
  await page.getByRole("button", { name: "Guardar formulario" }).click();
  await expect(page.getByRole("heading", { name: "Formularios" })).toBeVisible();

  await page.goto("/projects");
  await page.getByRole("link", { name: projectName }).first().click();
  await page.getByRole("link", { name: "Crear encuentro" }).click();
  await page.getByLabel("Nombre del encuentro").fill(encounterName);
  await page.getByLabel(/^Sofía$/).check();
  await page.getByRole("button", { name: "Crear encuentro" }).click();
  await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel("Formulario").selectOption({ label: formName });
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

  await page.locator('input[type="file"]').setInputFiles(downloadPath);

  await expect(
    page.getByRole("heading", { name: "Vista previa de importación completa" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Importar" }).click();

  await expect(page.getByText("Importación completada", { exact: true })).toBeVisible();

  // Sanity check: the project we created is still there.
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: "Proyectos" })).toBeVisible();
  await expect(page.getByRole("link", { name: projectName }).first()).toBeVisible();
});
