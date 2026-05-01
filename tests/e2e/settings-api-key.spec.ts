import { expect, test } from "@playwright/test";

test("settings page is accessible from navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /menú|navegación/i }).click();
  await page.getByRole("link", { name: "Configuración" }).click();

  await expect(page).toHaveURL("/settings");
  await expect(page.getByRole("heading", { name: "Configuración" })).toBeVisible();
});

test("settings page shows AI setup guide and API key form", async ({ page }) => {
  await page.goto("/settings");

  await expect(page.getByText("Generación de crónicas con IA")).toBeVisible();
  await expect(page.getByText("Qué hace la generación con IA")).toBeVisible();
  await expect(page.getByText("Privacidad y datos enviados")).toBeVisible();
  await expect(page.getByText("Cómo obtener tu clave gratuita")).toBeVisible();

  await expect(page.getByLabel("Clave de API de Gemini")).toBeVisible();
  await expect(page.getByRole("button", { name: "Guardar clave" })).toBeVisible();
});

test("shows 'Sin clave configurada' by default", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.getByText("Sin clave configurada")).toBeVisible();
});

test("saves API key and shows configured status", async ({ page }) => {
  await page.goto("/settings");

  await page.getByLabel("Clave de API de Gemini").fill("AIzaTestKey1234");
  await page.getByRole("button", { name: "Guardar clave" }).click();

  await expect(page.getByText("Clave configurada")).toBeVisible();
  await expect(page.getByRole("button", { name: "Quitar clave" })).toBeVisible();
});

test("clears API key after saving", async ({ page }) => {
  await page.goto("/settings");

  await page.getByLabel("Clave de API de Gemini").fill("AIzaTestKey1234");
  await page.getByRole("button", { name: "Guardar clave" }).click();
  await expect(page.getByText("Clave configurada")).toBeVisible();

  await page.getByRole("button", { name: "Quitar clave" }).click();

  await expect(page.getByText("Sin clave configurada")).toBeVisible();
  await expect(page.getByRole("button", { name: "Quitar clave" })).not.toBeVisible();
});

test("save button is disabled when input is empty", async ({ page }) => {
  await page.goto("/settings");

  const saveButton = page.getByRole("button", { name: "Guardar clave" });
  await expect(saveButton).toBeDisabled();

  await page.getByLabel("Clave de API de Gemini").fill("AIza");
  await expect(saveButton).toBeEnabled();

  await page.getByLabel("Clave de API de Gemini").clear();
  await expect(saveButton).toBeDisabled();
});

test("show/hide toggle changes input type", async ({ page }) => {
  await page.goto("/settings");

  const input = page.getByLabel("Clave de API de Gemini");
  await expect(input).toHaveAttribute("type", "password");

  await page.getByRole("button", { name: "Mostrar clave" }).click();
  await expect(input).toHaveAttribute("type", "text");

  await page.getByRole("button", { name: "Ocultar clave" }).click();
  await expect(input).toHaveAttribute("type", "password");
});
