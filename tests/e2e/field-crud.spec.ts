import { expect, test } from "@playwright/test";

test("can create and archive a field", async ({ page }) => {
  await page.goto("/campos");

  await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();

  await page.getByRole("link", { name: "Nuevo campo" }).click();
  await expect(page.getByRole("heading", { name: "Nuevo campo" })).toBeVisible();

  await page.getByLabel("Nombre del campo").fill("Participación");
  await page.getByLabel("Tipo").selectOption("number");
  await page.getByRole("button", { name: "Guardar campo" }).click();

  await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Participación" })).toBeVisible();

  await page.getByRole("button", { name: "Archivar" }).first().click();
  await page.getByRole("button", { name: "Archivados" }).click();

  await expect(page.getByRole("cell", { name: "Participación" })).toBeVisible();
});
