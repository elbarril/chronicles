import { expect, test, type Page } from "@playwright/test";

const GEMINI_API_KEY_STORAGE_KEY = "chronicle.geminiApiKey";
const GEMINI_API_URL = "**/generativelanguage.googleapis.com/**";

async function createEncounterWithObservation(page: Page, suffix: string) {
  const groupName = `Grupo IA ${suffix}`;
  const fieldName = `Nota IA ${suffix}`;
  const fieldKey = `nota_ia_${suffix}`;
  const formName = `Formulario IA ${suffix}`;
  const activityName = `Actividad IA ${suffix}`;

  await page.goto("/groups/new");
  await page.getByLabel("Nombre del grupo").fill(groupName);
  await page.getByPlaceholder("Participante 1").fill("Ana");
  await page.getByRole("button", { name: "Guardar grupo" }).click();

  await page.goto("/fields/new");
  await page.getByLabel("Nombre del campo").fill(fieldName);
  await page.getByLabel("Clave técnica").fill(fieldKey);
  await page.getByLabel("Tipo").selectOption("text");
  await page.getByRole("button", { name: "Guardar campo" }).click();

  await page.goto("/forms/new");
  await page.getByLabel("Nombre del formulario").fill(formName);
  const availableFieldsPanel = page.locator("div", { hasText: "Campos disponibles" }).first();
  await availableFieldsPanel
    .locator("li", { hasText: fieldName })
    .getByRole("button", { name: "Agregar" })
    .click();
  await page.getByRole("button", { name: "Guardar formulario" }).click();

  await page.goto("/encounters/new");
  await page.getByLabel("Actividad").fill(activityName);
  await page.getByLabel("Grupo").selectOption({ label: groupName });
  await page.getByLabel("Formulario").selectOption({ label: `${formName} (v1)` });
  await page.getByRole("button", { name: "Crear encuentro" }).click();
  await expect(page.getByRole("heading", { name: activityName })).toBeVisible();

  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel(new RegExp(fieldName)).fill("Texto de observación para IA");
  await page.getByRole("button", { name: "Guardar observación" }).click();

  return { activityName };
}

test("generates AI chronicle when API key is set and Gemini responds", async ({ page }) => {
  const suffix = `ai-${Date.now()}`;

  // Set API key in localStorage before visiting the page
  await page.goto("/");
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [
    GEMINI_API_KEY_STORAGE_KEY,
    "AIzaFakeKeyForTest",
  ] as [string, string]);

  // Intercept Gemini API call and return a mock response
  await page.route(GEMINI_API_URL, (route) => {
    void route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        candidates: [
          {
            content: {
              parts: [{ text: "Esta es la crónica generada con inteligencia artificial." }],
            },
          },
        ],
      }),
    });
  });

  const { activityName } = await createEncounterWithObservation(page, suffix);

  await page.getByRole("button", { name: "Generar crónica" }).click();

  await expect(page).toHaveURL(/\/chronicles\/.+/);
  await expect(page.getByRole("heading", { name: `Crónica · ${activityName}` })).toBeVisible();
  await expect(
    page.getByText("Esta es la crónica generada con inteligencia artificial."),
  ).toBeVisible();
  await expect(page.getByText("Generada con IA")).toBeVisible();
});

test("falls back to deterministic chronicle when Gemini returns error", async ({ page }) => {
  const suffix = `ai-err-${Date.now()}`;

  await page.goto("/");
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [
    GEMINI_API_KEY_STORAGE_KEY,
    "AIzaFakeKeyForTest",
  ] as [string, string]);

  // Intercept Gemini API call and simulate a failure
  await page.route(GEMINI_API_URL, (route) => {
    void route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: { message: "Internal Server Error", status: "INTERNAL" } }),
    });
  });

  const { activityName } = await createEncounterWithObservation(page, suffix);

  await page.getByRole("button", { name: "Generar crónica" }).click();

  await expect(page).toHaveURL(/\/chronicles\/.+/);
  await expect(page.getByRole("heading", { name: `Crónica · ${activityName}` })).toBeVisible();
  // Deterministic chronicle contains the structured header
  await expect(page.getByText("Resumen del encuentro")).toBeVisible();
  // AI badge must NOT appear
  await expect(page.getByText("Generada con IA")).not.toBeVisible();
  // Fallback warning toast
  await expect(
    page.getByText("No se pudo usar IA para la generación. La crónica se generó localmente."),
  ).toBeVisible();
});

test("generates deterministic chronicle without AI badge when no API key", async ({ page }) => {
  const suffix = `no-ai-${Date.now()}`;

  // Ensure no key in storage
  await page.goto("/");
  await page.evaluate(([key]) => localStorage.removeItem(key), [GEMINI_API_KEY_STORAGE_KEY] as [
    string,
  ]);

  const { activityName } = await createEncounterWithObservation(page, suffix);

  await page.getByRole("button", { name: "Generar crónica" }).click();

  await expect(page).toHaveURL(/\/chronicles\/.+/);
  await expect(page.getByRole("heading", { name: `Crónica · ${activityName}` })).toBeVisible();
  await expect(page.getByText("Generada con IA")).not.toBeVisible();
});
