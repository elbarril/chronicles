import { expect, test, type Page } from "@playwright/test";

async function createEncounterFlow(page: Page, suffix: string) {
  const groupName = `Grupo Crónica ${suffix}`;
  const fieldName = `Nota Crónica ${suffix}`;
  const fieldKey = `nota_cronica_${suffix}`;
  const formName = `Formulario Crónica ${suffix}`;
  const activityName = `Actividad Crónica ${suffix}`;

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

  await expect(page.getByRole("heading", { name: activityName })).toBeVisible();

  return {
    fieldName,
    activityName,
  };
}

test("generates chronicle from encounter and lists it", async ({ page }) => {
  const suffix = Date.now().toString();
  const { fieldName, activityName } = await createEncounterFlow(page, suffix);

  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel(new RegExp(fieldName)).fill("Observación para crónica");
  await page.getByRole("button", { name: "Guardar observación" }).click();

  await page.getByRole("button", { name: "Generar crónica" }).click();

  await expect(page).toHaveURL(/\/chronicles\/.+/);
  await expect(page.getByRole("heading", { name: `Crónica · ${activityName}` })).toBeVisible();
  await expect(page.getByText("Grupo: Grupo Crónica")).toBeVisible();
  await expect(page.getByText("Observación para crónica")).toBeVisible();

  await page.goto("/chronicles");
  await expect(page.getByRole("heading", { name: "Crónicas" })).toBeVisible();
  await expect(page.getByText(`Crónica · ${activityName}`)).toBeVisible();
});

test("shows empty observation summary when generating without observations", async ({ page }) => {
  const suffix = `empty-${Date.now().toString()}`;
  await createEncounterFlow(page, suffix);

  await page.getByRole("button", { name: "Generar crónica" }).click();

  await expect(page).toHaveURL(/\/chronicles\/.+/);
  await expect(
    page.getByText("No hay observaciones registradas para este encuentro."),
  ).toBeVisible();
});
