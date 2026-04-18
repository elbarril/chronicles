import { expect, test } from "@playwright/test";

test("can compose, reorder, version, archive and restore a form", async ({ page }) => {
  const suffix = Date.now().toString();
  const firstFieldName = `Participación ${suffix}`;
  const secondFieldName = `Ánimo ${suffix}`;
  const formName = `Sesión grupal ${suffix}`;
  const firstFieldKey = `participacion_${suffix}`;
  const secondFieldKey = `animo_${suffix}`;

  await page.goto("/fields/new");
  await page.getByLabel("Nombre del campo").fill(firstFieldName);
  await page.getByLabel("Clave técnica").fill(firstFieldKey);
  await page.getByLabel("Tipo").selectOption("number");
  await page.getByRole("button", { name: "Guardar campo" }).click();
  await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();
  await expect(page.getByRole("cell", { name: firstFieldName })).toBeVisible();

  await page.goto("/fields/new");
  await page.getByLabel("Nombre del campo").fill(secondFieldName);
  await page.getByLabel("Clave técnica").fill(secondFieldKey);
  await page.getByLabel("Tipo").selectOption("text");
  await page.getByRole("button", { name: "Guardar campo" }).click();
  await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();
  await expect(page.getByRole("cell", { name: secondFieldName })).toBeVisible();

  await page.goto("/forms");
  await page.getByRole("link", { name: "Nuevo formulario" }).click();

  await page.getByLabel("Nombre del formulario").fill(formName);

  const selectedList = page.locator("ol").first();
  const availableFieldsPanel = page.locator("div", { hasText: "Campos disponibles" }).first();

  await availableFieldsPanel
    .locator("li", { hasText: firstFieldName })
    .getByRole("button", { name: "Agregar" })
    .click();
  await availableFieldsPanel
    .locator("li", { hasText: secondFieldName })
    .getByRole("button", { name: "Agregar" })
    .click();

  await expect(selectedList.locator("li").first()).toContainText(firstFieldName);
  await selectedList
    .locator("li", { hasText: secondFieldName })
    .getByRole("button", { name: new RegExp(`subir campo ${secondFieldName}`, "i") })
    .click();
  await expect(selectedList.locator("li").first()).toContainText(secondFieldName);

  await page.getByRole("button", { name: "Guardar formulario" }).click();
  await expect(page.getByRole("heading", { name: "Formularios" })).toBeVisible();
  await expect(page.getByRole("cell", { name: formName })).toBeVisible();
  const activeFormRow = page.locator("tr", { hasText: formName }).first();
  await expect(activeFormRow).toContainText("1");

  await page.getByRole("link", { name: "Editar" }).first().click();
  await selectedList
    .locator("li", { hasText: firstFieldName })
    .getByRole("button", { name: new RegExp(`quitar campo ${firstFieldName}`, "i") })
    .click();
  await page.getByRole("button", { name: "Guardar formulario" }).click();

  await expect(page.locator("tr", { hasText: formName }).first()).toContainText("2");

  await page.getByRole("button", { name: "Archivar" }).first().click();
  await page.getByRole("button", { name: "Archivados" }).click();
  await expect(page.getByRole("cell", { name: formName })).toBeVisible();

  await page.getByRole("button", { name: "Restaurar" }).first().click();
  await page.getByRole("button", { name: "Activos" }).click();
  await expect(page.getByRole("cell", { name: formName })).toBeVisible();
});
