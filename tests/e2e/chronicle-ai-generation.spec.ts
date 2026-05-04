import { expect, test, type Page } from "@playwright/test";

const GEMINI_API_KEY_STORAGE_KEY = "chronicle.geminiApiKey";
const GEMINI_API_URL = "**/generativelanguage.googleapis.com/**";

interface EncounterFixture {
  projectName: string;
  encounterName: string;
}

/**
 * Reuses the seeded default form ("Observación de encuentro") to set
 * up an encounter with a single text observation. Skipping field/form
 * authoring keeps the test focused on the chronicle generation flow.
 */
async function createEncounterWithObservation(
  page: Page,
  suffix: string,
): Promise<EncounterFixture> {
  const projectName = `Proyecto IA ${suffix}`;
  const formName = "Observación de encuentro";
  const encounterName = `Encuentro IA ${suffix}`;

  await page.goto("/projects/new");
  await page.getByLabel("Nombre del proyecto").fill(projectName);
  await page.getByPlaceholder("Participante 1").fill("Ana");
  await page.getByRole("button", { name: "Guardar proyecto" }).click();
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

  await page.goto("/projects");
  await page.getByRole("link", { name: projectName }).first().click();
  await page.getByRole("link", { name: "Crear encuentro" }).click();
  await page.getByLabel("Nombre del encuentro").fill(encounterName);
  await page.getByLabel(/^Ana$/).check();
  await page.getByRole("button", { name: "Crear encuentro" }).click();
  await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel("Formulario").selectOption({ label: formName });
  await page.getByLabel(/Texto de observación/).fill("Texto de observación para IA");
  await page.getByRole("button", { name: "Guardar observación" }).click();

  return { projectName, encounterName };
}

test("generates AI chronicle when API key is set and Gemini responds", async ({ page }) => {
  const suffix = `ai-${Date.now()}`;

  await page.goto("/");
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [
    GEMINI_API_KEY_STORAGE_KEY,
    "AIzaFakeKeyForTest",
  ] as [string, string]);

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

  await createEncounterWithObservation(page, suffix);

  await page.getByRole("link", { name: "Ver crónica" }).click();
  await expect(page.getByRole("heading", { name: "Crónica del encuentro" })).toBeVisible();
  await page.getByRole("button", { name: /^Generar crónica/ }).click();

  await expect(
    page.getByText("Esta es la crónica generada con inteligencia artificial."),
  ).toBeVisible();
  await expect(page.getByLabel("Generada con IA")).toBeVisible();
});

test("does not fall back to deterministic chronicle when Gemini returns error on first generation", async ({
  page,
}) => {
  const suffix = `ai-err-${Date.now()}`;

  await page.goto("/");
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [
    GEMINI_API_KEY_STORAGE_KEY,
    "AIzaFakeKeyForTest",
  ] as [string, string]);

  await page.route(GEMINI_API_URL, (route) => {
    void route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: { message: "Internal Server Error", status: "INTERNAL" } }),
    });
  });

  await createEncounterWithObservation(page, suffix);

  await page.getByRole("link", { name: "Ver crónica" }).click();
  await expect(page.getByRole("heading", { name: "Crónica del encuentro" })).toBeVisible();
  await page.getByRole("button", { name: /^Generar crónica/ }).click();

  // With a configured API key but no previously saved chronicle, a Gemini
  // error surfaces an error toast and the user stays on the chronicle page
  // (no deterministic fallback is created).
  await expect(page.getByText("No pudimos generar la crónica.")).toBeVisible();
  await expect(page).toHaveURL(/\/encounters\/[0-9a-f-]+\/chronicle/);
  await expect(page.getByLabel("Generada con IA")).toBeHidden();
});

test("generates deterministic chronicle without AI badge when no API key", async ({ page }) => {
  const suffix = `no-ai-${Date.now()}`;

  await page.goto("/");
  await page.evaluate(([key]) => localStorage.removeItem(key), [GEMINI_API_KEY_STORAGE_KEY] as [
    string,
  ]);

  await createEncounterWithObservation(page, suffix);

  await page.getByRole("link", { name: "Ver crónica" }).click();
  await expect(page.getByRole("heading", { name: "Crónica del encuentro" })).toBeVisible();
  await page.getByRole("button", { name: /^Generar crónica/ }).click();

  await expect(page.getByLabel("Generada con IA")).toBeHidden();
});
