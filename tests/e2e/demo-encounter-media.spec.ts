import { expect, test } from "@playwright/test";

test("demo encounter ships pre-populated with all field types and chronicle ready", async ({
  page,
}) => {
  await page.goto("/support");

  await page.getByRole("button", { name: "Cargar encuentro de prueba" }).click();

  await expect(page).toHaveURL(/\/encounters\/[0-9a-f-]+/i);
  await expect(page.getByRole("heading", { name: "Encuentro de prueba" })).toBeVisible();

  // The demo encounter has two observations — one with the demo form (every
  // type), and one with the default form. Verify scalar values from both.
  await expect(page.getByText("Texto corto de ejemplo.")).toBeVisible();
  await expect(page.getByText("Verde, Azul")).toBeVisible();
  await expect(page.getByText("Ciudad Autónoma de Buenos Aires")).toBeVisible();
  await expect(page.getByText("Una segunda observación cargada con")).toBeVisible();

  // Media for every supported type is rendered with managed object URLs.
  await expect(page.getByLabel("Reproducir Audio")).toBeVisible();
  await expect(page.getByLabel("Reproducir Video")).toBeVisible();
  await expect(page.getByRole("img", { name: "Imagen" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Descargar Archivo" })).toBeVisible();

  // The chronicle was pre-generated, so going to the encounter chronicle
  // page should already show the body without further user action.
  await page.getByRole("link", { name: "Ver crónica" }).click();
  await expect(page.getByRole("heading", { name: "Crónica del encuentro" })).toBeVisible();

  await expect(page.getByText("Proyecto: Proyecto de prueba")).toBeVisible();
  await expect(page.getByText(/Texto corto de ejemplo\./)).toBeVisible();

  // Chronicle media panel renders all four media types reproducible.
  await expect(page.getByLabel("Reproducir Audio")).toBeVisible();
  await expect(page.getByLabel("Reproducir Video")).toBeVisible();
  await expect(page.getByRole("img", { name: "Imagen" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Descargar Archivo" })).toBeVisible();
});

test("'Cargar encuentro de prueba' is gated to the support page", async ({ page }) => {
  await page.goto("/support");
  await expect(page.getByRole("button", { name: "Cargar encuentro de prueba" })).toBeVisible();

  // Pages that show the demo toggle as "remove only".
  for (const path of ["/", "/fields", "/forms", "/projects", "/chronicles"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Cargar encuentro de prueba" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Eliminar contenido de prueba" })).toBeHidden();
  }

  await page.goto("/support");
  await page.getByRole("button", { name: "Cargar encuentro de prueba" }).click();
  await expect(page).toHaveURL(/\/encounters\/[0-9a-f-]+/i);

  await page.goto("/support");
  await expect(page.getByRole("button", { name: "Eliminar contenido de prueba" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Cargar encuentro de prueba" })).toBeHidden();

  // Once the demo exists, the destructive twin shows on every list page
  // and never offers the create button.
  for (const path of ["/fields", "/forms", "/projects", "/chronicles"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Eliminar contenido de prueba" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cargar encuentro de prueba" })).toBeHidden();
  }
});
