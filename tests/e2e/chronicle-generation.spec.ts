import { expect, test, type Page } from "@playwright/test";

interface EncounterFixture {
  projectName: string;
  fieldName: string;
  formName: string;
  encounterName: string;
}

async function createEncounterFlow(page: Page, suffix: string): Promise<EncounterFixture> {
  const projectName = `Proyecto Crónica ${suffix}`;
  const fieldName = `Nota Crónica ${suffix}`;
  const fieldKey = `nota_cronica_${suffix}`;
  const formName = `Formulario Crónica ${suffix}`;
  const encounterName = `Encuentro Crónica ${suffix}`;

  await page.goto("/projects/new");
  await page.getByLabel("Nombre del proyecto").fill(projectName);
  await page.getByPlaceholder("Participante 1").fill("Sofía");
  await page.getByRole("button", { name: "Guardar proyecto" }).click();
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

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

  await page.goto("/projects");
  await page.getByRole("link", { name: projectName }).first().click();
  await page.getByRole("link", { name: "Crear encuentro" }).click();
  await page.getByLabel("Nombre del encuentro").fill(encounterName);
  await page.getByLabel(/^Sofía$/).check();
  await page.getByRole("button", { name: "Crear encuentro" }).click();
  await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

  return { projectName, fieldName, formName, encounterName };
}

test("generates chronicle from encounter chronicle page and lists it", async ({ page }) => {
  const suffix = Date.now().toString();
  const { projectName, fieldName, formName, encounterName } = await createEncounterFlow(
    page,
    suffix,
  );

  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel("Formulario").selectOption({ label: `${formName} (v1)` });
  await page.getByLabel(new RegExp(fieldName)).fill("Observación para crónica");
  await page.getByRole("button", { name: "Guardar observación" }).click();

  await page.getByRole("link", { name: "Ver crónica" }).click();
  await expect(page.getByRole("heading", { name: "Crónica del encuentro" })).toBeVisible();
  await page.getByRole("button", { name: /^Generar crónica/ }).click();

  await expect(page.getByText(`Proyecto: ${projectName}`)).toBeVisible();
  await expect(page.getByText("Observación para crónica")).toBeVisible();

  await page.goto("/chronicles");
  await expect(page.getByRole("heading", { name: "Crónicas" })).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: new RegExp(`Crónica · ${projectName} · ${encounterName}`),
    }),
  ).toBeVisible();
});

test("shows empty observation summary when generating without observations", async ({ page }) => {
  const suffix = `empty-${Date.now().toString()}`;
  await createEncounterFlow(page, suffix);

  await page.getByRole("link", { name: "Ver crónica" }).click();
  await expect(page.getByRole("heading", { name: "Crónica del encuentro" })).toBeVisible();
  await page.getByRole("button", { name: /^Generar crónica/ }).click();

  await expect(
    page.getByText("No hay observaciones registradas para este encuentro."),
  ).toBeVisible();
});
