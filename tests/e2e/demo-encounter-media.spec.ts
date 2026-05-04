import { expect, test } from "@playwright/test";

test("demo project ships with eight encounters; first one is pre-populated and chronicle ready", async ({
  page,
}) => {
  await page.goto("/support");

  await page.getByRole("button", { name: "Crear proyecto de prueba" }).click();

  // Lands on the project detail page (not the encounter detail).
  await expect(page).toHaveURL(/\/projects\/[0-9a-f-]+/i);
  await expect(page.getByRole("heading", { name: "Proyecto de prueba" })).toBeVisible();

  // The eight Thursday encounters are listed on the project detail page
  // (the table renders both a mobile card list and a desktop table, so
  // each encounter link can show up more than once — `.first()` picks
  // whichever variant the current viewport exposes).
  for (const name of [
    "Encuentro 1",
    "Encuentro 2",
    "Encuentro 3",
    "Encuentro 4",
    "Encuentro 5",
    "Encuentro 6",
    "Encuentro 7",
    "Encuentro 8",
  ]) {
    await expect(page.getByRole("link", { name }).first()).toBeVisible();
  }

  // A handful of the 13 participants render as chips on the header.
  for (const participant of ["Thiago", "Bautista", "Ayelén"]) {
    await expect(page.getByText(participant, { exact: true }).first()).toBeVisible();
  }

  // Open the populated encounter (Encuentro 1) and verify pre-loaded
  // observations covering every field type plus the default form.
  await page.getByRole("link", { name: "Encuentro 1" }).first().click();
  await expect(page).toHaveURL(/\/encounters\/[0-9a-f-]+/i);
  await expect(page.getByRole("heading", { name: "Encuentro 1" })).toBeVisible();

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

test("'Crear proyecto de prueba' is gated to the support page", async ({ page }) => {
  await page.goto("/support");
  await expect(page.getByRole("button", { name: "Crear proyecto de prueba" })).toBeVisible();

  // Pages that show the demo toggle as "remove only".
  for (const path of ["/", "/forms", "/projects", "/chronicles"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Crear proyecto de prueba" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Eliminar proyecto de prueba" })).toBeHidden();
  }

  await page.goto("/support");
  await page.getByRole("button", { name: "Crear proyecto de prueba" }).click();
  await expect(page).toHaveURL(/\/projects\/[0-9a-f-]+/i);

  await page.goto("/support");
  await expect(page.getByRole("button", { name: "Eliminar proyecto de prueba" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Crear proyecto de prueba" })).toBeHidden();

  // Once the demo exists, the destructive twin shows on every list page
  // that mounts the toggle in removeOnly mode and never offers the
  // create button.
  for (const path of ["/forms", "/projects", "/chronicles"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Eliminar proyecto de prueba" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Crear proyecto de prueba" })).toBeHidden();
  }
});
