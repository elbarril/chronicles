import { expect, test, type Page } from "@playwright/test";

interface EncounterFixture {
  projectName: string;
  formName: string;
  encounterName: string;
}

/**
 * Builds a minimal end-to-end fixture by reusing the seeded default
 * form ("Observación de encuentro" → audio + longText). Skipping the
 * field/form authoring step keeps the test focused on the chronicle
 * generation flow.
 */
async function createEncounterFlow(page: Page, suffix: string): Promise<EncounterFixture> {
  const projectName = `Proyecto Crónica ${suffix}`;
  const formName = "Observación de encuentro";
  const encounterName = `Encuentro Crónica ${suffix}`;

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

  return { projectName, formName, encounterName };
}

test("generates chronicle from encounter chronicle page and lists it", async ({ page }) => {
  const suffix = Date.now().toString();
  const { projectName, formName, encounterName } = await createEncounterFlow(page, suffix);

  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel("Formulario").selectOption({ label: formName });
  await page.getByLabel(/Transcripción de audio de observación/).fill("Observación para crónica");
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
