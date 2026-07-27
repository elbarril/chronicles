import { expect, test } from "@playwright/test";

test("can export everything from settings and import it back", async ({ page }, testInfo) => {
  const suffix = Date.now().toString();
  const projectName = `Proyecto Export ${suffix}`;
  const formName = "Observación de encuentro";
  const encounterName = `Encuentro Export ${suffix}`;

  // Reuse the seeded default form ("Observación de encuentro") instead
  // of authoring fields/forms manually; field authoring is covered by
  // fields-from-form-builder.spec.ts.
  await page.goto("/projects/new");
  await page.getByLabel("Nombre del proyecto").fill(projectName);
  await page.getByPlaceholder("Participante 1").fill("Sofía");
  await page.getByRole("button", { name: "Guardar proyecto" }).click();
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

  await page.goto("/projects");
  await page.getByRole("link", { name: projectName }).first().click();
  await page.getByRole("link", { name: "Crear encuentro" }).click();
  await page.getByLabel("Nombre del encuentro").fill(encounterName);
  await page.getByLabel(/^Sofía$/).check();
  await page.getByRole("button", { name: "Crear encuentro" }).click();
  await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel("Formulario").selectOption({ label: formName });
  await page.getByLabel(/Transcripción de audio de observación/).fill("Observación exportable");
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
