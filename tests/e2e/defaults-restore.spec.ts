import { expect, test } from "@playwright/test";

test("preloads default fields and form, and the restore buttons bring them back from archived", async ({
  page,
}) => {
  await page.goto("/fields");

  await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Audio de observación" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Texto de observación" })).toBeVisible();

  await page.goto("/forms");
  await expect(page.getByRole("heading", { name: "Formularios" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Observación de encuentro" })).toBeVisible();

  await page.goto("/fields");
  const audioRow = page.locator("tr", { hasText: "Audio de observación" });
  await audioRow.getByRole("button", { name: "Archivar" }).click();
  await expect(page.getByRole("cell", { name: "Audio de observación" })).toHaveCount(0);

  await page.getByRole("button", { name: "Cargar campos por defecto" }).click();
  await expect(page.getByRole("cell", { name: "Audio de observación" })).toBeVisible();

  await page.goto("/forms");
  const formRow = page.locator("tr", { hasText: "Observación de encuentro" });
  await formRow.getByRole("button", { name: "Archivar" }).click();
  await expect(page.getByRole("cell", { name: "Observación de encuentro" })).toHaveCount(0);

  await page.getByRole("button", { name: "Cargar formulario por defecto" }).click();
  await expect(page.getByRole("cell", { name: "Observación de encuentro" })).toBeVisible();
});
