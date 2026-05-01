import { expect, test, type Page } from "@playwright/test";

const GEMINI_API_KEY_STORAGE_KEY = "chronicle.geminiApiKey";
const GEMINI_API_URL = "**/generativelanguage.googleapis.com/**";

async function createEncounterWithObservation(page: Page, suffix: string) {
  const groupName = `Grupo IA ${suffix}`;
  const fieldName = `Nota IA ${suffix}`;
  const fieldKey = `nota_ia_${suffix}`;
  const formName = `Formulario IA ${suffix}`;
  const activityName = `Actividad IA ${suffix}`;

  // Each save action navigates back to its list page; we wait for the
  // list heading before moving on so the previous Dexie write has
  // completed and the live query has propagated. Without these
  // synchronization barriers the test races with the dev server and
  // the next form's "Campos disponibles" panel may not include the
  // field we just created.
  await page.goto("/groups/new");
  await page.getByLabel("Nombre del grupo").fill(groupName);
  await page.getByPlaceholder("Participante 1").fill("Ana");
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
  // The "Generada con IA" badge identifies AI-generated chronicles. Use
  // the aria-label-driven locator to disambiguate from the success toast
  // that contains the same words.
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

  // The current contract is: with a configured API key but no previously
  // saved chronicle, a Gemini error surfaces an error toast and the user
  // stays on the encounter page (no deterministic fallback is created).
  await expect(page.getByText("No pudimos generar la crónica.")).toBeVisible();
  await expect(page).toHaveURL(/\/encounters\/[0-9a-f-]+/);
  // The encounter heading is still visible; no chronicle was created.
  await expect(page.getByRole("heading", { name: activityName })).toBeVisible();
  await expect(page.getByLabel("Generada con IA")).toBeHidden();
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
  await expect(page.getByLabel("Generada con IA")).toBeHidden();
});
